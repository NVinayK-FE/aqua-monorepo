'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Eye, EyeOff, Loader2, Check, Building2, Users, ChevronDown,
  Briefcase, ArrowRight, Sparkles, ShieldCheck
} from 'lucide-react'

// ─── Data ────────────────────────────────────────────────────────────────────

const INDUSTRIES = [
  'Technology', 'Healthcare', 'Finance & Banking', 'Education',
  'Retail & E-commerce', 'Manufacturing', 'Consulting', 'Real Estate',
  'Media & Entertainment', 'Other',
]

const COMPANY_SIZES = [
  { label: '1–10 employees', value: '1-10' },
  { label: '11–50 employees', value: '11-50' },
  { label: '51–200 employees', value: '51-200' },
  { label: '201–500 employees', value: '201-500' },
  { label: '500+ employees', value: '500+' },
]

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: '$9',
    per: 'per user / mo',
    description: 'Perfect for small teams just getting started.',
    features: ['Up to 25 employees', 'Core HR & Attendance', 'Leave management', 'Basic reporting', 'Email support'],
    highlight: false,
  },
  {
    id: 'growth',
    name: 'Growth',
    price: '$19',
    per: 'per user / mo',
    description: 'For growing teams that need more power.',
    features: ['Up to 200 employees', 'Everything in Starter', 'Payroll processing', 'Performance reviews', 'Priority support'],
    highlight: true,
    badge: 'Most Popular',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Custom',
    per: 'contact sales',
    description: 'For large organisations with advanced needs.',
    features: ['Unlimited employees', 'Everything in Growth', 'Multi-tenant SSO', 'Custom integrations', 'Dedicated CSM'],
    highlight: false,
  },
]

// ─── Step indicator ───────────────────────────────────────────────────────────

function StepDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
              i < current
                ? 'aqua-gradient text-white'
                : i === current
                ? 'border-2 border-primary text-primary'
                : 'border-2 border-border text-muted-foreground'
            }`}
          >
            {i < current ? <Check className="w-3.5 h-3.5" /> : i + 1}
          </div>
          {i < total - 1 && (
            <div className={`h-0.5 w-8 rounded transition-all duration-300 ${i < current ? 'bg-primary' : 'bg-border'}`} />
          )}
        </div>
      ))}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function RegisterPage() {
  const router = useRouter()

  // Step 0 = Company, 1 = Account, 2 = Plan, 3 = Success
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)

  // Step 0 — Company
  const [companyName, setCompanyName] = useState('')
  const [industry, setIndustry] = useState('')
  const [showIndustry, setShowIndustry] = useState(false)
  const [companySize, setCompanySize] = useState('')

  // Step 1 — Account
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  // Step 2 — Plan
  const [selectedPlan, setSelectedPlan] = useState('growth')

  const [error, setError] = useState('')

  // ── Helpers ────────────────────────────────────────────────────────────────

  const passwordStrength = (() => {
    if (!password) return 0
    let s = 0
    if (password.length >= 8) s++
    if (/[A-Z]/.test(password)) s++
    if (/[0-9]/.test(password)) s++
    if (/[^A-Za-z0-9]/.test(password)) s++
    return s
  })()

  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][passwordStrength]
  const strengthColor = ['', 'bg-red-400', 'bg-amber-400', 'bg-blue-400', 'bg-emerald-400'][passwordStrength]

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleCompanyNext = () => {
    if (!companyName.trim()) return setError('Please enter your company name.')
    if (!industry) return setError('Please select an industry.')
    if (!companySize) return setError('Please select your company size.')
    setError('')
    setStep(1)
  }

  const handleAccountNext = () => {
    if (!fullName.trim()) return setError('Please enter your full name.')
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError('Please enter a valid email address.')
    if (password.length < 8) return setError('Password must be at least 8 characters.')
    if (password !== confirmPassword) return setError('Passwords do not match.')
    setError('')
    setStep(2)
  }

  const handleStartTrial = async () => {
    setLoading(true)
    setError('')
    await new Promise((r) => setTimeout(r, 1800))
    setLoading(false)
    setStep(3)
  }

  const handleGoToDashboard = () => {
    router.push('/dashboard')
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="animate-fade-in w-full">

      {/* ── Success screen ────────────────────────────────────────────────── */}
      {step === 3 && (
        <div className="text-center space-y-6">
          <div className="w-20 h-20 rounded-full aqua-gradient flex items-center justify-center mx-auto shadow-lg">
            <Check className="w-10 h-10 text-white" strokeWidth={3} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">You're all set, {fullName.split(' ')[0]}!</h2>
            <p className="text-muted-foreground mt-2 text-sm">
              Your 14-day free trial for <strong>{companyName}</strong> is ready. No credit card required.
            </p>
          </div>

          <div className="bg-accent/40 rounded-xl p-4 text-left space-y-2.5">
            {[
              'Access to all features during your trial',
              'Invite your team — up to 25 members free',
              'Dedicated onboarding session available',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 text-sm text-foreground">
                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-primary" />
                </div>
                {item}
              </div>
            ))}
          </div>

          <button
            onClick={handleGoToDashboard}
            className="w-full py-3 px-4 aqua-gradient text-white font-semibold rounded-lg hover:opacity-90 transition-opacity text-sm flex items-center justify-center gap-2"
          >
            Go to your dashboard <ArrowRight className="w-4 h-4" />
          </button>

          <p className="text-xs text-muted-foreground">
            We've sent a confirmation to <strong>{email}</strong>
          </p>
        </div>
      )}

      {/* ── Step 0 — Company info ─────────────────────────────────────────── */}
      {step === 0 && (
        <>
          <StepDots current={0} total={3} />
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground">Set up your workspace</h2>
            <p className="text-muted-foreground mt-1 text-sm">Tell us a bit about your organisation.</p>
          </div>

          <div className="space-y-4">
            {/* Company name */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Company name</label>
              <div className="flex items-center border border-input rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-ring bg-white">
                <div className="flex items-center gap-2 px-3 border-r border-input bg-muted/30 py-2.5">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                </div>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Acme Corporation"
                  className="flex-1 px-3 py-2.5 text-sm bg-transparent outline-none"
                />
              </div>
            </div>

            {/* Industry */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Industry</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowIndustry(!showIndustry)}
                  className="w-full flex items-center justify-between px-4 py-2.5 border border-input rounded-lg bg-white text-sm hover:border-primary/50 transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <span className={industry ? 'text-foreground' : 'text-muted-foreground'}>
                    {industry || 'Select industry'}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${showIndustry ? 'rotate-180' : ''}`} />
                </button>
                {showIndustry && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-border rounded-lg shadow-lg overflow-auto max-h-52">
                    {INDUSTRIES.map((ind) => (
                      <button
                        key={ind}
                        type="button"
                        onClick={() => { setIndustry(ind); setShowIndustry(false) }}
                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-muted transition-colors ${industry === ind ? 'bg-accent/50 text-primary font-medium' : 'text-foreground'}`}
                      >
                        {ind}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Company size */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Company size</label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {COMPANY_SIZES.map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => setCompanySize(s.value)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-xs font-medium transition-all ${
                      companySize === s.value
                        ? 'border-primary bg-accent/40 text-primary'
                        : 'border-input bg-white text-muted-foreground hover:border-primary/40'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5 flex-shrink-0" />
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {error && <div className="bg-destructive/10 text-destructive text-sm px-4 py-2.5 rounded-lg">{error}</div>}

            <button
              onClick={handleCompanyNext}
              className="w-full py-3 px-4 aqua-gradient text-white font-semibold rounded-lg hover:opacity-90 transition-opacity text-sm flex items-center justify-center gap-2"
            >
              Continue <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-center text-xs text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="text-primary font-medium hover:underline">Sign in</Link>
            </p>
          </div>
        </>
      )}

      {/* ── Step 1 — Account details ──────────────────────────────────────── */}
      {step === 1 && (
        <>
          <StepDots current={1} total={3} />
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground">Create your account</h2>
            <p className="text-muted-foreground mt-1 text-sm">You'll use these credentials to sign in.</p>
          </div>

          <div className="space-y-4">
            {/* Full name */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Full name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full px-4 py-2.5 border border-input rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Work email */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Work email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@yourcompany.com"
                className="w-full px-4 py-2.5 border border-input rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  className="w-full px-4 py-2.5 pr-10 border border-input rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {/* Strength meter */}
              {password && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          i <= passwordStrength ? strengthColor : 'bg-muted'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Strength: <span className="font-medium text-foreground">{strengthLabel}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Confirm password</label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className={`w-full px-4 py-2.5 pr-10 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-ring transition-colors ${
                    confirmPassword && confirmPassword !== password ? 'border-destructive' : 'border-input'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                {confirmPassword && confirmPassword === password && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </div>
            </div>

            {error && <div className="bg-destructive/10 text-destructive text-sm px-4 py-2.5 rounded-lg">{error}</div>}

            <button
              onClick={handleAccountNext}
              className="w-full py-3 px-4 aqua-gradient text-white font-semibold rounded-lg hover:opacity-90 transition-opacity text-sm flex items-center justify-center gap-2"
            >
              Continue <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => { setError(''); setStep(0) }}
              className="w-full py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back
            </button>
          </div>
        </>
      )}

      {/* ── Step 2 — Plan selection ───────────────────────────────────────── */}
      {step === 2 && (
        <>
          <StepDots current={2} total={3} />
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground">Choose your plan</h2>
            <p className="text-muted-foreground mt-1 text-sm">
              All plans include a <span className="font-semibold text-primary">14-day free trial</span>. No credit card needed.
            </p>
          </div>

          <div className="space-y-3">
            {PLANS.map((plan) => (
              <button
                key={plan.id}
                type="button"
                onClick={() => setSelectedPlan(plan.id)}
                className={`w-full text-left rounded-xl border-2 p-4 transition-all duration-200 ${
                  selectedPlan === plan.id
                    ? 'border-primary bg-accent/30 shadow-sm'
                    : 'border-border bg-white hover:border-primary/40'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-semibold text-foreground text-sm">{plan.name}</span>
                      {plan.badge && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full aqua-gradient text-white">
                          {plan.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{plan.description}</p>
                    <div className="flex flex-wrap gap-x-3 gap-y-1">
                      {plan.features.slice(0, 3).map((f) => (
                        <span key={f} className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Check className="w-3 h-3 text-primary flex-shrink-0" /> {f}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="font-bold text-foreground text-base">{plan.price}</div>
                    <div className="text-[10px] text-muted-foreground whitespace-nowrap">{plan.per}</div>
                  </div>
                </div>

                {/* Selection indicator */}
                <div className={`mt-3 flex items-center gap-2 ${selectedPlan === plan.id ? '' : 'opacity-0'}`}>
                  <div className="w-4 h-4 rounded-full border-2 border-primary flex items-center justify-center flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  <span className="text-xs text-primary font-medium">Selected — free for 14 days</span>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-5 flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg px-4 py-3">
            <ShieldCheck className="w-4 h-4 text-primary flex-shrink-0" />
            No credit card required. Cancel anytime during your trial.
          </div>

          {error && <div className="mt-3 bg-destructive/10 text-destructive text-sm px-4 py-2.5 rounded-lg">{error}</div>}

          <button
            onClick={handleStartTrial}
            disabled={loading}
            className="mt-4 w-full py-3 px-4 aqua-gradient text-white font-semibold rounded-lg hover:opacity-90 disabled:opacity-70 transition-opacity text-sm flex items-center justify-center gap-2"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Setting up your workspace…</>
            ) : (
              <><Sparkles className="w-4 h-4" /> Start your free trial</>
            )}
          </button>

          <button
            onClick={() => { setError(''); setStep(1) }}
            className="w-full mt-2 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back
          </button>
        </>
      )}
    </div>
  )
}
