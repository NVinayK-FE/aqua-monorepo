import Link from 'next/link'
import MarketingNavbar from '@/components/marketing/navbar'
import { Target, Heart, Lightbulb, Globe, ArrowRight } from 'lucide-react'

const VALUES = [
  {
    icon: Target,
    title: 'Clarity first',
    description: 'We cut through complexity so HR teams can focus on people, not paperwork.',
  },
  {
    icon: Heart,
    title: 'People-centred',
    description: 'Every feature is built with the employee experience at its core.',
  },
  {
    icon: Lightbulb,
    title: 'Always innovating',
    description: 'We ship continuously, driven by customer feedback and emerging best practices.',
  },
  {
    icon: Globe,
    title: 'Built for scale',
    description: 'From 10 to 10,000 employees, AQUA SUITE grows with your organisation.',
  },
]

const TEAM = [
  { name: 'Arjun Mehta', role: 'CEO & Co-founder', initials: 'AM', bio: 'Former VP Engineering at WorkdayPlus. 15 years in enterprise SaaS.' },
  { name: 'Lisa Chen', role: 'CPO & Co-founder', initials: 'LC', bio: 'Ex-product lead at Lever and Rippling. Obsessed with HR workflows.' },
  { name: 'David Osei', role: 'CTO', initials: 'DO', bio: 'Previously at AWS and Stripe. Architect of AQUA\'s multi-tenant infrastructure.' },
  { name: 'Nadia Patel', role: 'Head of Customer Success', initials: 'NP', bio: 'Helped 500+ companies successfully deploy enterprise HR platforms.' },
]

const MILESTONES = [
  { year: '2020', event: 'Founded in Bangalore with a mission to modernise HR for the Asian market.' },
  { year: '2021', event: 'Launched multi-tenant payroll engine. Onboarded first 100 enterprise clients.' },
  { year: '2022', event: 'Expanded to Southeast Asia. Series A funding of $12M secured.' },
  { year: '2023', event: 'Hit 500+ enterprise tenants. Launched performance & analytics modules.' },
  { year: '2024', event: 'Global expansion. 1,200+ clients across 30 countries. Series B in progress.' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingNavbar />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-[0.08] aqua-gradient" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-20 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight">
            We're on a mission to make <br className="hidden sm:block" />
            <span className="text-primary">HR human again</span>
          </h1>
          <p className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            AQUA SUITE was built by HR practitioners and engineers who were tired of clunky legacy systems. We set out to build the platform we always wished existed.
          </p>
        </div>
      </section>

      {/* ── Story ────────────────────────────────────────────────────────── */}
      <section className="bg-white border-y border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-5">The story behind AQUA SUITE</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  In 2020, our founders were running HR at fast-growing companies and sharing the same frustration: the tools available were either overpriced enterprise behemoths or fragmented point solutions that never talked to each other.
                </p>
                <p>
                  So they built AQUA SUITE — a unified, multi-tenant HR platform designed from the ground up for modern teams. One platform that covers the entire employee lifecycle, from first interview to final payslip.
                </p>
                <p>
                  Today, over 1,200 organisations across 30 countries trust AQUA SUITE to manage their most important asset: their people.
                </p>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-5">
              {MILESTONES.map((m, i) => (
                <div key={m.year} className="flex gap-5">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full aqua-gradient flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm">
                      {m.year.slice(2)}
                    </div>
                    {i < MILESTONES.length - 1 && (
                      <div className="w-0.5 flex-1 bg-border mt-2" />
                    )}
                  </div>
                  <div className="pb-5">
                    <div className="text-xs font-semibold text-primary mb-1">{m.year}</div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{m.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ───────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-foreground">What we stand for</h2>
          <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
            Our values aren't wall art — they shape every decision we make.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {VALUES.map((v) => (
            <div key={v.title} className="stat-card text-center">
              <div className="w-12 h-12 rounded-xl aqua-gradient flex items-center justify-center mx-auto mb-4 shadow-sm">
                <v.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{v.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{v.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Team ─────────────────────────────────────────────────────────── */}
      <section className="bg-white border-y border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-foreground">Meet the team</h2>
            <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
              A small, diverse group of builders obsessed with making HR better.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM.map((member) => (
              <div key={member.name} className="rounded-2xl border border-border p-6 hover:shadow-md transition-shadow text-center">
                <div className="w-16 h-16 rounded-full aqua-gradient flex items-center justify-center text-white font-bold text-lg mx-auto mb-4 shadow-sm">
                  {member.initials}
                </div>
                <h3 className="font-semibold text-foreground">{member.name}</h3>
                <p className="text-xs text-primary font-medium mt-0.5 mb-3">{member.role}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h2 className="text-3xl font-bold text-foreground mb-4">Want to work with us?</h2>
        <p className="text-muted-foreground max-w-lg mx-auto mb-8">
          Whether you're a potential customer or a future team member, we'd love to hear from you.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/register"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-white font-semibold aqua-gradient rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-primary/20 text-sm"
          >
            Start free trial <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/contact"
            className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 border border-border text-foreground font-semibold rounded-xl hover:bg-muted transition-colors text-sm"
          >
            Get in touch
          </Link>
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
            <Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link>
            <Link href="/login" className="hover:text-foreground transition-colors">Sign in</Link>
          </div>
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} AQUA SUITE. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
