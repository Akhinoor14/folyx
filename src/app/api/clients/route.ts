import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { createClientRepo } from '@/lib/github'
import { generateClientId } from '@/lib/utils'
import type { NewClientFormData, ClientInfo } from '@/types/client'

export async function POST(req: NextRequest) {
  try {
    const body: NewClientFormData & { boss_password: string; end_date: string } = await req.json()
    const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || 'folyx.com'
    const vercelTeamId = process.env.VERCEL_TEAM_ID
    const vercelTeamQuery = vercelTeamId ? `?teamId=${encodeURIComponent(vercelTeamId)}` : ''

    // ── Validate required fields ──
    if (!body.full_name || !body.subdomain || !body.boss_email || !body.plan) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
    }

    const supabase = createAdminClient()

    // ── Check subdomain is unique ──
    const { data: existing } = await supabase
      .from('clients')
      .select('id')
      .eq('subdomain', body.subdomain)
      .single()

    if (existing) {
      return NextResponse.json({ error: `Subdomain "${body.subdomain}" is already taken.` }, { status: 409 })
    }

    // ── Build ClientInfo object ──
    const clientId = generateClientId(body.subdomain)
    const clientInfo: ClientInfo = {
      personal: {
        full_name: body.full_name,
        display_name: body.display_name || body.full_name.split(' ')[0],
        job_title: body.job_title || 'Student',
        tagline: body.tagline || 'Building the future.',
        bio_short: body.bio_short || '',
        profile_picture: '',
        university_full: body.university_full || '',
        university_short: body.university_short || '',
        department: body.department || '',
        batch: body.batch || '',
        hsc_institution: body.hsc_institution || '',
        ssc_institution: body.ssc_institution || '',
        location: 'Bangladesh',
      },
      contact: {
        email: body.boss_email,
        phone: body.phone || '',
      },
      social: {
        github_url: body.github_username ? `https://github.com/${body.github_username}` : '',
        linkedin_url: body.linkedin_url || '',
        facebook_url: body.facebook_url || '',
      },
      domain: {
        subdomain: body.subdomain,
        full_url: `https://${body.subdomain}.${appDomain}`,
      },
      subscription: {
        plan: body.plan,
        status: 'active',
        start_date: new Date().toISOString(),
        end_date: body.end_date,
        client_id: clientId,
      },
      features: {
        solidworks_enabled: true,
        matlab_enabled: true,
        arduino_enabled: true,
        electronics_enabled: true,
        content_studio_enabled: true,
        custom_domain_enabled: body.plan === 'yearly',
        analytics_enabled: true,
      },
    }

    // ── 1. Insert into Supabase ──
    const { data: clientRow, error: dbError } = await supabase
      .from('clients')
      .insert({
        subdomain: body.subdomain,
        info: clientInfo,
        github_repo: `${body.subdomain}-portfolio`,
        boss_email: body.boss_email,
        plan: body.plan,
        status: 'active',
        end_date: body.end_date,
      })
      .select('id')
      .single()

    if (dbError) {
      return NextResponse.json({ error: `Database error: ${dbError.message}` }, { status: 500 })
    }

    // ── 2. Create Supabase Auth user for Boss ──
    await supabase.auth.admin.createUser({
      email: body.boss_email,
      password: body.boss_password,
      user_metadata: { role: 'boss', client_id: clientRow.id, subdomain: body.subdomain },
      email_confirm: true,
    })

    // ── 3. Create GitHub repo from template (non-blocking) ──
    createClientRepo(body.subdomain, clientInfo).catch(console.error)

    // ── 4. Add Vercel subdomain (non-blocking) ──
    if (process.env.VERCEL_API_TOKEN && process.env.VERCEL_PROJECT_ID) {
      fetch(`https://api.vercel.com/v9/projects/${process.env.VERCEL_PROJECT_ID}/domains${vercelTeamQuery}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.VERCEL_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: `${body.subdomain}.${appDomain}` }),
      }).catch(console.error)
    }

    // ── 5. Send welcome email via EmailJS (server-side not possible, handled client-side or webhook) ──

    return NextResponse.json({
      success: true,
      client_id: clientRow.id,
      url: `https://${body.subdomain}.${appDomain}`,
      message: 'Client created successfully.',
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error.' }, { status: 500 })
  }
}

// ── GET all clients (admin only) ──
export async function GET(req: NextRequest) {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('clients')
    .select('id,subdomain,info,status,end_date,plan,created_at')
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
