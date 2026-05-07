import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { generatePassword, getPlanEndDate } from '@/lib/utils'

interface Props { params: { id: string } }

export async function PATCH(req: NextRequest, { params }: Props) {
  try {
    const { action, ...body } = await req.json()
    const supabase = createAdminClient()
    const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || 'folyx.com'
    const vercelTeamId = process.env.VERCEL_TEAM_ID
    const vercelTeamQuery = vercelTeamId ? `?teamId=${encodeURIComponent(vercelTeamId)}` : ''

    switch (action) {
      case 'extend': {
        const { data: client } = await supabase.from('clients').select('plan').eq('id', params.id).single()
        const newEnd = getPlanEndDate(client?.plan || 'monthly').toISOString()
        await supabase.from('clients').update({ status: 'active', end_date: body.end_date || newEnd }).eq('id', params.id)
        return NextResponse.json({ message: 'Subscription extended.' })
      }

      case 'toggle_status': {
        const { data: client } = await supabase.from('clients').select('status').eq('id', params.id).single()
        const newStatus = client?.status === 'active' ? 'suspended' : 'active'
        await supabase.from('clients').update({ status: newStatus }).eq('id', params.id)
        return NextResponse.json({ message: `Client ${newStatus}.` })
      }

      case 'reset_password': {
        const { data: client } = await supabase.from('clients').select('boss_email').eq('id', params.id).single()
        if (!client?.boss_email) return NextResponse.json({ error: 'No boss email found.' }, { status: 404 })
        const newPassword = generatePassword(12)
        const { data: users } = await supabase.auth.admin.listUsers()
        const bossUser = users?.users?.find(u => u.email === client.boss_email)
        if (bossUser) {
          await supabase.auth.admin.updateUserById(bossUser.id, { password: newPassword })
        }
        // TODO: Send new password via EmailJS webhook or email service
        return NextResponse.json({ message: `Password reset. New password: ${newPassword}` })
      }

      case 'delete': {
        const { data: client } = await supabase.from('clients').select('subdomain,github_repo').eq('id', params.id).single()

        // Remove Vercel domain
        if (process.env.VERCEL_API_TOKEN && process.env.VERCEL_PROJECT_ID && client?.subdomain) {
          await fetch(
            `https://api.vercel.com/v9/projects/${process.env.VERCEL_PROJECT_ID}/domains/${client.subdomain}.${appDomain}${vercelTeamQuery}`,
            { method: 'DELETE', headers: { Authorization: `Bearer ${process.env.VERCEL_API_TOKEN}` } }
          ).catch(() => {})
        }

        // Delete from DB (cascades to auth via trigger)
        await supabase.from('clients').delete().eq('id', params.id)
        return NextResponse.json({ message: 'Client deleted.' })
      }

      default:
        return NextResponse.json({ error: 'Unknown action.' }, { status: 400 })
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
