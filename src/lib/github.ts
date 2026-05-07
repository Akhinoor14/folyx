import { createAdminClient } from './supabase'

const GITHUB_TOKEN = process.env.GITHUB_TOKEN!
const GITHUB_ORG   = process.env.GITHUB_ORG || 'akhinoor14'
const CACHE_TTL_MS = 10 * 60 * 1000   // 10 minutes

const githubHeaders = {
  Authorization: `token ${GITHUB_TOKEN}`,
  'Content-Type': 'application/json',
  Accept: 'application/vnd.github.v3+json',
}

// ── Get file content from GitHub (with Supabase cache) ──
export async function getGitHubFile(repo: string, path: string): Promise<string | null> {
  const cacheKey = `${repo}/${path}`

  // Check cache first
  try {
    const supabase = createAdminClient()
    const { data } = await supabase
      .from('github_cache')
      .select('content, cached_at')
      .eq('cache_key', cacheKey)
      .single()

    if (data && Date.now() - new Date(data.cached_at).getTime() < CACHE_TTL_MS) {
      return data.content
    }
  } catch {}

  // Fetch from GitHub
  const res = await fetch(
    `https://api.github.com/repos/${GITHUB_ORG}/${repo}/contents/${path}`,
    { headers: githubHeaders, next: { revalidate: 600 } }
  )
  if (!res.ok) return null

  const json = await res.json()
  const content = Buffer.from(json.content, 'base64').toString('utf-8')

  // Store in cache
  try {
    const supabase = createAdminClient()
    await supabase.from('github_cache').upsert({
      cache_key: cacheKey,
      content,
      cached_at: new Date().toISOString(),
    })
  } catch {}

  return content
}

// ── Upload/update file in GitHub ──
export async function putGitHubFile(
  repo: string,
  path: string,
  content: string,
  message: string
): Promise<boolean> {
  // Check if file exists to get SHA
  let sha: string | undefined
  const existing = await fetch(
    `https://api.github.com/repos/${GITHUB_ORG}/${repo}/contents/${path}`,
    { headers: githubHeaders }
  )
  if (existing.ok) {
    const data = await existing.json()
    sha = data.sha
  }

  const res = await fetch(
    `https://api.github.com/repos/${GITHUB_ORG}/${repo}/contents/${path}`,
    {
      method: 'PUT',
      headers: githubHeaders,
      body: JSON.stringify({
        message,
        content: Buffer.from(content, 'utf-8').toString('base64'),
        ...(sha ? { sha } : {}),
      }),
    }
  )

  // Invalidate cache
  if (res.ok) {
    try {
      const supabase = createAdminClient()
      await supabase.from('github_cache').delete().eq('cache_key', `${repo}/${path}`)
    } catch {}
  }

  return res.ok
}

// ── Delete file from GitHub ──
export async function deleteGitHubFile(
  repo: string,
  path: string,
  message: string
): Promise<boolean> {
  const existing = await fetch(
    `https://api.github.com/repos/${GITHUB_ORG}/${repo}/contents/${path}`,
    { headers: githubHeaders }
  )
  if (!existing.ok) return false
  const data = await existing.json()

  const res = await fetch(
    `https://api.github.com/repos/${GITHUB_ORG}/${repo}/contents/${path}`,
    {
      method: 'DELETE',
      headers: githubHeaders,
      body: JSON.stringify({ message, sha: data.sha }),
    }
  )
  return res.ok
}

// ── Get client-info.json for a subdomain ──
export async function getClientInfo(subdomain: string) {
  const repoName = `${subdomain}-portfolio`
  const raw = await getGitHubFile(repoName, 'client-info.json')
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

// ── Copy template repo for new client ──
export async function createClientRepo(subdomain: string, clientInfoJson: object): Promise<boolean> {
  const templateRepo = process.env.GITHUB_TEMPLATE_REPO || 'folyx-portfolio-template'
  const newRepoName = `${subdomain}-portfolio`

  // Create repo from template
  const createRes = await fetch(`https://api.github.com/repos/${GITHUB_ORG}/${templateRepo}/generate`, {
    method: 'POST',
    headers: githubHeaders,
    body: JSON.stringify({
      owner: GITHUB_ORG,
      name: newRepoName,
      private: false,
      include_all_branches: false,
      description: `Folyx portfolio for ${subdomain}`,
    }),
  })
  if (!createRes.ok) return false

  // Wait 3 seconds for repo to initialize
  await new Promise(r => setTimeout(r, 3000))

  // Write client-info.json
  await putGitHubFile(
    newRepoName,
    'client-info.json',
    JSON.stringify(clientInfoJson, null, 2),
    'feat: initialize client info'
  )

  return true
}
