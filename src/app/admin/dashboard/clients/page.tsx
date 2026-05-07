import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus, ArrowLeft, ExternalLink } from 'lucide-react'
import { formatDate, getDaysRemaining, getStatusColor } from '@/lib/utils'

export default async function AdminClientsPage() {
  const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || 'folyx.com'
  const supabase = createServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session || session.user.user_metadata?.role !== 'admin') redirect('/admin/login')

  const { data: clients } = await supabase
    .from('clients')
    .select('id,subdomain,info,status,end_date,plan,created_at')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-[var(--bg-0)] p-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/admin/dashboard" className="btn btn-ghost p-2"><ArrowLeft className="w-4 h-4"/></Link>
          <h1 className="text-xl font-bold text-[var(--t1)]">All Clients</h1>
          <span className="badge badge-primary ml-1">{clients?.length || 0}</span>
          <Link href="/admin/dashboard/clients/new" className="btn btn-primary text-sm py-1.5 px-4 gap-1.5 ml-auto">
            <Plus className="w-4 h-4"/>Add Client
          </Link>
        </div>

        <div className="space-y-3">
          {clients?.map(c => {
            const daysLeft = getDaysRemaining(c.end_date)
            const name = c.info?.personal?.full_name || c.subdomain
            const initials = name.split(' ').map((n: string) => n[0]).join('').slice(0,2).toUpperCase()
            return (
              <div key={c.id} className="card p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-folyx-600/20 flex items-center justify-center shrink-0 font-bold text-folyx-300 text-sm">
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[var(--t1)]">{name}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-0.5">
                    <span className="text-xs text-[var(--t3)]">{c.subdomain}.{appDomain}</span>
                    <span className="text-xs text-[var(--t3)]">·</span>
                    <span className="text-xs text-[var(--t3)] capitalize">{c.plan}</span>
                    <span className="text-xs text-[var(--t3)]">·</span>
                    <span className="text-xs text-[var(--t3)]">Since {formatDate(c.created_at)}</span>
                  </div>
                </div>
                <div className="hidden sm:flex flex-col items-end gap-1 shrink-0">
                  <span className={`badge text-xs border ${getStatusColor(c.status)}`}>{c.status}</span>
                  {c.status === 'active' && (
                    <span className={`text-xs ${daysLeft <= 7 ? 'text-amber-400' : 'text-[var(--t3)]'}`}>
                      {daysLeft}d left
                    </span>
                  )}
                </div>
                <div className="flex gap-2 shrink-0">
                  <a href={`https://${c.subdomain}.${appDomain}`} target="_blank" rel="noreferrer"
                     className="w-8 h-8 rounded-lg hover:bg-[var(--bg-3)] flex items-center justify-center text-[var(--t2)] transition-colors">
                    <ExternalLink className="w-3.5 h-3.5"/>
                  </a>
                  <Link href={`/admin/dashboard/clients/${c.id}`} className="btn btn-outline text-xs py-1.5 px-3">
                    Manage
                  </Link>
                </div>
              </div>
            )
          })}
          {(!clients || clients.length === 0) && (
            <div className="card p-12 text-center text-[var(--t3)]">
              No clients yet.{' '}
              <Link href="/admin/dashboard/clients/new" className="text-folyx-400 hover:underline">Add the first one</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
