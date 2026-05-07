import { headers } from 'next/headers'
import { getClientInfo, getGitHubFile } from '@/lib/github'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { Post } from '@/types/content'
import Link from 'next/link'
import { PenSquare, Clock, Calendar } from 'lucide-react'
import { formatDate, estimateReadTime } from '@/lib/utils'

interface Props { params: { subdomain: string } }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = await getClientInfo(params.subdomain); return { title: `Posts — ${c?.personal.full_name || ''}` }
}

export default async function PostsPage({ params }: Props) {
  const subdomain = headers().get('x-folyx-subdomain') || params.subdomain
  const client = await getClientInfo(subdomain); if (!client) notFound()
  const raw = await getGitHubFile(`${subdomain}-portfolio`, 'content/posts-index.json')
  const posts: Post[] = raw ? JSON.parse(raw) : []

  return (
    <div className="pt-24"><section className="section-sm"><div className="container-folyx">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 rounded-xl bg-emerald-400/10 flex items-center justify-center"><PenSquare className="w-5 h-5 text-emerald-400" /></div>
        <div className="section-label !mb-0">Studio</div>
      </div>
      <h1 className="mb-2">Written Posts</h1>
      <p className="text-[var(--t2)] mb-10">Articles, thoughts, and technical writeups.</p>
      {posts.length === 0 ? <div className="card p-12 text-center text-[var(--t3)]">No posts published yet.</div> : (
        <div className="grid md:grid-cols-2 gap-5">
          {posts.map(p => (
            <Link key={p.slug} href={`/studio/posts/${p.slug}`} className="card p-6 group hover:border-emerald-400/30">
              {p.cover_image && (
                <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-4 bg-[var(--bg-3)]">
                  <img src={p.cover_image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              )}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {p.tags?.slice(0,3).map(t => <span key={t} className="text-xs px-2 py-0.5 rounded-md bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">{t}</span>)}
              </div>
              <h3 className="font-semibold text-[var(--t1)] mb-2 group-hover:text-folyx-300 transition-colors">{p.title}</h3>
              <p className="text-sm text-[var(--t2)] line-clamp-2 mb-3">{p.excerpt}</p>
              <div className="flex items-center gap-3 text-xs text-[var(--t3)]">
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(p.published_at)}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{estimateReadTime(p.content)} min read</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div></section></div>
  )
}
