'use client'

import { useState } from 'react'
import {
  Users, Building2, TrendingUp, ArrowUpRight,
  ChevronRight, Search, LayoutGrid,
  Briefcase, BookOpen, ShoppingBag, UserCheck,
} from 'lucide-react'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Cell,
} from 'recharts'
import {
  AQUA_PRODUCTS, ADMIN_TENANTS, ADMIN_USERS,
  PLAN_BADGE, STATUS_BADGE, fmtMoney, fmtDate,
  type AquaProductId,
} from '@/lib/admin-data'

// ─── Product icons ─────────────────────────────────────────────────────────────

const PRODUCT_ICONS: Record<AquaProductId, React.ElementType> = {
  hr:    UserCheck,
  crm:   Briefcase,
  books: BookOpen,
  store: ShoppingBag,
}

// ─── Derived per-product stats ────────────────────────────────────────────────

function productStats(id: AquaProductId) {
  const subs  = ADMIN_TENANTS.filter((t) => t.products.includes(id))
  const active = subs.filter((t) => t.status === 'active')
  const trial  = subs.filter((t) => t.status === 'trial')
  const mrr    = subs.reduce((acc, t) => acc + t.mrr, 0)
  const users  = ADMIN_USERS.filter((u) => subs.some((t) => t.id === u.tenantId)).length
  return { total: subs.length, active: active.length, trial: trial.length, mrr, users, tenants: subs }
}

// ─── Adoption chart data ──────────────────────────────────────────────────────

const ADOPTION_DATA = AQUA_PRODUCTS.map((p) => {
  const s = productStats(p.id)
  return { name: p.name.replace('Aqua ', ''), tenants: s.total, mrr: s.mrr, color: p.color }
})

// ─── Radar data ───────────────────────────────────────────────────────────────

const RADAR_DATA = [
  { metric: 'Tenants',  HR: 12, CRM: 7, Books: 4, Store: 5 },
  { metric: 'Users',    HR: 31, CRM: 14, Books: 8, Store: 9 },
  { metric: 'MRR',      HR: 9,  CRM: 7, Books: 5, Store: 4 },
  { metric: 'Activity', HR: 10, CRM: 8, Books: 6, Store: 7 },
  { metric: 'Growth',   HR: 8,  CRM: 9, Books: 5, Store: 6 },
]

// ─── Component ────────────────────────────────────────────────────────────────

