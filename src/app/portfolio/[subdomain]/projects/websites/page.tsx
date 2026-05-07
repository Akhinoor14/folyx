import { headers } from 'next/headers'
import { getClientInfo, getGitHubFile } from '@/lib/github'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { WebsiteProject } from '@/types/content'
import ProjectCard from '@/components/portfolio/ProjectCard'
import { Globe } from 'lucide-react'

interface Props { params: { subdomain: string } }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = await getClientInfo(params.subdomain)
  return { title: `Websites — ${c?.personal.full_name || ''}` }
}

export default async function WebsitesPage({ params }: Props) {
  const subdomain = headers().get('x-folyx-subdomain') || params.subdomain
  const client = await getClientInfo(subdomain)
  if (!client) notFound()

  const raw = await getGitHubFile(`${subdomain}-portfolio`, 'projects/websites.json')
  const projects: WebsiteProject[] = raw ? JSON.parse(raw) : []

  return (
    <div className="pt-24">
      <section className="section-sm">
        <div className="container-folyx">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-purple-400/10 flex items-center justify-center">
              <Globe className="w-5 h-5 text-purple-400" />
            </div>
            <div className="section-label !mb-0">Projects</div>
          </div>
          <h1 className="mb-2">Website Projects</h1>
          <p className="text-[var(--t2)] mb-10">Web applications, frontend, and full-stack projects.</p>

          {projects.length === 0 ? (
            <div className="card p-12 text-center text-[var(--t3)]">No website projects added yet.</div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {projects.map(p => (
                <ProjectCard key={p.id} id={p.id} title={p.title} description={p.description}
                  thumbnail={p.screenshots?.[0]} tags={p.tags} date={p.date}
                  status={p.status} featured={p.featured}
                  githubUrl={p.github_url} liveUrl={p.live_url}>
                  {p.tech_stack?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {p.tech_stack.slice(0, 5).map(t => (
                        <span key={t} className="text-xs px-2 py-0.5 rounded-md bg-purple-400/10 text-purple-400 border border-purple-400/20">{t}</span>
                      ))}
                    </div>
                  )}
                </ProjectCard>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
