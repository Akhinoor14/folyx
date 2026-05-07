import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: { default: 'Only Boss — Folyx CMS', template: '%s | Only Boss' },
  robots: { index: false, follow: false },
}

export default function BossLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
