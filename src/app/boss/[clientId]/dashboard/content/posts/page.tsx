'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Plus, Pencil, Trash2, Save, X, ArrowLeft, PenSquare, Loader2, Eye } from 'lucide-react'
import type { Post } from '@/types/content'
import { estimateReadTime } from '@/lib/utils'

const EMPTY: Omit<Post,'slug'> & { slug: string } = { slug:'', title:'', excerpt:'', content:'', cover_image:'', tags:[], published_at: new Date().toISOString() }

export default function BossPostsPage() {
  const { clientId } = useParams() as { clientId: string }
  const [posts, setPosts] = useState<Post[]>([])
  const [editing, setEditing] = useState<Post | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [preview, setPreview] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    fetch(`/api/github?clientId=${clientId}&path=content/posts-index.json`)
      .then(r=>r.json()).then(d=>{setPosts(d||[]);setLoading(false)}).catch(()=>setLoading(false))
  },[clientId])

  const startNew = () => { setEditing({...EMPTY});setIsNew(true);setPreview(false) }
  const set = (k:string,v:any) => setEditing(e=>e?{...e,[k]:v}:e)

  const autoSlug = (title:string) => title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'')

  const save = async () => {
    if (!editing) return; setSaving(true)
    const post = { ...editing, slug: editing.slug || autoSlug(editing.title), updated_at: new Date().toISOString() }
    // Save full markdown to separate file
    await fetch('/api/github',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({clientId,path:`content/posts/${post.slug}.md`,content:post.content})})
    // Update index
    const updated = isNew ? [...posts,{...post,content:''}] : posts.map(p=>p.slug===post.slug?{...post,content:''}:p)
    const res = await fetch('/api/github',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({clientId,path:'content/posts-index.json',content:JSON.stringify(updated,null,2)})})
    if (res.ok) {setPosts(updated);setEditing(null);setIsNew(false);setMsg('Published!')} else setMsg('Error.')
    setSaving(false);setTimeout(()=>setMsg(''),2500)
  }

  const remove = async (slug:string) => {
    if (!confirm('Delete this post?')) return
    await fetch('/api/github',{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({clientId,path:`content/posts/${slug}.md`})})
    const updated = posts.filter(p=>p.slug!==slug)
    await fetch('/api/github',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({clientId,path:'content/posts-index.json',content:JSON.stringify(updated,null,2)})})
    setPosts(updated)
  }

  return (
    <div className="min-h-screen bg-[var(--bg-0)] p-4 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href={`/boss/${clientId}/dashboard`} className="btn btn-ghost p-2"><ArrowLeft className="w-4 h-4"/></Link>
        <div className="w-8 h-8 rounded-xl bg-emerald-400/10 flex items-center justify-center"><PenSquare className="w-4 h-4 text-emerald-400"/></div>
        <h1 className="text-xl font-bold text-[var(--t1)]">Posts Manager</h1>
        <button onClick={startNew} className="btn btn-primary text-sm py-1.5 px-4 gap-1.5 ml-auto"><Plus className="w-4 h-4"/>New Post</button>
      </div>
      {msg && <div className="card p-3 mb-4 text-sm text-center text-emerald-400 border-emerald-400/20">{msg}</div>}

      {editing && (
        <div className="card p-6 mb-6 border-folyx-500/30">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-[var(--t1)]">{isNew?'New':'Edit'} Post</h2>
            <div className="flex gap-2">
              <button onClick={()=>setPreview(p=>!p)} className={`btn text-xs py-1.5 px-3 gap-1.5 ${preview?'btn-primary':'btn-ghost'}`}>
                <Eye className="w-3.5 h-3.5"/>{preview?'Edit':'Preview'}
              </button>
              <button onClick={()=>{setEditing(null);setIsNew(false)}} className="btn btn-ghost p-2"><X className="w-4 h-4"/></button>
            </div>
          </div>
          {!preview ? (
            <>
              <div className="mb-4"><label className="block text-xs text-[var(--t3)] mb-1">Title *</label>
                <input value={editing.title} onChange={e=>{set('title',e.target.value);if(isNew)set('slug',autoSlug(e.target.value))}} className="input-folyx text-lg font-semibold" placeholder="Post title"/></div>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div><label className="block text-xs text-[var(--t3)] mb-1">Slug (URL)</label>
                  <input value={editing.slug} onChange={e=>set('slug',e.target.value)} className="input-folyx font-mono text-sm" placeholder="my-post-slug"/></div>
                <div><label className="block text-xs text-[var(--t3)] mb-1">Tags</label>
                  <input value={editing.tags?.join(', ')} onChange={e=>set('tags',e.target.value.split(',').map((t:string)=>t.trim()).filter(Boolean))} className="input-folyx" placeholder="tech, engineering"/></div>
              </div>
              <div className="mb-4"><label className="block text-xs text-[var(--t3)] mb-1">Excerpt</label>
                <input value={editing.excerpt} onChange={e=>set('excerpt',e.target.value)} className="input-folyx" placeholder="Short description shown in listing"/></div>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs text-[var(--t3)]">Content (Markdown) *</label>
                  <span className="text-xs text-[var(--t3)]">~{estimateReadTime(editing.content||'')} min read</span>
                </div>
                <textarea value={editing.content} onChange={e=>set('content',e.target.value)} rows={16}
                  className="input-folyx resize-y font-mono text-sm" placeholder="# My Post&#10;&#10;Write your content in Markdown..."/>
              </div>
            </>
          ) : (
            <div className="prose-folyx min-h-[300px] p-4 rounded-xl bg-[var(--bg-1)] border border-[var(--border)]">
              <h1>{editing.title}</h1>
              <p className="text-[var(--t3)] text-sm">{editing.excerpt}</p>
              <hr/>
              <pre className="whitespace-pre-wrap text-sm text-[var(--t2)]">{editing.content}</pre>
            </div>
          )}
          <div className="flex gap-3 pt-4 border-t border-[var(--border)]">
            <button onClick={save} disabled={saving||!editing.title||!editing.content} className="btn btn-primary gap-2">
              {saving?<Loader2 className="w-4 h-4 animate-spin"/>:<Save className="w-4 h-4"/>}{saving?'Publishing…':'Publish Post'}
            </button>
            <button onClick={()=>{setEditing(null);setIsNew(false)}} className="btn btn-outline">Cancel</button>
          </div>
        </div>
      )}

      {loading?<div className="card p-12 text-center"><Loader2 className="w-6 h-6 animate-spin text-folyx-400 mx-auto"/></div>
      :posts.length===0?<div className="card p-12 text-center text-[var(--t3)]">No posts yet. Write your first post.</div>
      :<div className="space-y-3">{posts.map(p=>(
          <div key={p.slug} className="card p-4 flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="font-medium text-[var(--t1)] truncate">{p.title}</p>
              <p className="text-xs text-[var(--t3)]">/{p.slug} · {p.tags?.slice(0,2).join(', ')}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={()=>{setEditing(p);setIsNew(false);setPreview(false)}} className="w-8 h-8 rounded-lg hover:bg-[var(--bg-3)] flex items-center justify-center text-[var(--t2)]"><Pencil className="w-3.5 h-3.5"/></button>
              <button onClick={()=>remove(p.slug)} className="w-8 h-8 rounded-lg hover:bg-red-400/10 flex items-center justify-center text-red-400"><Trash2 className="w-3.5 h-3.5"/></button>
            </div>
          </div>
        ))}</div>}
    </div>
  )
}
