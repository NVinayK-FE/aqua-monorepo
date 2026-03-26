'use client'

import { FileText, Receipt, PieChart, CheckCircle2, TrendingUp, TrendingDown, Plus, Clock } from 'lucide-react'

const PRODUCT_COLOR = '#10b981'

const RECENT_INVOICES = [
  { id: 'INV-1042', client: 'Northbridge Tech',  amount: 4200,  status: 'paid',    due: '2026-03-10' },
  { id: 'INV-1041', client: 'Vertex Solutions',  amount: 8750,  status: 'pending', due: '2026-03-28' },
  { id: 'INV-1040', client: 'Meridian Retail',   amount: 1350,  status: 'overdue', due: '2026-03-05' },
  { id: 'INV-1039', client: 'Pacific Dynamics',  amount: 6100,  status: 'paid',    due: '2026-02-28' },
]

const RECENT_EXPENSES = [
  { desc: 'AWS Cloud Services',  category: 'Infrastructure', amount: 1240, date: 'Mar 22' },
  { desc: 'Team Offsite Lunch',  category: 'Meals',          amount:  320, date: 'Mar 18' },
  { desc: 'Adobe Creative Suite',category: 'Software',       amount:   89, date: 'Mar 15' },
  { desc: 'Office Supplies',     category: 'Supplies',       amount:  145, date: 'Mar 10' },
]

const STATUS_CONF = {
  paid:    { label: 'Paid',    cls: 'badge-active'   },
  pending: { label: 'Pending', cls: 'badge-pending'  },
  overdue: { label: 'Overdue', cls: 'badge-rejected' },
}

const INCOME_BREAKDOWN = [
  { label: 'Consulting',     pct: 55, color: '#10b981' },
  { label: 'Licensing',      pct: 28, color: '#6366f1' },
  { label: 'Support',        pct: 17, color: '#f59e0b' },
]

export default function BooksDashboardPage() {
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
              >BK</div>
              <h1 className="text-xl font-bold text-foreground">Aqua Books</h1>
            </div>
            <p className="text-sm text-muted-foreground">Finance overview · March 2026</p>
          </div>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium shadow-sm transition-opacity hover:opacity-90"
            style={{ backgroundColor: PRODUCT_COLOR }}
          >
            <Plus className="w-4 h-4" />
            New Invoice
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-6">

        {/* KPI strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Invoiced',   value: '$20.4k', sub: 'this month',   icon: FileText,      trend: +12, bg: 'bg-emerald-50', ic: 'text-emerald-600' },
            { label: 'Total Expenses',   value: '$1.8k',  sub: 'this month',   icon: Receipt,       trend: -5,  bg: 'bg-rose-50',    ic: 'text-rose-500'    },
            { label: 'Net Profit',       value: '$18.6k', sub: 'this month',   icon: TrendingUp,    trend: +18, bg: 'bg-blue-50',    ic: 'text-blue-600'    },
            { label: 'Pending Approvals',value: '3',      sub: 'awaiting you', icon: Clock,         trend: 0,   bg: 'bg-amber-50',   ic: 'text-amber-600'   },
          ].map((c) => (
            <div key={c.label} className="stat-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{c.label}</p>
                  <p className="text-xl font-bold text-foreground mt-0.5">{c.value}</p>
                  {c.trend !== 0 && (
                    <div className={`flex items-center gap-1 mt-0.5 text-[10px] font-medium ${c.trend > 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                      {c.trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {Math.abs(c.trend)}% vs last month
                    </div>
                  )}
                </div>
                <div className={`w-9 h-9 rounded-xl ${c.bg} flex items-center justify-center`}>
                  <c.icon className={`w-4.5 h-4.5 ${c.ic}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Recent invoices */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Recent Invoices</h3>
              <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">View all →</button>
            </div>
            <table className="w-full data-table">
              <thead>
                <tr>
                  <th className="text-left px-6 py-3">Invoice</th>
                  <th className="text-left px-4 py-3">Client</th>
                  <th className="text-right px-4 py-3">Amount</th>
                  <th className="text-left px-4 py-3">Due</th>
                  <th className="text-center px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {RECENT_INVOICES.map((inv) => {
                  const s = STATUS_CONF[inv.status as keyof typeof STATUS_CONF]
                  return (
                    <tr key={inv.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                      <td className="px-6 py-3 text-sm font-mono font-medium text-foreground">{inv.id}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{inv.client}</td>
                      <td className="px-4 py-3 text-right text-sm font-semibold text-foreground">
                        ${inv.amount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {new Date(inv.due).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={s.cls}>{s.label}</span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Income breakdown */}
          <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
            <h3 className="font-semibold text-foreground mb-5">Income Breakdown</h3>
            <div className="space-y-4">
              {INCOME_BREAKDOWN.map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-1.5 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="font-medium text-foreground">{item.label}</span>
                    </div>
                    <span className="text-muted-foreground font-semibold">{item.pct}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${item.pct}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-5 border-t border-border space-y-2.5">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Summary</h4>
              {[
                { label: 'Gross Revenue', value: '$20,400', color: 'text-foreground'   },
                { label: 'Expenses',      value: '-$1,794', color: 'text-rose-500'     },
                { label: 'Net Profit',    value: '$18,606', color: 'text-emerald-600'  },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{row.label}</span>
                  <span className={`font-semibold ${row.color}`}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent expenses */}
        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Recent Expenses</h3>
            <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">View all →</button>
          </div>
          <table className="w-full data-table">
            <thead>
              <tr>
                <th className="text-left px-6 py-3">Description</th>
                <th className="text-left px-4 py-3">Category</th>
                <th className="text-right px-4 py-3">Amount</th>
                <th className="text-left px-4 py-3">Date</th>
                <th className="text-center px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_EXPENSES.map((e) => (
                <tr key={e.desc} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-6 py-3 text-sm font-medium text-foreground">{e.desc}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{e.category}</span>
                  </td>
                  <td className="px-4 py-3 text-right text-sm text-rose-500 font-medium">-${e.amount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{e.date}</td>
                  <td className="px-4 py-3 text-center">
                    <button className="text-xs px-2.5 py-1 rounded-lg border border-border hover:bg-muted transition-colors text-muted-foreground">
                      Submit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  )
}
