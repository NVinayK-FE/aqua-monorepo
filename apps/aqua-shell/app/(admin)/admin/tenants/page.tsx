'use client'

import { useState, useMemo } from 'react'
import {
  Search, Filter, Download, MoreHorizontal, Building2, Plus,
  ChevronUp, ChevronDown, ChevronRight, X, AlertTriangle,
  CheckCircle2, Ban, RefreshCw, Mail, Globe, Users,
} from 'lucide-react'
import {
  ADMIN_TENANTS, PLAN_BADGE, STATUS_BADGE, fmtMoney, fmtDate,
  type AdminTenant, type TenantStatus, type PlanName,
} from '@/lib/admin-data'

// ─── Consts ───────────────────────────────────────────────────────────────────

const PLANS: PlanName[]       = ['Starter', 'Growth', 'Enterprise']
const STATUSES: TenantStatus[] = ['active', 'trial', 'suspended', 'cancelled']
const REGIONS = ['All Regions', 'US East', 'US West', 'Europe', 'Asia Pacific']

type SortKey = keyof Pick<AdminTenant, 'name' | 'plan' | 'employees' | 'mrr' | 'joined'>

// ─── Tenant Detail Drawer ─────────────────────────────────────────────────────

function TenantDrawer({ tenant, onClose, onStatusChange }: {
  tenant: AdminTenant
  onClose: () => void
  onStatusChange: (id: string, status: TenantStatus) => void
}) {
  const s = STATUS_BADGE[tenant.status]
  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col animate-slide-in-right">
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl aqua-gradient flex items-center justify-center text-white font-bold text-sm">
              {tenant.logo}
            </div>
            <div>
              <h2 className="font-bold text-foreground">{tenant.name}</h2>
              <p className="text-xs text-muted-foreground">{tenant.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Status + Plan */}
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

          {/* Details */}
          <div className="space-y-3">
            {[
              { label: 'Domain',        value: tenant.domain,                      icon: Globe },
              { label: 'Region',        value: tenant.region,                      icon: Globe },
              { label: 'Employees',     value: String(tenant.employees),           icon: Users },
              { label: 'MRR',          value: tenant.mrr ? fmtMoney(tenant.mrr) : 'Trial — $0', icon: null },
              { label: 'Billing',       value: tenant.billingCycle === 'annual' ? 'Annual' : 'Monthly', icon: null },
              { label: 'Joined',        value: fmtDate(tenant.joined),             icon: null },
              { label: 'Contact',       value: tenant.contactName,                 icon: null },
              { label: 'Contact Email', value: tenant.contactEmail,                icon: Mail },
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

          {/* Trial warning */}
          {tenant.status === 'trial' && tenant.trialEnds && (
            <div className="flex items-start gap-3 px-4 py-3 rounded-xl border border-amber-200 bg-amber-50 text-sm">
              <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-800">Trial expires {fmtDate(tenant.trialEnds)}</p>
                <p className="text-xs text-amber-700 mt-0.5">Contact this tenant to convert before expiry.</p>
              </div>
            </div>
          )}

          {/* Actions */}
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
      </div>
    </>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TenantsPage() {
  const [search, setSearch]         = useState('')
  const [planFilter, setPlanFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [regionFilter, setRegionFilter] = useState('All Regions')
  const [sortKey, setSortKey]       = useState<SortKey>('joined')
  const [sortDir, setSortDir]       = useState<'asc' | 'desc'>('desc')
  const [selected, setSelected]     = useState<AdminTenant | null>(null)
  const [overrides, setOverrides]   = useState<Record<string, TenantStatus>>({})

  const tenants = ADMIN_TENANTS.map((t) =>
    overrides[t.id] ? { ...t, status: overrides[t.id] } : t
  )

  const filtered = useMemo(() => {
    let rows = tenants.filter((t) => {
      const q = search.toLowerCase()
      const matchSearch = !q || t.name.toLowerCase().includes(q) || t.domain.includes(q) || t.id.includes(q) || t.contactEmail.includes(q)
      const matchPlan   = planFilter === 'all'   || t.plan === planFilter
      const matchStatus = statusFilter === 'all' || t.status === statusFilter
      const matchRegion = regionFilter === 'All Regions' || t.region === regionFilter
      return matchSearch && matchPlan && matchStatus && matchRegion
    })
    rows = [...rows].sort((a, b) => {
      const av = a[sortKey]; const bv = b[sortKey]
      const cmp = typeof av === 'number' ? (av as number) - (bv as number) : String(av).localeCompare(String(bv))
      return sortDir === 'asc' ? cmp : -cmp
    })
    return rows
  }, [tenants, search, planFilter, statusFilter, regionFilter, sortKey, sortDir])

  const handleSort = (key: SortKey) => {
    if (key === sortKey) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  const handleStatusChange = (id: string, status: TenantStatus) => {
    setOverrides(prev => ({ ...prev, [id]: status }))
    setSelected(prev => prev?.id === id ? { ...prev, status } : prev)
  }

  const SortIcon = ({ k }: { k: SortKey }) =>
    sortKey === k
      ? sortDir === 'asc' ? <ChevronUp className="w-3 h-3 ml-0.5" /> : <ChevronDown className="w-3 h-3 ml-0.5" />
      : <ChevronDown className="w-3 h-3 ml-0.5 opacity-30" />

  const kpis = [
    { label: 'Total Tenants',   value: tenants.length },
    { label: 'Active',          value: tenants.filter(t => t.status === 'active').length },
    { label: 'Free Trials',     value: tenants.filter(t => t.status === 'trial').length },
    { label: 'Suspended',       value: tenants.filter(t => t.status === 'suspended').length },
  ]

  return (
    <div className="flex flex-col flex-1">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-5 border-b border-border bg-white">
        <div>
          <h1 className="text-xl font-bold text-foreground">All Tenants</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage all organisations on the platform</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 aqua-gradient text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity shadow-sm">
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

        {/* Table card */}
        <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-3 px-6 py-4 border-b border-border">
            <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2 flex-1 min-w-48 max-w-72">
              <Search className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search by name, domain, ID…"
                className="bg-transparent text-xs outline-none flex-1" />
            </div>
            <select value={planFilter} onChange={e => setPlanFilter(e.target.value)}
              className="text-xs border border-input rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-ring">
              <option value="all">All Plans</option>
              {PLANS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              className="text-xs border border-input rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-ring">
              <option value="all">All Status</option>
              {STATUSES.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
            </select>
            <select value={regionFilter} onChange={e => setRegionFilter(e.target.value)}
              className="text-xs border border-input rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-ring">
              {REGIONS.map(r => <option key={r}>{r}</option>)}
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
                    <tr key={t.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"
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
                      <td className="px-4 py-4" onClick={e => e.stopPropagation()}>
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
                <p className="text-xs mt-1">Try adjusting your search or filters</p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between px-6 py-4 border-t border-border">
            <p className="text-xs text-muted-foreground">Showing {filtered.length} of {tenants.length} tenants</p>
          </div>
        </div>
      </div>

      {selected && (
        <TenantDrawer tenant={selected} onClose={() => setSelected(null)} onStatusChange={handleStatusChange} />
      )}
    </div>
  )
}
