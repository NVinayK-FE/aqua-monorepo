'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  CreditCard, Users, Calendar, CheckCircle2, Zap, Shield, Star,
  ArrowUpRight, Download, RefreshCw, Lock, Check, ChevronRight,
} from 'lucide-react'
import { formatCurrency, formatDate, calculatePercentage } from '@/lib/utils'

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: 4,
    unit: 'per employee/month',
    maxEmployees: 50,
    color: 'from-slate-500 to-slate-600',
    badgeColor: 'bg-slate-100 text-slate-700',
    features: [
      'Up to 50 employees',
      'Employee profiles & org chart',
      'Basic leave management',
      'Payroll processing',
      'Standard reports',
      'Email support',
    ],
    missing: ['Performance reviews', 'Custom roles & permissions', 'API access', 'Dedicated CSM'],
  },
  {
    id: 'pro',
    name: 'Professional',
    price: 8,
    unit: 'per employee/month',
    maxEmployees: 500,
    color: 'from-cyan-500 to-teal-600',
    badgeColor: 'bg-cyan-100 text-cyan-700',
    highlight: true,
    features: [
      'Up to 500 employees',
      'Everything in Starter',
      'Performance & appraisals',
      'Advanced analytics',
      'Custom roles & permissions',
      'Priority email & chat support',
      'SAML SSO',
      'API access (10K calls/day)',
    ],
    missing: ['Unlimited employees', 'Dedicated CSM', 'Custom integrations'],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 15,
    unit: 'per employee/month',
    maxEmployees: 999999,
    color: 'from-violet-600 to-indigo-700',
    badgeColor: 'bg-violet-100 text-violet-700',
    features: [
      'Unlimited employees',
      'Everything in Professional',
      'Dedicated Customer Success Manager',
      'Custom integrations & workflows',
      'Unlimited API access',
      'SLA 99.99% uptime guarantee',
      'On-premise deployment option',
      '24/7 phone & priority support',
      'Custom data retention policies',
    ],
    missing: [],
  },
]

const BILLING_HISTORY = [
  { date: '2025-03-01', amount: 1408, description: 'Pro Plan — 176 employees', status: 'paid', invoice: 'INV-2503-001' },
  { date: '2025-02-01', amount: 1392, description: 'Pro Plan — 174 employees', status: 'paid', invoice: 'INV-2502-001' },
  { date: '2025-01-01', amount: 1376, description: 'Pro Plan — 172 employees', status: 'paid', invoice: 'INV-2501-001' },
  { date: '2024-12-01', amount: 1368, description: 'Pro Plan — 171 employees', status: 'paid', invoice: 'INV-2412-001' },
  { date: '2024-11-01', amount: 1352, description: 'Pro Plan — 169 employees', status: 'paid', invoice: 'INV-2411-001' },
]

