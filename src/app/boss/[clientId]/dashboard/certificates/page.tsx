'use client'
// Certificates Manager
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Plus, Pencil, Trash2, Save, X, ArrowLeft, Award, Loader2 } from 'lucide-react'
import FileUploader from '@/components/boss/FileUploader'
import type { Certificate } from '@/types/content'

const EMPTY: Omit<Certificate,'id'> = { title:'', issuer:'', issue_date:'', image_url:'', credential_url:'', category:'', tags:[] }

export default function BossCertificatesPage() {
  const { clientId } = useParams() as { clientId: string }
  const [items, setItems] = useState<Certificate[]>([])
  const [editing, setEditing] = useState<Certificate | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    fetch(`/api/github?clientId=${clientId}&path=content/certificates.json`)
      .then(r=>r.json()).then(d=>{setItems(d||[]);setLoading(false)}).catch(()=>setLoading(false))
  },[clientId])

  const startNew = () => { setEditing({...EMPTY,id:`cert_${Date.now()}`});setIsNew(true) }
  const set = (k:string,v:any) => setEditing(e=>e?{...e,[k]:v}:e)

  const save = async () => {
    if (!editing) return; setSaving(true)
    const updated = isNew ? [...items,editing] : items.map(i=>i.id===editing.id?editing:i)
    const res = await fetch('/api/github',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({clientId,path:'content/certificates.json',content:JSON.stringify(updated,null,2)})})
    if (res.ok) {setItems(updated);setEditing(null);setIsNew(false);setMsg('Saved!')} else setMsg('Error.')
    setSaving(false);setTimeout(()=>setMsg(''),2500)
  }
  const remove = async (id:string) => {
    if (!confirm('Delete this certificate?')) return
    const updated = items.filter(i=>i.id!==id)
    await fetch('/api/github',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({clientId,path:'content/certificates.json',content:JSON.stringify(updated,null,2)})})
    setItems(updated)
  }

  return (
    <div className="min-h-screen bg-[var(--bg-0)] p-4 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href={`/boss/${clientId}/dashboard`} className="btn btn-ghost p-2"><ArrowLeft className="w-4 h-4"/></Link>
        <div className="w-8 h-8 rounded-xl bg-yellow-400/10 flex items-center justify-center"><Award className="w-4 h-4 text-yellow-400"/></div>
        <h1 className="text-xl font-bold text-[var(--t1)]">Certificates</h1>
        <button onClick={startNew} className="btn btn-primary text-sm py-1.5 px-4 gap-1.5 ml-auto"><Plus className="w-4 h-4"/>Add Certificate</button>
      </div>
      {msg && <div className="card p-3 mb-4 text-sm text-center text-emerald-400 border-emerald-400/20">{msg}</div>}

      {editing && (
        <div className="card p-6 mb-6 border-folyx-500/30">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-[var(--t1)]">{isNew?'Add':'Edit'} Certificate</h2>
            <button onClick={()=>{setEditing(null);setIsNew(false)}} className="btn btn-ghost p-2"><X className="w-4 h-4"/></button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div><label className="block text-xs text-[var(--t3)] mb-1">Certificate Title *</label><input value={editing.title} onChange={e=>set('title',e.target.value)} className="input-folyx"/></div>
            <div><label className="block text-xs text-[var(--t3)] mb-1">Issuer *</label><input value={editing.issuer} onChange={e=>set('issuer',e.target.value)} className="input-folyx" placeholder="Coursera, Google, IEEE"/></div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div><label className="block text-xs text-[var(--t3)] mb-1">Issue Date *</label><input type="date" value={editing.issue_date} onChange={e=>set('issue_date',e.target.value)} className="input-folyx"/></div>
            <div><label className="block text-xs text-[var(--t3)] mb-1">Expiry Date</label><input type="date" value={editing.expiry_date||''} onChange={e=>set('expiry_date',e.target.value)} className="input-folyx"/></div>
          </div>
          <div className="mb-4"><label className="block text-xs text-[var(--t3)] mb-1">Credential URL</label><input value={editing.credential_url||''} onChange={e=>set('credential_url',e.target.value)} className="input-folyx" placeholder="https://credential.link"/></div>
          <div className="mb-5"><label className="block text-xs text-[var(--t3)] mb-1.5">Certificate Image *</label>
            <FileUploader type="image" currentUrl={editing.image_url} label="Upload certificate image"
              onUpload={async(file)=>{const fd=new FormData();fd.append('file',file);fd.append('clientId',clientId);fd.append('type','image');const r=await fetch('/api/upload',{method:'POST',body:fd});const d=await r.json();set('image_url',d.url);return d.url}}/></div>
          <div className="flex gap-3 pt-4 border-t border-[var(--border)]">
            <button onClick={save} disabled={saving||!editing.title||!editing.issuer||!editing.image_url} className="btn btn-primary gap-2">
              {saving?<Loader2 className="w-4 h-4 animate-spin"/>:<Save className="w-4 h-4"/>}{saving?'Saving…':'Save'}
            </button>
            <button onClick={()=>{setEditing(null);setIsNew(false)}} className="btn btn-outline">Cancel</button>
          </div>
        </div>
      )}
      {loading?<div className="card p-12 text-center"><Loader2 className="w-6 h-6 animate-spin text-folyx-400 mx-auto"/></div>
      :items.length===0?<div className="card p-12 text-center text-[var(--t3)]">No certificates yet.</div>
      :<div className="grid sm:grid-cols-2 gap-4">{items.map(c=>(
          <div key={c.id} className="card p-4">
            {c.image_url && <img src={c.image_url} alt={c.title} className="w-full aspect-[4/3] object-cover rounded-xl mb-3 border border-[var(--border)]"/>}
            <p className="font-medium text-[var(--t1)] truncate">{c.title}</p>
            <p className="text-xs text-[var(--t3)]">{c.issuer} · {c.issue_date}</p>
            <div className="flex gap-2 mt-3">
              <button onClick={()=>{setEditing(c);setIsNew(false)}} className="btn btn-ghost text-xs py-1.5 px-3 gap-1"><Pencil className="w-3 h-3"/>Edit</button>
              <button onClick={()=>remove(c.id)} className="btn btn-ghost text-xs py-1.5 px-3 gap-1 text-red-400"><Trash2 className="w-3 h-3"/>Delete</button>
            </div>
          </div>
        ))}</div>}
    </div>
  )
}
