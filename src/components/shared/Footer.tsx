import Link from 'next/link'
import { Zap, Github, Youtube, Mail, Phone, Facebook, Linkedin, ExternalLink } from 'lucide-react'
import { FolyxLogo } from './Navbar'
import { APP_CONFIG } from '@/lib/utils'

const FOOTER_PAGES = [
  { label: 'Home', href: '/' },
  { label: 'Features', href: '/features' },
  { label: 'Portfolios', href: '/portfolios' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Contact', href: '/contact' },
]

const FOOTER_COMPANY = [
  { label: 'Admin Login', href: '/admin' },
  { label: 'Documentation', href: '/docs' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
]

const SOCIAL_LINKS = [
  { label: 'Facebook', href: 'https://facebook.com/folyxhq', Icon: Facebook },
  { label: 'GitHub', href: 'https://github.com/folyxhq', Icon: Github },
  { label: 'YouTube', href: 'https://youtube.com/@folyx', Icon: Youtube },
  { label: 'Email', href: `mailto:${APP_CONFIG.email}`, Icon: Mail },
]

interface FooterProps {
  variant?: 'company' | 'portfolio'
  clientName?: string
}

export default function Footer({ variant = 'company', clientName }: FooterProps) {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-1)]">
      <div className="container-folyx py-16">

        {/* 4-column grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* Col 1 — Brand */}
          <div className="sm:col-span-2 lg:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-folyx-600 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <FolyxLogo />
            </Link>
            <p className="text-sm text-[var(--t2)] leading-relaxed max-w-[26ch]">
              Professional portfolio websites for students and engineers. Built for Bangladesh, designed for the world.
            </p>
            <div className="flex flex-wrap gap-2">
              {['🔒 Secure', '⚡ Fast', '🇧🇩 Built in BD'].map((badge) => (
                <span
                  key={badge}
                  className="text-xs px-2.5 py-1 rounded-full bg-[var(--bg-3)] border border-[var(--border)] text-[var(--t3)]"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Col 2 — Pages */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-[var(--t1)] tracking-wide">Pages</h4>
            <ul className="space-y-2.5">
              {FOOTER_PAGES.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-[var(--t2)] hover:text-[var(--t1)] transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Company */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-[var(--t1)] tracking-wide">Company</h4>
            <ul className="space-y-2.5">
              {FOOTER_COMPANY.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-[var(--t2)] hover:text-[var(--t1)] transition-colors flex items-center gap-1.5"
                  >
                    {label}
                    {href.startsWith('http') && <ExternalLink className="w-3 h-3 opacity-50" />}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href={`mailto:${APP_CONFIG.email}`}
                  className="text-sm text-[var(--t2)] hover:text-[var(--t1)] transition-colors flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5 text-folyx-400" />
                  {APP_CONFIG.email}
                </a>
              </li>
              <li>
                <a
                  href="tel:+8801724812042"
                  className="text-sm text-[var(--t2)] hover:text-[var(--t1)] transition-colors flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-folyx-400" />
                  +880 1724-812042
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4 — Social */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-[var(--t1)] tracking-wide">Connect</h4>
            <div className="grid grid-cols-2 gap-2">
              {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel="noreferrer"
                  aria-label={label}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[var(--bg-3)] border border-[var(--border)] text-[var(--t2)] hover:text-white hover:border-folyx-500/40 hover:bg-folyx-600/10 transition-all text-sm font-medium"
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {label}
                </a>
              ))}
            </div>

            <div className="pt-2">
              <p className="text-xs text-[var(--t3)] leading-relaxed">
                Part of{' '}
                <span className="text-folyx-400 font-medium">Noor Academy</span>
                <br />
                Engineering · Education · Innovation
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-[var(--border)] flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-[var(--t3)]">
            © {year} Folyx · Part of Noor Academy · All rights reserved
          </p>
          <p className="text-xs text-[var(--t3)]">
            Engineering · Education · Innovation
          </p>
          <p className="text-xs text-[var(--t3)]">
            Proudly made in Bangladesh 🇧🇩
          </p>
        </div>
      </div>
    </footer>
  )
}
