'use client'
import { useState } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import type { Book } from '@/types/content'
import { BookOpen, X, ExternalLink } from 'lucide-react'

const PDFReader = dynamic(() => import('./PDFReader'), { ssr: false })

const STATUS_STYLES: Record<string, string> = {
  completed: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20',
  reading:   'bg-folyx-400/10 text-folyx-400 border-folyx-400/20',
  planned:   'bg-[var(--bg-4)] text-[var(--t3)] border-[var(--border)]',
}

export default function BookCard({ book: b }: { book: Book }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="card overflow-hidden group cursor-pointer hover:border-amber-400/30" onClick={() => b.pdf_url && setOpen(true)}>
        {/* Cover */}
        <div className="relative aspect-[3/4] bg-gradient-to-br from-amber-900/30 to-[var(--bg-3)] overflow-hidden">
          {b.cover_image ? (
            <Image src={b.cover_image} alt={b.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <BookOpen className="w-10 h-10 text-amber-400/30" />
            </div>
          )}
          {b.read_status && (
            <div className="absolute top-2 left-2">
              <span className={`badge text-xs border ${STATUS_STYLES[b.read_status]}`}>{b.read_status}</span>
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="text-sm font-semibold text-[var(--t1)] line-clamp-2 mb-1">{b.title}</h3>
          <p className="text-xs text-[var(--t3)] mb-2">{b.author}{b.year ? ` · ${b.year}` : ''}</p>
          {b.description && <p className="text-xs text-[var(--t2)] line-clamp-2">{b.description}</p>}
          {b.pdf_url && (
            <p className="text-xs text-amber-400 mt-2 font-medium">Click to read →</p>
          )}
        </div>
      </div>

      {/* PDF Modal */}
      {open && b.pdf_url && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-auto rounded-2xl">
            <div className="flex items-center justify-between p-3 bg-[var(--bg-2)] border-b border-[var(--border)] rounded-t-2xl">
              <span className="text-sm font-medium text-[var(--t1)] truncate">{b.title}</span>
              <button onClick={() => setOpen(false)} className="w-8 h-8 rounded-lg hover:bg-[var(--bg-3)] flex items-center justify-center text-[var(--t2)]">
                <X className="w-4 h-4" />
              </button>
            </div>
            <PDFReader url={b.pdf_url} title={b.title} />
          </div>
        </div>
      )}
    </>
  )
}
