'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  DollarSign,
  Calendar,
  Star,
  Settings,
  CreditCard,
  ChevronDown,
  Building2,
  LogOut,
  HelpCircle,
  Bell,
  PartyPopper,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  {
    label: 'Overview',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    label: 'HR Management',
    items: [
      { label: 'Employees', href: '/employees', icon: Users },
      { label: 'Payroll', href: '/payroll', icon: DollarSign },
      { label: 'Leave & Attendance', href: '/leave',     icon: Calendar     },
      { label: 'Performance',       href: '/performance',icon: Star         },
      { label: 'Holidays',          href: '/holidays',   icon: PartyPopper  },
    ],
  },
  {
    label: 'Administration',
    items: [
      { label: 'Licensing', href: '/licensing', icon: CreditCard },
      { label: 'Settings', href: '/settings', icon: Settings },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-border flex flex-col">
      {/* Logo */}
      <div className="p-5 border-b border-border">
        <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-9 h-9 rounded-xl aqua-gradient flex items-center justify-center text-white font-bold text-base flex-shrink-0">
            A
          </div>
          <div>
            <div className="font-bold text-foreground text-base leading-tight">AQUA SUITE</div>
            <div className="text-[10px] text-muted-foreground">Human Resource Management</div>
          </div>
        </Link>
      </div>

      {/* Tenant badge */}
      <div className="px-4 py-3 border-b border-border">
        <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg bg-accent/50 hover:bg-accent transition-colors text-left">
          <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
            <Building2 className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-foreground truncate">Acme Corporation</div>
            <div className="text-[10px] text-muted-foreground">Pro Plan · 176 employees</div>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-6">
        {NAV_ITEMS.map((group) => (
          <div key={group.label}>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2 px-2">
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
                        'nav-item',
                        isActive ? 'nav-item-active' : 'nav-item-inactive'
                      )}
                    >
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      <span>{item.label}</span>
                      {isActive && (
                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="p-4 border-t border-border space-y-1">
        <button className="nav-item nav-item-inactive w-full">
          <HelpCircle className="w-4 h-4" />
          Help & Support
        </button>
        <button className="nav-item nav-item-inactive w-full">
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
        {/* User */}
        <div className="flex items-center gap-3 px-2 py-2 mt-2 rounded-lg hover:bg-muted cursor-pointer transition-colors">
          <div className="w-8 h-8 rounded-full aqua-gradient flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            JO
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-foreground truncate">James Okafor</div>
            <div className="text-[10px] text-muted-foreground">HR Admin</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
