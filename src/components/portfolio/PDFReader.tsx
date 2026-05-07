'use client'
import { useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, ExternalLink, Loader2 } from 'lucide-react'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`

interface PDFReaderProps {
  url: string
  title?: string
}

export default function PDFReader({ url, title }: PDFReaderProps) {
  const [numPages, setNumPages] = useState<number>(0)
  const [pageNumber, setPageNumber] = useState(1)
  const [scale, setScale] = useState(1.0)
  const [loading, setLoading] = useState(true)

  return (
    <div className="card overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--border)] bg-[var(--bg-3)]">
        <span className="text-sm font-medium text-[var(--t1)] truncate max-w-[200px]">{title || 'Document'}</span>
        <div className="flex items-center gap-1">
          <button onClick={() => setScale(s => Math.max(0.5, s - 0.1))}
            className="w-7 h-7 rounded-lg hover:bg-[var(--bg-4)] flex items-center justify-center text-[var(--t2)] transition-colors">
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-xs text-[var(--t3)] w-12 text-center">{Math.round(scale * 100)}%</span>
          <button onClick={() => setScale(s => Math.min(2, s + 0.1))}
            className="w-7 h-7 rounded-lg hover:bg-[var(--bg-4)] flex items-center justify-center text-[var(--t2)] transition-colors">
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <a href={url} target="_blank" rel="noreferrer"
            className="w-7 h-7 rounded-lg hover:bg-[var(--bg-4)] flex items-center justify-center text-[var(--t2)] transition-colors ml-1">
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* PDF */}
      <div className="overflow-auto bg-[var(--bg-0)] flex justify-center p-4 min-h-[500px]">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-folyx-400" />
          </div>
        )}
        <Document
          file={url}
          onLoadSuccess={({ numPages }) => { setNumPages(numPages); setLoading(false) }}
          onLoadError={() => setLoading(false)}
          loading=""
        >
          <Page pageNumber={pageNumber} scale={scale} renderTextLayer renderAnnotationLayer />
        </Document>
      </div>

      {/* Pagination */}
      {numPages > 1 && (
        <div className="flex items-center justify-center gap-3 py-3 border-t border-[var(--border)] bg-[var(--bg-3)]">
          <button onClick={() => setPageNumber(p => Math.max(1, p - 1))} disabled={pageNumber <= 1}
            className="w-8 h-8 rounded-lg border border-[var(--border)] flex items-center justify-center text-[var(--t2)] disabled:opacity-30 hover:bg-[var(--bg-4)] transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm text-[var(--t2)]">{pageNumber} / {numPages}</span>
          <button onClick={() => setPageNumber(p => Math.min(numPages, p + 1))} disabled={pageNumber >= numPages}
            className="w-8 h-8 rounded-lg border border-[var(--border)] flex items-center justify-center text-[var(--t2)] disabled:opacity-30 hover:bg-[var(--bg-4)] transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}
