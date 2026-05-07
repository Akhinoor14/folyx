import type { Metadata } from 'next'
import { Layers, BookOpen, Code2, Globe, Shield, Zap, Box, FileText, Video, Search, Wifi, Smartphone, BarChart2, Lock, RefreshCw } from 'lucide-react'

export const metadata: Metadata = { title: 'Features' }

const FEATURE_SECTIONS = [
  {
    label: 'Projects',
    title: 'Six project categories, one portfolio',
    description: 'Showcase the full breadth of your engineering work.',
    features: [
      { icon: Zap, name: 'Arduino', desc: 'Circuit diagrams, code snippets, component lists, and demo videos.' },
      { icon: BarChart2, name: 'MATLAB', desc: 'Simulations, result images, toolbox details, and analysis writeups.' },
      { icon: Box, name: 'SolidWorks 3D', desc: 'Interactive 3D model viewer right in the browser. GLB files supported.' },
      { icon: Code2, name: 'Programming', desc: 'GitHub links, live demos, tech stack, and screenshots.' },
      { icon: Globe, name: 'Websites', desc: 'Web projects with live links, screenshots, and stack details.' },
      { icon: Layers, name: 'Electronics', desc: 'PCB designs, schematics, and component documentation.' },
    ],
  },
  {
    label: 'Content Studio',
    title: 'Publish everything you create',
    description: 'Your research, writing, and learning in one organized space.',
    features: [
      { icon: BookOpen, name: 'Books', desc: 'Curated book list with in-app PDF reader and notes.' },
      { icon: FileText, name: 'Research Papers', desc: 'Upload papers with abstracts, DOI links, and inline PDF reader.' },
      { icon: FileText, name: 'Written Posts', desc: 'Markdown-powered blog. Format, embed images, publish instantly.' },
      { icon: Video, name: 'Videos', desc: 'YouTube integration with categories and descriptions.' },
      { icon: Layers, name: 'Courses', desc: 'Show what you\'re learning — platforms, progress, certificates.' },
      { icon: Shield, name: 'Certificates', desc: 'Display achievement certificates with issuer details and credential links.' },
    ],
  },
  {
    label: 'Platform',
    title: 'Built for performance and reliability',
    description: 'Under the hood, everything is optimized.',
    features: [
      { icon: Search, name: 'Advanced Search', desc: 'Fuzzy search across all projects and content. Ctrl+K shortcut.' },
      { icon: Wifi, name: 'PWA + Offline', desc: 'Install like an app. Works offline. Loads from cache instantly.' },
      { icon: Smartphone, name: 'Mobile First', desc: 'Fully responsive on all screen sizes. No separate mobile version needed.' },
      { icon: Lock, name: 'Secure CMS', desc: 'Only Boss CMS protected with private login. Your data is yours.' },
      { icon: RefreshCw, name: 'Always Updated', desc: 'Instant content changes via CMS. No rebuild required.' },
      { icon: BarChart2, name: 'Analytics', desc: 'Track visits, popular projects, and referrers from your dashboard.' },
    ],
  },
]

export default function FeaturesPage() {
  return (
    <div className="pt-24">
      <section className="section-sm text-center">
        <div className="container-folyx max-w-2xl mx-auto">
          <div className="section-label mx-auto justify-center">Features</div>
          <h1 className="mb-4">Everything in one platform</h1>
          <p className="text-[var(--t2)] text-lg">
            Designed for engineers, researchers, and students who want a portfolio that matches the quality of their work.
          </p>
        </div>
      </section>

      {FEATURE_SECTIONS.map((section, si) => (
        <section key={section.label} className={`section ${si % 2 === 1 ? 'bg-[var(--bg-1)] border-y border-[var(--border)]' : ''}`}>
          <div className="container-folyx">
            <div className="max-w-xl mb-12">
              <div className="section-label">{section.label}</div>
              <h2 className="mb-3">{section.title}</h2>
              <p className="text-[var(--t2)]">{section.description}</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {section.features.map(({ icon: Icon, name, desc }) => (
                <div key={name} className="flex items-start gap-4 p-5 card">
                  <div className="w-9 h-9 rounded-xl bg-folyx-600/15 flex items-center justify-center shrink-0">
                    <Icon className="w-4.5 h-4.5 text-folyx-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--t1)] text-sm mb-1">{name}</p>
                    <p className="text-xs text-[var(--t2)] leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  )
}
