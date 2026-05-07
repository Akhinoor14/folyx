import { createServerClient } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Users, Plus, Shield, Activity, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { formatDate, getDaysRemaining, getStatusColor } from '@/lib/utils'
import { FolyxLogo } from '@/components/shared/Navbar'

export default async function AdminDashboardPage() {
  const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || 'folyx.com'
  const supabase = createServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session || session.user.user_metadata?.role !== 'admin') redirect('/admin/login')

  const { data: clients } = await supabase.from('clients').select('id,subdomain,info,status,end_date,plan,created_at').order('created_at',{ascending:false})

  const total = clients?.length || 0
  const active = clients?.filter(c=>c.status==='active').length || 0
  const expiring = clients?.filter(c=>getDaysRemaining(c.end_date)<=7 && c.status==='active').length || 0
  const expired = clients?.filter(c=>c.status==='expired').length || 0

  return (
    <div className="min-h-screen bg-[var(--bg-0)]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[var(--bg-1)]/80 backdrop-blur-xl border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Shield className="w-5 h-5 text-folyx-400"/>
            <FolyxLogo/>
            <span className="text-[var(--t3)] text-sm">Supreme Admin</span>
          </div>
          <Link href="/admin/dashboard/clients/new" className="btn btn-primary text-sm py-1.5 px-4 gap-1.5">
            <Plus className="w-4 h-4"/>Add Client
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label:'Total Clients', value:total, icon:Users, color:'text-folyx-400' },
            { label:'Active', value:active, icon:CheckCircle, color:'text-emerald-400' },
            { label:'Expiring Soon', value:expiring, icon:Clock, color:'text-amber-400' },
            { label:'Expired', value:expired, icon:AlertCircle, color:'text-red-400' },
          ].map(({label,value,icon:Icon,color})=>(
            <div key={label} className="card p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-[var(--t3)]">{label}</p>
                <Icon className={`w-4 h-4 ${color}`}/>
              </div>
              <p className={`text-3xl font-bold font-display ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Client list */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[var(--t1)]">All Clients</h2>
          <Link href="/admin/dashboard/clients" className="text-sm text-folyx-400 hover:text-folyx-300">View all →</Link>
        </div>

        <div className="space-y-3">
          {clients?.slice(0,10).map(c => {
            const daysLeft = getDaysRemaining(c.end_date)
            return (
              <div key={c.id} className="card p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-folyx-600/20 flex items-center justify-center shrink-0 font-bold text-folyx-300">
                  {c.info?.personal?.display_name?.charAt(0) || c.subdomain.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[var(--t1)]">{c.info?.personal?.full_name || c.subdomain}</p>
                  <p className="text-xs text-[var(--t3)]">{c.subdomain}.{appDomain} · {c.plan} · {formatDate(c.created_at)}</p>
                </div>
                <div className="hidden sm:block text-right shrink-0">
                  <span className={`badge text-xs border ${getStatusColor(c.status)}`}>{c.status}</span>
                  {c.status==='active' && <p className="text-xs text-[var(--t3)] mt-1">{daysLeft}d left</p>}
                </div>
                <Link href={`/admin/dashboard/clients/${c.id}`} className="btn btn-outline text-xs py-1.5 px-3 shrink-0">
                  Manage
                </Link>
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
