import Link from 'next/link'
import Image from 'next/image'
import { ExternalLink, Github, Calendar, Tag } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn, formatDate } from '@/lib/utils'

interface ProjectCardProps {
  id: string
  title: string
  description: string
  thumbnail?: string
  tags?: string[]
  date?: string
  href?: string
  githubUrl?: string
  liveUrl?: string
  featured?: boolean
  status?: 'completed' | 'in-progress' | 'planned'
  extraBadge?: string
  children?: ReactNode
}

const STATUS_STYLES = {
  completed:   'bg-emerald-400/10 text-emerald-400 border-emerald-400/20',
  'in-progress': 'bg-amber-400/10 text-amber-400 border-amber-400/20',
  planned:     'bg-[var(--bg-4)] text-[var(--t3)] border-[var(--border)]',
}

export default function ProjectCard({
  id, title, description, thumbnail, tags = [], date, href,
  githubUrl, liveUrl, featured, status, extraBadge, children,
}: ProjectCardProps) {
  return (
    <div className={cn('card overflow-hidden flex flex-col', featured && 'border-folyx-500/30')}>
      {/* Thumbnail */}
      {thumbnail && (
        <div className="relative w-full aspect-video bg-[var(--bg-3)] overflow-hidden">
          <Image src={thumbnail} alt={title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
          {featured && (
            <span className="absolute top-3 left-3 badge badge-primary text-xs">Featured</span>
          )}
        </div>
      )}
      {!thumbnail && (
        <div className="w-full aspect-video bg-gradient-to-br from-folyx-900/50 to-[var(--bg-3)] flex items-center justify-center border-b border-[var(--border)]">
          <span className="text-4xl font-bold text-folyx-700/40 font-display">{title.charAt(0)}</span>
        </div>
      )}

      <div className="p-5 flex flex-col flex-1">
        {/* Status + date */}
        <div className="flex items-center justify-between mb-3">
          {status && (
            <span className={cn('badge text-xs border', STATUS_STYLES[status])}>
              {status === 'in-progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          )}
          {extraBadge && <span className="badge badge-accent text-xs">{extraBadge}</span>}
          {date && (
            <span className="flex items-center gap-1 text-xs text-[var(--t3)] ml-auto">
              <Calendar className="w-3 h-3" /> {formatDate(date)}
            </span>
          )}
        </div>

        <h3 className="text-base font-semibold text-[var(--t1)] mb-2 line-clamp-2">{title}</h3>
        <p className="text-sm text-[var(--t2)] leading-relaxed mb-3 flex-1 line-clamp-3">{description}</p>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {tags.slice(0, 4).map(tag => (
              <span key={tag} className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-md bg-[var(--bg-3)] border border-[var(--border)] text-[var(--t3)]">
                <Tag className="w-2.5 h-2.5" />{tag}
              </span>
            ))}
          </div>
        )}

        {children}

        {/* Links */}
        <div className="flex items-center gap-2 mt-auto pt-3 border-t border-[var(--border)]">
          {href && (
            <Link href={href} className="btn btn-outline text-xs py-1.5 px-3 flex-1">
              View Details
            </Link>
          )}
          {githubUrl && (
            <a href={githubUrl} target="_blank" rel="noreferrer"
               className="w-8 h-8 rounded-lg bg-[var(--bg-3)] border border-[var(--border)] flex items-center justify-center text-[var(--t2)] hover:text-white transition-colors">
              <Github className="w-3.5 h-3.5" />
            </a>
          )}
          {liveUrl && (
            <a href={liveUrl} target="_blank" rel="noreferrer"
               className="w-8 h-8 rounded-lg bg-[var(--bg-3)] border border-[var(--border)] flex items-center justify-center text-[var(--t2)] hover:text-white transition-colors">
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
