'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { ArrowLeft, Save, Loader2, User, LogOut } from 'lucide-react'
import FileUploader from '@/components/boss/FileUploader'
import { useRouter } from 'next/navigation'

export default function BossSettingsPage() {
  const { clientId } = useParams() as { clientId: string }
  const router = useRouter()
  const [info, setInfo] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    const supabase = createClient()
    supabase.from('clients').select('info').eq('id', clientId).single()
      .then(({ data }) => { if (data) setInfo(data.info) })
  }, [clientId])

  const set = (path: string, value: any) => {
    setInfo((prev: any) => {
      const next = { ...prev }
      const keys = path.split('.')
      let obj = next
      for (let i = 0; i < keys.length - 1; i++) { obj[keys[i]] = { ...obj[keys[i]] }; obj = obj[keys[i]] }
      obj[keys[keys.length - 1]] = value
      return next
    })
  }

  const save = async () => {
    setSaving(true)
    const supabase = createClient()
    const { error } = await supabase.from('clients').update({ info }).eq('id', clientId)
    setMsg(error ? 'Error saving.' : 'Profile updated!')
    setSaving(false); setTimeout(() => setMsg(''), 2500)
  }

  const logout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push(`/boss/${clientId}/login`)
  }

  if (!info) return <div className="min-h-screen bg-[var(--bg-0)] flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-folyx-400"/></div>

  return (
    <div className="min-h-screen bg-[var(--bg-0)] p-4 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href={`/boss/${clientId}/dashboard`} className="btn btn-ghost p-2"><ArrowLeft className="w-4 h-4"/></Link>
        <div className="w-8 h-8 rounded-xl bg-[var(--bg-4)] flex items-center justify-center"><User className="w-4 h-4 text-[var(--t2)]"/></div>
        <h1 className="text-xl font-bold text-[var(--t1)]">Profile Settings</h1>
        <button onClick={logout} className="btn btn-ghost text-xs py-1.5 px-3 gap-1 ml-auto text-[var(--t3)]">
          <LogOut className="w-3.5 h-3.5"/>Logout
        </button>
      </div>
      {msg && <div className="card p-3 mb-4 text-sm text-center text-emerald-400 border-emerald-400/20">{msg}</div>}

      <div className="space-y-5">
        {/* Profile photo */}
        <div className="card p-5">
          <h3 className="font-semibold text-[var(--t1)] mb-4">Profile Photo</h3>
          <FileUploader type="image" currentUrl={info.personal?.profile_picture} label="Upload profile photo"
            onUpload={async(file)=>{const fd=new FormData();fd.append('file',file);fd.append('clientId',clientId);fd.append('type','profile');const r=await fetch('/api/upload',{method:'POST',body:fd});const d=await r.json();set('personal.profile_picture',d.url);return d.url}}/>
        </div>

        {/* Personal info */}
        <div className="card p-5">
          <h3 className="font-semibold text-[var(--t1)] mb-4">Personal Info</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              ['Display Name','personal.display_name','Nickname'],
              ['Job Title','personal.job_title','CSE Student, Engineer'],
              ['Tagline','personal.tagline','Your one-line bio'],
              ['Location','personal.location','Khulna, Bangladesh'],
            ].map(([label, path, placeholder]) => (
              <div key={path}>
                <label className="block text-xs text-[var(--t3)] mb-1">{label}</label>
                <input value={info?.personal?.[path.split('.')[1]]||''} onChange={e=>set(path,e.target.value)} className="input-folyx" placeholder={placeholder}/>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <label className="block text-xs text-[var(--t3)] mb-1">Short Bio</label>
            <textarea value={info.personal?.bio_short||''} onChange={e=>set('personal.bio_short',e.target.value)} rows={3} className="input-folyx resize-none" placeholder="Tell visitors about yourself..."/>
          </div>
        </div>

        {/* Contact */}
        <div className="card p-5">
          <h3 className="font-semibold text-[var(--t1)] mb-4">Contact Info</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {[['Email','contact.email'],['Phone','contact.phone'],['WhatsApp','contact.whatsapp']].map(([label,path])=>(
              <div key={path}>
                <label className="block text-xs text-[var(--t3)] mb-1">{label}</label>
                <input value={info?.contact?.[path.split('.')[1]]||''} onChange={e=>set(path,e.target.value)} className="input-folyx"/>
              </div>
            ))}
          </div>
        </div>

        {/* Social links */}
        <div className="card p-5">
          <h3 className="font-semibold text-[var(--t1)] mb-4">Social Links</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {[['GitHub','social.github_url'],['LinkedIn','social.linkedin_url'],['Facebook','social.facebook_url'],['YouTube','social.youtube_url']].map(([label,path])=>(
              <div key={path}>
                <label className="block text-xs text-[var(--t3)] mb-1">{label}</label>
                <input value={info?.social?.[path.split('.')[1]]||''} onChange={e=>set(path,e.target.value)} className="input-folyx" placeholder="https://..."/>
              </div>
            ))}
          </div>
        </div>

        <button onClick={save} disabled={saving} className="btn btn-primary w-full gap-2">
          {saving?<Loader2 className="w-4 h-4 animate-spin"/>:<Save className="w-4 h-4"/>}{saving?'Saving…':'Save All Changes'}
        </button>
      </div>
    </div>
  )
}
