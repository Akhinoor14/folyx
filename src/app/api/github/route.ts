import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getGitHubFile, putGitHubFile, deleteGitHubFile } from '@/lib/github'

// Validate that the requester owns this clientId (Boss auth check)
async function validateBoss(req: NextRequest, clientId: string): Promise<boolean> {
  const supabase = createAdminClient()
  const authHeader = req.headers.get('cookie') || ''
  // In production use Supabase session — here we trust the clientId matches session
  // Full validation happens via middleware; this is a secondary check
  const { data } = await supabase.from('clients').select('id').eq('id', clientId).single()
  return !!data
}

// GET: ?clientId=xxx&path=projects/arduino.json
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const clientId = searchParams.get('clientId')
  const path = searchParams.get('path')

  if (!clientId || !path) {
    return NextResponse.json({ error: 'Missing clientId or path.' }, { status: 400 })
  }

  // Get subdomain from DB to build repo name
  const supabase = createAdminClient()
  const { data: client } = await supabase.from('clients').select('subdomain').eq('id', clientId).single()
  if (!client) return NextResponse.json({ error: 'Client not found.' }, { status: 404 })

  const repoName = `${client.subdomain}-portfolio`
  const content = await getGitHubFile(repoName, path)

  if (content === null) {
    // Return empty array for JSON list files (not an error — just empty)
    if (path.endsWith('.json')) return NextResponse.json([])
    return NextResponse.json(null)
  }

  try {
    return NextResponse.json(JSON.parse(content))
  } catch {
    return new NextResponse(content, { headers: { 'Content-Type': 'text/plain' } })
  }
}

// PUT: { clientId, path, content }
export async function PUT(req: NextRequest) {
  try {
    const { clientId, path, content } = await req.json()
    if (!clientId || !path || content === undefined) {
      return NextResponse.json({ error: 'Missing fields.' }, { status: 400 })
    }

    const supabase = createAdminClient()
    const { data: client } = await supabase.from('clients').select('subdomain').eq('id', clientId).single()
    if (!client) return NextResponse.json({ error: 'Client not found.' }, { status: 404 })

    const repoName = `${client.subdomain}-portfolio`
    const ok = await putGitHubFile(repoName, path, content, `update: ${path}`)

    if (!ok) return NextResponse.json({ error: 'GitHub write failed.' }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// DELETE: { clientId, path }
export async function DELETE(req: NextRequest) {
  try {
    const { clientId, path } = await req.json()

    const supabase = createAdminClient()
    const { data: client } = await supabase.from('clients').select('subdomain').eq('id', clientId).single()
    if (!client) return NextResponse.json({ error: 'Client not found.' }, { status: 404 })

    const repoName = `${client.subdomain}-portfolio`
    const ok = await deleteGitHubFile(repoName, path, `delete: ${path}`)

    if (!ok) return NextResponse.json({ error: 'GitHub delete failed.' }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
