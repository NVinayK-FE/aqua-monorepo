'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Building2, CreditCard, Users,
  Settings, LogOut, HelpCircle, ChevronDown, ShieldCheck, PartyPopper,
} from 'lucide-react'
import { cn } from '@/lib/utils'

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
      { label: 'All Tenants',    href: '/admin/tenants',       icon: Building2  },
      { label: 'Subscriptions',  href: '/admin/subscriptions', icon: CreditCard },
    ],
  },
  {
    label: 'Platform',
    items: [
      { label: 'Users',     href: '/admin/users',     icon: Users        },
      { label: 'Holidays',  href: '/admin/holidays',  icon: PartyPopper  },
      { label: 'Settings',  href: '/admin/settings',  icon: Settings     },
    ],
  },
]

export function AdminSidebar() {
  const pathname = usePathname()

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
              <ShieldCheck className="w-2.5 h-2.5" /> Super Admin
            </div>
          </div>
        </Link>
      </div>

      {/* Admin badge */}
      <div className="px-4 py-3 border-b border-white/10">
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-white/5 border border-white/10">
          <div className="w-7 h-7 rounded-md aqua-gradient flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-white truncate">Platform Administration</div>
            <div className="text-[10px] text-white/50">1,247 tenants · All regions</div>
          </div>
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
                const isActive = pathname === item.href
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

      {/* Bottom */}
      <div className="p-4 border-t border-white/10 space-y-1">
        <button className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-white/60 hover:bg-white/8 hover:text-white transition-all w-full">
          <HelpCircle className="w-4 h-4" /> Help & Support
        </button>
        <Link href="/login" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-white/60 hover:bg-white/8 hover:text-white transition-all w-full">
          <LogOut className="w-4 h-4" /> Sign out
        </Link>
        <div className="flex items-center gap-3 px-2 py-2 mt-2 rounded-lg hover:bg-white/8 cursor-pointer transition-colors">
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
