import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, differenceInDays, addMonths, addYears } from 'date-fns'

// ── Tailwind class merger ──
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ── App constants ──
export const APP_CONFIG = {
  name: 'Folyx',
  domain: process.env.NEXT_PUBLIC_APP_DOMAIN || 'folyx.com',
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://folyx.com',
  tagline: 'Your portfolio, professionally built.',
  email: 'hello@folyx.com',
  github: 'https://github.com/folyxhq',
} as const

export const PLAN_CONFIG = {
  monthly: {
    label: 'Monthly',
    price_bdt: 299,
    price_usd: 3,
    duration_months: 1,
  },
  half_yearly: {
    label: '6 Months',
    price_bdt: 1499,
    price_usd: 14,
    duration_months: 6,
  },
  yearly: {
    label: 'Yearly',
    price_bdt: 2499,
    price_usd: 24,
    duration_months: 12,
  },
} as const

// ── Subscription helpers ──
export function getPlanEndDate(plan: keyof typeof PLAN_CONFIG, startDate = new Date()) {
  const months = PLAN_CONFIG[plan].duration_months
  if (months >= 12) return addYears(startDate, months / 12)
  return addMonths(startDate, months)
}

export function getDaysRemaining(endDate: string): number {
  return Math.max(0, differenceInDays(new Date(endDate), new Date()))
}

export function formatDate(date: string | Date): string {
  return format(new Date(date), 'dd MMM yyyy')
}

// ── Subdomain URL builder ──
export function getSubdomainUrl(subdomain: string): string {
  if (process.env.NODE_ENV === 'development') {
    return `http://localhost:3000?subdomain=${subdomain}`
  }
  return `https://${subdomain}.${APP_CONFIG.domain}`
}

// ── Client ID generator ──
export function generateClientId(subdomain: string): string {
  const date = format(new Date(), 'yyyyMMdd')
  return `folyx_${subdomain}_${date}`
}

// ── Random password generator ──
export function generatePassword(length = 12): string {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#$!'
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

// ── YouTube embed helpers ──
export function getYouTubeThumbnail(videoId: string): string {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
}

export function getYouTubeEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`
}

// ── Read time estimator ──
export function estimateReadTime(markdown: string): number {
  const words = markdown.split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
}

// ── Truncate text ──
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trimEnd() + '…'
}

// ── Status badge color ──
export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    active: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    expired: 'text-red-400 bg-red-400/10 border-red-400/20',
    suspended: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    trial: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  }
  return map[status] || 'text-gray-400 bg-gray-400/10 border-gray-400/20'
}
