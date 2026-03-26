'use client'

import { useState, useMemo } from 'react'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import {
  Building2, CreditCard, TrendingUp, TrendingDown,
  Activity, Globe, AlertCircle, CheckCircle2, Clock,
  MoreHorizontal, Search, ArrowUpRight, Users,
  UserCheck, Briefcase, BookOpen, ShoppingBag, Filter, X,
} from 'lucide-react'
import {
  AQUA_PRODUCTS, ADMIN_TENANTS, ADMIN_USERS, ADMIN_SUBSCRIPTIONS,
  PLAN_BADGE, STATUS_BADGE, fmtMoney, fmtDate,
  type AquaProductId,
} from '@/lib/admin-data'
import { useAdminFilter } from '@/lib/admin-filter-context'

// ─── Product icon map ─────────────────────────────────────────────────────────

const PRODUCT_ICONS: Record<AquaProductId, React.ElementType> = {
  hr:    UserCheck,
  crm:   Briefcase,
  books: BookOpen,
  store: ShoppingBag,
}

// ─── Plan colours (stable) ───────────────────────────────────────────────────

const PLAN_COLORS: Record<string, string> = {
  Starter:    '#b2ebf2',
  Growth:     '#00bcd4',
  Enterprise: '#006064',
}

// ─── Full-platform baseline trend (for "All" view + scaling) ─────────────────

