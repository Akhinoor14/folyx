import { headers } from 'next/headers'
import { getClientInfo } from '@/lib/github'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import { GraduationCap, MapPin, Mail, Phone, Github, Linkedin } from 'lucide-react'

interface Props { params: { subdomain: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const client = await getClientInfo(params.subdomain)
  return { title: `About — ${client?.personal.full_name || 'Portfolio'}` }
}

export default async function AboutPage({ params }: Props) {
  const subdomain = headers().get('x-folyx-subdomain') || params.subdomain
  const client = await getClientInfo(subdomain)
  if (!client) notFound()
  const { personal, contact, social } = client

  const education = [
    personal.university_full && { level: 'University', name: personal.university_full, detail: `${personal.department} · Batch ${personal.batch}` },
    personal.hsc_institution  && { level: 'HSC', name: personal.hsc_institution, detail: 'Higher Secondary Certificate' },
    personal.ssc_institution  && { level: 'SSC', name: personal.ssc_institution, detail: 'Secondary School Certificate' },
  ].filter(Boolean) as { level: string; name: string; detail: string }[]

  return (
    <div className="pt-24">
      <section className="section">
        <div className="container-folyx">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Left: photo + quick info */}
            <div className="space-y-5">
              <div className="w-full aspect-square rounded-3xl overflow-hidden border border-[var(--border)]">
                {personal.profile_picture ? (
                  <Image src={personal.profile_picture} alt={personal.full_name} width={400} height={400} className="object-cover w-full h-full" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-folyx-700 to-folyx-900 flex items-center justify-center">
                    <span className="text-7xl font-bold text-white/80">{personal.display_name.charAt(0)}</span>
                  </div>
                )}
              </div>
              <div className="card p-5 space-y-3">
                <h3 className="text-sm font-semibold text-[var(--t1)]">Quick Info</h3>
                {personal.location && (
                  <div className="flex items-center gap-2.5 text-sm text-[var(--t2)]">
                    <MapPin className="w-4 h-4 text-folyx-400 shrink-0" /> {personal.location}
                  </div>
                )}
                {contact.email && (
                  <div className="flex items-center gap-2.5 text-sm text-[var(--t2)]">
                    <Mail className="w-4 h-4 text-folyx-400 shrink-0" />
                    <a href={`mailto:${contact.email}`} className="hover:text-[var(--t1)] transition-colors truncate">{contact.email}</a>
                  </div>
                )}
                {contact.phone && (
                  <div className="flex items-center gap-2.5 text-sm text-[var(--t2)]">
                    <Phone className="w-4 h-4 text-folyx-400 shrink-0" /> {contact.phone}
                  </div>
                )}
                {social.github_url && (
                  <div className="flex items-center gap-2.5 text-sm text-[var(--t2)]">
                    <Github className="w-4 h-4 text-folyx-400 shrink-0" />
                    <a href={social.github_url} target="_blank" rel="noreferrer" className="hover:text-[var(--t1)] transition-colors">GitHub Profile</a>
                  </div>
                )}
                {social.linkedin_url && (
                  <div className="flex items-center gap-2.5 text-sm text-[var(--t2)]">
                    <Linkedin className="w-4 h-4 text-folyx-400 shrink-0" />
                    <a href={social.linkedin_url} target="_blank" rel="noreferrer" className="hover:text-[var(--t1)] transition-colors">LinkedIn Profile</a>
                  </div>
                )}
              </div>
            </div>

            {/* Right: bio + education */}
            <div className="lg:col-span-2 space-y-10">
              <div>
                <div className="section-label">About</div>
                <h1 className="mb-4">{personal.full_name}</h1>
                <p className="text-lg text-[var(--t2)] font-medium mb-4">{personal.job_title}</p>
                {personal.bio_long ? (
                  <p className="text-[var(--t2)] leading-relaxed">{personal.bio_long}</p>
                ) : personal.bio_short ? (
                  <p className="text-[var(--t2)] leading-relaxed">{personal.bio_short}</p>
                ) : (
                  <p className="text-[var(--t2)] leading-relaxed">{personal.tagline}</p>
                )}
              </div>

              {/* Education timeline */}
              {education.length > 0 && (
                <div>
                  <h3 className="flex items-center gap-2 text-base font-semibold text-[var(--t1)] mb-5">
                    <GraduationCap className="w-5 h-5 text-folyx-400" /> Education
                  </h3>
                  <div className="space-y-4">
                    {education.map(({ level, name, detail }, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-2.5 h-2.5 rounded-full bg-folyx-500 mt-1.5 shrink-0" />
                          {i < education.length - 1 && <div className="w-px flex-1 bg-[var(--border)] mt-2" />}
                        </div>
                        <div className="pb-4">
                          <span className="badge badge-primary text-xs mb-2">{level}</span>
                          <p className="font-semibold text-[var(--t1)] text-sm">{name}</p>
                          <p className="text-xs text-[var(--t3)] mt-0.5">{detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
