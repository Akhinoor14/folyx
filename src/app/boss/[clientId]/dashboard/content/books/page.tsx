'use client'
// Books Content Manager
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Plus, Pencil, Trash2, Save, X, ArrowLeft, BookOpen, Loader2 } from 'lucide-react'
import FileUploader from '@/components/boss/FileUploader'
import type { Book } from '@/types/content'

const EMPTY_BOOK: Omit<Book,'id'> = { title:'', author:'', cover_image:'', pdf_url:'', description:'', category:'', year:'', read_status:'planned', tags:[], date_added: new Date().toISOString() }

export default function BossBooksCMSPage() {
  const { clientId } = useParams() as { clientId: string }
  const [items, setItems] = useState<Book[]>([])
  const [editing, setEditing] = useState<Book | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    fetch(`/api/github?clientId=${clientId}&path=content/books.json`)
      .then(r=>r.json()).then(d=>{setItems(d||[]);setLoading(false)}).catch(()=>setLoading(false))
  }, [clientId])

  const startNew = () => { setEditing({...EMPTY_BOOK,id:`book_${Date.now()}`});setIsNew(true) }
  const set = (k:string,v:any) => setEditing(e=>e?{...e,[k]:v}:e)

  const save = async () => {
    if (!editing) return; setSaving(true)
    const updated = isNew ? [...items,editing] : items.map(i=>i.id===editing.id?editing:i)
    const res = await fetch('/api/github',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({clientId,path:'content/books.json',content:JSON.stringify(updated,null,2)})})
    if (res.ok) {setItems(updated);setEditing(null);setIsNew(false);setMsg('Saved!')} else setMsg('Error.')
    setSaving(false);setTimeout(()=>setMsg(''),2500)
  }

  const remove = async (id:string) => {
    if (!confirm('Delete this book?')) return
    const updated = items.filter(i=>i.id!==id)
    await fetch('/api/github',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({clientId,path:'content/books.json',content:JSON.stringify(updated,null,2)})})
    setItems(updated)
  }

  return (
    <div className="min-h-screen bg-[var(--bg-0)] p-4 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href={`/boss/${clientId}/dashboard`} className="btn btn-ghost p-2"><ArrowLeft className="w-4 h-4"/></Link>
        <div className="w-8 h-8 rounded-xl bg-amber-400/10 flex items-center justify-center"><BookOpen className="w-4 h-4 text-amber-400"/></div>
        <h1 className="text-xl font-bold text-[var(--t1)]">Books Manager</h1>
        <button onClick={startNew} className="btn btn-primary text-sm py-1.5 px-4 gap-1.5 ml-auto"><Plus className="w-4 h-4"/>Add Book</button>
      </div>
      {msg && <div className="card p-3 mb-4 text-sm text-center text-emerald-400 border-emerald-400/20">{msg}</div>}

      {editing && (
        <div className="card p-6 mb-6 border-folyx-500/30">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-[var(--t1)]">{isNew?'Add':'Edit'} Book</h2>
            <button onClick={()=>{setEditing(null);setIsNew(false)}} className="btn btn-ghost p-2"><X className="w-4 h-4"/></button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div><label className="block text-xs text-[var(--t3)] mb-1">Title *</label><input value={editing.title} onChange={e=>set('title',e.target.value)} className="input-folyx"/></div>
            <div><label className="block text-xs text-[var(--t3)] mb-1">Author *</label><input value={editing.author} onChange={e=>set('author',e.target.value)} className="input-folyx"/></div>
          </div>
          <div className="grid sm:grid-cols-3 gap-4 mb-4">
            <div><label className="block text-xs text-[var(--t3)] mb-1">Year</label><input value={editing.year} onChange={e=>set('year',e.target.value)} className="input-folyx" placeholder="2024"/></div>
            <div><label className="block text-xs text-[var(--t3)] mb-1">Category</label><input value={editing.category} onChange={e=>set('category',e.target.value)} className="input-folyx" placeholder="Engineering, Science"/></div>
            <div><label className="block text-xs text-[var(--t3)] mb-1">Read Status</label>
              <select value={editing.read_status} onChange={e=>set('read_status',e.target.value)} className="input-folyx">
                <option value="completed">Completed</option><option value="reading">Reading</option><option value="planned">Planned</option>
              </select></div>
          </div>
          <div className="mb-4"><label className="block text-xs text-[var(--t3)] mb-1">Description</label><textarea value={editing.description} onChange={e=>set('description',e.target.value)} rows={2} className="input-folyx resize-none"/></div>
          <div className="grid sm:grid-cols-2 gap-5 mb-5">
            <div><label className="block text-xs text-[var(--t3)] mb-1.5">Cover Image</label>
              <FileUploader type="image" currentUrl={editing.cover_image}
                onUpload={async(file)=>{const fd=new FormData();fd.append('file',file);fd.append('clientId',clientId);fd.append('type','image');const r=await fetch('/api/upload',{method:'POST',body:fd});const d=await r.json();set('cover_image',d.url);return d.url}}/></div>
            <div><label className="block text-xs text-[var(--t3)] mb-1.5">PDF File</label>
              <FileUploader type="pdf" currentUrl={editing.pdf_url} maxSizeMB={20}
                onUpload={async(file)=>{const fd=new FormData();fd.append('file',file);fd.append('clientId',clientId);fd.append('type','pdf');const r=await fetch('/api/upload',{method:'POST',body:fd});const d=await r.json();set('pdf_url',d.url);return d.url}}/></div>
          </div>
          <div className="flex gap-3 pt-4 border-t border-[var(--border)]">
            <button onClick={save} disabled={saving||!editing.title||!editing.author} className="btn btn-primary gap-2">
              {saving?<Loader2 className="w-4 h-4 animate-spin"/>:<Save className="w-4 h-4"/>}{saving?'Saving…':'Save Book'}
            </button>
            <button onClick={()=>{setEditing(null);setIsNew(false)}} className="btn btn-outline">Cancel</button>
          </div>
        </div>
      )}

      {loading?<div className="card p-12 text-center"><Loader2 className="w-6 h-6 animate-spin text-folyx-400 mx-auto"/></div>
      :items.length===0?<div className="card p-12 text-center text-[var(--t3)]">No books added yet.</div>
      :<div className="space-y-3">{items.map(b=>(
          <div key={b.id} className="card p-4 flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="font-medium text-[var(--t1)] truncate">{b.title}</p>
              <p className="text-xs text-[var(--t3)]">{b.author}{b.year ? ` · ${b.year}` : ''} · {b.read_status}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={()=>{setEditing(b);setIsNew(false)}} className="w-8 h-8 rounded-lg hover:bg-[var(--bg-3)] flex items-center justify-center text-[var(--t2)]"><Pencil className="w-3.5 h-3.5"/></button>
              <button onClick={()=>remove(b.id)} className="w-8 h-8 rounded-lg hover:bg-red-400/10 flex items-center justify-center text-red-400"><Trash2 className="w-3.5 h-3.5"/></button>
            </div>
          </div>
        ))}</div>}
    </div>
  )
}
