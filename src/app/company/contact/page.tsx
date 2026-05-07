'use client'
import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Mail, Phone, Send, CheckCircle, AlertCircle, Facebook, Github, MessageSquare } from 'lucide-react'
import { APP_CONFIG } from '@/lib/utils'

const CONTACT_INFO = [
  { icon: Mail, label: 'Email', value: APP_CONFIG.email, href: `mailto:${APP_CONFIG.email}` },
  { icon: Phone, label: 'Phone / WhatsApp', value: '+880 1724-812042', href: 'tel:+8801724812042' },
  { icon: Facebook, label: 'Facebook', value: 'facebook.com/folyxhq', href: 'https://facebook.com/folyxhq' },
  { icon: Github, label: 'GitHub', value: 'github.com/folyxhq', href: 'https://github.com/folyxhq' },
]

const PLAN_OPTIONS = ['Monthly (৳299)', '6 Months (৳1499)', 'Yearly (৳2499)', 'Just asking a question']

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', plan: '', university: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const { send } = await import('@emailjs/browser')
      await send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        {
          from_name: form.name,
          from_email: form.email,
          from_phone: form.phone,
          selected_plan: form.plan,
          university: form.university,
          message: form.message,
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      )
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="pt-24">
      <section className="section-sm text-center">
        <div className="container-folyx max-w-xl mx-auto">
          <div className="section-label mx-auto justify-center">Contact</div>
          <h1 className="mb-4">Get in touch</h1>
          <p className="text-[var(--t2)]">
            Ready to launch your portfolio, or have questions? We typically respond within a few hours.
          </p>
        </div>
      </section>

      <section className="section-sm">
        <div className="container-folyx">
          <div className="grid lg:grid-cols-5 gap-8 max-w-4xl mx-auto">
            {/* Left: info */}
            <div className="lg:col-span-2 space-y-4">
              {CONTACT_INFO.map(({ icon: Icon, label, value, href }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel="noreferrer"
                  className="flex items-start gap-3 p-4 card hover:border-folyx-500/30 transition-all"
                >
                  <div className="w-9 h-9 rounded-lg bg-folyx-600/15 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-folyx-400" />
                  </div>
                  <div>
                    <p className="text-xs text-[var(--t3)] mb-0.5">{label}</p>
                    <p className="text-sm font-medium text-[var(--t1)]">{value}</p>
                  </div>
                </a>
              ))}
              <div className="p-4 card bg-folyx-600/5 border-folyx-500/20">
                <MessageSquare className="w-5 h-5 text-folyx-400 mb-2" />
                <p className="text-sm font-semibold text-[var(--t1)] mb-1">Response time</p>
                <p className="text-sm text-[var(--t2)]">Usually within 2–6 hours. Weekends may be slower.</p>
              </div>
            </div>

            {/* Right: form */}
            <div className="lg:col-span-3">
              {status === 'sent' ? (
                <div className="card p-8 text-center">
                  <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Message sent!</h3>
                  <p className="text-[var(--t2)]">We&apos;ll get back to you shortly at {form.email}.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="card p-6 space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[var(--t2)] mb-1.5">Full name *</label>
                      <input name="name" value={form.name} onChange={handleChange} required placeholder="Your name" className="input-folyx" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[var(--t2)] mb-1.5">Email *</label>
                      <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="you@email.com" className="input-folyx" />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[var(--t2)] mb-1.5">Phone / WhatsApp</label>
                      <input name="phone" value={form.phone} onChange={handleChange} placeholder="+880 ..." className="input-folyx" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[var(--t2)] mb-1.5">University</label>
                      <input name="university" value={form.university} onChange={handleChange} placeholder="KUET, BUET..." className="input-folyx" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[var(--t2)] mb-1.5">Interested in</label>
                    <select name="plan" value={form.plan} onChange={handleChange} className="input-folyx">
                      <option value="">Select a plan…</option>
                      {PLAN_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[var(--t2)] mb-1.5">Message</label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Tell us what you need..."
                      className="input-folyx resize-none"
                    />
                  </div>
                  {status === 'error' && (
                    <div className="flex items-center gap-2 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      Failed to send. Please try WhatsApp or email directly.
                    </div>
                  )}
                  <button type="submit" disabled={status === 'sending'} className="btn btn-primary w-full gap-2">
                    {status === 'sending' ? 'Sending…' : (
                      <><Send className="w-4 h-4" /> Send Message</>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
