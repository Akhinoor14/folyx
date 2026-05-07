// ============================================================
// Folyx — Project Types
// ============================================================

export type ProjectCategory =
  | 'arduino'
  | 'matlab'
  | 'solidworks'
  | 'programming'
  | 'websites'
  | 'electronics'

export interface BaseProject {
  id: string
  title: string
  description: string
  thumbnail?: string
  tags: string[]
  date: string            // ISO
  featured?: boolean
  status?: 'completed' | 'in-progress' | 'planned'
}

export interface ArduinoProject extends BaseProject {
  category: 'arduino'
  circuit_image?: string
  video_url?: string
  code_snippet?: string
  components?: string[]
}

export interface MatlabProject extends BaseProject {
  category: 'matlab'
  simulation_image?: string
  result_images?: string[]
  toolboxes?: string[]
}

export interface SolidWorksProject extends BaseProject {
  category: 'solidworks'
  glb_file_url: string     // Cloudflare R2 URL
  preview_images?: string[]
  dimensions?: string
  material?: string
}

export interface ProgrammingProject extends BaseProject {
  category: 'programming'
  github_url?: string
  live_url?: string
  tech_stack: string[]
  screenshots?: string[]
}

export interface WebsiteProject extends BaseProject {
  category: 'websites'
  live_url?: string
  github_url?: string
  tech_stack: string[]
  screenshots?: string[]
}

export interface ElectronicsProject extends BaseProject {
  category: 'electronics'
  circuit_image?: string
  schematic_url?: string
  components?: string[]
  video_url?: string
}

export type AnyProject =
  | ArduinoProject
  | MatlabProject
  | SolidWorksProject
  | ProgrammingProject
  | WebsiteProject
  | ElectronicsProject

// ============================================================
// Folyx — Content Types (Content Studio)
// ============================================================

export interface Book {
  id: string
  title: string
  author: string
  cover_image?: string
  pdf_url?: string         // Cloudflare R2
  description?: string
  category?: string
  year?: string
  pages?: number
  read_status?: 'reading' | 'completed' | 'planned'
  tags?: string[]
  date_added: string
}

export interface Paper {
  id: string
  title: string
  authors: string[]
  journal?: string
  year: string
  pdf_url?: string         // Cloudflare R2
  doi?: string
  abstract?: string
  tags?: string[]
  date_added: string
}

export interface Post {
  slug: string
  title: string
  excerpt: string
  content: string          // Markdown content (GitHub)
  cover_image?: string
  tags?: string[]
  category?: string
  published_at: string
  updated_at?: string
  read_time?: number       // minutes
}

export interface Video {
  id: string
  title: string
  description?: string
  youtube_id: string       // YouTube video ID
  thumbnail?: string       // auto from YouTube
  category?: string
  tags?: string[]
  duration?: string
  date_added: string
}

export interface Course {
  id: string
  title: string
  description?: string
  platform?: string        // "YouTube", "Coursera", etc.
  url: string
  thumbnail?: string
  instructor?: string
  total_videos?: number
  completed_videos?: number
  status?: 'enrolled' | 'completed' | 'planned'
  certificate_url?: string
  tags?: string[]
  date_added: string
}

export interface Certificate {
  id: string
  title: string
  issuer: string
  issue_date: string
  expiry_date?: string
  credential_url?: string
  image_url: string        // Supabase Storage
  category?: string
  tags?: string[]
}
