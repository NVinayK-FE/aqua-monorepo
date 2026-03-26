'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard, Calendar, Clock, DollarSign, Star, User, PartyPopper,
  Users, TrendingUp, FileText, ShoppingBag, BarChart2,
  Receipt, CheckCircle2, ArrowLeftRight, PieChart, Activity,
  BookOpen, Menu, X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { PRODUCT_MAP, AquaProductId } from '@/lib/admin-data'

// ─── Per-product navigation ────────────────────────────────────────────────────

const PRODUCT_NAV: Record<AquaProductId, { label: string; href: string; icon: React.ElementType }[]> = {
  hr: [
    { label: 'My Dashboard',   href: '/employee',             icon: LayoutDashboard },
    { label: 'My Leave',       href: '/employee/leave',       icon: Calendar        },
    { label: 'My Timesheet',   href: '/employee/timesheet',   icon: Clock           },
    { label: 'My Payslips',    href: '/employee/payslips',    icon: DollarSign      },
    { label: 'My Performance', href: '/employee/performance', icon: Star            },
    { label: 'Holidays',       href: '/employee/holidays',    icon: PartyPopper     },
    { label: 'My Profile',     href: '/employee/profile',     icon: User            },
  ],
  crm: [
    { label: 'Dashboard',   href: '/employee/crm',            icon: LayoutDashboard },
    { label: 'My Pipeline', href: '/employee/crm/pipeline',   icon: TrendingUp      },
    { label: 'Contacts',    href: '/employee/crm/contacts',   icon: Users           },
    { label: 'My Deals',    href: '/employee/crm/deals',      icon: ArrowLeftRight  },
    { label: 'Activities',  href: '/employee/crm/activities', icon: Activity        },
    { label: 'Reports',     href: '/employee/crm/reports',    icon: BarChart2       },
  ],
  books: [
    { label: 'Dashboard',  href: '/employee/books',           icon: LayoutDashboard },
    { label: 'Invoices',   href: '/employee/books/invoices',  icon: FileText        },
    { label: 'Expenses',   href: '/employee/books/expenses',  icon: Receipt         },
    { label: 'Reports',    href: '/employee/books/reports',   icon: PieChart        },
    { label: 'Approvals',  href: '/employee/books/approvals', icon: CheckCircle2    },
  ],
  store: [
    { label: 'Dashboard',  href: '/employee/store',           icon: LayoutDashboard },
    { label: 'Orders',     href: '/employee/store/orders',    icon: ShoppingBag     },
    { label: 'Products',   href: '/employee/store/products',  icon: BookOpen        },
    { label: 'Customers',  href: '/employee/store/customers', icon: Users           },
    { label: 'Analytics',  href: '/employee/store/analytics', icon: BarChart2       },
  ],
}

// Lucide icons per product (for the rail)
const PRODUCT_ICON: Record<AquaProductId, React.ElementType> = {
  hr:    Users,
  crm:   TrendingUp,
  books: BookOpen,
  store: ShoppingBag,
}

const SECTION_LABEL: Record<AquaProductId, string> = {
  hr:    'My Workspace',
  crm:   'Sales & CRM',
  books: 'Finance',
  store: 'Store',
}

const PRODUCT_ROOT: Record<AquaProductId, string> = {
  hr:    '/employee',
  crm:   '/employee/crm',
  books: '/employee/books',
  store: '/employee/store',
}

const LICENSED: AquaProductId[] = ['hr', 'crm', 'books', 'store']

const ME = { name: 'Tom Anderson', initials: 'TA', position: 'Full Stack Developer', dept: 'Engineering' }

function getActiveProduct(pathname: string): AquaProductId {
  if (pathname.startsWith('/employee/crm'))   return 'crm'
  if (pathname.startsWith('/employee/books')) return 'books'
  if (pathname.startsWith('/employee/store')) return 'store'
  return 'hr'
}

