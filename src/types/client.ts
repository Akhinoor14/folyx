// ============================================================
// Folyx — ClientInfo Type
// This type mirrors client-info.json stored in GitHub per client
// ============================================================

export interface ClientInfo {
  personal: {
    full_name: string
    display_name: string
    job_title: string
    tagline: string
    bio_short: string
    bio_long?: string
    profile_picture: string        // Supabase Storage URL
    banner_image?: string
    university_full: string
    university_short: string
    department: string
    batch: string
    hsc_institution?: string
    ssc_institution?: string
    nationality?: string
    location?: string
  }

  contact: {
    email: string
    phone?: string
    whatsapp?: string
  }

  social: {
    github_url?: string
    linkedin_url?: string
    facebook_url?: string
    twitter_url?: string
    youtube_url?: string
    instagram_url?: string
    researchgate_url?: string
    website_url?: string
  }

  domain: {
    subdomain: string              // "akhinoor"
    full_url: string               // "https://akhinoor.folyx.com"
    custom_domain?: string         // "akhinoor.dev" (optional paid feature)
  }

  subscription: {
    plan: 'trial' | 'monthly' | 'half_yearly' | 'yearly'
    status: 'active' | 'expired' | 'suspended' | 'trial'
    start_date: string             // ISO date string
    end_date: string               // ISO date string
    client_id: string              // "folyx_akhinoor_20260506"
  }

  features: {
    solidworks_enabled: boolean
    matlab_enabled: boolean
    arduino_enabled: boolean
    electronics_enabled: boolean
    content_studio_enabled: boolean
    custom_domain_enabled: boolean
    analytics_enabled: boolean
  }

  theme?: {
    accent_color?: string          // optional per-client color override
    dark_mode_default?: boolean
  }
}

// ── Supabase DB row (what's stored in the database) ──
export interface ClientRow {
  id: string
  subdomain: string
  info: ClientInfo
  github_repo: string
  boss_email: string
  boss_password_hash: string
  plan: ClientInfo['subscription']['plan']
  status: ClientInfo['subscription']['status']
  end_date: string
  created_at: string
  updated_at: string
}

// ── Form data for creating a new client (Admin → Add Client) ──
export interface NewClientFormData {
  // Phase 1: Required
  full_name: string
  display_name: string
  subdomain: string
  plan: 'monthly' | 'half_yearly' | 'yearly'
  boss_email: string
  phone?: string

  // Phase 2: Academic
  university_full?: string
  university_short?: string
  department?: string
  batch?: string
  job_title?: string
  tagline?: string
  github_username?: string
  linkedin_url?: string

  // Phase 3: Optional extras
  hsc_institution?: string
  ssc_institution?: string
  bio_short?: string
  youtube_handle?: string
  facebook_url?: string
}