export default function LicensingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly')
  const currentPlan = PLANS[1] // Pro
  const usedSeats = 176
  const maxSeats = 500
  const usagePercent = calculatePercentage(usedSeats, maxSeats)

  const getDisplayPrice = (price: number) => {
    if (billingCycle === 'annual') return (price * 0.8).toFixed(0)
    return price
  }

  return (
    <div className="flex flex-col flex-1">
      <Header
        title="Licensing & Billing"
        subtitle="Manage your AQUA HRMS subscription, seats, and billing"
      />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Current plan summary */}
        <Card className="border-primary/20 bg-gradient-to-br from-cyan-50 to-teal-50/50">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl aqua-gradient flex items-center justify-center flex-shrink-0">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-foreground">Professional Plan</h2>
                    <span className="badge-approved">Active</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    acme.aqua-shell.io · Renews April 1, 2026
                  </p>
                </div>
              </div>

              <div className="flex-1 grid grid-cols-3 gap-4">
                {[
                  { label: 'Seats Used', value: `${usedSeats} / ${maxSeats}` },
                  { label: 'Monthly Cost', value: formatCurrency(usedSeats * 8) },
                  { label: 'Contract', value: 'Monthly' },
                ].map((item) => (
                  <div key={item.label} className="text-center bg-white/60 rounded-xl p-3">
                    <p className="text-lg font-bold text-foreground">{item.value}</p>
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-2 flex-shrink-0">
                <Button size="sm">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  Upgrade Plan
                </Button>
                <Button variant="outline" size="sm">
                  Manage Subscription
                </Button>
              </div>
            </div>

            {/* Seat usage */}
            <div className="mt-6 bg-white/60 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">Seat Utilization</span>
                </div>
                <span className="text-sm text-muted-foreground">{usedSeats} of {maxSeats} seats used ({usagePercent}%)</span>
              </div>
              <Progress value={usagePercent} className="h-3" />
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-muted-foreground">
                  {maxSeats - usedSeats} seats available to add more employees
                </p>
                <Button variant="ghost" size="sm" className="text-xs h-7">
                  <Plus className="w-3 h-3" />
                  Add seats
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Plan comparison */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-foreground">Available Plans</h3>
              <p className="text-sm text-muted-foreground">Choose the right plan for your organization</p>
            </div>
            {/* Billing toggle */}
            <div className="flex items-center gap-3 bg-muted rounded-xl p-1">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${billingCycle === 'monthly' ? 'bg-white shadow-sm text-foreground' : 'text-muted-foreground'
                  }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${billingCycle === 'annual' ? 'bg-white shadow-sm text-foreground' : 'text-muted-foreground'
                  }`}
              >
                Annual
                <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full font-semibold">
                  -20%
                </span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`rounded-2xl border-2 overflow-hidden transition-all ${plan.id === 'pro'
                    ? 'border-primary shadow-lg scale-[1.02]'
                    : 'border-border hover:border-primary/30'
                  }`}
              >
                {/* Plan header */}
                <div className={`bg-gradient-to-br ${plan.color} p-5 text-white`}>
                  {plan.highlight && (
                    <div className="inline-flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-full text-xs font-medium mb-2">
                      <Star className="w-3 h-3" />
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-lg font-bold">{plan.name}</h3>
                  <div className="mt-2">
                    <span className="text-3xl font-extrabold">${getDisplayPrice(plan.price)}</span>
                    <span className="text-sm text-white/80 ml-1">{plan.unit}</span>
                  </div>
                  {billingCycle === 'annual' && (
                    <p className="text-xs text-white/70 mt-1">Billed annually · Save 20%</p>
                  )}
                </div>

                {/* Features */}
                <div className="p-5 bg-white flex-1 flex flex-col gap-4">
                  <ul className="space-y-2">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm text-foreground">
                        <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        {feature}
                      </li>
                    ))}
                    {plan.missing.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm text-muted-foreground/60">
                        <div className="w-4 h-4 flex-shrink-0 mt-0.5 flex items-center justify-center">
                          <div className="w-2.5 h-px bg-muted-foreground/30 rounded" />
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button
                    className="w-full mt-auto"
                    variant={plan.id === 'pro' ? 'default' : 'outline'}
                    disabled={plan.id === 'pro'}
                  >
                    {plan.id === 'pro' ? 'Current Plan' :
                      plan.id === 'enterprise' ? 'Contact Sales' : 'Downgrade'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Billing history */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Billing History</CardTitle>
                <CardDescription>All invoices and payments</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Download className="w-3.5 h-3.5" />
                Export All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full data-table">
              <thead>
                <tr>
                  <th className="text-left px-6 py-3">Invoice</th>
                  <th className="text-left px-4 py-3">Date</th>
                  <th className="text-left px-4 py-3">Description</th>
                  <th className="text-right px-4 py-3">Amount</th>
                  <th className="text-center px-4 py-3">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {BILLING_HISTORY.map((item) => (
                  <tr key={item.invoice} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-sm text-foreground">{item.invoice}</td>
                    <td className="px-4 py-4 text-sm text-muted-foreground">{formatDate(item.date)}</td>
                    <td className="px-4 py-4 text-sm text-foreground">{item.description}</td>
                    <td className="px-4 py-4 text-right font-semibold text-foreground">{formatCurrency(item.amount)}</td>
                    <td className="px-4 py-4 text-center">
                      <span className="badge-approved">{item.status}</span>
                    </td>
                    <td className="px-4 py-4">
                      <button className="flex items-center gap-1 text-xs text-primary hover:underline">
                        <Download className="w-3.5 h-3.5" />
                        PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Security & compliance */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: Shield,
              title: 'SOC 2 Type II',
              desc: 'AQUA HRMS is SOC 2 Type II certified. Your data is encrypted at rest and in transit.',
              badge: 'Certified',
              color: 'text-emerald-600',
              bg: 'bg-emerald-50',
            },
            {
              icon: Lock,
              title: 'GDPR Compliant',
              desc: 'Full GDPR compliance with data processing agreements and right-to-be-forgotten support.',
              badge: 'Compliant',
              color: 'text-blue-600',
              bg: 'bg-blue-50',
            },
            {
              icon: RefreshCw,
              title: 'Auto Renewal',
              desc: 'Your Pro plan auto-renews monthly. Cancel anytime with 30-day notice period.',
              badge: 'Active',
              color: 'text-purple-600',
              bg: 'bg-purple-50',
            },
          ].map((item) => (
            <Card key={item.title}>
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center flex-shrink-0`}>
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-semibold text-foreground">{item.title}</h4>
                      <span className="badge-approved text-[10px] px-1.5 py-0.5">{item.badge}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

function Plus({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  )
}
