'use client'

import { useState, useMemo } from 'react'
import {
  Search, Download, Building2, Plus,
  ChevronUp, ChevronDown, ChevronRight, X, AlertTriangle,
  CheckCircle2, Ban, RefreshCw, Mail, Globe, Users,
  Clock, LayoutGrid, Filter,
} from 'lucide-react'
import {
  ADMIN_TENANTS, ADMIN_USERS, AQUA_PRODUCTS, PRODUCT_MAP,
  PLAN_BADGE, STATUS_BADGE, ROLE_BADGE,
  fmtMoney, fmtDate, relativeTime,
  type AdminTenant, type TenantStatus, type PlanName, type AquaProductId,
} from '@/lib/admin-data'
import { useAdminFilter } from '@/lib/admin-filter-context'

// ─── Consts ───────────────────────────────────────────────────────────────────

const PLANS: PlanName[]       = ['Starter', 'Growth', 'Enterprise']
const STATUSES: TenantStatus[] = ['active', 'trial', 'suspended', 'cancelled']
const REGIONS = ['All Regions', 'US East', 'US West', 'Europe', 'Asia Pacific']

type SortKey = keyof Pick<AdminTenant, 'name' | 'plan' | 'employees' | 'mrr' | 'joined'>
type DrawerTab = 'overview' | 'users' | 'products'

// ─── Add Tenant Drawer ────────────────────────────────────────────────────────

