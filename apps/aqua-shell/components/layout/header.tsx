'use client'

import { Search, Bell, Settings, ChevronDown } from 'lucide-react'

interface HeaderProps {
  title: string
  subtitle?: string
  actions?: React.ReactNode
}

export function Header({ title, subtitle, actions }: HeaderProps) {
  return (
    <header className="h-16 border-b border-border bg-white/80 backdrop-blur-sm sticky top-0 z-30 flex items-center px-6 gap-4">
      <div className="flex-1">
        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>

      {/* Search */}
      <div className="hidden md:flex items-center gap-2 bg-muted rounded-lg px-3 py-2 w-64">
        <Search className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent text-sm outline-none flex-1 text-foreground placeholder:text-muted-foreground"
        />
        <kbd className="hidden lg:inline-flex text-[10px] font-medium text-muted-foreground bg-background border border-border rounded px-1.5 py-0.5">
          ⌘K
        </kbd>
      </div>

      {/* Actions */}
      {actions}

      {/* Notifications */}
      <button className="relative w-9 h-9 rounded-lg hover:bg-muted flex items-center justify-center transition-colors text-muted-foreground hover:text-foreground">
        <Bell className="w-4 h-4" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-destructive" />
      </button>

      {/* User menu */}
      <button className="flex items-center gap-2.5 hover:bg-muted rounded-lg px-2 py-1.5 transition-colors">
        <div className="w-7 h-7 rounded-full aqua-gradient flex items-center justify-center text-white text-xs font-bold">
          JO
        </div>
        <div className="hidden md:block text-left">
          <div className="text-xs font-semibold text-foreground leading-tight">James Okafor</div>
          <div className="text-[10px] text-muted-foreground">HR Admin</div>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-muted-foreground hidden md:block" />
      </button>
    </header>
  )
}
