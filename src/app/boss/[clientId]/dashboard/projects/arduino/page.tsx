'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Plus, Pencil, Trash2, Save, X, ArrowLeft, Zap, Loader2 } from 'lucide-react'
import FileUploader from '@/components/boss/FileUploader'
import type { ArduinoProject } from '@/types/content'

const EMPTY: Omit<ArduinoProject, 'id'> = {
  category: 'arduino', title: '', description: '', thumbnail: '', tags: [], date: '',
  featured: false, status: 'completed', circuit_image: '', video_url: '', code_snippet: '', components: [],
}

export default function BossArduinoPage() {
  const params = useParams()
  const clientId = params.clientId as string
  const [projects, setProjects] = useState<ArduinoProject[]>([])
  const [editing, setEditing] = useState<ArduinoProject | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    fetch(`/api/github?clientId=${clientId}&path=projects/arduino.json`)
      .then(r => r.json()).then(d => { setProjects(d || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [clientId])

  const startNew = () => {
    setEditing({ ...EMPTY, id: `arduino_${Date.now()}` } as ArduinoProject)
    setIsNew(true)
  }

  const save = async () => {
    if (!editing) return
    setSaving(true)
    const updated = isNew ? [...projects, editing] : projects.map(p => p.id === editing.id ? editing : p)
    const res = await fetch('/api/github', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientId, path: 'projects/arduino.json', content: JSON.stringify(updated, null, 2) }),
    })
    if (res.ok) { setProjects(updated); setEditing(null); setIsNew(false); setMsg('Saved!') }
    else setMsg('Error saving.')
    setSaving(false)
    setTimeout(() => setMsg(''), 2500)
  }

  const remove = async (id: string) => {
    if (!confirm('Delete this project?')) return
    const updated = projects.filter(p => p.id !== id)
    await fetch('/api/github', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientId, path: 'projects/arduino.json', content: JSON.stringify(updated, null, 2) }),
    })
    setProjects(updated)
  }

  const set = (key: string, val: any) => setEditing(e => e ? { ...e, [key]: val } : e)

  return (
    <div className="min-h-screen bg-[var(--bg-0)] p-4 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href={`/boss/${clientId}/dashboard`} className="btn btn-ghost p-2"><ArrowLeft className="w-4 h-4" /></Link>
        <div className="w-8 h-8 rounded-xl bg-amber-400/10 flex items-center justify-center"><Zap className="w-4 h-4 text-amber-400" /></div>
        <h1 className="text-xl font-bold text-[var(--t1)]">Arduino Projects</h1>
        <button onClick={startNew} className="btn btn-primary text-sm py-1.5 px-4 gap-1.5 ml-auto"><Plus className="w-4 h-4" />Add New</button>
      </div>

      {msg && <div className="card p-3 mb-4 text-sm text-center text-emerald-400 border-emerald-400/20">{msg}</div>}

      {/* Edit form */}
      {editing && (
        <div className="card p-6 mb-6 border-folyx-500/30">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-[var(--t1)]">{isNew ? 'New Project' : 'Edit Project'}</h2>
            <button onClick={() => { setEditing(null); setIsNew(false) }} className="btn btn-ghost p-2"><X className="w-4 h-4" /></button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div><label className="block text-xs text-[var(--t3)] mb-1">Title *</label>
              <input value={editing.title} onChange={e => set('title', e.target.value)} className="input-folyx" placeholder="Project title" /></div>
            <div><label className="block text-xs text-[var(--t3)] mb-1">Date</label>
              <input type="date" value={editing.date} onChange={e => set('date', e.target.value)} className="input-folyx" /></div>
          </div>
          <div className="mb-4"><label className="block text-xs text-[var(--t3)] mb-1">Description *</label>
            <textarea value={editing.description} onChange={e => set('description', e.target.value)} rows={3} className="input-folyx resize-none" placeholder="Describe your project" /></div>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div><label className="block text-xs text-[var(--t3)] mb-1">Tags (comma separated)</label>
              <input value={editing.tags?.join(', ')} onChange={e => set('tags', e.target.value.split(',').map(t => t.trim()).filter(Boolean))} className="input-folyx" placeholder="IoT, ESP32, Sensor" /></div>
            <div><label className="block text-xs text-[var(--t3)] mb-1">Status</label>
              <select value={editing.status} onChange={e => set('status', e.target.value)} className="input-folyx">
                <option value="completed">Completed</option>
                <option value="in-progress">In Progress</option>
                <option value="planned">Planned</option>
              </select></div>
          </div>
          <div className="mb-4"><label className="block text-xs text-[var(--t3)] mb-1">Components (comma separated)</label>
            <input value={editing.components?.join(', ')} onChange={e => set('components', e.target.value.split(',').map(t => t.trim()).filter(Boolean))} className="input-folyx" placeholder="Arduino Uno, DHT11, LCD" /></div>
          <div className="mb-4"><label className="block text-xs text-[var(--t3)] mb-1">Video URL (YouTube)</label>
            <input value={editing.video_url} onChange={e => set('video_url', e.target.value)} className="input-folyx" placeholder="https://youtube.com/..." /></div>
          <div className="mb-5"><label className="block text-xs text-[var(--t3)] mb-1.5">Circuit Image</label>
            <FileUploader type="image" currentUrl={editing.circuit_image}
              onUpload={async (file) => {
                const fd = new FormData(); fd.append('file', file); fd.append('clientId', clientId); fd.append('type', 'image')
                const r = await fetch('/api/upload', { method: 'POST', body: fd })
                const d = await r.json(); set('circuit_image', d.url); return d.url
              }} /></div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-[var(--t2)] cursor-pointer">
              <input type="checkbox" checked={editing.featured} onChange={e => set('featured', e.target.checked)} className="w-4 h-4 rounded" />
              Featured project
            </label>
          </div>
          <div className="flex gap-3 mt-5 pt-4 border-t border-[var(--border)]">
            <button onClick={save} disabled={saving || !editing.title || !editing.description} className="btn btn-primary gap-2">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? 'Saving…' : 'Save Project'}
            </button>
            <button onClick={() => { setEditing(null); setIsNew(false) }} className="btn btn-outline">Cancel</button>
          </div>
        </div>
      )}

      {/* Project list */}
      {loading ? (
        <div className="card p-12 text-center"><Loader2 className="w-6 h-6 animate-spin text-folyx-400 mx-auto" /></div>
      ) : projects.length === 0 ? (
        <div className="card p-12 text-center text-[var(--t3)]">No projects yet. Click &quot;Add New&quot; to get started.</div>
      ) : (
        <div className="space-y-3">
          {projects.map(p => (
            <div key={p.id} className="card p-4 flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-[var(--t1)] truncate">{p.title}</p>
                <p className="text-xs text-[var(--t3)] truncate">{p.description}</p>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {p.tags?.slice(0,3).map(t => <span key={t} className="text-xs px-1.5 py-0.5 rounded bg-[var(--bg-3)] text-[var(--t3)]">{t}</span>)}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => { setEditing(p); setIsNew(false) }} className="w-8 h-8 rounded-lg hover:bg-[var(--bg-3)] flex items-center justify-center text-[var(--t2)] transition-colors">
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => remove(p.id)} className="w-8 h-8 rounded-lg hover:bg-red-400/10 flex items-center justify-center text-red-400 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
