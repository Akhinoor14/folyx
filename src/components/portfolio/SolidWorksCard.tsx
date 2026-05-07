'use client'
import dynamic from 'next/dynamic'
import type { SolidWorksProject } from '@/types/content'
import { formatDate } from '@/lib/utils'
import { Calendar, Ruler, Package } from 'lucide-react'

const ModelViewer = dynamic(() => import('./ModelViewer'), {
  ssr: false,
  loading: () => (
    <div className="w-full rounded-2xl bg-[var(--bg-3)] border border-[var(--border)] flex items-center justify-center" style={{ height: '320px' }}>
      <p className="text-xs text-[var(--t3)]">Loading 3D viewer…</p>
    </div>
  ),
})

export default function SolidWorksCard({ project: p }: { project: SolidWorksProject }) {
  return (
    <div className="card overflow-hidden">
      <ModelViewer glbUrl={p.glb_file_url} title={p.title} height="320px" />
      <div className="p-5">
        <h3 className="text-base font-semibold text-[var(--t1)] mb-2">{p.title}</h3>
        <p className="text-sm text-[var(--t2)] mb-4 line-clamp-3">{p.description}</p>
        <div className="flex flex-wrap gap-3 text-xs text-[var(--t3)]">
          {p.date && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(p.date)}</span>}
          {p.dimensions && <span className="flex items-center gap-1"><Ruler className="w-3 h-3" />{p.dimensions}</span>}
          {p.material && <span className="flex items-center gap-1"><Package className="w-3 h-3" />{p.material}</span>}
        </div>
        {p.tags && p.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {p.tags.map(t => (
              <span key={t} className="text-xs px-2 py-0.5 rounded-md bg-folyx-400/10 text-folyx-400 border border-folyx-400/20">{t}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
