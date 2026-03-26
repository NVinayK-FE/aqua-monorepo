'use client'

import { useState, useMemo } from 'react'
import {
  CreditCard, TrendingUp, AlertTriangle, RefreshCw,
  Search, ChevronUp, ChevronDown, X, ArrowUpRight,
  ArrowDownRight, Ban, CheckCircle2, Clock,
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts'
import {
  ADMIN_SUBSCRIPTIONS, ADMIN_TENANTS, AQUA_PRODUCTS, PLAN_BADGE, STATUS_BADGE,
  fmtMoney, fmtDate, AdminSubscription, PRODUCT_MAP,
} from '@/lib/admin-data'
import { useAdminFilter } from '@/lib/admin-filter-context'

// ─── MRR trend (last 6 months mock) ─────────────────────────────────────────
const MRR_TREND = [
  { month: 'Oct', mrr: 54200 },
  { month: 'Nov', mrr: 58900 },
  { month: 'Dec', mrr: 61400 },
  { month: 'Jan', mrr: 65000 },
  { month: 'Feb', mrr: 72300 },
  { month: 'Mar', mrr: 79314 },
]

const PLAN_COLORS: Record<string, string> = {
  Starter: '#00bcd4',
  Growth: '#0e7490',
  Enterprise: '#0f766e',
}

type SortField = 'tenantName' | 'plan' | 'amount' | 'seats' | 'nextRenewal' | 'status'
type SortDir = 'asc' | 'desc'

type SubStatus = AdminSubscription['status']

// ─── Subscription Drawer ─────────────────────────────────────────────────────
function SubscriptionDrawer({
  sub,
  onClose,
  onAction,
}: {
  sub: AdminSubscription
  onClose: () => void
  onAction: (id: string, action: 'cancel' | 'upgrade' | 'downgrade') => void
}) {
  const seatPct = Math.round((sub.usedSeats / sub.seats) * 100)
  const statusInfo = STATUS_BADGE[sub.status] ?? { label: sub.status, cls: 'badge-inactive' }

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="w-[480px] bg-white shadow-2xl flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="px-6 py-5 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="font-bold text-foreground text-lg">{sub.tenantName}</h2>
            <p className="text-sm text-muted-foreground">{sub.id}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Status + plan */}
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${PLAN_BADGE[sub.plan]}`}>
              {sub.plan}
            </span>
            <span className={statusInfo.cls}>{statusInfo.label}</span>
            <span className="ml-auto text-xs text-muted-foreground capitalize">{sub.billingCycle}</span>
          </div>

          {/* Financials */}
          <div className="bg-muted/40 rounded-xl p-4 space-y-2">
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-3">Billing</p>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-semibold text-foreground">
                {sub.amount === 0 ? 'Free trial' : `$${sub.amount.toLocaleString()} / ${sub.billingCycle === 'annual' ? 'yr' : 'mo'}`}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">MRR</span>
              <span className="font-semibold text-emerald-600">
                {sub.amount === 0 ? '$0' : `$${(sub.billingCycle === 'annual' ? sub.amount / 12 : sub.amount).toLocaleString()}`}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Payment</span>
              <span className="font-medium text-foreground">{sub.paymentMethod}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Started</span>
              <span className="font-medium text-foreground">{fmtDate(sub.startDate)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Next renewal</span>
              <span className="font-medium text-foreground">{fmtDate(sub.nextRenewal)}</span>
            </div>
          </div>

          {/* Seat usage */}
          <div>
            <div className="flex items-center justify-between mb-2 text-sm">
              <span className="font-medium text-foreground">Seat Usage</span>
              <span className="text-muted-foreground">
                <strong className="text-foreground">{sub.usedSeats}</strong> / {sub.seats} seats ({seatPct}%)
              </span>
            </div>
            <div className="h-2.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${seatPct}%`, backgroundColor: seatPct > 90 ? '#ef5350' : '#00bcd4' }}
              />
            </div>
            {seatPct > 90 && (
              <p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Approaching seat limit
              </p>
            )}
          </div>

          {/* Quick actions */}
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-3">Quick Actions</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => { onAction(sub.id, 'upgrade'); onClose() }}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-primary/5 hover:border-primary/30 transition-all"
              >
                <ArrowUpRight className="w-4 h-4 text-primary" />
                Upgrade Plan
              </button>
              <button
                onClick={() => { onAction(sub.id, 'downgrade'); onClose() }}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-amber-50 hover:border-amber-300 transition-all"
              >
                <ArrowDownRight className="w-4 h-4 text-amber-500" />
                Downgrade Plan
              </button>
              <button
                onClick={() => { onAction(sub.id, 'cancel'); onClose() }}
                className="col-span-2 flex items-center gap-2 px-3 py-2.5 rounded-xl border border-rose-200 text-sm font-medium text-rose-600 hover:bg-rose-50 transition-all"
              >
                <Ban className="w-4 h-4" />
                Cancel Subscription
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function SubscriptionsPage() {
  const [search, setSearch] = useState('')
  const [planFilter, setPlanFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortField, setSortField] = useState<SortField>('tenantName')
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [selected, setSelected] = useState<AdminSubscription | null>(null)
  const [overrides, setOverrides] = useState<Record<string, string>>({})
  const { productFilter } = useAdminFilter()

  // Scope subscriptions to tenants matching the global product filter
  const scopedTenantIds = productFilter === 'all'
    ? null
    : new Set(ADMIN_TENANTS.filter((t) => t.products.includes(productFilter)).map((t) => t.id))
  const BASE_SUBS = scopedTenantIds
    ? ADMIN_SUBSCRIPTIONS.filter((s) => scopedTenantIds.has(s.tenantId))
    : ADMIN_SUBSCRIPTIONS
  const activeProductMeta = productFilter !== 'all' ? PRODUCT_MAP[productFilter] : null

  const totalMRR = BASE_SUBS.reduce((s, x) => {
    const mrr = x.billingCycle === 'annual' ? x.amount / 12 : x.amount
    return s + mrr
  }, 0)
  const activeCount = BASE_SUBS.filter((s) => s.status === 'active').length
  const trialCount  = BASE_SUBS.filter((s) => s.status === 'trial').length
  const pastDue     = BASE_SUBS.filter((s) => s.status === 'past_due').length

  // Plan breakdown for pie
  const planTotals = ['Starter', 'Growth', 'Enterprise'].map((p) => ({
    name: p,
    value: BASE_SUBS.filter((s) => s.plan === p).length,
  }))

  const handleSort = (f: SortField) => {
    if (f === sortField) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortField(f); setSortDir('asc') }
  }

  const handleAction = (id: string, action: 'cancel' | 'upgrade' | 'downgrade') => {
    if (action === 'cancel') setOverrides((o) => ({ ...o, [id]: 'cancelled' }))
    if (action === 'upgrade') setOverrides((o) => ({ ...o, [id]: 'active' }))
    if (action === 'downgrade') setOverrides((o) => ({ ...o, [id]: 'active' }))
  }

  const rows = useMemo(() => {
    let data = BASE_SUBS.map((s) => ({
      ...s,
      status: (overrides[s.id] as SubStatus) ?? s.status,
    }))

    if (search) {
      const q = search.toLowerCase()
      data = data.filter((s) => s.tenantName.toLowerCase().includes(q) || s.id.toLowerCase().includes(q))
    }
    if (planFilter !== 'all')   data = data.filter((s) => s.plan === planFilter)
    if (statusFilter !== 'all') data = data.filter((s) => s.status === statusFilter)

    data.sort((a, b) => {
      let av: string | number, bv: string | number
      switch (sortField) {
        case 'tenantName':  av = a.tenantName; bv = b.tenantName; break
        case 'plan':        av = a.plan;       bv = b.plan;       break
        case 'amount':      av = a.amount;     bv = b.amount;     break
        case 'seats':       av = a.seats;      bv = b.seats;      break
        case 'nextRenewal': av = a.nextRenewal; bv = b.nextRenewal; break
        case 'status':      av = a.status;     bv = b.status;     break
        default:            av = a.tenantName; bv = b.tenantName
      }
      if (av < bv) return sortDir === 'asc' ? -1 : 1
      if (av > bv) return sortDir === 'asc' ? 1 : -1
      return 0
    })
    return data
  }, [BASE_SUBS, search, planFilter, statusFilter, sortField, sortDir, overrides])

  const SortIcon = ({ field }: { field: SortField }) =>
    sortField === field
      ? sortDir === 'asc'
        ? <ChevronUp className="w-3 h-3 ml-1 inline" />
        : <ChevronDown className="w-3 h-3 ml-1 inline" />
      : <ChevronUp className="w-3 h-3 ml-1 inline opacity-20" />

  return (
    <div className="flex flex-col flex-1">
      {/* Header */}
      <div className="px-8 py-6 border-b border-border bg-white">
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl font-bold text-foreground">Subscriptions</h1>
          {activeProductMeta && (
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${activeProductMeta.bg} ${activeProductMeta.textColor} ${activeProductMeta.border}`}>
              {activeProductMeta.name}
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-0.5">
          {activeProductMeta
            ? `Showing subscriptions for tenants using ${activeProductMeta.name}`
            : 'Manage all tenant subscriptions and billing'}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-6">

        {/* KPI cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total MRR',           value: fmtMoney(Math.round(totalMRR)), icon: CreditCard,      color: 'text-cyan-600',    bg: 'bg-cyan-50',    sub: '+9.7% vs last month' },
            { label: 'Active Subscriptions',value: String(activeCount),            icon: CheckCircle2,    color: 'text-emerald-600', bg: 'bg-emerald-50', sub: `${trialCount} on trial` },
            { label: 'Past Due',            value: String(pastDue),                icon: AlertTriangle,   color: 'text-rose-500',    bg: 'bg-rose-50',    sub: 'Needs attention' },
            { label: 'Renewal Rate',        value: '94.2%',                        icon: RefreshCw,       color: 'text-primary',     bg: 'bg-primary/10', sub: '+1.4% vs last month' },
          ].map((c) => (
            <div key={c.label} className="stat-card">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{c.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-0.5">{c.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{c.sub}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center flex-shrink-0`}>
                  <c.icon className={`w-5 h-5 ${c.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* MRR trend */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-border p-6 shadow-sm">
            <h3 className="font-semibold text-foreground mb-4">MRR Trend (6 months)</h3>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={MRR_TREND} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="mrrGrad2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#00bcd4" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#00bcd4" stopOpacity={0}    />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
                <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, 'MRR']} />
                <Area type="monotone" dataKey="mrr" stroke="#00bcd4" strokeWidth={2} fill="url(#mrrGrad2)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Plan distribution */}
          <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
            <h3 className="font-semibold text-foreground mb-4">By Plan</h3>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={planTotals}
                  cx="50%" cy="50%"
                  innerRadius={45} outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {planTotals.map((entry) => (
                    <Cell key={entry.name} fill={PLAN_COLORS[entry.name]} />
                  ))}
                </Pie>
                <Legend iconSize={10} wrapperStyle={{ fontSize: 12 }} />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          {/* Toolbar */}
          <div className="px-6 py-4 border-b border-border flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="Search subscriptions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="text-sm border border-border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white"
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
            >
              <option value="all">All Plans</option>
              <option value="Starter">Starter</option>
              <option value="Growth">Growth</option>
              <option value="Enterprise">Enterprise</option>
            </select>
            <select
              className="text-sm border border-border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="trial">Trial</option>
              <option value="past_due">Past Due</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <span className="text-xs text-muted-foreground ml-auto">{rows.length} subscription{rows.length !== 1 ? 's' : ''}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full data-table">
              <thead>
                <tr>
                  {([
                    ['tenantName', 'Tenant'],
                    ['plan',       'Plan'],
                    ['amount',     'Amount'],
                    ['seats',      'Seats'],
                    ['nextRenewal','Next Renewal'],
                    ['status',     'Status'],
                  ] as [SortField, string][]).map(([f, label]) => (
                    <th
                      key={f}
                      className="text-left px-5 py-3 cursor-pointer select-none hover:text-foreground transition-colors"
                      onClick={() => handleSort(f)}
                    >
                      {label}<SortIcon field={f} />
                    </th>
                  ))}
                  <th className="px-5 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((sub) => {
                  const statusInfo = STATUS_BADGE[sub.status] ?? { label: sub.status, cls: 'badge-inactive' }
                  const seatPct = Math.round((sub.usedSeats / sub.seats) * 100)
                  return (
                    <tr
                      key={sub.id}
                      className="border-b border-border last:border-0 hover:bg-muted/30 cursor-pointer"
                      onClick={() => setSelected(sub)}
                    >
                      <td className="px-5 py-3">
                        <p className="text-sm font-semibold text-foreground">{sub.tenantName}</p>
                        <p className="text-xs text-muted-foreground">{sub.id}</p>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${PLAN_BADGE[sub.plan]}`}>
                          {sub.plan}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-sm font-semibold text-foreground">
                        {sub.amount === 0 ? (
                          <span className="text-muted-foreground">Free trial</span>
                        ) : (
                          <>${sub.amount.toLocaleString()}
                          <span className="text-xs font-normal text-muted-foreground ml-1">
                            /{sub.billingCycle === 'annual' ? 'yr' : 'mo'}
                          </span>
                          </>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{ width: `${seatPct}%`, backgroundColor: seatPct > 90 ? '#ef5350' : '#00bcd4' }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">{sub.usedSeats}/{sub.seats}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-sm text-muted-foreground">{fmtDate(sub.nextRenewal)}</td>
                      <td className="px-5 py-3">
                        <span className={statusInfo.cls}>{statusInfo.label}</span>
                      </td>
                      <td className="px-5 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => { handleAction(sub.id, 'upgrade'); }}
                            className="p-1.5 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                            title="Upgrade"
                          >
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>
                          {sub.status !== 'cancelled' && (
                            <button
                              onClick={() => handleAction(sub.id, 'cancel')}
                              className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-500 transition-colors"
                              title="Cancel"
                            >
                              <Ban className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selected && (
        <SubscriptionDrawer
          sub={selected}
          onClose={() => setSelected(null)}
          onAction={handleAction}
        />
      )}
    </div>
  )
}
