'use client'
import { useState } from 'react'
import { Mail, Phone, Github, Linkedin, Facebook, Youtube, Send, CheckCircle, AlertCircle } from 'lucide-react'
import { useParams } from 'next/navigation'

// Note: client info loaded client-side via fetch for this 'use client' page
export default function PortfolioContactPage() {
  const params = useParams()
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const emailjs = await import('emailjs-com')
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        { from_name: form.name, from_email: form.email, subject: form.subject, message: form.message, to_subdomain: params.subdomain },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      )
      setStatus('sent')
    } catch { setStatus('error') }
  }

  return (
    <div className="pt-24">
      <section className="section-sm">
        <div className="container-folyx max-w-2xl mx-auto">
          <div className="section-label">Contact</div>
          <h1 className="mb-3">Get In Touch</h1>
          <p className="text-[var(--t2)] mb-10">Have a question, collaboration idea, or just want to say hello?</p>

          {status === 'sent' ? (
            <div className="card p-10 text-center">
              <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Message sent!</h3>
              <p className="text-[var(--t2)]">Thank you for reaching out. I&apos;ll get back to you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="card p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[var(--t2)] mb-1.5">Name *</label>
                  <input value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} required placeholder="Your name" className="input-folyx" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--t2)] mb-1.5">Email *</label>
                  <input type="email" value={form.email} onChange={e => setForm(p => ({...p, email: e.target.value}))} required placeholder="you@email.com" className="input-folyx" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--t2)] mb-1.5">Subject</label>
                <input value={form.subject} onChange={e => setForm(p => ({...p, subject: e.target.value}))} placeholder="What's this about?" className="input-folyx" />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--t2)] mb-1.5">Message *</label>
                <textarea value={form.message} onChange={e => setForm(p => ({...p, message: e.target.value}))} required rows={5} placeholder="Your message…" className="input-folyx resize-none" />
              </div>
              {status === 'error' && (
                <div className="flex items-center gap-2 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">
                  <AlertCircle className="w-4 h-4 shrink-0" /> Failed to send. Please try again or email directly.
                </div>
              )}
              <button type="submit" disabled={status === 'sending'} className="btn btn-primary w-full gap-2">
                {status === 'sending' ? 'Sending…' : <><Send className="w-4 h-4" />Send Message</>}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  )
}
