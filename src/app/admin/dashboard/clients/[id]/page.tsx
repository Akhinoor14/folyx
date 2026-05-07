import { createServerClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { formatDate, getDaysRemaining, getStatusColor } from '@/lib/utils'
import ClientActions from '@/components/admin/ClientActions'

interface Props { params: { id: string } }

export default async function ClientDetailPage({ params }: Props) {
  const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || 'folyx.com'
  const supabase = createServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session || session.user.user_metadata?.role !== 'admin') redirect('/admin/login')

  const { data: client } = await supabase
    .from('clients')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!client) notFound()

  const info = client.info
  const daysLeft = getDaysRemaining(client.end_date)

  return (
    <div className="min-h-screen bg-[var(--bg-0)] p-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/admin/dashboard/clients" className="btn btn-ghost p-2"><ArrowLeft className="w-4 h-4"/></Link>
          <div>
            <h1 className="text-xl font-bold text-[var(--t1)]">{info?.personal?.full_name || client.subdomain}</h1>
            <p className="text-xs text-[var(--t3)]">{client.subdomain}.{appDomain}</p>
          </div>
          <a href={`https://${client.subdomain}.${appDomain}`} target="_blank" rel="noreferrer"
             className="btn btn-outline text-xs py-1.5 px-3 gap-1.5 ml-auto">
            <ExternalLink className="w-3.5 h-3.5"/>View Site
          </a>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-5">
          {/* Subscription card */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-[var(--t1)] mb-4">Subscription</h3>
            <div className="space-y-2.5">
              {[
                ['Status', <span className={`badge text-xs border ${getStatusColor(client.status)}`}>{client.status}</span>],
                ['Plan', <span className="text-[var(--t1)] capitalize font-medium">{client.plan}</span>],
                ['Started', formatDate(client.created_at)],
                ['Expires', formatDate(client.end_date)],
                ['Days Left', <span className={daysLeft <= 7 ? 'text-amber-400 font-semibold' : 'text-[var(--t1)]'}>{daysLeft} days</span>],
              ].map(([k, v]: any) => (
                <div key={k} className="flex justify-between items-center text-sm">
                  <span className="text-[var(--t3)]">{k}</span>
                  <span>{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Client info card */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-[var(--t1)] mb-4">Client Info</h3>
            <div className="space-y-2.5">
              {[
                ['Email', info?.contact?.email || client.boss_email],
                ['Phone', info?.contact?.phone || '—'],
                ['University', info?.personal?.university_short || '—'],
                ['Department', info?.personal?.department || '—'],
                ['Batch', info?.personal?.batch || '—'],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between items-center text-sm">
                  <span className="text-[var(--t3)]">{k}</span>
                  <span className="text-[var(--t1)] text-right max-w-[180px] truncate">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions — client component for interactivity */}
        <ClientActions client={client} />
      </div>
    </div>
  )
}
