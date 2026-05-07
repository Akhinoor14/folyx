import { headers } from 'next/headers'
import { getClientInfo, getGitHubFile } from '@/lib/github'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { SolidWorksProject } from '@/types/content'
import { Box } from 'lucide-react'
import SolidWorksCard from '@/components/portfolio/SolidWorksCard'

interface Props { params: { subdomain: string } }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = await getClientInfo(params.subdomain)
  return { title: `SolidWorks — ${c?.personal.full_name || ''}` }
}

export default async function SolidWorksPage({ params }: Props) {
  const subdomain = headers().get('x-folyx-subdomain') || params.subdomain
  const client = await getClientInfo(subdomain)
  if (!client) notFound()

  const raw = await getGitHubFile(`${subdomain}-portfolio`, 'projects/solidworks.json')
  const projects: SolidWorksProject[] = raw ? JSON.parse(raw) : []

  return (
    <div className="pt-24">
      <section className="section-sm">
        <div className="container-folyx">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-folyx-400/10 flex items-center justify-center">
              <Box className="w-5 h-5 text-folyx-400" />
            </div>
            <div className="section-label !mb-0">Projects</div>
          </div>
          <h1 className="mb-2">SolidWorks 3D Projects</h1>
          <p className="text-[var(--t2)] mb-10">Interactive 3D models — drag to rotate, scroll to zoom.</p>

          {projects.length === 0 ? (
            <div className="card p-12 text-center text-[var(--t3)]">No SolidWorks projects added yet.</div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-6">
              {projects.map(p => <SolidWorksCard key={p.id} project={p} />)}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
