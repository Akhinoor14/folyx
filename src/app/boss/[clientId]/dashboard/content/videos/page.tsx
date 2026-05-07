'use client'
// Videos Manager
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Plus, Pencil, Trash2, Save, X, ArrowLeft, Video as VideoIcon, Loader2 } from 'lucide-react'
import type { Video } from '@/types/content'
import { getYouTubeThumbnail } from '@/lib/utils'

const EMPTY: Omit<Video,'id'> = { title:'', description:'', youtube_id:'', category:'', tags:[], duration:'', date_added: new Date().toISOString() }

function extractYouTubeId(url: string): string {
  const match = url.match(/(?:youtu\.be\/|v=|embed\/)([^&?/]+)/)
  return match?.[1] || url
}

export default function BossVideosPage() {
  const { clientId } = useParams() as { clientId: string }
  const [items, setItems] = useState<Video[]>([])
  const [editing, setEditing] = useState<Video | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    fetch(`/api/github?clientId=${clientId}&path=content/videos.json`)
      .then(r=>r.json()).then(d=>{setItems(d||[]);setLoading(false)}).catch(()=>setLoading(false))
  },[clientId])

  const startNew = () => { setEditing({...EMPTY,id:`vid_${Date.now()}`});setIsNew(true) }
  const set = (k:string,v:any) => setEditing(e=>e?{...e,[k]:v}:e)

  const save = async () => {
    if (!editing) return; setSaving(true)
    const item = { ...editing, youtube_id: extractYouTubeId(editing.youtube_id) }
    const updated = isNew ? [...items,item] : items.map(i=>i.id===item.id?item:i)
    const res = await fetch('/api/github',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({clientId,path:'content/videos.json',content:JSON.stringify(updated,null,2)})})
    if (res.ok) {setItems(updated);setEditing(null);setIsNew(false);setMsg('Saved!')} else setMsg('Error.')
    setSaving(false);setTimeout(()=>setMsg(''),2500)
  }
  const remove = async (id:string) => {
    if (!confirm('Delete?')) return
    const updated = items.filter(i=>i.id!==id)
    await fetch('/api/github',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({clientId,path:'content/videos.json',content:JSON.stringify(updated,null,2)})})
    setItems(updated)
  }

  return (
    <div className="min-h-screen bg-[var(--bg-0)] p-4 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href={`/boss/${clientId}/dashboard`} className="btn btn-ghost p-2"><ArrowLeft className="w-4 h-4"/></Link>
        <div className="w-8 h-8 rounded-xl bg-rose-400/10 flex items-center justify-center"><VideoIcon className="w-4 h-4 text-rose-400"/></div>
        <h1 className="text-xl font-bold text-[var(--t1)]">Videos Manager</h1>
        <button onClick={startNew} className="btn btn-primary text-sm py-1.5 px-4 gap-1.5 ml-auto"><Plus className="w-4 h-4"/>Add Video</button>
      </div>
      {msg && <div className="card p-3 mb-4 text-sm text-center text-emerald-400 border-emerald-400/20">{msg}</div>}

      {editing && (
        <div className="card p-6 mb-6 border-folyx-500/30">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-[var(--t1)]">{isNew?'Add':'Edit'} Video</h2>
            <button onClick={()=>{setEditing(null);setIsNew(false)}} className="btn btn-ghost p-2"><X className="w-4 h-4"/></button>
          </div>
          <div className="mb-4"><label className="block text-xs text-[var(--t3)] mb-1">Title *</label><input value={editing.title} onChange={e=>set('title',e.target.value)} className="input-folyx"/></div>
          <div className="mb-4">
            <label className="block text-xs text-[var(--t3)] mb-1">YouTube URL or Video ID *</label>
            <input value={editing.youtube_id} onChange={e=>set('youtube_id',e.target.value)} className="input-folyx" placeholder="https://youtube.com/watch?v=... or dQw4w9WgXcQ"/>
            {editing.youtube_id && (
              <img src={getYouTubeThumbnail(extractYouTubeId(editing.youtube_id))} alt="thumbnail" className="mt-2 w-32 rounded-lg border border-[var(--border)]" />
            )}
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div><label className="block text-xs text-[var(--t3)] mb-1">Category</label><input value={editing.category} onChange={e=>set('category',e.target.value)} className="input-folyx" placeholder="Tutorial, Lecture"/></div>
            <div><label className="block text-xs text-[var(--t3)] mb-1">Duration</label><input value={editing.duration} onChange={e=>set('duration',e.target.value)} className="input-folyx" placeholder="12:34"/></div>
          </div>
          <div className="mb-4"><label className="block text-xs text-[var(--t3)] mb-1">Description</label><textarea value={editing.description} onChange={e=>set('description',e.target.value)} rows={2} className="input-folyx resize-none"/></div>
          <div className="flex gap-3 pt-4 border-t border-[var(--border)]">
            <button onClick={save} disabled={saving||!editing.title||!editing.youtube_id} className="btn btn-primary gap-2">
              {saving?<Loader2 className="w-4 h-4 animate-spin"/>:<Save className="w-4 h-4"/>}{saving?'Saving…':'Save'}
            </button>
            <button onClick={()=>{setEditing(null);setIsNew(false)}} className="btn btn-outline">Cancel</button>
          </div>
        </div>
      )}
      {loading?<div className="card p-12 text-center"><Loader2 className="w-6 h-6 animate-spin text-folyx-400 mx-auto"/></div>
      :items.length===0?<div className="card p-12 text-center text-[var(--t3)]">No videos yet.</div>
      :<div className="space-y-3">{items.map(v=>(
          <div key={v.id} className="card p-4 flex items-center gap-4">
            <img src={getYouTubeThumbnail(v.youtube_id)} alt={v.title} className="w-20 rounded-lg border border-[var(--border)] shrink-0" />
            <div className="flex-1 min-w-0"><p className="font-medium text-[var(--t1)] truncate">{v.title}</p><p className="text-xs text-[var(--t3)]">{v.duration||'No duration'}</p></div>
            <div className="flex gap-2 shrink-0">
              <button onClick={()=>{setEditing(v);setIsNew(false)}} className="w-8 h-8 rounded-lg hover:bg-[var(--bg-3)] flex items-center justify-center text-[var(--t2)]"><Pencil className="w-3.5 h-3.5"/></button>
              <button onClick={()=>remove(v.id)} className="w-8 h-8 rounded-lg hover:bg-red-400/10 flex items-center justify-center text-red-400"><Trash2 className="w-3.5 h-3.5"/></button>
            </div>
          </div>
        ))}</div>}
    </div>
  )
}
