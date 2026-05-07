import type { Metadata } from 'next'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'

export const metadata: Metadata = {
  title: { default: 'Folyx — Professional Portfolio Platform', template: '%s | Folyx' },
  description: 'Build a stunning professional portfolio website for students and engineers.',
}

export default function CompanyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar variant="company" />
      <main className="flex-1">{children}</main>
      <Footer variant="company" />
    </div>
  )
}
