'use client'

import {
  ShoppingCart, Package, Users, BarChart2, TrendingUp,
  TrendingDown, Plus, CheckCircle2, Clock, AlertCircle,
} from 'lucide-react'

const PRODUCT_COLOR = '#f59e0b'

const RECENT_ORDERS = [
  { id: '#ORD-7821', customer: 'Aisha Patel',    items: 3, total: 289,  status: 'shipped',    date: 'Mar 25' },
  { id: '#ORD-7820', customer: 'Lucas Schmidt',  items: 1, total:  99,  status: 'processing', date: 'Mar 24' },
  { id: '#ORD-7819', customer: 'Fatima Al-Zahra',items: 5, total: 574,  status: 'delivered',  date: 'Mar 23' },
  { id: '#ORD-7818', customer: 'Ryan Choi',      items: 2, total: 148,  status: 'delivered',  date: 'Mar 22' },
  { id: '#ORD-7817', customer: 'Noa Goldstein',  items: 1, total:  55,  status: 'cancelled',  date: 'Mar 21' },
]

const LOW_STOCK = [
  { name: 'Aqua Desk Stand Pro',   sku: 'ADS-101', stock: 4,  threshold: 10 },
  { name: 'USB-C Hub 7-port',      sku: 'UCH-204', stock: 7,  threshold: 15 },
  { name: 'Wireless Charger Pad',  sku: 'WCP-078', stock: 2,  threshold: 10 },
]

const STATUS_CONF = {
  delivered:  { label: 'Delivered',  icon: CheckCircle2, cls: 'text-emerald-600', bg: 'bg-emerald-50' },
  shipped:    { label: 'Shipped',    icon: TrendingUp,   cls: 'text-blue-600',    bg: 'bg-blue-50'    },
  processing: { label: 'Processing', icon: Clock,        cls: 'text-amber-600',   bg: 'bg-amber-50'   },
  cancelled:  { label: 'Cancelled',  icon: AlertCircle,  cls: 'text-rose-500',    bg: 'bg-rose-50'    },
}

export default function StoreDashboardPage() {
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
              >ST</div>
              <h1 className="text-xl font-bold text-foreground">Aqua Store</h1>
            </div>
            <p className="text-sm text-muted-foreground">Store overview · March 2026</p>
          </div>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium shadow-sm transition-opacity hover:opacity-90"
            style={{ backgroundColor: PRODUCT_COLOR }}
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-6">

        {/* KPI strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Monthly Revenue', value: '$12.4k', trend: +22, icon: BarChart2,     bg: 'bg-amber-50',   ic: 'text-amber-600'   },
            { label: 'Orders',          value: '84',     trend: +8,  icon: ShoppingCart,  bg: 'bg-blue-50',    ic: 'text-blue-600'    },
            { label: 'Active Products', value: '138',    trend: +3,  icon: Package,       bg: 'bg-purple-50',  ic: 'text-purple-600'  },
            { label: 'Customers',       value: '1,204',  trend: +14, icon: Users,         bg: 'bg-emerald-50', ic: 'text-emerald-600' },
          ].map((c) => (
            <div key={c.label} className="stat-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{c.label}</p>
                  <p className="text-xl font-bold text-foreground mt-0.5">{c.value}</p>
                  <div className={`flex items-center gap-1 mt-0.5 text-[10px] font-medium ${c.trend > 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                    {c.trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {Math.abs(c.trend)}% vs last month
                  </div>
                </div>
                <div className={`w-9 h-9 rounded-xl ${c.bg} flex items-center justify-center`}>
                  <c.icon className={`w-4.5 h-4.5 ${c.ic}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Recent orders */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Recent Orders</h3>
              <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">View all →</button>
            </div>
            <table className="w-full data-table">
              <thead>
                <tr>
                  <th className="text-left px-6 py-3">Order</th>
                  <th className="text-left px-4 py-3">Customer</th>
                  <th className="text-center px-4 py-3">Items</th>
                  <th className="text-right px-4 py-3">Total</th>
                  <th className="text-center px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {RECENT_ORDERS.map((o) => {
                  const s = STATUS_CONF[o.status as keyof typeof STATUS_CONF]
                  const Icon = s.icon
                  return (
                    <tr key={o.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                      <td className="px-6 py-3 text-sm font-mono font-medium text-foreground">{o.id}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 text-xs font-bold">
                            {o.customer.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="text-sm text-foreground">{o.customer}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-muted-foreground">{o.items}</td>
                      <td className="px-4 py-3 text-right text-sm font-semibold text-foreground">${o.total}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${s.bg} ${s.cls}`}>
                          <Icon className="w-3 h-3" />
                          {s.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{o.date}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Low stock alerts */}
          <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-foreground">Low Stock Alerts</h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 font-medium border border-rose-200">
                {LOW_STOCK.length} items
              </span>
            </div>
            <div className="space-y-4">
              {LOW_STOCK.map((item) => {
                const pct = Math.round((item.stock / item.threshold) * 100)
                return (
                  <div key={item.sku}>
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <p className="text-sm font-medium text-foreground leading-tight">{item.name}</p>
                        <p className="text-[10px] text-muted-foreground">{item.sku}</p>
                      </div>
                      <span className="text-xs font-bold text-rose-500 flex-shrink-0 ml-2">{item.stock} left</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-rose-400"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Reorder at {item.threshold}</p>
                  </div>
                )
              })}
            </div>

            <button
              className="w-full mt-5 py-2 rounded-xl text-sm font-medium border border-border hover:bg-muted/50 transition-colors text-muted-foreground"
            >
              View all inventory →
            </button>
          </div>
        </div>

        {/* Quick stats row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {[
            { label: 'Avg Order Value', value: '$147.6',  sub: '+$12 vs last month'      },
            { label: 'Return Rate',     value: '2.4%',    sub: 'Below 5% target ✓'       },
            { label: 'Top Category',    value: 'Tech',    sub: '42% of total revenue'    },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-border p-5 shadow-sm">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-2xl font-bold text-foreground mt-1">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.sub}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