function AddTenantDrawer({
  onClose,
  onAdd,
}: {
  onClose: () => void
  onAdd: (t: AdminTenant) => void
}) {
  const [form, setForm] = useState({
    name: '',
    domain: '',
    contactName: '',
    contactEmail: '',
    plan: 'Starter' as PlanName,
    billingCycle: 'monthly' as 'monthly' | 'annual',
    region: 'US East',
    products: ['hr'] as AquaProductId[],
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)

  const set = (k: string, v: unknown) => {
    setForm((f) => ({ ...f, [k]: v }))
    setErrors((e) => { const n = { ...e }; delete n[k]; return n })
  }

  const toggleProduct = (id: AquaProductId) => {
    setForm((f) => ({
      ...f,
      products: f.products.includes(id)
        ? f.products.filter((p) => p !== id)
        : [...f.products, id],
    }))
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.name.trim())         e.name         = 'Organization name is required'
    if (!form.domain.trim())       e.domain       = 'Domain is required'
    if (!form.contactName.trim())  e.contactName  = 'Contact name is required'
    if (!form.contactEmail.trim()) e.contactEmail = 'Contact email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contactEmail))
      e.contactEmail = 'Enter a valid email'
    if (form.products.length === 0) e.products = 'Select at least one product'
    return e
  }

  const handleSubmit = () => {
    const e = validate()
    if (Object.keys(e).length > 0) { setErrors(e); return }
    const id = `T-${1300 + Math.floor(Math.random() * 100)}`
    const mrrMap: Record<PlanName, number> = { Starter: 162, Growth: 1805, Enterprise: 10800 }
    const tenant: AdminTenant = {
      id,
      name: form.name.trim(),
      domain: form.domain.trim().toLowerCase(),
      plan: form.plan,
      status: 'trial',
      employees: 0,
      mrr: form.billingCycle === 'annual' ? mrrMap[form.plan] * 10 : mrrMap[form.plan],
      billingCycle: form.billingCycle,
      region: form.region,
      joined: new Date().toISOString().slice(0, 10),
      trialEnds: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
      contactName: form.contactName.trim(),
      contactEmail: form.contactEmail.trim(),
      logo: form.name.trim().split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase(),
      products: form.products,
    }
    onAdd(tenant)
    setSubmitted(true)
    setTimeout(onClose, 1200)
  }

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-white shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border bg-muted/30">
          <div>
            <h2 className="font-bold text-foreground text-lg">Add New Tenant</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Register a new organisation on the platform</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 p-10 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">Tenant Created!</p>
              <p className="text-sm text-muted-foreground mt-1">{form.name} has been added and is on trial.</p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-6 space-y-5">

              {/* Section: Organisation */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Organisation</p>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-foreground block mb-1">Organisation Name <span className="text-destructive">*</span></label>
                    <input
                      value={form.name}
                      onChange={(e) => {
                        set('name', e.target.value)
                        // Auto-suggest domain
                        if (!form.domain) {
                          const slug = e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 20)
                          set('domain', slug ? `${slug}.aqua-shell.io` : '')
                        }
                      }}
                      placeholder="e.g. Acme Corporation"
                      className={`w-full px-3 py-2 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-primary/30 ${errors.name ? 'border-destructive' : 'border-input'}`}
                    />
                    {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="text-xs font-medium text-foreground block mb-1">Domain <span className="text-destructive">*</span></label>
                    <input
                      value={form.domain}
                      onChange={(e) => set('domain', e.target.value)}
                      placeholder="company.aqua-shell.io"
                      className={`w-full px-3 py-2 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-primary/30 font-mono ${errors.domain ? 'border-destructive' : 'border-input'}`}
                    />
                    {errors.domain && <p className="text-xs text-destructive mt-1">{errors.domain}</p>}
                  </div>
                  <div>
                    <label className="text-xs font-medium text-foreground block mb-1">Region</label>
                    <select value={form.region} onChange={(e) => set('region', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-input rounded-lg outline-none focus:ring-2 focus:ring-primary/30 bg-white">
                      {REGIONS.filter((r) => r !== 'All Regions').map((r) => <option key={r}>{r}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Section: Contact */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Primary Contact</p>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-foreground block mb-1">Contact Name <span className="text-destructive">*</span></label>
                    <input
                      value={form.contactName}
                      onChange={(e) => set('contactName', e.target.value)}
                      placeholder="Full name"
                      className={`w-full px-3 py-2 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-primary/30 ${errors.contactName ? 'border-destructive' : 'border-input'}`}
                    />
                    {errors.contactName && <p className="text-xs text-destructive mt-1">{errors.contactName}</p>}
                  </div>
                  <div>
                    <label className="text-xs font-medium text-foreground block mb-1">Contact Email <span className="text-destructive">*</span></label>
                    <input
                      type="email"
                      value={form.contactEmail}
                      onChange={(e) => set('contactEmail', e.target.value)}
                      placeholder="admin@company.com"
                      className={`w-full px-3 py-2 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-primary/30 ${errors.contactEmail ? 'border-destructive' : 'border-input'}`}
                    />
                    {errors.contactEmail && <p className="text-xs text-destructive mt-1">{errors.contactEmail}</p>}
                  </div>
                </div>
              </div>

              {/* Section: Subscription */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Subscription</p>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-foreground block mb-1">Plan</label>
                      <select value={form.plan} onChange={(e) => set('plan', e.target.value as PlanName)}
                        className="w-full px-3 py-2 text-sm border border-input rounded-lg outline-none focus:ring-2 focus:ring-primary/30 bg-white">
                        {PLANS.map((p) => <option key={p}>{p}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-foreground block mb-1">Billing Cycle</label>
                      <select value={form.billingCycle} onChange={(e) => set('billingCycle', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-input rounded-lg outline-none focus:ring-2 focus:ring-primary/30 bg-white">
                        <option value="monthly">Monthly</option>
                        <option value="annual">Annual (save 2 months)</option>
                      </select>
                    </div>
                  </div>

                  {/* Plan comparison hint */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    {PLANS.map((p) => {
                      const prices: Record<PlanName, string> = { Starter: '$9/seat', Growth: '$19/seat', Enterprise: '$Custom' }
                      return (
                        <button key={p} onClick={() => set('plan', p)}
                          className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                            form.plan === p
                              ? 'border-primary bg-primary/8 text-primary'
                              : 'border-border text-muted-foreground hover:border-primary/40'
                          }`}>
                          <p>{p}</p>
                          <p className="font-normal text-[10px] mt-0.5 opacity-70">{prices[p]}</p>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Section: Products */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                  Products <span className="text-destructive">*</span>
                </p>
                <p className="text-xs text-muted-foreground mb-3">Select which Aqua products this tenant will use</p>
                {errors.products && <p className="text-xs text-destructive mb-2">{errors.products}</p>}
                <div className="grid grid-cols-2 gap-2">
                  {AQUA_PRODUCTS.map((product) => {
                    const active = form.products.includes(product.id)
                    return (
                      <button key={product.id} onClick={() => toggleProduct(product.id)}
                        className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${
                          active ? `${product.bg} ${product.border}` : 'border-border hover:border-primary/30'
                        }`}>
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-bold ${
                          active ? 'bg-white shadow-sm' : 'bg-muted'
                        }`}>
                          <LayoutGrid className={`w-4 h-4 ${active ? product.textColor : 'text-muted-foreground'}`} />
                        </div>
                        <div className="min-w-0">
                          <p className={`text-xs font-semibold ${active ? product.textColor : 'text-foreground'}`}>{product.name}</p>
                          <p className="text-[10px] text-muted-foreground truncate">{product.tagline}</p>
                        </div>
                        <div className={`ml-auto w-4 h-4 rounded-full flex-shrink-0 border-2 flex items-center justify-center ${
                          active ? `bg-white border-white ${product.textColor}` : 'border-muted-foreground/30'
                        }`}>
                          {active && <CheckCircle2 className={`w-4 h-4 ${product.textColor}`} />}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-border flex items-center gap-3">
              <button onClick={onClose}
                className="flex-1 px-4 py-2.5 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors">
                Cancel
              </button>
              <button onClick={handleSubmit}
                className="flex-1 px-4 py-2.5 rounded-lg aqua-gradient text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm">
                Create Tenant
              </button>
            </div>
          </>
        )}
      </div>
    </>
  )
}

// ─── Tenant Detail Drawer ─────────────────────────────────────────────────────

function TenantDrawer({ tenant, onClose, onStatusChange }: {
  tenant: AdminTenant
  onClose: () => void
  onStatusChange: (id: string, status: TenantStatus) => void
}) {
  const [tab, setTab] = useState<DrawerTab>('overview')
  const s = STATUS_BADGE[tenant.status]

  const tenantUsers = ADMIN_USERS.filter((u) => u.tenantId === tenant.id)

  const TABS: { id: DrawerTab; label: string; count?: number }[] = [
    { id: 'overview',  label: 'Overview' },
    { id: 'users',     label: 'Users',    count: tenantUsers.length },
    { id: 'products',  label: 'Products', count: tenant.products.length },
  ]

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-white shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl aqua-gradient flex items-center justify-center text-white font-bold text-sm">
              {tenant.logo}
            </div>
            <div>
              <h2 className="font-bold text-foreground">{tenant.name}</h2>
              <p className="text-xs text-muted-foreground">{tenant.id} · {tenant.domain}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border px-6">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-1 py-3 mr-6 text-sm font-medium border-b-2 transition-colors ${
                tab === t.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}>
              {t.label}
              {t.count !== undefined && (
                <span className={`inline-flex items-center justify-center rounded-full text-[10px] font-semibold w-4 h-4 ${
                  tab === t.id ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                }`}>
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* ── Overview ── */}
          {tab === 'overview' && (
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-border p-4">
                  <p className="text-xs text-muted-foreground mb-1">Status</p>
                  <span className={s.cls}>{s.label}</span>
                </div>
                <div className="rounded-xl border border-border p-4">
                  <p className="text-xs text-muted-foreground mb-1">Plan</p>
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${PLAN_BADGE[tenant.plan]}`}>{tenant.plan}</span>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Domain',    value: tenant.domain,                                    icon: Globe  },
                  { label: 'Region',    value: tenant.region,                                    icon: Globe  },
                  { label: 'Employees', value: String(tenant.employees),                         icon: Users  },
                  { label: 'MRR',       value: tenant.mrr ? fmtMoney(tenant.mrr) : 'Trial — $0', icon: null  },
                  { label: 'Billing',   value: tenant.billingCycle === 'annual' ? 'Annual' : 'Monthly', icon: null },
                  { label: 'Joined',    value: fmtDate(tenant.joined),                           icon: null  },
                  { label: 'Contact',   value: tenant.contactName,                               icon: null  },
                  { label: 'Email',     value: tenant.contactEmail,                              icon: Mail  },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="flex items-center justify-between text-sm border-b border-border pb-2 last:border-0">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium text-foreground flex items-center gap-1.5">
                      {Icon && <Icon className="w-3.5 h-3.5 text-muted-foreground" />}
                      {value}
                    </span>
                  </div>
                ))}
              </div>
              {tenant.status === 'trial' && tenant.trialEnds && (
                <div className="flex items-start gap-3 px-4 py-3 rounded-xl border border-amber-200 bg-amber-50 text-sm">
                  <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-amber-800">Trial expires {fmtDate(tenant.trialEnds)}</p>
                    <p className="text-xs text-amber-700 mt-0.5">Contact this tenant to convert before expiry.</p>
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Quick Actions</p>
                {tenant.status !== 'active' && (
                  <button onClick={() => onStatusChange(tenant.id, 'active')}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-emerald-200 bg-emerald-50 text-sm font-medium text-emerald-700 hover:bg-emerald-100 transition-colors">
                    <CheckCircle2 className="w-4 h-4" /> Activate tenant
                  </button>
                )}
                {tenant.status === 'active' && (
                  <button onClick={() => onStatusChange(tenant.id, 'suspended')}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-amber-200 bg-amber-50 text-sm font-medium text-amber-700 hover:bg-amber-100 transition-colors">
                    <Ban className="w-4 h-4" /> Suspend tenant
                  </button>
                )}
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-white text-sm font-medium text-foreground hover:bg-muted transition-colors">
                  <Mail className="w-4 h-4" /> Email contact
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-white text-sm font-medium text-foreground hover:bg-muted transition-colors">
                  <RefreshCw className="w-4 h-4" /> Change plan
                </button>
              </div>
            </div>
          )}

          {/* ── Users ── */}
          {tab === 'users' && (
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-foreground">{tenantUsers.length} users in this tenant</p>
                <button className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 aqua-gradient text-white rounded-lg hover:opacity-90 transition-opacity">
                  <Plus className="w-3.5 h-3.5" /> Invite User
                </button>
              </div>
              {tenantUsers.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  <Users className="w-8 h-8 mx-auto mb-2 opacity-25" />
                  <p className="text-sm">No users yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {tenantUsers.map((u) => {
                    const rb = ROLE_BADGE[u.role]
                    const sb = STATUS_BADGE[u.status]
                    return (
                      <div key={u.id} className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-muted/30 transition-colors">
                        <div className="w-9 h-9 rounded-full aqua-gradient flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {u.initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-foreground truncate">{u.name}</p>
                            <span className={sb.cls}>{sb.label}</span>
                          </div>
                          <p className="text-[11px] text-muted-foreground truncate">{u.email}</p>
                        </div>
                        <div className="flex-shrink-0 text-right">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${rb.cls}`}>{rb.label}</span>
                          <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1 justify-end">
                            <Clock className="w-2.5 h-2.5" />
                            {u.lastLogin === '—' ? 'Never' : relativeTime(u.lastLogin)}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── Products ── */}
          {tab === 'products' && (
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-foreground">{tenant.products.length} of {AQUA_PRODUCTS.length} products active</p>
                <button className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 aqua-gradient text-white rounded-lg hover:opacity-90 transition-opacity">
                  <Plus className="w-3.5 h-3.5" /> Add Product
                </button>
              </div>
              <div className="space-y-3">
                {AQUA_PRODUCTS.map((product) => {
                  const active = tenant.products.includes(product.id)
                  return (
                    <div key={product.id}
                      className={`flex items-center gap-4 p-4 rounded-xl border transition-colors ${
                        active ? `${product.bg} ${product.border}` : 'border-border bg-muted/20'
                      }`}>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        active ? 'bg-white shadow-sm' : 'bg-muted'
                      }`}>
                        <LayoutGrid className={`w-4 h-4 ${active ? product.textColor : 'text-muted-foreground'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className={`text-sm font-semibold ${active ? product.textColor : 'text-muted-foreground'}`}>{product.name}</p>
                          {active && (
                            <span className={`inline-flex px-1.5 py-0.5 rounded-md text-[10px] font-semibold ${product.bg} ${product.textColor}`}>Active</span>
                          )}
                        </div>
                        <p className={`text-[11px] mt-0.5 ${active ? 'text-foreground/70' : 'text-muted-foreground'}`}>{product.tagline}</p>
                      </div>
                      {!active && (
                        <button className="flex-shrink-0 text-xs font-medium text-primary hover:underline">Enable</button>
                      )}
                      {active && (
                        <button className="flex-shrink-0 text-xs font-medium text-muted-foreground hover:text-destructive transition-colors">Disable</button>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TenantsPage() {
  const { productFilter } = useAdminFilter()

  const [search, setSearch]             = useState('')
  const [planFilter, setPlanFilter]     = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [regionFilter, setRegionFilter] = useState('All Regions')
  const [sortKey, setSortKey]           = useState<SortKey>('joined')
  const [sortDir, setSortDir]           = useState<'asc' | 'desc'>('desc')
  const [selected, setSelected]         = useState<AdminTenant | null>(null)
  const [overrides, setOverrides]       = useState<Record<string, TenantStatus>>({})
  const [addedTenants, setAddedTenants] = useState<AdminTenant[]>([])
  const [showAdd, setShowAdd]           = useState(false)

  const allTenants = [
    ...ADMIN_TENANTS.map((t) => overrides[t.id] ? { ...t, status: overrides[t.id] } : t),
    ...addedTenants,
  ]

  // Apply global product filter from sidebar
  const productFiltered = productFilter === 'all'
    ? allTenants
    : allTenants.filter((t) => t.products.includes(productFilter))

  const filtered = useMemo(() => {
    let rows = productFiltered.filter((t) => {
      const q = search.toLowerCase()
      const matchSearch = !q || t.name.toLowerCase().includes(q) || t.domain.includes(q) || t.id.includes(q) || t.contactEmail.includes(q)
      const matchPlan   = planFilter   === 'all'         || t.plan   === planFilter
      const matchStatus = statusFilter === 'all'         || t.status === statusFilter
      const matchRegion = regionFilter === 'All Regions' || t.region === regionFilter
      return matchSearch && matchPlan && matchStatus && matchRegion
    })
    rows = [...rows].sort((a, b) => {
      const av = a[sortKey]; const bv = b[sortKey]
      const cmp = typeof av === 'number' ? (av as number) - (bv as number) : String(av).localeCompare(String(bv))
      return sortDir === 'asc' ? cmp : -cmp
    })
    return rows
  }, [productFiltered, search, planFilter, statusFilter, regionFilter, sortKey, sortDir])

  const handleSort = (key: SortKey) => {
    if (key === sortKey) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortKey(key); setSortDir('asc') }
  }

  const handleStatusChange = (id: string, status: TenantStatus) => {
    setOverrides((prev) => ({ ...prev, [id]: status }))
    setSelected((prev) => (prev?.id === id ? { ...prev, status } : prev))
  }

  const SortIcon = ({ k }: { k: SortKey }) =>
    sortKey === k
      ? sortDir === 'asc' ? <ChevronUp className="w-3 h-3 ml-0.5" /> : <ChevronDown className="w-3 h-3 ml-0.5" />
      : <ChevronDown className="w-3 h-3 ml-0.5 opacity-30" />

  const kpis = [
    { label: 'Tenants',   value: productFiltered.length },
    { label: 'Active',    value: productFiltered.filter((t) => t.status === 'active').length },
    { label: 'Trials',    value: productFiltered.filter((t) => t.status === 'trial').length },
    { label: 'Suspended', value: productFiltered.filter((t) => t.status === 'suspended').length },
  ]

  const activeProduct = productFilter !== 'all' ? PRODUCT_MAP[productFilter] : null

  return (
    <div className="flex flex-col flex-1">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-5 border-b border-border bg-white">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold text-foreground">All Tenants</h1>
            {activeProduct && (
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${activeProduct.bg} ${activeProduct.textColor} ${activeProduct.border}`}>
                <Filter className="w-3 h-3" />
                {activeProduct.name}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            {activeProduct
              ? `Showing tenants using ${activeProduct.name}`
              : 'Manage all organisations on the platform'}
          </p>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2 aqua-gradient text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity shadow-sm">
          <Plus className="w-4 h-4" /> Add Tenant
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((k) => (
            <div key={k.label} className="stat-card text-center">
              <p className="text-3xl font-extrabold text-primary">{k.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{k.label}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="flex flex-wrap items-center gap-3 px-6 py-4 border-b border-border">
            <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2 flex-1 min-w-48 max-w-72">
              <Search className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, domain, ID…"
                className="bg-transparent text-xs outline-none flex-1" />
            </div>
            <select value={planFilter} onChange={(e) => setPlanFilter(e.target.value)}
              className="text-xs border border-input rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-ring">
              <option value="all">All Plans</option>
              {PLANS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs border border-input rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-ring">
              <option value="all">All Status</option>
              {STATUSES.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
            </select>
            <select value={regionFilter} onChange={(e) => setRegionFilter(e.target.value)}
              className="text-xs border border-input rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-ring">
              {REGIONS.map((r) => <option key={r}>{r}</option>)}
            </select>
            <button className="ml-auto flex items-center gap-1.5 px-3 py-2 text-xs font-medium border border-input rounded-lg hover:bg-muted transition-colors">
              <Download className="w-3.5 h-3.5" /> Export
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full data-table">
              <thead>
                <tr>
                  <th className="text-left px-6 py-3">
                    <button onClick={() => handleSort('name')} className="flex items-center text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground">
                      Tenant <SortIcon k="name" />
                    </button>
                  </th>
                  <th className="text-left px-4 py-3">
                    <button onClick={() => handleSort('plan')} className="flex items-center text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground">
                      Plan <SortIcon k="plan" />
                    </button>
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Products</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Region</th>
                  <th className="text-right px-4 py-3">
                    <button onClick={() => handleSort('employees')} className="flex items-center justify-end ml-auto text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground">
                      Employees <SortIcon k="employees" />
                    </button>
                  </th>
                  <th className="text-right px-4 py-3">
                    <button onClick={() => handleSort('mrr')} className="flex items-center justify-end ml-auto text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground">
                      MRR <SortIcon k="mrr" />
                    </button>
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-3">
                    <button onClick={() => handleSort('joined')} className="flex items-center text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground">
                      Joined <SortIcon k="joined" />
                    </button>
                  </th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => {
                  const sc = STATUS_BADGE[t.status]
                  return (
                    <tr key={t.id}
                      className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"
                      onClick={() => setSelected(t)}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl aqua-gradient flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm">
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
                          {t.products.map((pid) => {
                            const p = PRODUCT_MAP[pid]
                            return (
                              <span key={pid} className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-semibold ${p.bg} ${p.textColor}`}>
                                {p.name.replace('Aqua ', '')}
                              </span>
                            )
                          })}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-muted-foreground">{t.region}</td>
                      <td className="px-4 py-4 text-right text-sm font-medium text-foreground">{t.employees.toLocaleString()}</td>
                      <td className="px-4 py-4 text-right">
                        <span className={`text-sm font-semibold ${t.mrr === 0 ? 'text-muted-foreground' : 'text-foreground'}`}>
                          {t.mrr === 0 ? '—' : fmtMoney(t.mrr)}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={sc.cls}>{sc.label}</span>
                        {t.trialEnds && (
                          <p className="text-[10px] text-amber-600 mt-0.5">Ends {fmtDate(t.trialEnds)}</p>
                        )}
                      </td>
                      <td className="px-4 py-4 text-sm text-muted-foreground">{fmtDate(t.joined)}</td>
                      <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => setSelected(t)}
                          className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground transition-colors">
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Building2 className="w-10 h-10 mx-auto mb-3 opacity-25" />
                <p className="text-sm font-medium">No tenants found</p>
                <p className="text-xs mt-1">Try adjusting your filters</p>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between px-6 py-4 border-t border-border">
            <p className="text-xs text-muted-foreground">Showing {filtered.length} of {productFiltered.length} tenants</p>
          </div>
        </div>
      </div>

      {selected && (
        <TenantDrawer tenant={selected} onClose={() => setSelected(null)} onStatusChange={handleStatusChange} />
      )}
      {showAdd && (
        <AddTenantDrawer
          onClose={() => setShowAdd(false)}
          onAdd={(t) => setAddedTenants((prev) => [t, ...prev])}
        />
      )}
    </div>
  )
}
