'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { Search, X, FileText, Box, BookOpen, Video } from 'lucide-react'
import Fuse from 'fuse.js'
import { cn } from '@/lib/utils'

interface SearchItem {
  id: string
  title: string
  description?: string
  type: 'project' | 'post' | 'book' | 'video' | 'page'
  url: string
  tags?: string[]
}

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
  items?: SearchItem[]
}

const TYPE_ICONS = {
  project: Box,
  post: FileText,
  book: BookOpen,
  video: Video,
  page: FileText,
}

const TYPE_COLORS = {
  project: 'text-folyx-400',
  post: 'text-emerald-400',
  book: 'text-amber-400',
  video: 'text-red-400',
  page: 'text-[var(--t3)]',
}

export default function SearchModal({ isOpen, onClose, items = [] }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchItem[]>([])
  const [selected, setSelected] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const fuse = new Fuse(items, {
    keys: ['title', 'description', 'tags'],
    threshold: 0.35,
    includeScore: true,
  })

  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setResults(items.slice(0, 6))
      setSelected(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  const handleSearch = useCallback((q: string) => {
    setQuery(q)
    setSelected(0)
    if (!q.trim()) {
      setResults(items.slice(0, 6))
      return
    }
    const fuseResults = fuse.search(q).slice(0, 8)
    setResults(fuseResults.map(r => r.item))
  }, [items])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(s => Math.min(s + 1, results.length - 1)) }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)) }
    if (e.key === 'Enter' && results[selected]) {
      window.location.href = results[selected].url
      onClose()
    }
    if (e.key === 'Escape') onClose()
  }

  // Global Ctrl+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        if (isOpen) onClose(); // toggle behavior handled by parent
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[9998] flex items-start justify-center pt-[15vh] px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-lg bg-[var(--bg-2)] border border-[var(--border-2)] rounded-2xl shadow-2xl overflow-hidden animate-fade-up"
        onKeyDown={handleKeyDown}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[var(--border)]">
          <Search className="w-4 h-4 text-[var(--t3)] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => handleSearch(e.target.value)}
            placeholder="Search projects, posts, books…"
            className="flex-1 bg-transparent text-[var(--t1)] placeholder-[var(--t3)] text-sm outline-none"
          />
          {query && (
            <button onClick={() => handleSearch('')} className="text-[var(--t3)] hover:text-[var(--t1)]">
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:block text-xs text-[var(--t3)] bg-[var(--bg-3)] border border-[var(--border)] px-1.5 py-0.5 rounded">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto">
          {results.length === 0 ? (
            <div className="py-12 text-center text-sm text-[var(--t3)]">
              No results for &quot;{query}&quot;
            </div>
          ) : (
            <ul className="p-2">
              {results.map((item, i) => {
                const Icon = TYPE_ICONS[item.type]
                return (
                  <li key={item.id}>
                    <a
                      href={item.url}
                      onClick={onClose}
                      className={cn(
                        'flex items-start gap-3 px-3 py-2.5 rounded-xl transition-all',
                        i === selected
                          ? 'bg-folyx-600/15 border border-folyx-500/20'
                          : 'hover:bg-[var(--bg-3)]'
                      )}
                    >
                      <Icon className={cn('w-4 h-4 mt-0.5 shrink-0', TYPE_COLORS[item.type])} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[var(--t1)] truncate">{item.title}</p>
                        {item.description && (
                          <p className="text-xs text-[var(--t3)] truncate mt-0.5">{item.description}</p>
                        )}
                      </div>
                      <span className="text-xs text-[var(--t3)] capitalize shrink-0">{item.type}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 border-t border-[var(--border)] flex items-center gap-4 text-xs text-[var(--t3)]">
          <span className="flex items-center gap-1">
            <kbd className="bg-[var(--bg-3)] border border-[var(--border)] px-1.5 py-0.5 rounded text-[10px]">↑↓</kbd>
            navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd className="bg-[var(--bg-3)] border border-[var(--border)] px-1.5 py-0.5 rounded text-[10px]">↵</kbd>
            open
          </span>
          <span className="ml-auto">Ctrl+K</span>
        </div>
      </div>
    </div>
  )
}
