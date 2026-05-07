'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, CheckCircle, Loader2, Zap } from 'lucide-react'
import type { NewClientFormData } from '@/types/client'
import { generatePassword, getPlanEndDate } from '@/lib/utils'

const STEPS = ['Basic Info', 'Academic', 'Review & Create']

const EMPTY: NewClientFormData = {
  full_name:'', display_name:'', subdomain:'', plan:'monthly', boss_email:'', phone:'',
  university_full:'', university_short:'', department:'', batch:'', job_title:'Student', tagline:'',
  github_username:'', linkedin_url:'', hsc_institution:'', ssc_institution:'', bio_short:'', facebook_url:'',
}

export default function AddClientPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<NewClientFormData>(EMPTY)
  const [creating, setCreating] = useState(false)
  const [result, setResult] = useState<{ success:boolean; url?:string; error?:string } | null>(null)

  const set = (k: keyof NewClientFormData, v: string) => setForm(p => ({...p,[k]:v}))

  const autoSubdomain = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g,'-').replace(/(^-|-$)/g,'').replace(/-+/g,'-')

  const handleCreate = async () => {
    setCreating(true)
    try {
      const bossPassword = generatePassword(12)
      const endDate = getPlanEndDate(form.plan).toISOString()
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, boss_password: bossPassword, end_date: endDate }),
      })
      const data = await res.json()
      if (res.ok) {
        setResult({ success: true, url: `https://${form.subdomain}.folyx.com` })
      } else {
        setResult({ success: false, error: data.error || 'Failed to create client.' })
      }
    } catch (e: any) {
      setResult({ success: false, error: e.message })
    }
    setCreating(false)
  }

  if (result?.success) {
    return (
      <div className="min-h-screen bg-[var(--bg-0)] flex items-center justify-center p-4">
        <div className="card p-8 max-w-md w-full text-center">
          <div className="w-14 h-14 rounded-2xl bg-emerald-400/10 flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-7 h-7 text-emerald-400"/>
          </div>
          <h2 className="text-xl font-bold text-[var(--t1)] mb-2">Portfolio Created!</h2>
          <p className="text-[var(--t2)] text-sm mb-1">Live at:</p>
          <a href={result.url} target="_blank" rel="noreferrer" className="text-folyx-400 font-medium hover:underline">{result.url}</a>
          <p className="text-xs text-[var(--t3)] mt-4">Welcome email sent to {form.boss_email}. Deployment takes ~2 minutes.</p>
          <div className="flex gap-3 mt-6">
            <Link href="/admin/dashboard" className="btn btn-outline flex-1">Back to Dashboard</Link>
            <Link href="/admin/dashboard/clients/new" onClick={()=>{setForm(EMPTY);setStep(0);setResult(null)}} className="btn btn-primary flex-1">Add Another</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--bg-0)] p-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link href="/admin/dashboard" className="btn btn-ghost p-2"><ArrowLeft className="w-4 h-4"/></Link>
          <div>
            <h1 className="text-xl font-bold text-[var(--t1)]">Add New Client</h1>
            <p className="text-xs text-[var(--t3)]">Step {step+1} of {STEPS.length}: {STEPS[step]}</p>
          </div>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((s,i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${i<=step?'bg-folyx-600 text-white':'bg-[var(--bg-3)] text-[var(--t3)]'}`}>{i+1}</div>
              {i<STEPS.length-1 && <div className={`h-px flex-1 ${i<step?'bg-folyx-500':'bg-[var(--border)]'}`}/>}
            </div>
          ))}
        </div>

        <div className="card p-6">
          {/* Step 1: Basic */}
          {step===0 && (
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className="block text-xs text-[var(--t3)] mb-1">Full Name *</label>
                  <input value={form.full_name} onChange={e=>{set('full_name',e.target.value);if(!form.display_name)set('display_name',e.target.value.split(' ')[0]);if(!form.subdomain)set('subdomain',autoSubdomain(e.target.value.split(' ')[0]))}} className="input-folyx"/></div>
                <div><label className="block text-xs text-[var(--t3)] mb-1">Display Name *</label>
                  <input value={form.display_name} onChange={e=>set('display_name',e.target.value)} className="input-folyx" placeholder="Nick / First name"/></div>
              </div>
              <div><label className="block text-xs text-[var(--t3)] mb-1">Subdomain * <span className="text-folyx-400 ml-1">{form.subdomain}.folyx.com</span></label>
                <input value={form.subdomain} onChange={e=>set('subdomain',autoSubdomain(e.target.value))} className="input-folyx font-mono" placeholder="name"/></div>
              <div><label className="block text-xs text-[var(--t3)] mb-1">Boss Login Email *</label>
                <input type="email" value={form.boss_email} onChange={e=>set('boss_email',e.target.value)} className="input-folyx"/></div>
              <div><label className="block text-xs text-[var(--t3)] mb-1">Phone / WhatsApp</label>
                <input value={form.phone||''} onChange={e=>set('phone',e.target.value)} className="input-folyx"/></div>
              <div><label className="block text-xs text-[var(--t3)] mb-1">Plan *</label>
                <select value={form.plan} onChange={e=>set('plan',e.target.value as any)} className="input-folyx">
                  <option value="monthly">Monthly — ৳299</option>
                  <option value="half_yearly">6 Months — ৳1499</option>
                  <option value="yearly">Yearly — ৳2499</option>
                </select></div>
            </div>
          )}

          {/* Step 2: Academic */}
          {step===1 && (
            <div className="space-y-4">
              <div><label className="block text-xs text-[var(--t3)] mb-1">University (Full Name)</label>
                <input value={form.university_full||''} onChange={e=>set('university_full',e.target.value)} className="input-folyx" placeholder="Khulna University of Engineering & Technology"/></div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className="block text-xs text-[var(--t3)] mb-1">Short Name</label>
                  <input value={form.university_short||''} onChange={e=>set('university_short',e.target.value)} className="input-folyx" placeholder="KUET"/></div>
                <div><label className="block text-xs text-[var(--t3)] mb-1">Department</label>
                  <input value={form.department||''} onChange={e=>set('department',e.target.value)} className="input-folyx" placeholder="CSE, EEE, ME"/></div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className="block text-xs text-[var(--t3)] mb-1">Batch</label>
                  <input value={form.batch||''} onChange={e=>set('batch',e.target.value)} className="input-folyx" placeholder="19, 20, 21..."/></div>
                <div><label className="block text-xs text-[var(--t3)] mb-1">Job Title</label>
                  <input value={form.job_title||''} onChange={e=>set('job_title',e.target.value)} className="input-folyx" placeholder="CSE Student"/></div>
              </div>
              <div><label className="block text-xs text-[var(--t3)] mb-1">Tagline</label>
                <input value={form.tagline||''} onChange={e=>set('tagline',e.target.value)} className="input-folyx" placeholder="Building the future with code"/></div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className="block text-xs text-[var(--t3)] mb-1">GitHub Username</label>
                  <input value={form.github_username||''} onChange={e=>set('github_username',e.target.value)} className="input-folyx" placeholder="username"/></div>
                <div><label className="block text-xs text-[var(--t3)] mb-1">LinkedIn URL</label>
                  <input value={form.linkedin_url||''} onChange={e=>set('linkedin_url',e.target.value)} className="input-folyx" placeholder="https://linkedin.com/in/..."/></div>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step===2 && (
            <div className="space-y-4">
              <div className="bg-[var(--bg-1)] rounded-xl p-4 space-y-2 text-sm">
                {[
                  ['Name', form.full_name],
                  ['Subdomain', `${form.subdomain}.folyx.com`],
                  ['Email', form.boss_email],
                  ['Plan', form.plan],
                  ['University', form.university_short||'—'],
                  ['Department', form.department||'—'],
                ].map(([k,v])=>(
                  <div key={k} className="flex justify-between">
                    <span className="text-[var(--t3)]">{k}</span>
                    <span className="text-[var(--t1)] font-medium">{v}</span>
                  </div>
                ))}
              </div>
              {result?.error && (
                <div className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">{result.error}</div>
              )}
              <div className="bg-folyx-600/5 border border-folyx-500/20 rounded-xl p-4 text-xs text-[var(--t2)] space-y-1">
                <p>✓ Supabase client row created</p>
                <p>✓ GitHub portfolio repo auto-generated</p>
                <p>✓ Vercel subdomain provisioned (~60s)</p>
                <p>✓ Welcome email sent to {form.boss_email}</p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-6 pt-4 border-t border-[var(--border)]">
            {step>0 && <button onClick={()=>setStep(s=>s-1)} className="btn btn-outline gap-2"><ArrowLeft className="w-4 h-4"/>Back</button>}
            {step<STEPS.length-1 ? (
              <button onClick={()=>setStep(s=>s+1)} disabled={step===0&&(!form.full_name||!form.subdomain||!form.boss_email)}
                className="btn btn-primary gap-2 ml-auto">Next<ArrowRight className="w-4 h-4"/></button>
            ) : (
              <button onClick={handleCreate} disabled={creating} className="btn btn-primary gap-2 ml-auto">
                {creating?<Loader2 className="w-4 h-4 animate-spin"/>:<Zap className="w-4 h-4"/>}
                {creating?'Creating…':'Create Portfolio'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
