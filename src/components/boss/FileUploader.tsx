'use client'
import { useState, useRef, useCallback } from 'react'
import { Upload, X, Loader2, CheckCircle, File, Image as ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FileUploaderProps {
  accept?: string
  maxSizeMB?: number
  label?: string
  hint?: string
  currentUrl?: string
  onUpload: (file: File) => Promise<string>
  onRemove?: () => Promise<void>
  type?: 'image' | 'pdf' | 'glb' | 'any'
}

export default function FileUploader({
  accept, maxSizeMB = 10, label = 'Upload file', hint,
  currentUrl, onUpload, onRemove, type = 'any',
}: FileUploaderProps) {
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadedUrl, setUploadedUrl] = useState(currentUrl || '')
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const acceptMap = { image: 'image/*', pdf: 'application/pdf', glb: '.glb', any: '*' }
  const acceptStr = accept || acceptMap[type]

  const handleFile = useCallback(async (file: File) => {
    setError('')
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File too large. Max ${maxSizeMB}MB.`); return
    }
    setUploading(true)
    try {
      const url = await onUpload(file)
      setUploadedUrl(url)
    } catch (e: any) {
      setError(e.message || 'Upload failed.')
    } finally {
      setUploading(false)
    }
  }, [onUpload, maxSizeMB])

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleRemove = async () => {
    if (onRemove) await onRemove()
    setUploadedUrl('')
  }

  // Uploaded state
  if (uploadedUrl && !uploading) {
    return (
      <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <p className="text-sm font-medium text-[var(--t1)]">File uploaded</p>
            <p className="text-xs text-[var(--t3)] truncate max-w-[200px]">{uploadedUrl.split('/').pop()}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => inputRef.current?.click()}
            className="btn btn-ghost text-xs py-1.5 px-3">Replace</button>
          {onRemove && (
            <button onClick={handleRemove}
              className="w-8 h-8 rounded-lg hover:bg-red-400/10 flex items-center justify-center text-red-400 transition-colors">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <input ref={inputRef} type="file" accept={acceptStr} className="hidden"
          onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
      </div>
    )
  }

  return (
    <div>
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          'rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-all',
          dragging
            ? 'border-folyx-400 bg-folyx-400/5'
            : 'border-[var(--border-2)] hover:border-folyx-400/50 hover:bg-[var(--bg-3)]'
        )}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 text-folyx-400 animate-spin" />
            <p className="text-sm text-[var(--t2)]">Uploading…</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="w-8 h-8 text-[var(--t3)]" />
            <p className="text-sm font-medium text-[var(--t1)]">{label}</p>
            <p className="text-xs text-[var(--t3)]">
              {hint || `Drag & drop or click to browse · Max ${maxSizeMB}MB`}
            </p>
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-400 mt-1.5">{error}</p>}
      <input ref={inputRef} type="file" accept={acceptStr} className="hidden"
        onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
    </div>
  )
}
