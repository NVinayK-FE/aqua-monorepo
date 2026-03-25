'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Calendar, Clock, DollarSign, Star, User, PartyPopper, LogOut, HelpCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { label: 'My Dashboard',   href: '/employee',            icon: LayoutDashboard },
  { label: 'My Leave',       href: '/employee/leave',      icon: Calendar        },
  { label: 'My Timesheet',   href: '/employee/timesheet',  icon: Clock           },
  { label: 'My Payslips',    href: '/employee/payslips',   icon: DollarSign      },
  { label: 'My Performance', href: '/employee/performance',icon: Star            },
  { label: 'Holidays',       href: '/employee/holidays',   icon: PartyPopper     },
  { label: 'My Profile',     href: '/employee/profile',    icon: User            },
]

// Tom Anderson — logged-in employee
const ME = { name: 'Tom Anderson', initials: 'TA', position: 'Full Stack Developer', dept: 'Engineering', email: 'tom.a@acme.com' }

export function EmployeeSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-border flex flex-col">
      {/* Logo */}
      <div className="p-5 border-b border-border">
        <Link href="/employee" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-9 h-9 rounded-xl aqua-gradient flex items-center justify-center text-white font-bold text-base flex-shrink-0">
            A
          </div>
          <div>
            <div className="font-bold text-foreground text-base leading-tight">AQUA SUITE</div>
            <div className="text-[10px] text-muted-foreground">Employee Portal</div>
          </div>
        </Link>
      </div>

      {/* Employee identity card */}
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-accent/40 border border-primary/10">
          <div className="w-9 h-9 rounded-full aqua-gradient flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {ME.initials}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-foreground truncate">{ME.name}</div>
            <div className="text-[10px] text-muted-foreground truncate">{ME.position} · {ME.dept}</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2 px-2">My Workspace</p>
        <ul className="space-y-0.5">
          {NAV_ITEMS.map((item) => {
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
                  {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-border space-y-1">
        <button className="nav-item nav-item-inactive w-full">
          <HelpCircle className="w-4 h-4" /> Help & Support
        </button>
        <Link href="/login" className="nav-item nav-item-inactive w-full flex">
          <LogOut className="w-4 h-4" /> Sign out
        </Link>
      </div>
    </aside>
  )
}
