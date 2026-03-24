import Link from 'next/link'
import MarketingNavbar from '@/components/marketing/navbar'
import {
  Users, DollarSign, BarChart3, CalendarCheck, ShieldCheck,
  Zap, ArrowRight, Star, CheckCircle2
} from 'lucide-react'

const FEATURES = [
  {
    icon: Users,
    title: 'Employee Management',
    description: 'Centralise all employee records, onboarding, and org charts in one place.',
  },
  {
    icon: DollarSign,
    title: 'Payroll Processing',
    description: 'Automate salary runs, deductions, and compliance with zero manual effort.',
  },
  {
    icon: CalendarCheck,
    title: 'Leave & Attendance',
    description: 'Real-time leave tracking, holiday calendars, and approval workflows.',
  },
  {
    icon: BarChart3,
    title: 'Performance Reviews',
    description: 'Set goals, run 360° reviews, and surface insights that drive growth.',
  },
  {
    icon: ShieldCheck,
    title: 'Role-Based Access',
    description: 'Granular permissions per role, department, and tenant out of the box.',
  },
  {
    icon: Zap,
    title: 'Real-Time Analytics',
    description: 'Live dashboards and exportable reports so you always have the full picture.',
  },
]

const STATS = [
  { value: '50K+', label: 'Employees managed' },
  { value: '1,200+', label: 'Enterprise tenants' },
  { value: '99.9%', label: 'Uptime SLA' },
  { value: '4.9★', label: 'Average rating' },
]

const TESTIMONIALS = [
  {
    quote: 'AQUA SUITE cut our monthly payroll processing time from 3 days to under 2 hours.',
    name: 'Priya Sharma',
    role: 'Head of HR, TechWave Solutions',
    initials: 'PS',
  },
  {
    quote: 'The multi-tenant architecture is exactly what we needed to manage our franchise network.',
    name: 'Marcus Liu',
    role: 'COO, Greenfield Ltd',
    initials: 'ML',
  },
  {
    quote: 'Onboarding 300 employees was seamless. The support team is genuinely outstanding.',
    name: 'Sarah O\'Brien',
    role: 'People Operations, Horizon Health',
    initials: 'SO',
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingNavbar />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full opacity-10 aqua-gradient" />
          <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full opacity-[0.07] aqua-gradient" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent text-primary text-xs font-semibold mb-6 border border-primary/20">
            <Star className="w-3 h-3 fill-current" />
            Trusted by 1,200+ organisations worldwide
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight tracking-tight max-w-4xl mx-auto">
            HR management that works{' '}
            <span className="text-primary">as hard as you do</span>
          </h1>

          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            AQUA SUITE brings your entire HR operation — hiring, payroll, leave, and performance — under one intuitive platform. Built for modern, growing teams.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-white font-semibold aqua-gradient rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-primary/20 text-sm"
            >
              Start free trial <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-foreground font-semibold border border-border rounded-xl hover:bg-muted transition-colors text-sm"
            >
              Sign in to your account
            </Link>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            14-day free trial · No credit card required · Cancel anytime
          </p>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────────────────── */}
      <section className="border-y border-border bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-extrabold text-primary">{s.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-foreground">Everything your HR team needs</h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            One platform, every workflow — from your first hire to your thousandth.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="stat-card group">
              <div className="w-11 h-11 rounded-xl aqua-gradient flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform duration-200">
                <f.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-foreground mb-1.5">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────────── */}
      <section className="bg-white border-y border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-foreground">Loved by HR teams everywhere</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="rounded-2xl border border-border p-6 hover:shadow-md transition-shadow">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-foreground leading-relaxed mb-5">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full aqua-gradient flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {t.initials}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="relative overflow-hidden rounded-3xl aqua-gradient p-10 text-center text-white shadow-xl">
          <div className="absolute top-[-60px] right-[-60px] w-64 h-64 rounded-full bg-white/10" />
          <div className="absolute bottom-[-40px] left-[-40px] w-48 h-48 rounded-full bg-white/10" />
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-3">Ready to transform your HR?</h2>
            <p className="text-white/80 mb-8 max-w-lg mx-auto">
              Join thousands of companies that run their people operations on AQUA SUITE.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-primary font-semibold rounded-xl hover:bg-white/90 transition-colors text-sm shadow-sm"
              >
                Start free trial <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 border border-white/40 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors text-sm"
              >
                Talk to sales
              </Link>
            </div>
            <div className="mt-6 flex items-center justify-center gap-6 flex-wrap">
              {['No credit card needed', '14-day free trial', 'Cancel anytime'].map((item) => (
                <div key={item} className="flex items-center gap-1.5 text-sm text-white/80">
                  <CheckCircle2 className="w-4 h-4 text-white/60" /> {item}
                </div>
              ))}
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
            <Link href="/about" className="hover:text-foreground transition-colors">About</Link>
            <Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link>
            <Link href="/login" className="hover:text-foreground transition-colors">Sign in</Link>
          </div>
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} AQUA SUITE. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
