'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2, Building2, ChevronDown } from 'lucide-react'

const DEMO_TENANTS = [
  { id: 'acme-corp', name: 'Acme Corporation', domain: 'acme.aqua-shell.io', logo: '🏢' },
  { id: 'techwave', name: 'TechWave Solutions', domain: 'techwave.aqua-shell.io', logo: '🚀' },
  { id: 'horizon-health', name: 'Horizon Health', domain: 'horizon.aqua-shell.io', logo: '🏥' },
  { id: 'greenfield', name: 'Greenfield Ltd', domain: 'greenfield.aqua-shell.io', logo: '🌿' },
]

export default function LoginPage() {
  const router = useRouter()
  const [step, setStep] = useState<'tenant' | 'credentials'>('tenant')
  const [selectedTenant, setSelectedTenant] = useState(DEMO_TENANTS[0])
  const [showTenantDropdown, setShowTenantDropdown] = useState(false)
  const [customDomain, setCustomDomain] = useState('')
  const [email, setEmail] = useState('admin@acme.com')
  const [password, setPassword] = useState('password')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleTenantContinue = () => {
    if (!selectedTenant) {
      setError('Please select your organization')
      return
    }
    setError('')
    setStep('credentials')
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Simulate auth
    await new Promise((r) => setTimeout(r, 1500))

    if (email && password) {
      router.push('/dashboard')
    } else {
      setError('Invalid credentials. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="animate-fade-in">
      {step === 'tenant' ? (
        <>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground">Select your organization</h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Choose your workspace or enter a custom domain to continue.
            </p>
          </div>

          <div className="space-y-4">
            {/* Tenant selector */}
            <div className="relative">
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Organization
              </label>
              <button
                type="button"
                onClick={() => setShowTenantDropdown(!showTenantDropdown)}
                className="w-full flex items-center justify-between px-4 py-3 border border-input rounded-lg bg-white text-sm hover:border-primary/50 transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{selectedTenant.logo}</span>
                  <div className="text-left">
                    <div className="font-medium text-foreground">{selectedTenant.name}</div>
                    <div className="text-xs text-muted-foreground">{selectedTenant.domain}</div>
                  </div>
                </div>
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${showTenantDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showTenantDropdown && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-border rounded-lg shadow-lg overflow-hidden">
                  {DEMO_TENANTS.map((tenant) => (
                    <button
                      key={tenant.id}
                      type="button"
                      onClick={() => {
                        setSelectedTenant(tenant)
                        setShowTenantDropdown(false)
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-muted transition-colors text-left ${selectedTenant.id === tenant.id ? 'bg-accent/50' : ''
                        }`}
                    >
                      <span className="text-xl">{tenant.logo}</span>
                      <div>
                        <div className="font-medium text-foreground">{tenant.name}</div>
                        <div className="text-xs text-muted-foreground">{tenant.domain}</div>
                      </div>
                      {selectedTenant.id === tenant.id && (
                        <div className="ml-auto w-2 h-2 rounded-full bg-primary" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground">or use custom domain</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Custom domain
              </label>
              <div className="flex items-center border border-input rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-ring bg-white">
                <div className="flex items-center gap-2 px-3 border-r border-input bg-muted/30 py-2.5">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                </div>
                <input
                  type="text"
                  value={customDomain}
                  onChange={(e) => setCustomDomain(e.target.value)}
                  placeholder="yourcompany.aqua-shell.io"
                  className="flex-1 px-3 py-2.5 text-sm bg-transparent outline-none"
                />
              </div>
            </div>

            {error && (
              <div className="bg-destructive/10 text-destructive text-sm px-4 py-2.5 rounded-lg">
                {error}
              </div>
            )}

            <button
              onClick={handleTenantContinue}
              className="w-full py-3 px-4 aqua-gradient text-white font-semibold rounded-lg hover:opacity-90 transition-opacity text-sm"
            >
              Continue →
            </button>

            <p className="text-center text-xs text-muted-foreground">
              New to AQUA HRMS?{' '}
              <Link href="/register" className="text-primary font-medium hover:underline">
                Start free trial
              </Link>
            </p>
          </div>
        </>
      ) : (
        <>
          <button
            onClick={() => setStep('tenant')}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            ← Back to organizations
          </button>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-xl">
                {selectedTenant.logo}
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Signing into</div>
                <div className="font-semibold text-foreground">{selectedTenant.name}</div>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-foreground">Welcome back</h2>
            <p className="text-muted-foreground mt-1 text-sm">Enter your credentials to access your account.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                className="w-full px-4 py-2.5 border border-input rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-foreground">Password</label>
                <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-2.5 pr-10 border border-input rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" id="remember" className="rounded border-input accent-primary" />
              <label htmlFor="remember" className="text-sm text-muted-foreground">
                Keep me signed in for 30 days
              </label>
            </div>

            {error && (
              <div className="bg-destructive/10 text-destructive text-sm px-4 py-2.5 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 aqua-gradient text-white font-semibold rounded-lg hover:opacity-90 disabled:opacity-70 transition-opacity text-sm flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                'Sign in to AQUA HRMS'
              )}
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground">or</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <button
              type="button"
              className="w-full py-2.5 px-4 border border-input rounded-lg text-sm font-medium text-foreground hover:bg-muted flex items-center justify-center gap-3 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google SSO
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            By signing in, you agree to AQUA HRMS{' '}
            <Link href="/terms" className="text-primary hover:underline">Terms</Link> and{' '}
            <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
          </p>
        </>
      )}
    </div>
  )
}
