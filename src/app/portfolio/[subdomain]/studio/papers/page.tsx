// papers/page.tsx
import { headers } from 'next/headers'
import { getClientInfo, getGitHubFile } from '@/lib/github'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { Paper } from '@/types/content'
import { FileText, ExternalLink } from 'lucide-react'
import dynamic from 'next/dynamic'
const PDFReader = dynamic(() => import('@/components/portfolio/PDFReader'), { ssr: false })

interface Props { params: { subdomain: string } }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = await getClientInfo(params.subdomain); return { title: `Papers — ${c?.personal.full_name || ''}` }
}

export default async function PapersPage({ params }: Props) {
  const subdomain = headers().get('x-folyx-subdomain') || params.subdomain
  const client = await getClientInfo(subdomain); if (!client) notFound()
  const raw = await getGitHubFile(`${subdomain}-portfolio`, 'content/papers.json')
  const papers: Paper[] = raw ? JSON.parse(raw) : []

  return (
    <div className="pt-24"><section className="section-sm"><div className="container-folyx">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 rounded-xl bg-blue-400/10 flex items-center justify-center"><FileText className="w-5 h-5 text-blue-400" /></div>
        <div className="section-label !mb-0">Studio</div>
      </div>
      <h1 className="mb-2">Research Papers</h1>
      <p className="text-[var(--t2)] mb-10">Published and preprint research papers.</p>
      {papers.length === 0 ? <div className="card p-12 text-center text-[var(--t3)]">No papers added yet.</div> : (
        <div className="space-y-4">
          {papers.map(p => (
            <div key={p.id} className="card p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-[var(--t1)] mb-1">{p.title}</h3>
                  <p className="text-sm text-[var(--t3)] mb-2">{p.authors.join(', ')} · {p.year}{p.journal ? ` · ${p.journal}` : ''}</p>
                  {p.abstract && <p className="text-sm text-[var(--t2)] line-clamp-3">{p.abstract}</p>}
                  {p.tags && <div className="flex flex-wrap gap-1 mt-3">{p.tags.map(t => <span key={t} className="text-xs px-2 py-0.5 rounded-md bg-blue-400/10 text-blue-400 border border-blue-400/20">{t}</span>)}</div>}
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  {p.pdf_url && <a href={p.pdf_url} target="_blank" rel="noreferrer" className="btn btn-outline text-xs py-1.5 px-3 gap-1"><FileText className="w-3 h-3"/>PDF</a>}
                  {p.doi && <a href={`https://doi.org/${p.doi}`} target="_blank" rel="noreferrer" className="btn btn-ghost text-xs py-1.5 px-3 gap-1"><ExternalLink className="w-3 h-3"/>DOI</a>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div></section></div>
  )
}
