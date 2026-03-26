'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Building2, CreditCard,
  Settings, ChevronDown, ShieldCheck,
  LayoutGrid, X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAdminFilter } from '@/lib/admin-filter-context'
import type { ProductFilter } from '@/lib/admin-filter-context'
import { AQUA_PRODUCTS } from '@/lib/admin-data'

const NAV_ITEMS = [
  {
    label: 'Overview',
    items: [
      { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Tenant Management',
    items: [
      { label: 'All Tenants',   href: '/admin/tenants',       icon: Building2  },
      { label: 'Subscriptions', href: '/admin/subscriptions', icon: CreditCard },
    ],
  },
  {
    label: 'Products',
    items: [
      { label: 'Aqua Products', href: '/admin/products', icon: LayoutGrid },
    ],
  },
  {
    label: 'Platform',
    items: [
      { label: 'Settings', href: '/admin/settings', icon: Settings },
    ],
  },
]

const FILTER_PILLS: { id: ProductFilter; label: string; color: string; dot: string }[] = [
  { id: 'all',   label: 'All',   color: 'bg-white/15 text-white border-white/20',                    dot: 'bg-white'           },
  { id: 'hr',    label: 'HR',    color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',            dot: 'bg-cyan-400'        },
  { id: 'crm',   label: 'CRM',   color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',      dot: 'bg-indigo-400'      },
  { id: 'books', label: 'Books', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',   dot: 'bg-emerald-400'     },
  { id: 'store', label: 'Store', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30',         dot: 'bg-amber-400'       },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const { productFilter, setProductFilter } = useAdminFilter()

  const activeProductMeta = productFilter !== 'all'
    ? AQUA_PRODUCTS.find((p) => p.id === productFilter)
    : null

  return (
    <aside className="w-64 min-h-screen bg-[#0a1628] flex flex-col">
      {/* Logo */}
      <div className="p-5 border-b border-white/10">
        <Link href="/admin/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-9 h-9 rounded-xl aqua-gradient flex items-center justify-center text-white font-bold text-base flex-shrink-0">
            A
          </div>
          <div>
            <div className="font-bold text-white text-base leading-tight">AQUA SUITE</div>
            <div className="text-[10px] text-white/50 flex items-center gap-1">
              <ShieldCheck className="w-2.5 h-2.5" /> Super Admin Console
            </div>
          </div>
        </Link>
      </div>

      {/* Product filter pills */}
      <div className="px-4 py-3 border-b border-white/10">
        <p className="text-[9px] font-semibold text-white/30 uppercase tracking-widest mb-2 px-1">
          Filter by Product
        </p>
        <div className="flex flex-wrap gap-1.5">
          {FILTER_PILLS.map((pill) => {
            const isActive = productFilter === pill.id
            return (
              <button
                key={pill.id}
                onClick={() => setProductFilter(pill.id)}
                className={cn(
                  'inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all duration-150',
                  pill.color,
                  isActive
                    ? 'ring-2 ring-white/30 scale-105 shadow-lg'
                    : 'opacity-60 hover:opacity-100'
                )}
              >
                {isActive && <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${pill.dot}`} />}
                {pill.label}
              </button>
            )
          })}
        </div>

        {/* Active filter banner */}
        {activeProductMeta && (
          <div className={`mt-2 flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-[11px] font-medium`}
            style={{
              backgroundColor: activeProductMeta.color + '18',
              borderColor: activeProductMeta.color + '40',
              color: activeProductMeta.color,
            }}>
            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 animate-pulse" style={{ backgroundColor: activeProductMeta.color }} />
            <span className="flex-1">Viewing: {activeProductMeta.name}</span>
            <button onClick={() => setProductFilter('all')} className="hover:opacity-80 transition-opacity">
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* Admin badge */}
      <div className="px-4 py-3 border-b border-white/10">
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-white/5 border border-white/10">
          <div className="w-7 h-7 rounded-md aqua-gradient flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-white truncate">Platform Administration</div>
            <div className="text-[10px] text-white/50">
              {productFilter === 'all'
                ? '1,247 tenants · All regions'
                : `${activeProductMeta?.name} · Filtered view`}
            </div>
          </div>
          <ChevronDown className="w-3 h-3 text-white/30 flex-shrink-0" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-6">
        {NAV_ITEMS.map((group) => (
          <div key={group.label}>
            <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest mb-2 px-2">
              {group.label}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer',
                        isActive
                          ? 'bg-white/15 text-white'
                          : 'text-white/60 hover:bg-white/8 hover:text-white'
                      )}
                    >
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      <span>{item.label}</span>
                      {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400" />}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Bottom user card */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/8 cursor-pointer transition-colors">
          <div className="w-8 h-8 rounded-full aqua-gradient flex items-center justify-center text-white text-xs font-bold flex-shrink-0">SA</div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-white truncate">Super Admin</div>
            <div className="text-[10px] text-white/50">admin@aquasuite.io</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
