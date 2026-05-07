import type { Metadata, Viewport } from 'next'
import { DM_Sans, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  weight: ['400', '500'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Folyx — Professional Portfolio Platform',
    template: '%s | Folyx',
  },
  description: 'Build a stunning professional portfolio website. Designed for students and professionals in engineering, technology, and research.',
  keywords: ['portfolio', 'professional portfolio', 'engineering portfolio', 'student portfolio', 'Bangladesh'],
  authors: [{ name: 'Folyx' }],
  creator: 'Folyx',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://folyx.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://folyx.com',
    siteName: 'Folyx',
    title: 'Folyx — Professional Portfolio Platform',
    description: 'Build a stunning professional portfolio website.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Folyx',
    description: 'Professional portfolio platform for students and engineers.',
  },
  icons: {
    icon: '/icons/favicon.ico',
    apple: '/icons/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  themeColor: '#080c14',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${dmSans.variable} ${jetbrainsMono.variable} font-body antialiased`}>
        {children}
      </body>
    </html>
  )
}
