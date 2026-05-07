import { headers } from 'next/headers'
import { getClientInfo } from '@/lib/github'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { BookOpen, FileText, PenSquare, Video, GraduationCap, ArrowRight } from 'lucide-react'

interface Props { params: { subdomain: string } }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = await getClientInfo(params.subdomain)
  return { title: `Studio — ${c?.personal.full_name || ''}` }
}

const STUDIO_ITEMS = [
  { label: 'Books',   desc: 'Reading list & library',         icon: BookOpen,    href: '/studio/books',   color: 'text-amber-400',  bg: 'bg-amber-400/10' },
  { label: 'Papers',  desc: 'Research publications',          icon: FileText,    href: '/studio/papers',  color: 'text-blue-400',   bg: 'bg-blue-400/10' },
  { label: 'Posts',   desc: 'Written articles & thoughts',    icon: PenSquare,   href: '/studio/posts',   color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  { label: 'Videos',  desc: 'Video content & lectures',       icon: Video,       href: '/studio/videos',  color: 'text-rose-400',   bg: 'bg-rose-400/10' },
  { label: 'Courses', desc: 'Courses & certifications',       icon: GraduationCap, href: '/studio/courses', color: 'text-purple-400', bg: 'bg-purple-400/10' },
]

export default async function StudioPage({ params }: Props) {
  const subdomain = headers().get('x-folyx-subdomain') || params.subdomain
  const client = await getClientInfo(subdomain)
  if (!client) notFound()

  return (
    <div className="pt-24">
      <section className="section-sm">
        <div className="container-folyx">
          <div className="section-label">Content Studio</div>
          <h1 className="mb-3">Publications & Content</h1>
          <p className="text-[var(--t2)] mb-12">Books, research, writing, videos, and courses.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {STUDIO_ITEMS.map(({ label, desc, icon: Icon, href, color, bg }) => (
              <Link key={label} href={href} className="card p-6 group hover:border-folyx-500/30">
                <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center mb-4`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <h3 className="text-base font-semibold text-[var(--t1)] mb-1">{label}</h3>
                <p className="text-sm text-[var(--t2)] mb-4">{desc}</p>
                <span className={`flex items-center gap-1 text-xs font-medium ${color}`}>
                  Browse {label.toLowerCase()} <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
