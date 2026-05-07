import { headers } from 'next/headers'
import { getClientInfo, getGitHubFile } from '@/lib/github'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { Video } from '@/types/content'
import { Video as VideoIcon, Play } from 'lucide-react'
import { getYouTubeThumbnail, getYouTubeEmbedUrl } from '@/lib/utils'

interface Props { params: { subdomain: string } }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = await getClientInfo(params.subdomain); return { title: `Videos — ${c?.personal.full_name || ''}` }
}

export default async function VideosPage({ params }: Props) {
  const subdomain = headers().get('x-folyx-subdomain') || params.subdomain
  const client = await getClientInfo(subdomain); if (!client) notFound()
  const raw = await getGitHubFile(`${subdomain}-portfolio`, 'content/videos.json')
  const videos: Video[] = raw ? JSON.parse(raw) : []

  return (
    <div className="pt-24"><section className="section-sm"><div className="container-folyx">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 rounded-xl bg-rose-400/10 flex items-center justify-center"><VideoIcon className="w-5 h-5 text-rose-400" /></div>
        <div className="section-label !mb-0">Studio</div>
      </div>
      <h1 className="mb-2">Videos</h1>
      <p className="text-[var(--t2)] mb-10">Video lectures, tutorials, and demos.</p>
      {videos.length === 0 ? <div className="card p-12 text-center text-[var(--t3)]">No videos added yet.</div> : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {videos.map(v => (
            <div key={v.id} className="card overflow-hidden group">
              <div className="relative aspect-video bg-[var(--bg-3)] overflow-hidden">
                <img src={v.thumbnail || getYouTubeThumbnail(v.youtube_id)} alt={v.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <a href={`https://youtube.com/watch?v=${v.youtube_id}`} target="_blank" rel="noreferrer"
                   className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center"><Play className="w-5 h-5 text-white fill-white" /></div>
                </a>
                {v.duration && <span className="absolute bottom-2 right-2 text-xs bg-black/80 text-white px-1.5 py-0.5 rounded">{v.duration}</span>}
              </div>
              <div className="p-4">
                <h3 className="text-sm font-semibold text-[var(--t1)] line-clamp-2 mb-1">{v.title}</h3>
                {v.description && <p className="text-xs text-[var(--t2)] line-clamp-2">{v.description}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div></section></div>
  )
}
