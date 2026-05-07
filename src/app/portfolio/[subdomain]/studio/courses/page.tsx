import { headers } from 'next/headers'
import { getClientInfo, getGitHubFile } from '@/lib/github'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { Course } from '@/types/content'
import { GraduationCap, ExternalLink, CheckCircle } from 'lucide-react'

interface Props { params: { subdomain: string } }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = await getClientInfo(params.subdomain); return { title: `Courses — ${c?.personal.full_name || ''}` }
}

const STATUS_STYLES: Record<string, string> = {
  completed: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20',
  enrolled:  'bg-folyx-400/10 text-folyx-400 border-folyx-400/20',
  planned:   'bg-[var(--bg-4)] text-[var(--t3)] border-[var(--border)]',
}

export default async function CoursesPage({ params }: Props) {
  const subdomain = headers().get('x-folyx-subdomain') || params.subdomain
  const client = await getClientInfo(subdomain); if (!client) notFound()
  const raw = await getGitHubFile(`${subdomain}-portfolio`, 'content/courses.json')
  const courses: Course[] = raw ? JSON.parse(raw) : []

  return (
    <div className="pt-24"><section className="section-sm"><div className="container-folyx">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 rounded-xl bg-purple-400/10 flex items-center justify-center"><GraduationCap className="w-5 h-5 text-purple-400" /></div>
        <div className="section-label !mb-0">Studio</div>
      </div>
      <h1 className="mb-2">Courses</h1>
      <p className="text-[var(--t2)] mb-10">Courses, certifications, and ongoing learning.</p>
      {courses.length === 0 ? <div className="card p-12 text-center text-[var(--t3)]">No courses added yet.</div> : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map(c => (
            <div key={c.id} className="card p-5">
              {c.thumbnail && <img src={c.thumbnail} alt={c.title} className="w-full aspect-video object-cover rounded-xl mb-4" />}
              <div className="flex items-start justify-between gap-2 mb-3">
                <h3 className="text-sm font-semibold text-[var(--t1)] line-clamp-2 flex-1">{c.title}</h3>
                {c.status && <span className={`badge text-xs border shrink-0 ${STATUS_STYLES[c.status]}`}>{c.status}</span>}
              </div>
              {c.instructor && <p className="text-xs text-[var(--t3)] mb-1">by {c.instructor}</p>}
              {c.platform && <p className="text-xs text-[var(--t3)] mb-3">{c.platform}</p>}
              {c.total_videos && c.completed_videos !== undefined && (
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-[var(--t3)] mb-1">
                    <span>Progress</span>
                    <span>{c.completed_videos}/{c.total_videos} videos</span>
                  </div>
                  <div className="h-1.5 bg-[var(--bg-3)] rounded-full overflow-hidden">
                    <div className="h-full bg-folyx-500 rounded-full transition-all" style={{ width: `${(c.completed_videos/c.total_videos)*100}%` }} />
                  </div>
                </div>
              )}
              <div className="flex gap-2">
                <a href={c.url} target="_blank" rel="noreferrer" className="btn btn-outline text-xs py-1.5 px-3 gap-1 flex-1"><ExternalLink className="w-3 h-3" />View</a>
                {c.certificate_url && <a href={c.certificate_url} target="_blank" rel="noreferrer" className="btn btn-ghost text-xs py-1.5 px-3 gap-1"><CheckCircle className="w-3 h-3 text-emerald-400" />Cert</a>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div></section></div>
  )
}
