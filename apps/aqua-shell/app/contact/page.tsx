'use client'

import { useState } from 'react'
import Link from 'next/link'
import MarketingNavbar from '@/components/marketing/navbar'
import { Mail, Phone, MapPin, MessageSquare, CheckCircle2, Loader2 } from 'lucide-react'

const CONTACT_INFO = [
  {
    icon: Mail,
    label: 'Email us',
    value: 'hello@aquasuite.io',
    sub: 'We reply within 24 hours',
  },
  {
    icon: Phone,
    label: 'Call us',
    value: '+1 (800) 555-AQUA',
    sub: 'Mon–Fri, 9am–6pm IST',
  },
  {
    icon: MapPin,
    label: 'Visit us',
    value: '12th Floor, Prestige Tower',
    sub: 'Bangalore, India 560001',
  },
]

const SUBJECTS = [
  'General enquiry',
  'Sales & pricing',
  'Technical support',
  'Partnership',
  'Press & media',
  'Other',
]

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return setError('Please enter your name.')
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError('Please enter a valid email address.')
    if (!subject) return setError('Please select a subject.')
    if (!message.trim() || message.trim().length < 20) return setError('Please write at least 20 characters in your message.')

    setError('')
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1600))
    setLoading(false)
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-background">
      <MarketingNavbar />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full opacity-[0.08] aqua-gradient" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
          <div className="w-14 h-14 rounded-2xl aqua-gradient flex items-center justify-center mx-auto mb-5 shadow-md">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight">
            Let's <span className="text-primary">talk</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-lg mx-auto">
            Have a question, a sales enquiry, or just want to say hello? We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid lg:grid-cols-3 gap-10">

          {/* Contact info sidebar */}
          <div className="space-y-5">
            {CONTACT_INFO.map((item) => (
              <div key={item.label} className="stat-card flex gap-4">
                <div className="w-11 h-11 rounded-xl aqua-gradient flex items-center justify-center flex-shrink-0 shadow-sm">
                  <item.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-0.5">{item.label}</div>
                  <div className="font-semibold text-foreground text-sm">{item.value}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{item.sub}</div>
                </div>
              </div>
            ))}

            {/* Extra nudge */}
            <div className="rounded-2xl border border-primary/20 bg-accent/30 p-5 text-sm text-foreground">
              <p className="font-semibold mb-1">Looking for a demo?</p>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Book a personalised walkthrough with one of our product specialists — no pressure, no commitment.
              </p>
              <Link
                href="/register"
                className="inline-flex items-center gap-1.5 mt-3 text-xs font-semibold text-primary hover:underline"
              >
                Start free trial instead →
              </Link>
            </div>
          </div>

          {/* Contact form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-border p-8 shadow-sm">

              {submitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 rounded-full aqua-gradient flex items-center justify-center mx-auto shadow-md">
                    <CheckCircle2 className="w-8 h-8 text-white" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Message received!</h3>
                  <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                    Thanks, <strong>{name.split(' ')[0]}</strong>. We'll get back to you at <strong>{email}</strong> within one business day.
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setName(''); setEmail(''); setSubject(''); setMessage('') }}
                    className="mt-2 text-sm text-primary font-medium hover:underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">Send us a message</h2>
                    <p className="text-sm text-muted-foreground mt-1">Fill in the form and we'll be in touch shortly.</p>
                  </div>

                  {/* Name + Email row */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Full name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Jane Doe"
                        className="w-full px-4 py-2.5 border border-input rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Email address</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="jane@company.com"
                        className="w-full px-4 py-2.5 border border-input rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Subject</label>
                    <div className="flex flex-wrap gap-2">
                      {SUBJECTS.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setSubject(s)}
                          className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                            subject === s
                              ? 'border-primary bg-accent/50 text-primary'
                              : 'border-input bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      Message
                      <span className="text-muted-foreground font-normal ml-1">({message.length}/1000)</span>
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value.slice(0, 1000))}
                      rows={5}
                      placeholder="Tell us how we can help…"
                      className="w-full px-4 py-3 border border-input rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                    />
                  </div>

                  {error && (
                    <div className="bg-destructive/10 text-destructive text-sm px-4 py-2.5 rounded-lg">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto px-8 py-3 aqua-gradient text-white font-semibold rounded-lg hover:opacity-90 disabled:opacity-70 transition-opacity text-sm flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</>
                    ) : (
                      'Send message'
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-border bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg aqua-gradient flex items-center justify-center text-white font-bold text-xs">A</div>
            <span className="font-bold text-foreground text-sm">AQUA SUITE</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <Link href="/about" className="hover:text-foreground transition-colors">About</Link>
            <Link href="/login" className="hover:text-foreground transition-colors">Sign in</Link>
          </div>
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} AQUA SUITE. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
