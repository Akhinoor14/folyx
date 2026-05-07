'use client'
import { useState, type FormEvent } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Zap, Eye, EyeOff, AlertCircle, Lock } from 'lucide-react'

export default function BossLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const params = useParams()

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true); setError('')
    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    if (authError) { setError('Invalid credentials. Please try again.'); setLoading(false); return }
    router.push(`/boss/${params.clientId}/dashboard`)
  }

  return (
    <div className="min-h-screen bg-[var(--bg-0)] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute inset-0 glow-top" />

      <div className="relative w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-folyx-600 flex items-center justify-center mx-auto mb-4 shadow-glow-md">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--t1)]">Only Boss</h1>
          <p className="text-sm text-[var(--t3)] mt-1">Your portfolio content manager</p>
        </div>

        <form onSubmit={handleLogin} className="card p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-[var(--t2)] mb-1.5">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              placeholder="your@email.com" className="input-folyx" autoComplete="email" />
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--t2)] mb-1.5">Password</label>
            <div className="relative">
              <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                placeholder="••••••••" className="input-folyx pr-10" autoComplete="current-password" />
              <button type="button" onClick={() => setShowPass(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--t3)] hover:text-[var(--t1)]">
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-3 py-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn btn-primary w-full gap-2">
            <Lock className="w-4 h-4" />
            {loading ? 'Logging in…' : 'Login to Boss'}
          </button>
        </form>

        <p className="text-center text-xs text-[var(--t3)] mt-4">
          Forgot credentials?{' '}
          <a href="https://folyx.com/contact" className="text-folyx-400 hover:text-folyx-300">Contact Folyx</a>
        </p>
      </div>
    </div>
  )
}
