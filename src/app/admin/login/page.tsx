'use client'
import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Shield, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { FolyxLogo } from '@/components/shared/Navbar'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true); setError('')
    const supabase = createClient()
    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password })
    if (authError || !data.session) { setError('Invalid credentials.'); setLoading(false); return }
    // Check admin role in user metadata
    const role = data.user?.user_metadata?.role
    if (role !== 'admin') { await supabase.auth.signOut(); setError('Access denied. Admin only.'); setLoading(false); return }
    router.push('/admin/dashboard')
  }

  return (
    <div className="min-h-screen bg-[var(--bg-0)] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-grid opacity-30"/>
      <div className="absolute inset-0 glow-top"/>
      <div className="relative w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[var(--bg-3)] border border-[var(--border)] flex items-center justify-center mx-auto mb-4">
            <Shield className="w-6 h-6 text-folyx-400"/>
          </div>
          <FolyxLogo size="lg"/>
          <p className="text-sm text-[var(--t3)] mt-1">Supreme Admin</p>
        </div>
        <form onSubmit={handleLogin} className="card p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-[var(--t2)] mb-1.5">Admin Email</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required className="input-folyx" autoComplete="email"/>
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--t2)] mb-1.5">Password</label>
            <div className="relative">
              <input type={showPass?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)} required className="input-folyx pr-10" autoComplete="current-password"/>
              <button type="button" onClick={()=>setShowPass(s=>!s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--t3)]">
                {showPass?<EyeOff className="w-4 h-4"/>:<Eye className="w-4 h-4"/>}
              </button>
            </div>
          </div>
          {error && <div className="flex items-center gap-2 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-3 py-2.5"><AlertCircle className="w-4 h-4 shrink-0"/>{error}</div>}
          <button type="submit" disabled={loading} className="btn btn-primary w-full gap-2">
            <Shield className="w-4 h-4"/>{loading?'Logging in…':'Admin Login'}
          </button>
        </form>
      </div>
    </div>
  )
}