const BASE_MRR_TREND = [
  { month: 'Oct', mrr: 142000, tenants: 1180 },
  { month: 'Nov', mrr: 148000, tenants: 1195 },
  { month: 'Dec', mrr: 151000, tenants: 1205 },
  { month: 'Jan', mrr: 156000, tenants: 1218 },
  { month: 'Feb', mrr: 162000, tenants: 1231 },
  { month: 'Mar', mrr: 169000, tenants: 1247 },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)     return `$${(n / 1_000).toFixed(0)}K`
  return `$${n}`
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminDashboardPage() {
  const [search, setSearch] = useState('')
  const { productFilter, setProductFilter } = useAdminFilter()

  // ── Scoped tenants / users / subs ─────────────────────────────────────────
  const scopedTenants = useMemo(
    () => productFilter === 'all'
      ? ADMIN_TENANTS
      : ADMIN_TENANTS.filter((t) => t.products.includes(productFilter)),
    [productFilter]
  )

  const scopedUserCount = useMemo(
    () => ADMIN_USERS.filter((u) => scopedTenants.some((t) => t.id === u.tenantId)).length,
    [scopedTenants]
  )

  const scopedSubIds = useMemo(
    () => new Set(scopedTenants.map((t) => t.id)),
    [scopedTenants]
  )
  const scopedSubs = useMemo(
    () => ADMIN_SUBSCRIPTIONS.filter((s) => scopedSubIds.has(s.tenantId)),
    [scopedSubIds]
  )

  const activeProductMeta = productFilter !== 'all'
    ? AQUA_PRODUCTS.find((p) => p.id === productFilter) ?? null
    : null

  // ── Live KPIs from scoped data ────────────────────────────────────────────
  const scopedMRR      = scopedTenants.reduce((a, t) => a + t.mrr, 0)
  const scopedActive   = scopedTenants.filter((t) => t.status === 'active').length
  const scopedTrials   = scopedTenants.filter((t) => t.status === 'trial').length
  const scopedSuspended = scopedTenants.filter((t) => t.status === 'suspended').length
  const scopedCancelled = scopedTenants.filter((t) => t.status === 'cancelled').length
  const scopedTenantCt = scopedTenants.length
  const scopedEmployees = scopedTenants.reduce((a, t) => a + t.employees, 0)
  const avgEmployees   = scopedTenantCt > 0 ? Math.round(scopedEmployees / scopedTenantCt) : 0
  const scopedPastDue  = scopedSubs.filter((s) => s.status === 'past_due').length

  // ── MRR trend — scale global trend by scoped/total ratio ─────────────────
  const totalBaseMRR = BASE_MRR_TREND[BASE_MRR_TREND.length - 1].mrr
  const mrrTrend = useMemo(() => {
    if (productFilter === 'all') return BASE_MRR_TREND
    const ratio = totalBaseMRR > 0 ? scopedMRR / totalBaseMRR : 0
    // Apply a slight ramp so earlier months are proportionally lower
    return BASE_MRR_TREND.map((d, i) => ({
      ...d,
      mrr:     Math.round(d.mrr     * ratio * (0.82 + i * 0.036)),
      tenants: Math.round(d.tenants * (scopedTenantCt / 1247) * (0.82 + i * 0.036)),
    }))
  }, [productFilter, scopedMRR, scopedTenantCt])

  const latestMRR  = mrrTrend[mrrTrend.length - 1].mrr
  const prevMRR    = mrrTrend[mrrTrend.length - 2].mrr
  const mrrGrowth  = prevMRR > 0 ? (((latestMRR - prevMRR) / prevMRR) * 100).toFixed(1) : '0.0'
  const latestTens = mrrTrend[mrrTrend.length - 1].tenants
  const prevTens   = mrrTrend[mrrTrend.length - 2].tenants

  // ── Plan breakdown from scoped tenants ───────────────────────────────────
  const planDist = useMemo(() =>
    ['Starter', 'Growth', 'Enterprise'].map((p) => {
      const ts = scopedTenants.filter((t) => t.plan === p)
      return {
        name:  p,
        value: ts.length,
        color: PLAN_COLORS[p],
        mrr:   ts.reduce((a, t) => a + t.mrr, 0),
      }
    }),
    [scopedTenants]
  )

  // ── Status breakdown from scoped tenants ─────────────────────────────────
  const statusData = [
    { status: 'Active',     count: scopedActive,    color: '#10b981' },
    { status: 'Free Trial', count: scopedTrials,    color: '#f59e0b' },
    { status: 'Suspended',  count: scopedSuspended, color: '#ef4444' },
    { status: 'Cancelled',  count: scopedCancelled, color: '#9ca3af' },
  ]

  // ── Product adoption bar — highlight selected ─────────────────────────────
  const adoptionChart = AQUA_PRODUCTS.map((p) => {
    const ts = scopedTenants.filter((t) => t.products.includes(p.id))
    return {
      name:    p.name.replace('Aqua ', ''),
      tenants: ts.length,
      color:   p.color,
      id:      p.id,
    }
  })

  // ── Recent tenants ────────────────────────────────────────────────────────
  const recentTenants = useMemo(
    () => [...scopedTenants]
      .sort((a, b) => new Date(b.joined).getTime() - new Date(a.joined).getTime())
      .slice(0, 7),
    [scopedTenants]
  )

  const tableRows = recentTenants.filter(
    (t) => !search ||
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.plan.toLowerCase().includes(search.toLowerCase()) ||
      t.domain.toLowerCase().includes(search.toLowerCase())
  )

  // ── Product strip per-product stats ──────────────────────────────────────
  function productCardStats(id: AquaProductId) {
    const ts  = scopedTenants.filter((t) => t.products.includes(id))
    const usr = ADMIN_USERS.filter((u) => ts.some((t) => t.id === u.tenantId)).length
    return { tenants: ts.length, users: usr, mrr: ts.reduce((a, t) => a + t.mrr, 0) }
  }

  return (
    <div className="flex flex-col flex-1">
      {/* Page header */}
      <div className="flex items-center justify-between px-8 py-5 border-b border-border bg-white">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold text-foreground">
              {activeProductMeta ? `${activeProductMeta.name} Overview` : 'Platform Overview'}
            </h1>
            {activeProductMeta && (
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${activeProductMeta.bg} ${activeProductMeta.textColor} ${activeProductMeta.border}`}
              >
                <Filter className="w-3 h-3" /> Filtered
                <button
                  onClick={() => setProductFilter('all')}
                  className="ml-0.5 hover:opacity-70 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            {activeProductMeta
              ? `${scopedTenantCt} tenants · ${scopedUserCount} users · ${fmt(scopedMRR)} MRR`
              : 'Real-time metrics across all tenants and products — March 2026'}
          </p>
        </div>
        <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
          <Activity className="w-3 h-3" /> All systems operational
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-6">

        {/* ── Primary KPIs ──────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: 'Monthly Recurring Revenue',
              value: fmt(latestMRR),
              sub:   `+${mrrGrowth}% vs last month`,
              icon:  TrendingUp,
              color: 'text-emerald-600', bg: 'bg-emerald-50', positive: true,
            },
            {
              label: 'Total Tenants',
              value: latestTens.toLocaleString(),
              sub:   `+${latestTens - prevTens} this month`,
              icon:  Building2,
              color: 'text-cyan-600', bg: 'bg-cyan-50', positive: true,
            },
            {
              label: 'Active Subscriptions',
              value: String(scopedActive),
              sub:   `${scopedTenantCt > 0 ? Math.round((scopedActive / scopedTenantCt) * 100) : 0}% of tenants`,
              icon:  CreditCard,
              color: 'text-blue-600', bg: 'bg-blue-50', positive: true,
            },
            {
              label: 'Free Trials Active',
              value: String(scopedTrials),
              sub:   '14-day conversion window',
              icon:  Clock,
              color: 'text-amber-600', bg: 'bg-amber-50', positive: null,
            },
          ].map((c) => (
            <div key={c.label} className="stat-card">
              <div className="flex items-start justify-between mb-3">
                <p className="text-xs text-muted-foreground leading-tight">{c.label}</p>
                <div className={`w-9 h-9 rounded-xl ${c.bg} flex items-center justify-center flex-shrink-0`}>
                  <c.icon className={`w-4 h-4 ${c.color}`} />
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

        {/* ── Secondary KPIs ────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: 'Avg Employees / Tenant',
              value: avgEmployees.toLocaleString(),
              icon:  Users, color: 'text-purple-600', bg: 'bg-purple-50',
            },
            {
              label: 'Churn Rate (30d)',
              value: scopedTenantCt > 0 ? `${((scopedCancelled / scopedTenantCt) * 100).toFixed(1)}%` : '0%',
              icon:  TrendingDown, color: 'text-rose-600', bg: 'bg-rose-50',
            },
            {
              label: 'Total Employees Managed',
              value: scopedEmployees.toLocaleString(),
              icon:  Globe, color: 'text-teal-600', bg: 'bg-teal-50',
            },
            {
              label: productFilter === 'all' ? 'Support Tickets Open' : 'Past Due Subscriptions',
              value: productFilter === 'all' ? '14' : String(scopedPastDue),
              icon:  AlertCircle, color: 'text-orange-600', bg: 'bg-orange-50',
            },
          ].map((c) => (
            <div key={c.label} className="stat-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{c.label}</p>
                  <p className="text-xl font-bold text-foreground mt-0.5">{c.value}</p>
                </div>
                <div className={`w-9 h-9 rounded-xl ${c.bg} flex items-center justify-center flex-shrink-0`}>
                  <c.icon className={`w-4 h-4 ${c.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Product adoption strip ────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {AQUA_PRODUCTS.map((product) => {
            const s    = productCardStats(product.id)
            const PIco = PRODUCT_ICONS[product.id]
            const isSelected = productFilter === product.id
            const isDimmed   = productFilter !== 'all' && !isSelected
            return (
              <button
                key={product.id}
                onClick={() => setProductFilter(isSelected ? 'all' : product.id)}
                className={`text-left rounded-xl border-2 p-4 transition-all duration-150 ${
                  isSelected
                    ? `${product.bg} ${product.border} shadow-md scale-[1.02]`
                    : isDimmed
                    ? 'border-border bg-white opacity-40 hover:opacity-70'
                    : `border-border bg-white hover:${product.border} hover:${product.bg}`
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    isSelected ? 'bg-white shadow-sm' : product.bg
                  }`}>
                    <PIco className={`w-4 h-4 ${product.textColor}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-foreground">{product.name}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{product.tagline}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className={`text-lg font-extrabold ${product.textColor}`}>{s.tenants}</p>
                    <p className="text-[10px] text-muted-foreground">Tenants</p>
                  </div>
                  <div>
                    <p className={`text-lg font-extrabold ${product.textColor}`}>{s.users}</p>
                    <p className="text-[10px] text-muted-foreground">Users</p>
                  </div>
                  <div>
                    <p className={`text-lg font-extrabold ${product.textColor}`}>{fmt(s.mrr)}</p>
                    <p className="text-[10px] text-muted-foreground">MRR</p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* ── Charts row ────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* MRR trend */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-border p-5 shadow-sm">
            <div className="mb-4">
              <h3 className="font-semibold text-foreground">MRR Growth</h3>
              <p className="text-xs text-muted-foreground">
                {activeProductMeta
                  ? `${activeProductMeta.name} monthly recurring revenue — last 6 months`
                  : 'Platform-wide monthly recurring revenue — last 6 months'}
              </p>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={mrrTrend}>
                <defs>
                  <linearGradient id="mrrGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={activeProductMeta?.color ?? '#00bcd4'} stopOpacity={0.18} />
                    <stop offset="95%" stopColor={activeProductMeta?.color ?? '#00bcd4'} stopOpacity={0}    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
                <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, 'MRR']} />
                <Area type="monotone" dataKey="mrr" name="MRR"
                  stroke={activeProductMeta?.color ?? '#00bcd4'}
                  strokeWidth={2.5}
                  fill="url(#mrrGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Plan distribution (live from scoped tenants) */}
          <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
            <div className="mb-4">
              <h3 className="font-semibold text-foreground">Plans</h3>
              <p className="text-xs text-muted-foreground">
                {activeProductMeta ? `${activeProductMeta.name} tenants by plan` : 'Tenants by subscription plan'}
              </p>
            </div>
            {scopedTenantCt === 0 ? (
              <div className="h-36 flex items-center justify-center text-muted-foreground text-xs">No data</div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={140}>
                  <PieChart>
                    <Pie data={planDist} cx="50%" cy="50%" innerRadius={40} outerRadius={60}
                      dataKey="value" paddingAngle={3}>
                      {planDist.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v, n) => [`${v} tenants`, n]} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2.5 mt-2">
                  {planDist.map((p) => (
                    <div key={p.name} className="flex items-center gap-2 text-xs">
                      <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: p.color }} />
                      <span className="text-muted-foreground flex-1">{p.name}</span>
                      <span className="font-semibold text-foreground">{p.value}</span>
                      <span className="text-muted-foreground">{fmt(p.mrr)}/mo</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── Product adoption + Tenant status ──────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Product adoption bar — highlights selected product */}
          <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
            <div className="mb-4">
              <h3 className="font-semibold text-foreground">Product Adoption</h3>
              <p className="text-xs text-muted-foreground">
                {activeProductMeta
                  ? `Tenants with ${activeProductMeta.name} also using other products`
                  : 'Tenants subscribed per Aqua product'}
              </p>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={adoptionChart} barSize={36}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v: number) => [`${v}`, 'Tenants']} />
                <Bar dataKey="tenants" radius={[6, 6, 0, 0]}>
                  {adoptionChart.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={entry.color}
                      opacity={productFilter === 'all' || entry.id === productFilter ? 1 : 0.25}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Tenant status breakdown (live) */}
          <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
            <div className="mb-4">
              <h3 className="font-semibold text-foreground">Tenant Status</h3>
              <p className="text-xs text-muted-foreground">
                {activeProductMeta
                  ? `Account status breakdown for ${activeProductMeta.name} tenants`
                  : 'Distribution of account statuses across the platform'}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {statusData.map((s) => (
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
        </div>

        {/* ── Recent tenants table ───────────────────────────────────────── */}
        <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <div>
              <h3 className="font-semibold text-foreground">
                {activeProductMeta ? `Recent ${activeProductMeta.name} Tenants` : 'Recent Tenants'}
              </h3>
              <p className="text-xs text-muted-foreground">
                {activeProductMeta
                  ? `Latest ${activeProductMeta.name} organisations — ${scopedTenantCt} total`
                  : 'Latest organisations to join the platform'}
              </p>
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
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tenant</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Plan</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Products</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Employees</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">MRR</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Joined</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {tableRows.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-10 text-muted-foreground text-sm">
                      No tenants match your search
                    </td>
                  </tr>
                ) : tableRows.map((t) => (
                  <tr key={t.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg aqua-gradient flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {t.logo}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{t.name}</p>
                          <p className="text-xs text-muted-foreground">{t.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${PLAN_BADGE[t.plan]}`}>
                        {t.plan}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex gap-1 flex-wrap">
                        {t.products.map((pid) => {
                          const p = AQUA_PRODUCTS.find((x) => x.id === pid)!
                          const isActive = pid === productFilter
                          return (
                            <span key={pid}
                              className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-semibold transition-opacity ${p.bg} ${p.textColor} ${
                                productFilter !== 'all' && !isActive ? 'opacity-30' : 'opacity-100'
                              }`}>
                              {p.name.replace('Aqua ', '')}
                            </span>
                          )
                        })}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right text-sm font-medium text-foreground">{t.employees}</td>
                    <td className="px-4 py-4">
                      <span className={STATUS_BADGE[t.status].cls}>{STATUS_BADGE[t.status].label}</span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <span className={`text-sm font-semibold ${t.mrr === 0 ? 'text-muted-foreground' : 'text-foreground'}`}>
                        {t.mrr === 0 ? '—' : fmt(t.mrr)}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-muted-foreground">
                      {fmtDate(t.joined)}
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
