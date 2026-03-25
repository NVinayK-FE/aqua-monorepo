'use client'

import { useState } from 'react'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import {
  Building2, CreditCard, Users, TrendingUp, TrendingDown,
  Activity, Globe, AlertCircle, CheckCircle2, Clock,
  MoreHorizontal, Search, ArrowUpRight,
} from 'lucide-react'

// ─── Mock data ────────────────────────────────────────────────────────────────

const MRR_TREND = [
  { month: 'Oct', mrr: 142000, tenants: 1180 },
  { month: 'Nov', mrr: 148000, tenants: 1195 },
  { month: 'Dec', mrr: 151000, tenants: 1205 },
  { month: 'Jan', mrr: 156000, tenants: 1218 },
  { month: 'Feb', mrr: 162000, tenants: 1231 },
  { month: 'Mar', mrr: 169000, tenants: 1247 },
]

const PLAN_DIST = [
  { name: 'Starter',    value: 612, color: '#b2ebf2', mrr: 5508  },
  { name: 'Growth',     value: 498, color: '#00bcd4', mrr: 9462  },
  { name: 'Enterprise', value: 137, color: '#006064', mrr: 41100 },
]

const TENANT_STATUS = [
  { status: 'Active',      count: 893, color: '#10b981' },
  { status: 'Free Trial',  count: 354, color: '#f59e0b' },
  { status: 'Suspended',   count: 21,  color: '#ef4444' },
  { status: 'Churned',     count: 0,   color: '#9ca3af' },
]

const RECENT_TENANTS = [
  { id: 'T-1247', name: 'NovaTech Inc.',        plan: 'Growth',     employees: 120, status: 'trial',    joined: '2026-03-22', mrr: 1900  },
  { id: 'T-1246', name: 'BlueSky Analytics',    plan: 'Starter',    employees: 18,  status: 'active',   joined: '2026-03-20', mrr: 162   },
  { id: 'T-1245', name: 'Meridian Health',       plan: 'Enterprise', employees: 540, status: 'active',   joined: '2026-03-18', mrr: 10800 },
  { id: 'T-1244', name: 'Apex Logistics',        plan: 'Growth',     employees: 95,  status: 'active',   joined: '2026-03-15', mrr: 1805  },
  { id: 'T-1243', name: 'Sunrise Education',     plan: 'Starter',    employees: 34,  status: 'trial',    joined: '2026-03-14', mrr: 0     },
  { id: 'T-1242', name: 'Peak Performance Ltd',  plan: 'Growth',     employees: 210, status: 'active',   joined: '2026-03-10', mrr: 3990  },
  { id: 'T-1241', name: 'CloudBridge Systems',   plan: 'Enterprise', employees: 820, status: 'active',   joined: '2026-03-08', mrr: 16400 },
]

const PLAN_COLOR: Record<string, string> = {
  Starter:    'bg-cyan-100 text-cyan-700',
  Growth:     'bg-primary/10 text-primary',
  Enterprise: 'bg-teal-900/10 text-teal-800',
}

const STATUS_CONF: Record<string, { label: string; cls: string }> = {
  active:    { label: 'Active',    cls: 'badge-active'   },
  trial:     { label: 'Trial',     cls: 'badge-pending'  },
  suspended: { label: 'Suspended', cls: 'badge-rejected' },
}

