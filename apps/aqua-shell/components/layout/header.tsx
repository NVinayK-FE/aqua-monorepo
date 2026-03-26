'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Search, Bell, ChevronDown, HelpCircle, LogOut, User, Settings, ExternalLink } from 'lucide-react'

interface HeaderProps {
  title: string
  subtitle?: string
  actions?: React.ReactNode
}

export function Header({ title, subtitle, actions }: HeaderProps) {
  const [profileOpen, setProfileOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileOpen(false)
      }
    }
    if (profileOpen) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [profileOpen])

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

      {/* Profile dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setProfileOpen((v) => !v)}
          className={`flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors ${
            profileOpen ? 'bg-muted' : 'hover:bg-muted'
          }`}
        >
          <div className="w-7 h-7 rounded-full aqua-gradient flex items-center justify-center text-white text-xs font-bold">
            JO
          </div>
          <div className="hidden md:block text-left">
            <div className="text-xs font-semibold text-foreground leading-tight">James Okafor</div>
            <div className="text-[10px] text-muted-foreground">HR Admin</div>
          </div>
          <ChevronDown
            className={`w-3.5 h-3.5 text-muted-foreground hidden md:block transition-transform duration-150 ${
              profileOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Dropdown panel */}
        {profileOpen && (
          <div className="absolute right-0 top-[calc(100%+6px)] w-56 rounded-xl border border-border bg-white shadow-lg shadow-black/8 overflow-hidden z-50">
            {/* User info */}
            <div className="px-4 py-3 bg-muted/40 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full aqua-gradient flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  JO
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-foreground truncate">James Okafor</div>
                  <div className="text-[11px] text-muted-foreground truncate">j.okafor@acme.com</div>
                </div>
              </div>
              <div className="mt-2">
                <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                  HR Admin
                </span>
              </div>
            </div>

            {/* Menu items */}
            <div className="p-1.5 space-y-0.5">
              <Link
                href="/settings"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm text-foreground hover:bg-muted transition-colors"
              >
                <User className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                My Profile
              </Link>
              <Link
                href="/settings"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm text-foreground hover:bg-muted transition-colors"
              >
                <Settings className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                Account Settings
              </Link>
            </div>

            <div className="border-t border-border p-1.5 space-y-0.5">
              <button
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm text-foreground hover:bg-muted transition-colors"
              >
                <HelpCircle className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                Help & Support
                <ExternalLink className="w-3 h-3 text-muted-foreground ml-auto" />
              </button>
            </div>

            <div className="border-t border-border p-1.5">
              <Link
                href="/login"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/8 transition-colors"
              >
                <LogOut className="w-4 h-4 flex-shrink-0" />
                Sign out
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
