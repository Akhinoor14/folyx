import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { uploadToR2, R2Keys } from '@/lib/r2'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const clientId = formData.get('clientId') as string
    const type = formData.get('type') as string // 'image' | 'pdf' | 'glb' | 'profile'

    if (!file || !clientId || !type) {
      return NextResponse.json({ error: 'Missing file, clientId, or type.' }, { status: 400 })
    }

    // Get client subdomain
    const supabase = createAdminClient()
    const { data: client } = await supabase.from('clients').select('subdomain').eq('id', clientId).single()
    if (!client) return NextResponse.json({ error: 'Client not found.' }, { status: 404 })

    const subdomain = client.subdomain
    const fileId = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`
    const buffer = Buffer.from(await file.arrayBuffer())

    let url: string

    if (type === 'pdf') {
      // Large files → Cloudflare R2
      const key = R2Keys.pdf(subdomain, fileId.replace('.pdf', ''))
      url = await uploadToR2(key, buffer, 'application/pdf')

    } else if (type === 'glb') {
      // 3D models → Cloudflare R2
      const key = R2Keys.glb(subdomain, fileId.replace('.glb', ''))
      url = await uploadToR2(key, buffer, 'model/gltf-binary')

    } else if (type === 'profile') {
      // Profile photo → Supabase Storage (fast CDN)
      const path = `${subdomain}/profile/${fileId}`
      const { error } = await supabase.storage
        .from('portfolios')
        .upload(path, buffer, { contentType: file.type, upsert: true })
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      const { data: { publicUrl } } = supabase.storage.from('portfolios').getPublicUrl(path)
      url = publicUrl

    } else {
      // Other images → Supabase Storage
      const path = `${subdomain}/images/${fileId}`
      const { error } = await supabase.storage
        .from('portfolios')
        .upload(path, buffer, { contentType: file.type, upsert: true })
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      const { data: { publicUrl } } = supabase.storage.from('portfolios').getPublicUrl(path)
      url = publicUrl
    }

    return NextResponse.json({ success: true, url })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Upload failed.' }, { status: 500 })
  }
}