function fmt(n: number) {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`
  if (n >= 1000)    return `$${(n / 1000).toFixed(0)}K`
  return `$${n}`
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminDashboardPage() {
  const [search, setSearch] = useState('')

  const filtered = RECENT_TENANTS.filter(
    (t) =>
      !search ||
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.plan.toLowerCase().includes(search.toLowerCase())
  )

  const totalMRR    = MRR_TREND[MRR_TREND.length - 1].mrr
  const prevMRR     = MRR_TREND[MRR_TREND.length - 2].mrr
  const mrrGrowth   = (((totalMRR - prevMRR) / prevMRR) * 100).toFixed(1)
  const totalTenants = MRR_TREND[MRR_TREND.length - 1].tenants
  const prevTenants  = MRR_TREND[MRR_TREND.length - 2].tenants

  return (
    <div className="flex flex-col flex-1">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-5 border-b border-border bg-white">
        <div>
          <h1 className="text-xl font-bold text-foreground">Platform Overview</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Real-time metrics across all tenants — March 2026</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
            <Activity className="w-3 h-3" /> All systems operational
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-6">

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: 'Monthly Recurring Revenue',
              value: fmt(totalMRR),
              sub: `+${mrrGrowth}% vs last month`,
              icon: TrendingUp,
              color: 'text-emerald-600', bg: 'bg-emerald-50', positive: true,
            },
            {
              label: 'Total Tenants',
              value: totalTenants.toLocaleString(),
              sub: `+${totalTenants - prevTenants} this month`,
              icon: Building2,
              color: 'text-cyan-600', bg: 'bg-cyan-50', positive: true,
            },
            {
              label: 'Active Subscriptions',
              value: '893',
              sub: '72% of total tenants',
              icon: CreditCard,
              color: 'text-blue-600', bg: 'bg-blue-50', positive: true,
            },
            {
              label: 'Free Trials Active',
              value: '354',
              sub: '28% conversion target',
              icon: Clock,
              color: 'text-amber-600', bg: 'bg-amber-50', positive: null,
            },
          ].map((c) => (
            <div key={c.label} className="stat-card">
              <div className="flex items-start justify-between mb-3">
                <p className="text-xs text-muted-foreground leading-tight">{c.label}</p>
                <div className={`w-9 h-9 rounded-xl ${c.bg} flex items-center justify-center flex-shrink-0`}>
                  <c.icon className={`w-4.5 h-4.5 ${c.color}`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground">{c.value}</p>
              <p className={`text-xs mt-1 flex items-center gap-1 ${c.positive === true ? 'text-emerald-600' : 'text-muted-foreground'}`}>
                {c.positive === true && <ArrowUpRight className="w-3 h-3" />}
                {c.sub}
              </p>
            </div>
          ))}
        </div>

        {/* Secondary KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Avg Employees / Tenant', value: '48', icon: Users,       color: 'text-purple-600', bg: 'bg-purple-50' },
            { label: 'Churn Rate (30d)',        value: '1.8%', icon: TrendingDown, color: 'text-rose-600',  bg: 'bg-rose-50'   },
            { label: 'Total Employees Managed', value: '59,856', icon: Globe,      color: 'text-teal-600',  bg: 'bg-teal-50'   },
            { label: 'Support Tickets Open',    value: '14',   icon: AlertCircle, color: 'text-orange-600',bg: 'bg-orange-50' },
          ].map((c) => (
            <div key={c.label} className="stat-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{c.label}</p>
                  <p className="text-xl font-bold text-foreground mt-0.5">{c.value}</p>
                </div>
                <div className={`w-9 h-9 rounded-xl ${c.bg} flex items-center justify-center flex-shrink-0`}>
                  <c.icon className={`w-4.5 h-4.5 ${c.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* MRR trend */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-border p-5 shadow-sm">
            <div className="mb-4">
              <h3 className="font-semibold text-foreground">MRR Growth</h3>
              <p className="text-xs text-muted-foreground">Monthly recurring revenue over the last 6 months</p>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={MRR_TREND}>
                <defs>
                  <linearGradient id="mrrGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#00bcd4" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#00bcd4" stopOpacity={0}    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
                <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, 'MRR']} />
                <Area type="monotone" dataKey="mrr" name="MRR"
                  stroke="#00bcd4" strokeWidth={2.5} fill="url(#mrrGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Plan distribution */}
          <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
            <div className="mb-4">
              <h3 className="font-semibold text-foreground">Plans</h3>
              <p className="text-xs text-muted-foreground">Tenants by subscription plan</p>
            </div>
            <ResponsiveContainer width="100%" height={140}>
              <PieChart>
                <Pie data={PLAN_DIST} cx="50%" cy="50%" innerRadius={40} outerRadius={60}
                  dataKey="value" paddingAngle={3}>
                  {PLAN_DIST.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v, n) => [`${v} tenants`, n]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2.5 mt-2">
              {PLAN_DIST.map((p) => (
                <div key={p.name} className="flex items-center gap-2 text-xs">
                  <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: p.color }} />
                  <span className="text-muted-foreground flex-1">{p.name}</span>
                  <span className="font-semibold text-foreground">{p.value}</span>
                  <span className="text-muted-foreground">{fmt(p.mrr)}/mo</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Status breakdown */}
        <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
          <div className="mb-4">
            <h3 className="font-semibold text-foreground">Tenant Status Breakdown</h3>
            <p className="text-xs text-muted-foreground">Distribution of tenant account statuses</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {TENANT_STATUS.map((s) => (
              <div key={s.status} className="flex items-center gap-3 p-4 rounded-xl border border-border">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: s.color + '20' }}>
                  <CheckCircle2 className="w-5 h-5" style={{ color: s.color }} />
                </div>
                <div>
                  <div className="text-lg font-bold text-foreground">{s.count}</div>
                  <div className="text-xs text-muted-foreground">{s.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent tenants table */}
        <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <div>
              <h3 className="font-semibold text-foreground">Recent Tenants</h3>
              <p className="text-xs text-muted-foreground">Latest organisations to join the platform</p>
            </div>
            <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2 w-52">
              <Search className="w-3.5 h-3.5 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tenants…"
                className="bg-transparent text-xs outline-none flex-1"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full data-table">
              <thead>
                <tr>
                  <th className="text-left px-6 py-3">Tenant</th>
                  <th className="text-left px-4 py-3">Plan</th>
                  <th className="text-right px-4 py-3">Employees</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-right px-4 py-3">MRR</th>
                  <th className="text-left px-4 py-3">Joined</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => (
                  <tr key={t.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg aqua-gradient flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {t.name[0]}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{t.name}</p>
                          <p className="text-xs text-muted-foreground">{t.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${PLAN_COLOR[t.plan]}`}>
                        {t.plan}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right text-sm font-medium text-foreground">{t.employees}</td>
                    <td className="px-4 py-4">
                      <span className={STATUS_CONF[t.status].cls}>{STATUS_CONF[t.status].label}</span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <span className={`text-sm font-semibold ${t.mrr === 0 ? 'text-muted-foreground' : 'text-foreground'}`}>
                        {t.mrr === 0 ? '—' : fmt(t.mrr)}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-muted-foreground">
                      {new Date(t.joined).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-4">
                      <button className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}