export default function ProductsPage() {
  const [activeProduct, setActiveProduct] = useState<AquaProductId>('hr')
  const [search, setSearch] = useState('')

  const current = AQUA_PRODUCTS.find((p) => p.id === activeProduct)!
  const stats   = productStats(activeProduct)
  const Icon    = PRODUCT_ICONS[activeProduct]

  const filteredTenants = stats.tenants.filter((t) => {
    const q = search.toLowerCase()
    return !q || t.name.toLowerCase().includes(q) || t.domain.includes(q)
  })

  return (
    <div className="flex flex-col flex-1">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-5 border-b border-border bg-white">
        <div>
          <h1 className="text-xl font-bold text-foreground">Aqua Products</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage and monitor all products in the Aqua Suite platform
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-6">

        {/* Product cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {AQUA_PRODUCTS.map((product) => {
            const s   = productStats(product.id)
            const PIco = PRODUCT_ICONS[product.id]
            const isActive = activeProduct === product.id
            return (
              <button
                key={product.id}
                onClick={() => setActiveProduct(product.id)}
                className={`text-left p-5 rounded-2xl border-2 transition-all duration-150 ${
                  isActive
                    ? `${product.bg} ${product.border} shadow-md`
                    : 'border-border bg-white hover:border-border hover:shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isActive ? 'bg-white shadow-sm' : product.bg
                  }`}>
                    <PIco className={`w-5 h-5 ${product.textColor}`} />
                  </div>
                  {isActive && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${product.bg} ${product.textColor} border ${product.border}`}>
                      Viewing
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-foreground text-sm">{product.name}</h3>
                <p className="text-[11px] text-muted-foreground mt-0.5 mb-3">{product.tagline}</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-muted-foreground">Tenants</p>
                    <p className="font-bold text-foreground text-base">{s.total}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">MRR</p>
                    <p className={`font-bold text-base ${product.textColor}`}>{fmtMoney(s.mrr)}</p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Selected product detail */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* KPIs */}
          <div className={`rounded-2xl border-2 ${current.border} ${current.bg} p-6 space-y-4`}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center">
                <Icon className={`w-6 h-6 ${current.textColor}`} />
              </div>
              <div>
                <h2 className="font-bold text-foreground text-lg">{current.name}</h2>
                <p className="text-xs text-muted-foreground">{current.tagline}</p>
              </div>
            </div>
            <p className="text-sm text-foreground/80">{current.description}</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Total Tenants',  value: stats.total,               icon: Building2   },
                { label: 'Active',         value: stats.active,              icon: TrendingUp  },
                { label: 'On Trial',       value: stats.trial,               icon: Users       },
                { label: 'Total Users',    value: stats.users,               icon: UserCheck   },
              ].map((k) => (
                <div key={k.label} className="bg-white/70 rounded-xl p-3">
                  <p className="text-[10px] text-muted-foreground">{k.label}</p>
                  <p className={`text-xl font-bold ${current.textColor}`}>{k.value}</p>
                </div>
              ))}
            </div>
            <div className="bg-white/70 rounded-xl p-3">
              <p className="text-[10px] text-muted-foreground">Monthly Recurring Revenue</p>
              <p className={`text-2xl font-extrabold ${current.textColor}`}>{fmtMoney(stats.mrr)}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground mb-2">Features Included</p>
              <ul className="space-y-1">
                {current.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs text-foreground/80">
                    <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0`} style={{ backgroundColor: current.color }} />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Adoption chart */}
          <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
            <h3 className="font-semibold text-foreground mb-1">Tenant Adoption</h3>
            <p className="text-xs text-muted-foreground mb-4">Active tenants by product</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={ADOPTION_DATA} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v: number) => [`${v} tenants`, 'Tenants']} />
                <Bar dataKey="tenants" radius={[6, 6, 0, 0]}>
                  {ADOPTION_DATA.map((entry, i) => (
                    <Cell key={i} fill={entry.color} opacity={ADOPTION_DATA[i].name === current.name.replace('Aqua ', '') ? 1 : 0.35} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            {/* MRR mini */}
            <div className="mt-4 space-y-2">
              <p className="text-xs font-semibold text-muted-foreground">MRR Contribution</p>
              {AQUA_PRODUCTS.map((p) => {
                const s = productStats(p.id)
                const totalMrr = AQUA_PRODUCTS.reduce((acc, pp) => acc + productStats(pp.id).mrr, 0)
                const pct = totalMrr > 0 ? Math.round((s.mrr / totalMrr) * 100) : 0
                return (
                  <div key={p.id} className="flex items-center gap-2 text-xs">
                    <div className="w-2 h-2 rounded-sm flex-shrink-0" style={{ backgroundColor: p.color }} />
                    <span className="text-muted-foreground flex-1">{p.name}</span>
                    <span className="font-semibold text-foreground">{pct}%</span>
                    <span className="text-muted-foreground">{fmtMoney(s.mrr)}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Radar */}
          <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
            <h3 className="font-semibold text-foreground mb-1">Product Comparison</h3>
            <p className="text-xs text-muted-foreground mb-4">Relative performance across key metrics</p>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={RADAR_DATA}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10 }} />
                <Radar name="HR"    dataKey="HR"    stroke="#00bcd4" fill="#00bcd4" fillOpacity={0.15} strokeWidth={2} />
                <Radar name="CRM"   dataKey="CRM"   stroke="#6366f1" fill="#6366f1" fillOpacity={0.15} strokeWidth={2} />
                <Radar name="Books" dataKey="Books" stroke="#10b981" fill="#10b981" fillOpacity={0.15} strokeWidth={2} />
                <Radar name="Store" dataKey="Store" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.15} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-3 mt-1">
              {AQUA_PRODUCTS.map((p) => (
                <div key={p.id} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: p.color }} />
                  {p.name.replace('Aqua ', '')}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tenants using this product */}
        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <div>
              <h3 className="font-semibold text-foreground">
                Tenants using {current.name}
              </h3>
              <p className="text-xs text-muted-foreground">{stats.total} tenants subscribed to this product</p>
            </div>
            <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2 w-56">
              <Search className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tenants…"
                className="bg-transparent text-xs outline-none flex-1" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full data-table">
              <thead>
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tenant</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Plan</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Also Using</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Employees</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">MRR</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Joined</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {filteredTenants.map((t) => {
                  const sc = STATUS_BADGE[t.status]
                  const otherProducts = t.products.filter((p) => p !== activeProduct)
                  return (
                    <tr key={t.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl aqua-gradient flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {t.logo}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">{t.name}</p>
                            <p className="text-xs text-muted-foreground">{t.domain}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${PLAN_BADGE[t.plan]}`}>{t.plan}</span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex gap-1 flex-wrap">
                          {otherProducts.length === 0 ? (
                            <span className="text-xs text-muted-foreground">HR only</span>
                          ) : otherProducts.map((pid) => {
                            const pp = AQUA_PRODUCTS.find((x) => x.id === pid)!
                            return (
                              <span key={pid} className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-semibold ${pp.bg} ${pp.textColor}`}>
                                {pp.name.replace('Aqua ', '')}
                              </span>
                            )
                          })}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={sc.cls}>{sc.label}</span>
                      </td>
                      <td className="px-4 py-4 text-right text-sm font-medium text-foreground">{t.employees.toLocaleString()}</td>
                      <td className="px-4 py-4 text-right">
                        <span className={`text-sm font-semibold ${t.mrr === 0 ? 'text-muted-foreground' : 'text-foreground'}`}>
                          {t.mrr === 0 ? '—' : fmtMoney(t.mrr)}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-muted-foreground">{fmtDate(t.joined)}</td>
                      <td className="px-4 py-4">
                        <button className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground transition-colors">
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
                {filteredTenants.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center py-10 text-muted-foreground text-sm">
                      No tenants found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}
