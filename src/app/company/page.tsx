import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Zap, Star, Users, Globe, Shield, Layers, Code2, BookOpen, ChevronRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Folyx — Professional Portfolio Platform',
}

// ─────────────────────────────────────────────────────────
// STATS
// ─────────────────────────────────────────────────────────
const STATS = [
  { value: '50+', label: 'Portfolios Deployed' },
  { value: '99.9%', label: 'Uptime' },
  { value: '< 2s', label: 'Load Time' },
  { value: '100%', label: 'Mobile Ready' },
]

// ─────────────────────────────────────────────────────────
// FEATURES
// ─────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: Layers,
    title: 'Multi-category Projects',
    description: 'Showcase Arduino, MATLAB, SolidWorks 3D, programming, websites, and electronics projects in one portfolio.',
    color: 'text-folyx-400',
    bg: 'bg-folyx-500/10',
  },
  {
    icon: BookOpen,
    title: 'Content Studio',
    description: 'Publish books, research papers, video lectures, written posts, and courses — all from one dashboard.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
  },
  {
    icon: Code2,
    title: 'Only Boss CMS',
    description: 'Full content management system. Upload, edit, and delete anything without touching a single line of code.',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
  },
  {
    icon: Globe,
    title: 'Custom Subdomain',
    description: 'Get your own subdomain instantly: name.folyx.com. Upgrade later with a fully custom domain.',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Each portfolio is isolated. Boss CMS protected with private login. Data stored securely.',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
  },
  {
    icon: Zap,
    title: 'Instant Deploy',
    description: 'Portfolio goes live in under 2 minutes after you sign up. Zero setup required from your end.',
    color: 'text-rose-400',
    bg: 'bg-rose-500/10',
  },
]

// ─────────────────────────────────────────────────────────
// TESTIMONIALS
// ─────────────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    name: 'Akhinoor Islam',
    role: 'CSE · KUET',
    text: "Folyx made my portfolio look like a professional company's product page. The SolidWorks 3D viewer alone is worth it.",
    rating: 5,
    initials: 'AI',
  },
  {
    name: 'Fatima Rahman',
    role: 'EEE · BUET',
    text: 'The Only Boss CMS is incredibly intuitive. I update my projects and publications every week without any hassle.',
    rating: 5,
    initials: 'FR',
  },
  {
    name: 'Noman Hossain',
    role: 'ME · KUET',
    text: "My SolidWorks models look amazing with the 3D viewer. Recruiters always comment on how impressive the portfolio is.",
    rating: 5,
    initials: 'NH',
  },
]

