import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'
import { getClientInfo } from '@/lib/github'
import type { ClientInfo } from '@/types/client'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import SplashScreen from '@/components/shared/SplashScreen'
import CursorEffect from '@/components/shared/CursorEffect'

interface PortfolioLayoutProps {
  children: ReactNode
  params: { subdomain: string }
}

export default async function PortfolioLayout({ children, params }: PortfolioLayoutProps) {
  // Read subdomain from middleware header OR from params
  const headersList = headers()
  const subdomain = headersList.get('x-folyx-subdomain') || params.subdomain

  const client: ClientInfo | null = await getClientInfo(subdomain)
  if (!client) notFound()

  // Check subscription active
  const isExpired = client.subscription.status === 'expired' || client.subscription.status === 'suspended'

  const portfolioLinks = [
    { label: 'Home',     href: '/' },
    { label: 'About',    href: '/about' },
    { label: 'Projects', href: '/projects' },
    { label: 'Studio',   href: '/studio' },
    { label: 'Contact',  href: '/contact' },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <SplashScreen />
      <CursorEffect />
      <Navbar
        variant="portfolio"
        links={portfolioLinks}
        clientName={client.personal.display_name}
      />
      {isExpired && (
        <div className="fixed bottom-0 inset-x-0 z-40 bg-amber-500/10 border-t border-amber-500/30 py-2 text-center text-xs text-amber-400">
          ⚠ This portfolio&apos;s subscription has expired. Contact{' '}
          <a href="https://folyx.com/contact" className="underline">Folyx</a> to renew.
        </div>
      )}
      <main className="flex-1">{children}</main>
      <Footer variant="portfolio" clientName={client.personal.full_name} />
    </div>
  )
}
