import type { Metadata } from 'next'
import Link from 'next/link'
import { Check, Zap, ArrowRight, HelpCircle } from 'lucide-react'
import { PLAN_CONFIG } from '@/lib/utils'

export const metadata: Metadata = { title: 'Pricing' }

const PLAN_FEATURES = {
  monthly: [
    'Personal subdomain (name.folyx.com)',
    'All project categories (6 types)',
    'Content Studio',
    'Only Boss CMS',
    'PDF & 3D model viewer',
    'Search functionality',
    'PWA (offline support)',
    'Mobile responsive',
    'Email support',
  ],
  half_yearly: [
    'Everything in Monthly',
    '2 months free',
    'Priority support',
    'Analytics dashboard',
    'Custom profile badge',
    'Featured in portfolios page',
  ],
  yearly: [
    'Everything in 6 Months',
    '4 months free',
    'Custom domain option',
    'Priority deployment',
    'Dedicated support',
    'Profile verification badge',
    'Featured placement',
  ],
}

const FAQS = [
  { q: 'How quickly will my portfolio go live?', a: 'Typically within 2 minutes of completing your order. Our system auto-creates and deploys everything.' },
  { q: 'Can I update my content myself?', a: 'Yes. The Only Boss CMS lets you upload, edit, and delete all projects and content without any coding.' },
  { q: 'What happens when my plan expires?', a: 'Your portfolio stays visible for 7 more days. After that it\'s paused until you renew. Your data is never deleted.' },
  { q: 'Can I get a custom domain like myname.com?', a: 'Yes, on the Yearly plan we support custom domains. You\'ll need to own the domain and point DNS to us.' },
  { q: 'Do I need to know coding?', a: 'Zero coding required. Everything is managed through the CMS. We handle all technical details.' },
]

export default function PricingPage() {
  return (
    <div className="pt-24">
      {/* Header */}
      <section className="section-sm text-center">
        <div className="container-folyx max-w-2xl mx-auto">
          <div className="section-label mx-auto justify-center">Pricing</div>
          <h1 className="mb-4">Simple, transparent pricing</h1>
          <p className="text-[var(--t2)] text-lg">
            One plan, all features. No hidden fees. Cancel anytime.
          </p>
        </div>
      </section>

      {/* Plans */}
      <section className="section-sm">
        <div className="container-folyx">
          <div className="grid md:grid-cols-3 gap-5 max-w-4xl mx-auto items-start">
            {(Object.entries(PLAN_CONFIG) as [keyof typeof PLAN_CONFIG, typeof PLAN_CONFIG[keyof typeof PLAN_CONFIG]][]).map(([key, plan], idx) => {
              const features = PLAN_FEATURES[key]
              const isFeatured = key === 'half_yearly'
              return (
                <div
                  key={key}
                  className={`card p-6 relative ${isFeatured ? 'border-folyx-500/40 shadow-glow-sm scale-[1.02]' : ''}`}
                >
                  {isFeatured && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <span className="bg-folyx-600 text-white text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <div className="mb-6">
                    <h3 className="text-base font-semibold text-[var(--t1)] mb-1">{plan.label}</h3>
                    <div className="flex items-end gap-1 my-3">
                      <span className="font-display text-3xl font-bold text-[var(--t1)]">
                        ৳{plan.price_bdt}
                      </span>
                      <span className="text-[var(--t3)] text-sm mb-1">/ {plan.label.toLowerCase()}</span>
                    </div>
                    <p className="text-xs text-[var(--t3)]">${plan.price_usd} USD · One-time payment</p>
                  </div>
                  <ul className="space-y-2.5 mb-6">
                    {features.map(f => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-[var(--t2)]">
                        <Check className="w-4 h-4 text-folyx-400 shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/contact"
                    className={`btn w-full ${isFeatured ? 'btn-primary' : 'btn-outline'}`}
                  >
                    Get Started
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section bg-[var(--bg-1)] border-t border-[var(--border)]">
        <div className="container-folyx max-w-2xl mx-auto">
          <div className="flex items-center gap-2 mb-10 justify-center">
            <HelpCircle className="w-5 h-5 text-folyx-400" />
            <h2 className="text-2xl">Frequently asked questions</h2>
          </div>
          <div className="space-y-4">
            {FAQS.map(({ q, a }) => (
              <div key={q} className="card p-5">
                <p className="font-semibold text-[var(--t1)] mb-2">{q}</p>
                <p className="text-sm text-[var(--t2)]">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
