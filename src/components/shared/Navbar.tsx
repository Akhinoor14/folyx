'use client'
import { useState, useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavLink { label: string; href: string }

interface NavbarProps {
  variant?: 'company' | 'portfolio' | 'admin' | 'boss'
  links?: NavLink[]
  logo?: ReactNode
  actions?: ReactNode
  clientName?: string
}

const COMPANY_LINKS: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Features', href: '/features' },
  { label: 'Portfolios', href: '/portfolios' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Contact', href: '/contact' },
]

const PORTFOLIO_LINKS: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Projects', href: '/projects' },
  { label: 'Studio', href: '/studio' },
  { label: 'Contact', href: '/contact' },
]

export function FolyxLogo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'text-lg', md: 'text-xl', lg: 'text-2xl' }
  return (
    <span className={cn('font-display font-bold tracking-tight', sizes[size])}>
      <span className="text-gradient">Folyx</span>
    </span>
  )
}

export default function Navbar({
  variant = 'company',
  links,
  logo,
  actions,
  clientName,
}: NavbarProps) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const navRef = useRef<HTMLElement>(null)

  const navLinks = links ?? (variant === 'portfolio' ? PORTFOLIO_LINKS : COMPANY_LINKS)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => { setOpen(false) }, [pathname])

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  // Prevent body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <>
      <nav
        ref={navRef}
        className={cn(
          'fixed top-0 inset-x-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-[var(--bg-0)]/90 backdrop-blur-xl border-b border-[var(--border)] shadow-lg'
            : 'bg-transparent'
        )}
      >
        <div className="container-folyx">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              {logo ?? (
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-folyx-600 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  <FolyxLogo />
                  {clientName && (
                    <span className="hidden sm:block text-[var(--t3)] text-sm font-normal ml-1">
                      / {clientName}
                    </span>
                  )}
                </div>
              )}
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    isActive(link.href)
                      ? 'text-white bg-[var(--bg-3)]'
                      : 'text-[var(--t2)] hover:text-white hover:bg-[var(--bg-3)]'
                  )}
                >
                  {link.label}
                  {isActive(link.href) && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-folyx-400" />
                  )}
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="hidden md:flex items-center gap-3">
              {actions ?? (
                variant === 'company' ? (
                  <>
                    <Link href="/portfolios" className="btn btn-ghost text-sm py-2 px-4">
                      See portfolios
                    </Link>
                    <Link href="/pricing" className="btn btn-primary text-sm py-2 px-4">
                      Get Started
                    </Link>
                  </>
                ) : null
              )}
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden btn btn-ghost p-2 rounded-lg"
              aria-label="Toggle menu"
              aria-expanded={open}
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden transition-opacity duration-300',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={() => setOpen(false)}
      />

      {/* Mobile menu */}
      <div
        className={cn(
          'fixed top-16 inset-x-0 z-40 md:hidden transition-all duration-300',
          open ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'
        )}
      >
        <div className="mx-4 rounded-2xl bg-[var(--bg-2)] border border-[var(--border)] shadow-xl overflow-hidden">
          <div className="p-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all',
                  isActive(link.href)
                    ? 'text-white bg-[var(--bg-3)] border border-[var(--border-2)]'
                    : 'text-[var(--t2)] hover:text-white hover:bg-[var(--bg-3)]'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
          {variant === 'company' && (
            <div className="px-4 pb-4 pt-2 border-t border-[var(--border)] flex flex-col gap-2">
              <Link href="/pricing" className="btn btn-primary w-full">
                Get Started — Free
              </Link>
              <Link href="/portfolios" className="btn btn-outline w-full">
                See portfolios
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
