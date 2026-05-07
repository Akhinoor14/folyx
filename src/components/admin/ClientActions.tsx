'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { RefreshCw, PauseCircle, PlayCircle, Trash2, Key, Loader2, CheckCircle } from 'lucide-react'
import { getPlanEndDate } from '@/lib/utils'

interface ClientActionsProps {
  client: {
    id: string
    subdomain: string
    status: string
    plan: string
    boss_email: string
  }
}

export default function ClientActions({ client }: ClientActionsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [msg, setMsg] = useState('')

  const doAction = async (action: string, body?: object) => {
    setLoading(action)
    const res = await fetch(`/api/clients/${client.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, ...body }),
    })
    const data = await res.json()
    setMsg(res.ok ? data.message || 'Done!' : data.error || 'Error.')
    setLoading(null)
    setTimeout(() => { setMsg(''); router.refresh() }, 2000)
  }

  const extendPlan = () => {
    const newEndDate = getPlanEndDate(client.plan as any).toISOString()
    doAction('extend', { end_date: newEndDate })
  }

  const confirmDelete = () => {
    if (confirm(`Permanently delete ${client.subdomain}? This cannot be undone.`)) {
      doAction('delete')
    }
  }

  const actions = [
    {
      id: 'extend',
      label: 'Extend Subscription',
      desc: `Add 1 ${client.plan} period from today`,
      icon: RefreshCw,
      color: 'text-folyx-400',
      bg: 'bg-folyx-400/10 hover:bg-folyx-400/20 border-folyx-400/20',
      onClick: extendPlan,
    },
    {
      id: 'toggle_status',
      label: client.status === 'active' ? 'Suspend Client' : 'Reactivate Client',
      desc: client.status === 'active' ? 'Portfolio will show expired notice' : 'Restore full access',
      icon: client.status === 'active' ? PauseCircle : PlayCircle,
      color: client.status === 'active' ? 'text-amber-400' : 'text-emerald-400',
      bg: client.status === 'active'
        ? 'bg-amber-400/10 hover:bg-amber-400/20 border-amber-400/20'
        : 'bg-emerald-400/10 hover:bg-emerald-400/20 border-emerald-400/20',
      onClick: () => doAction('toggle_status'),
    },
    {
      id: 'reset_password',
      label: 'Reset Boss Password',
      desc: `Send new password to ${client.boss_email}`,
      icon: Key,
      color: 'text-purple-400',
      bg: 'bg-purple-400/10 hover:bg-purple-400/20 border-purple-400/20',
      onClick: () => doAction('reset_password'),
    },
    {
      id: 'delete',
      label: 'Delete Client',
      desc: 'Permanently remove all data and portfolio',
      icon: Trash2,
      color: 'text-red-400',
      bg: 'bg-red-400/10 hover:bg-red-400/20 border-red-400/20',
      onClick: confirmDelete,
    },
  ]

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-[var(--t1)]">Actions</h3>

      {msg && (
        <div className="flex items-center gap-2 text-sm text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-xl px-4 py-3">
          <CheckCircle className="w-4 h-4 shrink-0" />{msg}
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-3">
        {actions.map(({ id, label, desc, icon: Icon, color, bg, onClick }) => (
          <button
            key={id}
            onClick={onClick}
            disabled={loading !== null}
            className={`flex items-start gap-3 p-4 rounded-xl border text-left transition-all ${bg} disabled:opacity-50`}
          >
            <div className="mt-0.5 shrink-0">
              {loading === id
                ? <Loader2 className={`w-5 h-5 ${color} animate-spin`} />
                : <Icon className={`w-5 h-5 ${color}`} />
              }
            </div>
            <div>
              <p className={`text-sm font-semibold ${color}`}>{label}</p>
              <p className="text-xs text-[var(--t3)] mt-0.5">{desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
