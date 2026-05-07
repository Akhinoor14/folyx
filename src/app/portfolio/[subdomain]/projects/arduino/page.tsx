import { headers } from 'next/headers'
import { getClientInfo, getGitHubFile } from '@/lib/github'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { ArduinoProject } from '@/types/content'
import ProjectCard from '@/components/portfolio/ProjectCard'
import { Zap } from 'lucide-react'

interface Props { params: { subdomain: string } }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = await getClientInfo(params.subdomain)
  return { title: `Arduino — ${c?.personal.full_name || ''}` }
}

export default async function ArduinoPage({ params }: Props) {
  const subdomain = headers().get('x-folyx-subdomain') || params.subdomain
  const client = await getClientInfo(subdomain)
  if (!client) notFound()

  const repoName = `${subdomain}-portfolio`
  const raw = await getGitHubFile(repoName, 'projects/arduino.json')
  const projects: ArduinoProject[] = raw ? JSON.parse(raw) : []

  return (
    <div className="pt-24">
      <section className="section-sm">
        <div className="container-folyx">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-amber-400/10 flex items-center justify-center">
              <Zap className="w-5 h-5 text-amber-400" />
            </div>
            <div className="section-label !mb-0">Projects</div>
          </div>
          <h1 className="mb-2">Arduino Projects</h1>
          <p className="text-[var(--t2)] mb-10">Embedded systems, IoT, and circuit projects.</p>

          {projects.length === 0 ? (
            <div className="card p-12 text-center text-[var(--t3)]">No Arduino projects added yet.</div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {projects.map(p => (
                <ProjectCard
                  key={p.id}
                  id={p.id}
                  title={p.title}
                  description={p.description}
                  thumbnail={p.circuit_image}
                  tags={p.tags}
                  date={p.date}
                  status={p.status}
                  featured={p.featured}
                >
                  {p.components && p.components.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs text-[var(--t3)] mb-1.5">Components used:</p>
                      <div className="flex flex-wrap gap-1">
                        {p.components.slice(0, 4).map(c => (
                          <span key={c} className="text-xs px-2 py-0.5 rounded-md bg-amber-400/10 text-amber-400 border border-amber-400/20">{c}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {p.video_url && (
                    <a href={p.video_url} target="_blank" rel="noreferrer"
                       className="text-xs text-folyx-400 hover:text-folyx-300 transition-colors">▶ Watch demo</a>
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