// ─────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <div className="relative">

      {/* ── HERO ── */}
      <section className="relative min-h-[calc(100vh-64px)] flex items-center pt-24 pb-20 overflow-hidden">
        {/* Backgrounds */}
        <div className="absolute inset-0 bg-grid opacity-50" />
        <div className="absolute inset-0 glow-top" />
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent/5 blur-3xl pointer-events-none" />

        <div className="container-folyx relative z-10">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="badge badge-primary mb-6 w-fit animate-fade-up" style={{ animationDelay: '0ms' }}>
              <Zap className="w-3 h-3" />
              Portfolio Platform for Engineers & Students
            </div>

            {/* Headline */}
            <h1
              className="mb-6 animate-fade-up"
              style={{ animationDelay: '80ms', animationFillMode: 'both', opacity: 0 }}
            >
              Your work deserves{' '}
              <span className="text-gradient">a better stage.</span>
            </h1>

            {/* Sub */}
            <p
              className="text-lg text-[var(--t2)] max-w-xl mb-10 leading-relaxed animate-fade-up"
              style={{ animationDelay: '160ms', animationFillMode: 'both', opacity: 0 }}
            >
              Folyx builds professional portfolio websites for students and engineers — complete with CMS, 
              3D model viewer, research publications, and a personal subdomain.
            </p>

            {/* CTAs */}
            <div
              className="flex flex-wrap gap-3 animate-fade-up"
              style={{ animationDelay: '240ms', animationFillMode: 'both', opacity: 0 }}
            >
              <Link href="/pricing" className="btn btn-primary gap-2 px-6 py-3">
                Get Your Portfolio
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/portfolios" className="btn btn-outline gap-2 px-6 py-3">
                See examples
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Social proof */}
            <div
              className="mt-10 flex flex-wrap items-center gap-6 animate-fade-up"
              style={{ animationDelay: '320ms', animationFillMode: 'both', opacity: 0 }}
            >
              <div className="flex -space-x-2">
                {['AI', 'FR', 'NH', 'SK'].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full bg-folyx-600 border-2 border-[var(--bg-0)] flex items-center justify-center text-xs font-bold text-white">
                    {i}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex gap-0.5 mb-0.5">
                  {Array(5).fill(0).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-[var(--t3)]">Trusted by 50+ students & professionals</p>
              </div>
            </div>
          </div>

          {/* Hero mockup card */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden xl:block w-[420px] animate-fade-up"
               style={{ animationDelay: '400ms', animationFillMode: 'both', opacity: 0 }}>
            <div className="card p-6 shadow-card-hover">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-folyx-600/30 border border-folyx-500/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-folyx-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--t1)]">Akhinoor Islam</p>
                  <p className="text-xs text-[var(--t3)]">akhinoor.folyx.com</p>
                </div>
                <span className="ml-auto badge badge-accent text-xs">Live ✓</span>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {['Arduino', 'MATLAB', 'SolidWorks', 'Programming', 'Websites', 'Electronics'].map(t => (
                  <span key={t} className="text-xs px-2 py-1 rounded-lg bg-[var(--bg-3)] border border-[var(--border)] text-[var(--t2)] text-center">{t}</span>
                ))}
              </div>
              <div className="h-1.5 bg-[var(--bg-3)] rounded-full overflow-hidden">
                <div className="h-full w-4/5 bg-gradient-to-r from-folyx-500 to-accent rounded-full" />
              </div>
              <p className="text-xs text-[var(--t3)] mt-1.5">Profile 80% complete</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="border-y border-[var(--border)] bg-[var(--bg-1)]">
        <div className="container-folyx py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="font-display text-3xl font-bold text-gradient">{value}</p>
                <p className="text-sm text-[var(--t3)] mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="section">
        <div className="container-folyx">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="section-label mx-auto justify-center">Features</div>
            <h2>Everything a professional portfolio needs</h2>
            <p className="mt-4 text-[var(--t2)]">
              Not just a profile page. A complete platform designed specifically for engineering students and professionals.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(({ icon: Icon, title, description, color, bg }) => (
              <div key={title} className="card p-6 group">
                <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-4`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <h3 className="text-base font-semibold text-[var(--t1)] mb-2">{title}</h3>
                <p className="text-sm text-[var(--t2)] leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/features" className="btn btn-outline gap-2">
              See all features <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="section bg-[var(--bg-1)] border-y border-[var(--border)]">
        <div className="container-folyx">
          <div className="text-center mb-12">
            <div className="section-label mx-auto justify-center">Testimonials</div>
            <h2>Loved by students & professionals</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {TESTIMONIALS.map(({ name, role, text, rating, initials }) => (
              <div key={name} className="card p-6">
                <div className="flex gap-0.5 mb-4">
                  {Array(rating).fill(0).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-[var(--t2)] leading-relaxed mb-5">&ldquo;{text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-folyx-600 flex items-center justify-center text-sm font-bold text-white">
                    {initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--t1)]">{name}</p>
                    <p className="text-xs text-[var(--t3)]">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section">
        <div className="container-folyx">
          <div className="relative rounded-3xl bg-[var(--bg-2)] border border-[var(--border)] overflow-hidden p-12 text-center">
            <div className="absolute inset-0 bg-grid opacity-30" />
            <div className="absolute inset-0 glow-top opacity-60" />
            <div className="relative z-10 max-w-xl mx-auto">
              <h2 className="mb-4">Ready to launch your portfolio?</h2>
              <p className="text-[var(--t2)] mb-8">
                Get your professional portfolio live in under 2 minutes. No setup required.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link href="/pricing" className="btn btn-primary px-8 py-3 gap-2">
                  Get Started Today
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/contact" className="btn btn-outline px-8 py-3">
                  Talk to us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
