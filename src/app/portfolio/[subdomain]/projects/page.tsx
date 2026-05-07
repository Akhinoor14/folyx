import { headers } from 'next/headers'
import { getClientInfo } from '@/lib/github'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Zap, BarChart2, Box, Code2, Globe, Layers, ArrowRight } from 'lucide-react'

interface Props { params: { subdomain: string } }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = await getClientInfo(params.subdomain)
  return { title: `Projects — ${c?.personal.full_name || ''}` }
}

const CATEGORIES = [
  { key: 'arduino',     label: 'Arduino',     desc: 'Embedded systems, circuits, IoT projects',           icon: Zap,        href: '/projects/arduino',     color: 'text-amber-400',  bg: 'bg-amber-400/10' },
  { key: 'matlab',      label: 'MATLAB',      desc: 'Simulations, signal processing, control systems',    icon: BarChart2,  href: '/projects/matlab',      color: 'text-blue-400',   bg: 'bg-blue-400/10' },
  { key: 'solidworks',  label: 'SolidWorks',  desc: '3D models, mechanical designs, assemblies',          icon: Box,        href: '/projects/solidworks',  color: 'text-folyx-400',  bg: 'bg-folyx-400/10' },
  { key: 'programming', label: 'Programming', desc: 'Software, scripts, algorithms, data structures',     icon: Code2,      href: '/projects/programming', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  { key: 'websites',    label: 'Websites',    desc: 'Web apps, frontend, backend, full-stack projects',   icon: Globe,      href: '/projects/websites',    color: 'text-purple-400', bg: 'bg-purple-400/10' },
  { key: 'electronics', label: 'Electronics', desc: 'PCB design, schematics, circuit analysis',           icon: Layers,     href: '/projects/electronics', color: 'text-rose-400',   bg: 'bg-rose-400/10' },
]

export default async function ProjectsPage({ params }: Props) {
  const subdomain = headers().get('x-folyx-subdomain') || params.subdomain
  const client = await getClientInfo(subdomain)
  if (!client) notFound()
  const { features } = client

  const enabledKeys = {
    arduino: true, matlab: features.matlab_enabled, solidworks: features.solidworks_enabled,
    programming: true, websites: true, electronics: features.arduino_enabled,
  } as Record<string, boolean>

  return (
    <div className="pt-24">
      <section className="section-sm">
        <div className="container-folyx">
          <div className="section-label">Projects</div>
          <h1 className="mb-3">All Projects</h1>
          <p className="text-[var(--t2)] mb-12">Browse all work by category.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {CATEGORIES.filter(c => enabledKeys[c.key] !== false).map(({ label, desc, icon: Icon, href, color, bg }) => (
              <Link key={label} href={href} className="card p-6 group hover:border-folyx-500/30">
                <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center mb-4`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <h3 className="text-base font-semibold text-[var(--t1)] mb-1.5">{label}</h3>
                <p className="text-sm text-[var(--t2)] leading-relaxed mb-4">{desc}</p>
                <span className={`flex items-center gap-1 text-xs font-medium ${color}`}>
                  View projects <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
