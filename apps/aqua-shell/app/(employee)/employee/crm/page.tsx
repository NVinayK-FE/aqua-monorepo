'use client'

import {
  TrendingUp, Users, ArrowLeftRight, Activity, BarChart2,
  Phone, Mail, Plus, Circle,
} from 'lucide-react'

const PIPELINE_STAGES = [
  { stage: 'Lead',        count: 24, value: 48000,  color: '#6366f1' },
  { stage: 'Qualified',   count: 15, value: 112000, color: '#8b5cf6' },
  { stage: 'Proposal',    count: 9,  value: 89000,  color: '#a855f7' },
  { stage: 'Negotiation', count: 5,  value: 74000,  color: '#c084fc' },
  { stage: 'Won',         count: 8,  value: 136000, color: '#10b981' },
]

const RECENT_CONTACTS = [
  { name: 'Sarah Mitchell',  company: 'Northbridge Tech',  status: 'hot',    lastContact: '2 hours ago'  },
  { name: 'James Okafor',    company: 'Vertex Solutions',  status: 'warm',   lastContact: '1 day ago'    },
  { name: 'Priya Nair',      company: 'Meridian Retail',   status: 'cold',   lastContact: '3 days ago'   },
  { name: 'Chris Lundberg',  company: 'Pacific Dynamics',  status: 'warm',   lastContact: '5 days ago'   },
]

const STATUS_CONF = {
  hot:  { label: 'Hot',  cls: 'bg-rose-50 text-rose-600 border border-rose-200'    },
  warm: { label: 'Warm', cls: 'bg-amber-50 text-amber-600 border border-amber-200' },
  cold: { label: 'Cold', cls: 'bg-blue-50 text-blue-600 border border-blue-200'    },
}

const PRODUCT_COLOR = '#6366f1'

export default function CrmDashboardPage() {
  const totalPipelineValue = PIPELINE_STAGES.reduce((s, p) => s + p.value, 0)
  const maxValue = Math.max(...PIPELINE_STAGES.map((p) => p.value))

  return (
    <div className="flex flex-col flex-1">
      {/* Header */}
      <div className="px-8 py-6 border-b border-border bg-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <div
                className="w-6 h-6 rounded-md flex items-center justify-center text-white text-[10px] font-bold"
                style={{ backgroundColor: PRODUCT_COLOR }}
              >CR</div>
              <h1 className="text-xl font-bold text-foreground">Aqua CRM</h1>
            </div>
            <p className="text-sm text-muted-foreground">Sales pipeline · Tom Anderson · Q1 2026</p>
          </div>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium shadow-sm transition-opacity hover:opacity-90"
            style={{ backgroundColor: PRODUCT_COLOR }}
          >
            <Plus className="w-4 h-4" />
            New Deal
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-6">

        {/* KPI strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Pipeline Value',  value: `$${(totalPipelineValue / 1000).toFixed(0)}k`, icon: TrendingUp,    bg: 'bg-indigo-50',  ic: 'text-indigo-600' },
            { label: 'Active Deals',    value: '38',   icon: ArrowLeftRight, bg: 'bg-purple-50',  ic: 'text-purple-600' },
            { label: 'Contacts',        value: '147',  icon: Users,          bg: 'bg-blue-50',    ic: 'text-blue-600'   },
            { label: 'Activities Due',  value: '9',    icon: Activity,       bg: 'bg-rose-50',    ic: 'text-rose-500'   },
          ].map((c) => (
            <div key={c.label} className="stat-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{c.label}</p>
                  <p className="text-xl font-bold text-foreground mt-0.5">{c.value}</p>
                </div>
                <div className={`w-9 h-9 rounded-xl ${c.bg} flex items-center justify-center`}>
                  <c.icon className={`w-4.5 h-4.5 ${c.ic}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Pipeline funnel */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-border p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-foreground">My Pipeline</h3>
              <span className="text-xs text-muted-foreground">Total: ${(totalPipelineValue / 1000).toFixed(0)}k</span>
            </div>
            <div className="space-y-3">
              {PIPELINE_STAGES.map((s) => {
                const pct = Math.round((s.value / maxValue) * 100)
                return (
                  <div key={s.stage}>
                    <div className="flex items-center justify-between mb-1.5 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                        <span className="font-medium text-foreground">{s.stage}</span>
                        <span className="text-xs text-muted-foreground">{s.count} deals</span>
                      </div>
                      <span className="text-muted-foreground font-medium">${(s.value / 1000).toFixed(0)}k</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: s.color }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Quick stats */}
          <div className="bg-white rounded-2xl border border-border p-6 shadow-sm space-y-5">
            <h3 className="font-semibold text-foreground">My Performance</h3>
            {[
              { label: 'Win Rate',      value: '34%',   sub: '8 of 23 deals closed'    },
              { label: 'Avg Deal Size', value: '$17k',  sub: 'vs $14k last quarter'     },
              { label: 'Quota Attain.', value: '78%',   sub: '$136k of $175k target'    },
              { label: 'Avg Close',     value: '22 d',  sub: 'time to close a deal'     },
            ].map((s) => (
              <div key={s.label}>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{s.label}</span>
                  <span className="text-sm font-bold text-foreground">{s.value}</span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-0.5">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent contacts */}
        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Recent Contacts</h3>
            <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">View all →</button>
          </div>
          <table className="w-full data-table">
            <thead>
              <tr>
                <th className="text-left px-6 py-3">Name</th>
                <th className="text-left px-4 py-3">Company</th>
                <th className="text-center px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Last Contact</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {RECENT_CONTACTS.map((c) => {
                const s = STATUS_CONF[c.status as keyof typeof STATUS_CONF]
                return (
                  <tr key={c.name} className="border-b border-border last:border-0 hover:bg-muted/30">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold">
                          {c.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-sm font-medium text-foreground">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{c.company}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${s.cls}`}>
                        <Circle className="w-1.5 h-1.5 fill-current" />
                        {s.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{c.lastContact}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 justify-end">
                        <button className="p-1.5 rounded-lg hover:bg-muted transition-colors" title="Call">
                          <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-muted transition-colors" title="Email">
                          <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                        </button>
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
  )
}
