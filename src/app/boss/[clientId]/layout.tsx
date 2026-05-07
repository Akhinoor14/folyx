import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: { default: 'Only Boss — Folyx CMS', template: '%s | Only Boss' },
  robots: { index: false, follow: false },
}

export default function BossLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
