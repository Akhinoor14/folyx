import { createServerClient } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Zap, Box, Code2, Globe, BarChart2, BookOpen, FileText, Video, GraduationCap, Award, Settings, LogOut, User, Layers } from 'lucide-react'

interface Props { params: { clientId: string } }

const SECTIONS = [
  {
    title: 'Projects',
    color: 'text-amber-400',
    items: [
      { label: 'Arduino',     href: 'projects/arduino',     icon: Zap },
      { label: 'MATLAB',      href: 'projects/matlab',      icon: BarChart2 },
      { label: 'SolidWorks',  href: 'projects/solidworks',  icon: Box },
      { label: 'Programming', href: 'projects/programming',  icon: Code2 },
      { label: 'Websites',    href: 'projects/websites',     icon: Globe },
      { label: 'Electronics', href: 'projects/electronics',  icon: Layers },
    ],
  },
  {
    title: 'Content Studio',
    color: 'text-emerald-400',
    items: [
      { label: 'Books',   href: 'content/books',   icon: BookOpen },
      { label: 'Papers',  href: 'content/papers',  icon: FileText },
      { label: 'Posts',   href: 'content/posts',   icon: FileText },
      { label: 'Videos',  href: 'content/videos',  icon: Video },
      { label: 'Courses', href: 'content/courses', icon: GraduationCap },
    ],
  },
]

export default async function BossDashboardPage({ params }: Props) {
  const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || 'folyx.com'
  const supabase = createServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect(`/boss/${params.clientId}/login`)

  const { data: client } = await supabase
    .from('clients')
    .select('info, subdomain')
    .eq('id', params.clientId)
    .single()

  const info = client?.info
  const subdomain = client?.subdomain

  return (
    <div className="min-h-screen bg-[var(--bg-0)]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[var(--bg-1)]/80 backdrop-blur-xl border-b border-[var(--border)]">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-folyx-600 flex items-center justify-center"><Zap className="w-4 h-4 text-white" /></div>
            <span className="font-bold text-[var(--t1)]">Only Boss</span>
            {info && <span className="text-[var(--t3)] text-sm">· {info.personal?.display_name}</span>}
          </div>
          <div className="flex items-center gap-2">
            <a href={`https://${subdomain}.${appDomain}`} target="_blank" rel="noreferrer"
               className="btn btn-ghost text-xs py-1.5 px-3 gap-1">
              <Globe className="w-3.5 h-3.5" /> View Site
            </a>
            <Link href={`/boss/${params.clientId}/dashboard/settings`} className="w-8 h-8 rounded-lg hover:bg-[var(--bg-3)] flex items-center justify-center text-[var(--t2)]">
              <Settings className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[var(--t1)] mb-1">
            Welcome back, {info?.personal?.display_name || 'Boss'} 👋
          </h1>
          <p className="text-[var(--t2)] text-sm">Manage your portfolio content below.</p>
        </div>

        {/* Sections */}
        {SECTIONS.map(section => (
          <div key={section.title} className="mb-8">
            <h2 className={`text-sm font-semibold ${section.color} uppercase tracking-wider mb-4`}>
              {section.title}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {section.items.map(({ label, href, icon: Icon }) => (
                <Link key={label} href={`/boss/${params.clientId}/dashboard/${href}`}
                  className="card p-4 text-center hover:border-folyx-500/30 group">
                  <Icon className="w-5 h-5 mx-auto mb-2 text-[var(--t2)] group-hover:text-folyx-400 transition-colors" />
                  <p className="text-xs font-medium text-[var(--t1)]">{label}</p>
                </Link>
              ))}
            </div>
          </div>
        ))}

        {/* Certificates & Settings */}
        <div className="grid sm:grid-cols-2 gap-4">
          <Link href={`/boss/${params.clientId}/dashboard/certificates`}
            className="card p-5 flex items-center gap-4 hover:border-folyx-500/30">
            <div className="w-10 h-10 rounded-xl bg-yellow-400/10 flex items-center justify-center">
              <Award className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <p className="font-semibold text-[var(--t1)]">Certificates</p>
              <p className="text-xs text-[var(--t3)]">Upload and manage achievement certificates</p>
            </div>
          </Link>
          <Link href={`/boss/${params.clientId}/dashboard/settings`}
            className="card p-5 flex items-center gap-4 hover:border-folyx-500/30">
            <div className="w-10 h-10 rounded-xl bg-[var(--bg-4)] flex items-center justify-center">
              <User className="w-5 h-5 text-[var(--t2)]" />
            </div>
            <div>
              <p className="font-semibold text-[var(--t1)]">Profile Settings</p>
              <p className="text-xs text-[var(--t3)]">Update photo, bio, and contact info</p>
            </div>
          </Link>
        </div>
      </main>
    </div>
  )
}
