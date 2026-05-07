import 'server-only'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!

export function createAdminClient() {
  const { createClient } = require('@supabase/supabase-js')
  return createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