export function EmployeeSidebar() {
  const pathname      = usePathname()
  const activeProduct = getActiveProduct(pathname)
  const activeMeta    = PRODUCT_MAP[activeProduct]
  const navItems      = PRODUCT_NAV[activeProduct]

  // locked = hamburger was clicked → stay expanded
  // hovered = mouse is over the rail → temporarily expand
  const [locked,  setLocked]  = useState(false)
  const [hovered, setHovered] = useState(false)

  const expanded = locked || hovered

  // Collapsed rail: 60px DOM space. Hovered: absolute overlay at 220px.
  // Locked: DOM space itself widens to 220px (pushes secondary nav).
  const COLLAPSED_W = 60
  const EXPANDED_W  = 220

  return (
    <div className="flex min-h-screen flex-shrink-0">

      {/* ═══════════════════════════════════════════════════════════════════════
          PRIMARY RAIL
          DOM width = locked ? 220px : 60px  (transition so layout shift is smooth)
          Visual panel expands to 220px on hover/lock via absolute positioning.
      ═══════════════════════════════════════════════════════════════════════ */}
      <div
        className="relative flex-shrink-0 min-h-screen"
        style={{
          width:      locked ? EXPANDED_W : COLLAPSED_W,
          transition: 'width 220ms cubic-bezier(0.4,0,0.2,1)',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Visual panel (absolute so hover-expand overlays secondary nav) */}
        <div
          className="absolute top-0 left-0 min-h-screen bg-[#0d1117] flex flex-col overflow-hidden z-20"
          style={{
            width:      expanded ? EXPANDED_W : COLLAPSED_W,
            transition: 'width 220ms cubic-bezier(0.4,0,0.2,1)',
            boxShadow:  hovered && !locked ? '6px 0 24px rgba(0,0,0,0.35)' : 'none',
            borderRight: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          {/* ── Hamburger ────────────────────────────────────────────────── */}
          <div className="flex items-center px-3 pt-4 pb-3">
            <button
              onClick={() => { setLocked(l => !l); setHovered(false) }}
              className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all flex-shrink-0"
              title={locked ? 'Collapse sidebar' : 'Pin sidebar open'}
            >
              {locked ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>

            {/* Brand name — visible when expanded */}
            <div
              className="ml-2 overflow-hidden"
              style={{
                opacity:    expanded ? 1 : 0,
                width:      expanded ? 'auto' : 0,
                transition: 'opacity 150ms ease',
                whiteSpace: 'nowrap',
              }}
            >
              <span className="text-white font-bold text-sm tracking-wide">AQUA SUITE</span>
            </div>
          </div>

          {/* ── Divider ──────────────────────────────────────────────────── */}
          <div className="mx-3 mb-3 h-px bg-white/[0.06]" />

          {/* ── Product items ─────────────────────────────────────────────── */}
          <nav className="flex-1 px-2 space-y-0.5 overflow-y-auto overflow-x-hidden">
            {/* Section label — only when expanded */}
            <div
              className="px-2 mb-2 overflow-hidden"
              style={{
                maxHeight:  expanded ? 24 : 0,
                opacity:    expanded ? 1 : 0,
                transition: 'max-height 200ms ease, opacity 150ms ease',
              }}
            >
              <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-widest whitespace-nowrap">
                Products
              </span>
            </div>

            {LICENSED.map((pid) => {
              const meta     = PRODUCT_MAP[pid]
              const isActive = pid === activeProduct
              const Icon     = PRODUCT_ICON[pid]

              return (
                <Link
                  key={pid}
                  href={PRODUCT_ROOT[pid]}
                  className={cn(
                    'relative flex items-center gap-3 rounded-lg transition-all duration-150 overflow-hidden',
                    'py-2.5',
                    expanded ? 'px-3' : 'px-0 justify-center',
                    isActive
                      ? 'text-white'
                      : 'text-slate-500 hover:text-slate-200 hover:bg-white/[0.06]',
                  )}
                  style={isActive ? { backgroundColor: 'rgba(255,255,255,0.08)' } : undefined}
                >
                  {/* Left accent bar for active */}
                  {isActive && (
                    <span
                      className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full"
                      style={{ backgroundColor: meta.color }}
                    />
                  )}

                  {/* Icon — colored dot backdrop when active */}
                  <div
                    className={cn(
                      'flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all',
                      expanded ? '' : 'mx-auto',
                    )}
                    style={isActive
                      ? { backgroundColor: meta.color + '25' }
                      : { backgroundColor: 'transparent' }
                    }
                  >
                    <Icon
                      className="w-4 h-4 flex-shrink-0"
                      style={{ color: isActive ? meta.color : undefined }}
                    />
                  </div>

                  {/* Name + tagline — visible when expanded */}
                  <div
                    className="overflow-hidden"
                    style={{
                      opacity:    expanded ? 1 : 0,
                      width:      expanded ? 'auto' : 0,
                      minWidth:   expanded ? 0 : 0,
                      transition: 'opacity 150ms ease 60ms',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <p className="text-[13px] font-semibold leading-tight">{meta.name}</p>
                    <p className="text-[10px] text-slate-500 leading-tight mt-0.5">{meta.tagline}</p>
                  </div>
                </Link>
              )
            })}
          </nav>

          {/* ── Divider ──────────────────────────────────────────────────── */}
          <div className="mx-3 mt-3 h-px bg-white/[0.06]" />

          {/* ── User avatar / card ───────────────────────────────────────── */}
          <div className="px-2 py-3">
            <div className={cn('flex items-center gap-3 rounded-lg', expanded ? 'px-3 py-2 hover:bg-white/[0.06]' : 'justify-center py-2')}>
              <div className="relative flex-shrink-0">
                <div className="w-8 h-8 rounded-full aqua-gradient flex items-center justify-center text-white text-xs font-bold">
                  {ME.initials}
                </div>
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 border-2 border-[#0d1117]" />
              </div>

              <div
                className="overflow-hidden"
                style={{
                  opacity:    expanded ? 1 : 0,
                  width:      expanded ? 'auto' : 0,
                  transition: 'opacity 150ms ease',
                  whiteSpace: 'nowrap',
                }}
              >
                <p className="text-[12px] font-semibold text-white leading-tight">{ME.name}</p>
                <p className="text-[10px] text-slate-500 leading-tight mt-0.5">{ME.dept}</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECONDARY NAV — contextual items for the active product
      ═══════════════════════════════════════════════════════════════════════ */}
      <div className="w-[196px] min-h-screen bg-white border-r border-border flex flex-col flex-shrink-0">

        {/* Product header */}
        <div className="px-4 pt-4 pb-3 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: activeMeta.color + '20' }}
            >
              {(() => { const Icon = PRODUCT_ICON[activeProduct]; return <Icon className="w-3.5 h-3.5" style={{ color: activeMeta.color }} /> })()}
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-bold text-foreground leading-tight truncate">{activeMeta.name}</p>
              <p className="text-[9px] text-muted-foreground truncate leading-tight">{activeMeta.tagline}</p>
            </div>
          </div>
        </div>

        {/* User identity chip */}
        <div className="px-3 py-2.5 border-b border-border">
          <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-accent/50">
            <div className="w-6 h-6 rounded-full aqua-gradient flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0">
              {ME.initials}
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-foreground truncate leading-tight">{ME.name}</p>
              <p className="text-[9px] text-muted-foreground truncate">{ME.dept}</p>
            </div>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto px-3 py-3">
          <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-2 px-2">
            {SECTION_LABEL[activeProduct]}
          </p>
          <ul className="space-y-0.5">
            {navItems.map((item) => {
              const isActive =
                activeProduct === 'hr'
                  ? pathname === item.href
                  : pathname === item.href || pathname.startsWith(item.href + '/')

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[12px] transition-all',
                      isActive
                        ? 'font-semibold'
                        : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                    )}
                    style={
                      isActive
                        ? { backgroundColor: activeMeta.color + '15', color: activeMeta.color }
                        : undefined
                    }
                  >
                    <item.icon className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{item.label}</span>
                    {isActive && (
                      <div
                        className="ml-auto w-1 h-1 rounded-full flex-shrink-0"
                        style={{ backgroundColor: activeMeta.color }}
                      />
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Coloured bottom accent */}
        <div className="p-3 border-t" style={{ borderTopColor: activeMeta.color + '25' }}>
          <div
            className="px-3 py-2 rounded-lg"
            style={{ backgroundColor: activeMeta.color + '10' }}
          >
            <p className="text-[10px] font-semibold" style={{ color: activeMeta.color }}>
              {activeMeta.name}
            </p>
            <p className="text-[9px] text-muted-foreground mt-0.5">{activeMeta.tagline}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
