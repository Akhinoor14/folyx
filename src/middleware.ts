import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

const ADMIN_SUBDOMAIN = 'admin'
const WWW_SUBDOMAIN = 'www'
const APP_DOMAIN = process.env.NEXT_PUBLIC_APP_DOMAIN || 'folyx.com'

function withPrefix(pathname: string, prefix: string) {
  if (pathname === prefix || pathname.startsWith(`${prefix}/`)) return pathname
  if (pathname === '/') return prefix
  return `${prefix}${pathname}`
}

export async function middleware(req: NextRequest) {
  const hostname = req.headers.get('x-forwarded-host') || req.headers.get('host') || ''
  const pathname = req.nextUrl.pathname

  // Skip static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') 
  ) {
    return NextResponse.next()
  }

  // Extract subdomain
  const hostWithoutPort = hostname.split(':')[0].toLowerCase()
  const isLocalDev = hostWithoutPort === 'localhost' || hostWithoutPort === '127.0.0.1'
  const isPreviewHost = hostWithoutPort.endsWith('.vercel.app')
  const isAppDomainHost =
    hostWithoutPort === APP_DOMAIN ||
    hostWithoutPort.endsWith(`.${APP_DOMAIN}`)

  // Local dev: use query param ?subdomain=name for testing
  let subdomain = ''
  if (isLocalDev) {
    subdomain = req.nextUrl.searchParams.get('subdomain') || ''
  } else {
    // Production: extract from hostname
    const parts = hostWithoutPort.split('.')
    if (parts.length >= 3) {
      subdomain = parts[0]
    }
  }

  // ── Company website (folyx.com or www.folyx.com or no subdomain) ──
  if (!subdomain || subdomain === WWW_SUBDOMAIN || isPreviewHost || !isAppDomainHost) {
    if (
      pathname.startsWith('/admin') ||
      pathname.startsWith('/boss') ||
      pathname.startsWith('/company')
    ) {
      return NextResponse.next()
    }
    const url = req.nextUrl.clone()
    url.pathname = withPrefix(pathname, '/company')
    return NextResponse.rewrite(url)
  }

  // ── Supreme Admin (admin.folyx.com) ──
  if (subdomain === ADMIN_SUBDOMAIN) {
    // Auth check for admin routes (except login)
    if (!pathname.startsWith('/admin/login') && pathname !== '/login') {
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            get: (name) => req.cookies.get(name)?.value,
            set: () => {},
            remove: () => {},
          },
        }
      )
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        const loginUrl = req.nextUrl.clone()
        loginUrl.pathname = '/admin/login'
        return NextResponse.redirect(loginUrl)
      }
    }
    const url = req.nextUrl.clone()
    url.pathname = withPrefix(pathname, '/admin')
    return NextResponse.rewrite(url)
  }

  // ── Client Portfolio (name.folyx.com) ──
  // Rewrite to /portfolio/[subdomain]/...
  const portfolioPrefix = `/portfolio/${subdomain}`
  if (pathname === portfolioPrefix || pathname.startsWith(`${portfolioPrefix}/`)) {
    return NextResponse.next()
  }
  const url = req.nextUrl.clone()
  url.pathname = withPrefix(pathname, portfolioPrefix)
  
  // Add subdomain header for server components to read
  const response = NextResponse.rewrite(url)
  response.headers.set('x-folyx-subdomain', subdomain)
  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icons|images|sw.js|workbox-*.js).*)',
  ],
}
