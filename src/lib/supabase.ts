import { createBrowserClient } from '@supabase/ssr'
import { createServerClient as _createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// ── Browser client (use in Client Components) ──
export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

// ── Server client (use in Server Components, API routes) ──
export function createServerClient() {
  const cookieStore = cookies()
  return _createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: CookieOptions) {
        try { cookieStore.set({ name, value, ...options }) } catch {}
      },
      remove(name: string, options: CookieOptions) {
        try { cookieStore.set({ name, value: '', ...options }) } catch {}
      },
    },
  })
}

// ── Admin client (service role — only use in trusted server code) ──
export function createAdminClient() {
  const { createClient: _createClient } = require('@supabase/supabase-js')
  return _createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
