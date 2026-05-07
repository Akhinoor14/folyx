import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, ExternalLink, Star } from 'lucide-react'

export const metadata: Metadata = { title: 'Portfolios' }

const SAMPLE_PORTFOLIOS = [
  {
    name: 'Akhinoor Islam',
    slug: 'akhinoor',
    role: 'CSE Student · KUET',
    tags: ['Arduino', 'SolidWorks', 'Programming'],
    rating: 5,
    initials: 'AI',
    color: 'from-folyx-600 to-folyx-800',
    featured: true,
  },
  {
    name: 'Fatima Rahman',
    slug: 'fatima',
    role: 'EEE Student · BUET',
    tags: ['MATLAB', 'Electronics', 'Research'],
    rating: 5,
    initials: 'FR',
    color: 'from-emerald-600 to-emerald-800',
    featured: false,
  },
  {
    name: 'Noman Hossain',
    slug: 'noman',
    role: 'ME Student · KUET',
    tags: ['SolidWorks', 'MATLAB', 'Electronics'],
    rating: 5,
    initials: 'NH',
    color: 'from-amber-600 to-amber-800',
    featured: false,
  },
  {
    name: 'Sakib Ahmed',
    slug: 'sakib',
    role: 'CSE Graduate · RUET',
    tags: ['Programming', 'Websites', 'Arduino'],
    rating: 5,
    initials: 'SA',
    color: 'from-purple-600 to-purple-800',
    featured: false,
  },
]

export default function PortfoliosPage() {
  const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || 'folyx.com'
  return (
    <div className="pt-24">
      <section className="section-sm text-center">
        <div className="container-folyx max-w-xl mx-auto">
          <div className="section-label mx-auto justify-center">Portfolios</div>
          <h1 className="mb-4">Live portfolios built on Folyx</h1>
          <p className="text-[var(--t2)]">
            See real portfolios from students and professionals across Bangladesh.
          </p>
        </div>
      </section>

      <section className="section-sm">
        <div className="container-folyx">
          <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {SAMPLE_PORTFOLIOS.map((p) => (
              <div key={p.slug} className={`card p-6 relative ${p.featured ? 'border-folyx-500/30 shadow-glow-sm' : ''}`}>
                {p.featured && (
                  <span className="absolute top-4 right-4 badge badge-primary text-xs">Featured</span>
                )}
                <div className="flex items-center gap-4 mb-5">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${p.color} flex items-center justify-center text-white font-bold text-lg shrink-0`}>
                    {p.initials}
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--t1)]">{p.name}</p>
                    <p className="text-xs text-[var(--t3)]">{p.role}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-5">
                  {p.tags.map(tag => (
                    <span key={tag} className="text-xs px-2.5 py-1 rounded-lg bg-[var(--bg-3)] border border-[var(--border)] text-[var(--t2)]">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-0.5">
                    {Array(p.rating).fill(0).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <a
                    href={`https://${p.slug}.${appDomain}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-xs text-folyx-400 hover:text-folyx-300 transition-colors font-medium"
                  >
                    Visit portfolio <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-14 max-w-xl mx-auto text-center">
            <div className="card p-8 bg-folyx-600/5 border-folyx-500/20">
              <h3 className="text-xl font-semibold mb-2">Your portfolio could be next</h3>
              <p className="text-[var(--t2)] text-sm mb-6">
                Join students and professionals who already have a professional portfolio live on Folyx.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link href="/pricing" className="btn btn-primary gap-2">
                  Get Your Portfolio <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/contact" className="btn btn-outline">Contact us</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
