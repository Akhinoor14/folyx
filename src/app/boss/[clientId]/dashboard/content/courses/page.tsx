'use client'
// Courses Manager
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Plus, Pencil, Trash2, Save, X, ArrowLeft, GraduationCap, Loader2 } from 'lucide-react'
import type { Course } from '@/types/content'

const EMPTY: Omit<Course,'id'> = { title:'', description:'', platform:'', url:'', instructor:'', status:'enrolled', tags:[], date_added: new Date().toISOString() }

export default function BossCoursesPage() {
  const { clientId } = useParams() as { clientId: string }
  const [items, setItems] = useState<Course[]>([])
  const [editing, setEditing] = useState<Course | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    fetch(`/api/github?clientId=${clientId}&path=content/courses.json`)
      .then(r=>r.json()).then(d=>{setItems(d||[]);setLoading(false)}).catch(()=>setLoading(false))
  },[clientId])

  const startNew = () => { setEditing({...EMPTY,id:`course_${Date.now()}`});setIsNew(true) }
  const set = (k:string,v:any) => setEditing(e=>e?{...e,[k]:v}:e)

  const save = async () => {
    if (!editing) return; setSaving(true)
    const updated = isNew ? [...items,editing] : items.map(i=>i.id===editing.id?editing:i)
    const res = await fetch('/api/github',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({clientId,path:'content/courses.json',content:JSON.stringify(updated,null,2)})})
    if (res.ok) {setItems(updated);setEditing(null);setIsNew(false);setMsg('Saved!')} else setMsg('Error.')
    setSaving(false);setTimeout(()=>setMsg(''),2500)
  }
  const remove = async (id:string) => {
    if (!confirm('Delete?')) return
    const updated = items.filter(i=>i.id!==id)
    await fetch('/api/github',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({clientId,path:'content/courses.json',content:JSON.stringify(updated,null,2)})})
    setItems(updated)
  }

  return (
    <div className="min-h-screen bg-[var(--bg-0)] p-4 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href={`/boss/${clientId}/dashboard`} className="btn btn-ghost p-2"><ArrowLeft className="w-4 h-4"/></Link>
        <div className="w-8 h-8 rounded-xl bg-purple-400/10 flex items-center justify-center"><GraduationCap className="w-4 h-4 text-purple-400"/></div>
        <h1 className="text-xl font-bold text-[var(--t1)]">Courses Manager</h1>
        <button onClick={startNew} className="btn btn-primary text-sm py-1.5 px-4 gap-1.5 ml-auto"><Plus className="w-4 h-4"/>Add Course</button>
      </div>
      {msg && <div className="card p-3 mb-4 text-sm text-center text-emerald-400 border-emerald-400/20">{msg}</div>}

      {editing && (
        <div className="card p-6 mb-6 border-folyx-500/30">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-[var(--t1)]">{isNew?'Add':'Edit'} Course</h2>
            <button onClick={()=>{setEditing(null);setIsNew(false)}} className="btn btn-ghost p-2"><X className="w-4 h-4"/></button>
          </div>
          <div className="mb-4"><label className="block text-xs text-[var(--t3)] mb-1">Course Title *</label><input value={editing.title} onChange={e=>set('title',e.target.value)} className="input-folyx"/></div>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div><label className="block text-xs text-[var(--t3)] mb-1">Platform</label><input value={editing.platform} onChange={e=>set('platform',e.target.value)} className="input-folyx" placeholder="YouTube, Coursera, Udemy"/></div>
            <div><label className="block text-xs text-[var(--t3)] mb-1">Instructor</label><input value={editing.instructor} onChange={e=>set('instructor',e.target.value)} className="input-folyx"/></div>
          </div>
          <div className="mb-4"><label className="block text-xs text-[var(--t3)] mb-1">Course URL *</label><input value={editing.url} onChange={e=>set('url',e.target.value)} className="input-folyx" placeholder="https://..."/></div>
          <div className="grid sm:grid-cols-3 gap-4 mb-4">
            <div><label className="block text-xs text-[var(--t3)] mb-1">Status</label>
              <select value={editing.status} onChange={e=>set('status',e.target.value)} className="input-folyx">
                <option value="enrolled">Enrolled</option><option value="completed">Completed</option><option value="planned">Planned</option>
              </select></div>
            <div><label className="block text-xs text-[var(--t3)] mb-1">Total Videos</label><input type="number" value={editing.total_videos||''} onChange={e=>set('total_videos',+e.target.value)} className="input-folyx"/></div>
            <div><label className="block text-xs text-[var(--t3)] mb-1">Completed</label><input type="number" value={editing.completed_videos||''} onChange={e=>set('completed_videos',+e.target.value)} className="input-folyx"/></div>
          </div>
          <div className="mb-4"><label className="block text-xs text-[var(--t3)] mb-1">Certificate URL</label><input value={editing.certificate_url||''} onChange={e=>set('certificate_url',e.target.value)} className="input-folyx" placeholder="https://certificate.link"/></div>
          <div className="flex gap-3 pt-4 border-t border-[var(--border)]">
            <button onClick={save} disabled={saving||!editing.title||!editing.url} className="btn btn-primary gap-2">
              {saving?<Loader2 className="w-4 h-4 animate-spin"/>:<Save className="w-4 h-4"/>}{saving?'Saving…':'Save'}
            </button>
            <button onClick={()=>{setEditing(null);setIsNew(false)}} className="btn btn-outline">Cancel</button>
          </div>
        </div>
      )}
      {loading?<div className="card p-12 text-center"><Loader2 className="w-6 h-6 animate-spin text-folyx-400 mx-auto"/></div>
      :items.length===0?<div className="card p-12 text-center text-[var(--t3)]">No courses yet.</div>
      :<div className="space-y-3">{items.map(c=>(
          <div key={c.id} className="card p-4 flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="font-medium text-[var(--t1)] truncate">{c.title}</p>
              <p className="text-xs text-[var(--t3)]">{c.platform||'No platform'} · {c.status}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={()=>{setEditing(c);setIsNew(false)}} className="w-8 h-8 rounded-lg hover:bg-[var(--bg-3)] flex items-center justify-center text-[var(--t2)]"><Pencil className="w-3.5 h-3.5"/></button>
              <button onClick={()=>remove(c.id)} className="w-8 h-8 rounded-lg hover:bg-red-400/10 flex items-center justify-center text-red-400"><Trash2 className="w-3.5 h-3.5"/></button>
            </div>
          </div>
        ))}</div>}
    </div>
  )
}
