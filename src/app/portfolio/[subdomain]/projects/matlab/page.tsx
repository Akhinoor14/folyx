import { headers } from 'next/headers'
import { getClientInfo, getGitHubFile } from '@/lib/github'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { MatlabProject } from '@/types/content'
import ProjectCard from '@/components/portfolio/ProjectCard'
import { BarChart2 } from 'lucide-react'

interface Props { params: { subdomain: string } }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = await getClientInfo(params.subdomain)
  return { title: `MATLAB — ${c?.personal.full_name || ''}` }
}

export default async function MatlabPage({ params }: Props) {
  const subdomain = headers().get('x-folyx-subdomain') || params.subdomain
  const client = await getClientInfo(subdomain)
  if (!client) notFound()

  const raw = await getGitHubFile(`${subdomain}-portfolio`, 'projects/matlab.json')
  const projects: MatlabProject[] = raw ? JSON.parse(raw) : []

  return (
    <div className="pt-24">
      <section className="section-sm">
        <div className="container-folyx">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-blue-400/10 flex items-center justify-center">
              <BarChart2 className="w-5 h-5 text-blue-400" />
            </div>
            <div className="section-label !mb-0">Projects</div>
          </div>
          <h1 className="mb-2">MATLAB Projects</h1>
          <p className="text-[var(--t2)] mb-10">Simulations, signal processing, and control systems.</p>

          {projects.length === 0 ? (
            <div className="card p-12 text-center text-[var(--t3)]">No MATLAB projects added yet.</div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {projects.map(p => (
                <ProjectCard key={p.id} id={p.id} title={p.title} description={p.description}
                  thumbnail={p.simulation_image} tags={p.tags} date={p.date} status={p.status} featured={p.featured}>
                  {p.toolboxes && p.toolboxes.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs text-[var(--t3)] mb-1.5">Toolboxes:</p>
                      <div className="flex flex-wrap gap-1">
                        {p.toolboxes.map(t => (
                          <span key={t} className="text-xs px-2 py-0.5 rounded-md bg-blue-400/10 text-blue-400 border border-blue-400/20">{t}</span>
                        ))}
                      </div>
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
