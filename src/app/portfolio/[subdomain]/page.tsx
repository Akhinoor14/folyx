import { headers } from 'next/headers'
import { getClientInfo } from '@/lib/github'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Github, Linkedin, Youtube, Facebook, Mail, Phone, ExternalLink, MapPin, GraduationCap } from 'lucide-react'
import type { ClientInfo } from '@/types/client'

interface Props { params: { subdomain: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const client = await getClientInfo(params.subdomain)
  if (!client) return { title: 'Portfolio' }
  return {
    title: `${client.personal.full_name} — Portfolio`,
    description: client.personal.tagline,
    openGraph: {
      title: client.personal.full_name,
      description: client.personal.tagline,
      images: client.personal.profile_picture ? [client.personal.profile_picture] : [],
    },
  }
}

const CATEGORY_LABELS = [
  { key: 'arduino',      label: 'Arduino',     href: '/projects/arduino' },
  { key: 'matlab',       label: 'MATLAB',      href: '/projects/matlab' },
  { key: 'solidworks',   label: 'SolidWorks',  href: '/projects/solidworks' },
  { key: 'programming',  label: 'Programming', href: '/projects/programming' },
  { key: 'websites',     label: 'Websites',    href: '/projects/websites' },
  { key: 'electronics',  label: 'Electronics', href: '/projects/electronics' },
]

export default async function PortfolioHomePage({ params }: Props) {
  const headersList = headers()
  const subdomain = headersList.get('x-folyx-subdomain') || params.subdomain
  const client: ClientInfo | null = await getClientInfo(subdomain)
  if (!client) notFound()

  const { personal, contact, social, features } = client

  const socialLinks = [
    social.github_url   && { icon: Github,   href: social.github_url,   label: 'GitHub' },
    social.linkedin_url && { icon: Linkedin,  href: social.linkedin_url, label: 'LinkedIn' },
    social.youtube_url  && { icon: Youtube,   href: social.youtube_url,  label: 'YouTube' },
    social.facebook_url && { icon: Facebook,  href: social.facebook_url, label: 'Facebook' },
  ].filter(Boolean) as { icon: any; href: string; label: string }[]

  return (
    <div>
      {/* ── HERO ── */}
      <section className="relative min-h-[calc(100vh-64px)] flex items-center pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="absolute inset-0 glow-top" />

        <div className="container-folyx relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text */}
            <div className="space-y-6">
              {personal.location && (
                <div className="flex items-center gap-1.5 text-sm text-[var(--t3)]">
                  <MapPin className="w-3.5 h-3.5" />
                  {personal.location}
                </div>
              )}
              <div>
                <p className="text-folyx-400 font-medium mb-2 text-sm tracking-wide">
                  Hi, I&apos;m
                </p>
                <h1 className="text-gradient mb-3">{personal.full_name}</h1>
                <p className="text-xl text-[var(--t2)] font-medium">{personal.job_title}</p>
              </div>
              <p className="text-[var(--t2)] text-lg leading-relaxed max-w-lg">
                {personal.tagline}
              </p>
              {personal.bio_short && (
                <p className="text-[var(--t3)] text-sm leading-relaxed max-w-lg">
                  {personal.bio_short}
                </p>
              )}

              {/* University badge */}
              <div className="flex items-center gap-2.5 bg-[var(--bg-2)] border border-[var(--border)] rounded-xl px-4 py-3 w-fit">
                <GraduationCap className="w-4 h-4 text-folyx-400 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-[var(--t1)]">{personal.university_short || personal.university_full}</p>
                  <p className="text-xs text-[var(--t3)]">{personal.department} · Batch {personal.batch}</p>
                </div>
              </div>

              {/* CTA + social */}
              <div className="flex flex-wrap gap-3 items-center">
                <Link href="/projects" className="btn btn-primary gap-2">
                  View Projects <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/contact" className="btn btn-outline">
                  Contact Me
                </Link>
              </div>
              {socialLinks.length > 0 && (
                <div className="flex items-center gap-2">
                  {socialLinks.map(({ icon: Icon, href, label }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={label}
                      className="w-9 h-9 rounded-xl bg-[var(--bg-3)] border border-[var(--border)] flex items-center justify-center text-[var(--t2)] hover:text-white hover:border-folyx-500/40 transition-all"
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  ))}
                  {contact.email && (
                    <a href={`mailto:${contact.email}`} aria-label="Email"
                       className="w-9 h-9 rounded-xl bg-[var(--bg-3)] border border-[var(--border)] flex items-center justify-center text-[var(--t2)] hover:text-white transition-all">
                      <Mail className="w-4 h-4" />
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Profile photo */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <div className="w-64 h-64 lg:w-80 lg:h-80 rounded-3xl overflow-hidden border border-[var(--border)] shadow-glow-md">
                  {personal.profile_picture ? (
                    <Image
                      src={personal.profile_picture}
                      alt={personal.full_name}
                      fill
                      className="object-cover"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-folyx-700 to-folyx-900 flex items-center justify-center">
                      <span className="text-6xl font-bold text-white/80">
                        {personal.display_name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                {/* Floating badge */}
                <div className="absolute -bottom-4 -right-4 bg-[var(--bg-2)] border border-[var(--border)] rounded-2xl px-4 py-2.5 shadow-card">
                  <p className="text-xs text-[var(--t3)]">Portfolio by</p>
                  <p className="text-sm font-bold text-gradient">Folyx</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROJECT CATEGORIES ── */}
      <section className="section bg-[var(--bg-1)] border-t border-[var(--border)]">
        <div className="container-folyx">
          <div className="mb-10">
            <div className="section-label">Projects</div>
            <h2>Explore my work</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {CATEGORY_LABELS.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="card p-4 text-center hover:border-folyx-500/30 group"
              >
                <p className="text-sm font-medium text-[var(--t1)] group-hover:text-folyx-300 transition-colors">
                  {label}
                </p>
              </Link>
            ))}
          </div>
          <div className="mt-6">
            <Link href="/projects" className="btn btn-outline gap-2">
              All projects <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CONTENT STUDIO TEASER ── */}
      {features.content_studio_enabled && (
        <section className="section">
          <div className="container-folyx">
            <div className="mb-10">
              <div className="section-label">Content Studio</div>
              <h2>Publications & Content</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {[
                { label: 'Books',   href: '/studio/books',   emoji: '📚' },
                { label: 'Papers',  href: '/studio/papers',  emoji: '📄' },
                { label: 'Posts',   href: '/studio/posts',   emoji: '✍️' },
                { label: 'Videos',  href: '/studio/videos',  emoji: '🎥' },
                { label: 'Courses', href: '/studio/courses', emoji: '🎓' },
              ].map(({ label, href, emoji }) => (
                <Link key={label} href={href} className="card p-5 flex items-center gap-3 hover:border-folyx-500/30">
                  <span className="text-2xl">{emoji}</span>
                  <span className="font-medium text-[var(--t1)]">{label}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
