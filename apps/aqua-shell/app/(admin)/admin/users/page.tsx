'use client'

import { useState, useMemo } from 'react'
import {
  Users, ShieldCheck, UserCheck, UserX,
  Search, ChevronUp, ChevronDown, X,
  Mail, Building2, Clock, MoreVertical,
  ToggleLeft, ToggleRight, Trash2,
} from 'lucide-react'
import {
  ADMIN_USERS, ROLE_BADGE, STATUS_BADGE, fmtDate, relativeTime, AdminUser,
} from '@/lib/admin-data'

type SortField = 'name' | 'tenantName' | 'role' | 'status' | 'lastLogin' | 'createdAt'
type SortDir   = 'asc' | 'desc'
type UserStatus = AdminUser['status']

// ─── User Drawer ─────────────────────────────────────────────────────────────
function UserDrawer({
  user,
  onClose,
  onToggle,
}: {
  user: AdminUser
  onClose: () => void
  onToggle: (id: string) => void
}) {
  const roleBadge   = ROLE_BADGE[user.role]   ?? { label: user.role,   cls: 'bg-gray-100 text-gray-600' }
  const statusBadge = STATUS_BADGE[user.status] ?? { label: user.status, cls: 'badge-inactive' }
  const isActive    = user.status === 'active'

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="w-[440px] bg-white shadow-2xl flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="px-6 py-5 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full aqua-gradient flex items-center justify-center text-white font-bold text-sm">
              {user.initials}
            </div>
            <div>
              <h2 className="font-bold text-foreground">{user.name}</h2>
              <p className="text-sm text-muted-foreground">{user.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${roleBadge.cls}`}>{roleBadge.label}</span>
            <span className={statusBadge.cls}>{statusBadge.label}</span>
          </div>

          {/* Details */}
          <div className="bg-muted/40 rounded-xl p-4 space-y-3">
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Account Details</p>
            {[
              { icon: Mail,      label: 'Email',       value: user.email       },
              { icon: Building2, label: 'Tenant',      value: user.tenantName  },
              { icon: ShieldCheck,label: 'Role',       value: roleBadge.label  },
              { icon: Clock,     label: 'Last Login',  value: relativeTime(user.lastLogin) },
              { icon: UserCheck, label: 'Created',     value: fmtDate(user.createdAt) },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3 text-sm">
                <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <span className="text-muted-foreground w-24">{label}</span>
                <span className="font-medium text-foreground truncate">{value}</span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-3">Actions</p>
            <div className="space-y-2">
              <button
                onClick={() => { onToggle(user.id); onClose() }}
                className={`w-full flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                  isActive
                    ? 'border-rose-200 text-rose-600 hover:bg-rose-50'
                    : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                }`}
              >
                {isActive ? <ToggleLeft className="w-4 h-4" /> : <ToggleRight className="w-4 h-4" />}
                {isActive ? 'Deactivate User' : 'Activate User'}
              </button>
              <button
                onClick={() => { /* send invite */ onClose() }}
                className="w-full flex items-center gap-2 px-4 py-3 rounded-xl border border-border text-sm font-medium hover:bg-muted/50 transition-all"
              >
                <Mail className="w-4 h-4 text-primary" />
                Resend Invite Email
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function UsersPage() {
  const [search, setSearch]           = useState('')
  const [roleFilter, setRoleFilter]   = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortField, setSortField]     = useState<SortField>('name')
  const [sortDir, setSortDir]         = useState<SortDir>('asc')
  const [selected, setSelected]       = useState<AdminUser | null>(null)
  const [overrides, setOverrides]     = useState<Record<string, UserStatus>>({})

  // Stats
  const totalUsers   = ADMIN_USERS.length
  const activeUsers  = ADMIN_USERS.filter((u) => u.status === 'active').length
  const pendingUsers = ADMIN_USERS.filter((u) => u.status === 'pending').length
  const adminCount   = ADMIN_USERS.filter((u) => u.role === 'super_admin' || u.role === 'hr_admin').length

  const handleSort = (f: SortField) => {
    if (f === sortField) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortField(f); setSortDir('asc') }
  }

  const handleToggle = (id: string) => {
    setOverrides((o) => {
      const cur = (o[id] ?? ADMIN_USERS.find((u) => u.id === id)!.status) as UserStatus
      return { ...o, [id]: cur === 'active' ? 'inactive' : 'active' }
    })
  }

  const rows = useMemo(() => {
    let data = ADMIN_USERS.map((u) => ({
      ...u,
      status: overrides[u.id] ?? u.status,
    })) as AdminUser[]

    if (search) {
      const q = search.toLowerCase()
      data = data.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.tenantName.toLowerCase().includes(q)
      )
    }
    if (roleFilter !== 'all')   data = data.filter((u) => u.role === roleFilter)
    if (statusFilter !== 'all') data = data.filter((u) => u.status === statusFilter)

    data.sort((a, b) => {
      let av: string, bv: string
      switch (sortField) {
        case 'name':       av = a.name;       bv = b.name;       break
        case 'tenantName': av = a.tenantName; bv = b.tenantName; break
        case 'role':       av = a.role;       bv = b.role;       break
        case 'status':     av = a.status;     bv = b.status;     break
        case 'lastLogin':  av = a.lastLogin;  bv = b.lastLogin;  break
        case 'createdAt':  av = a.createdAt;  bv = b.createdAt;  break
        default:           av = a.name;       bv = b.name
      }
      if (av < bv) return sortDir === 'asc' ? -1 : 1
      if (av > bv) return sortDir === 'asc' ? 1 : -1
      return 0
    })
    return data
  }, [search, roleFilter, statusFilter, sortField, sortDir, overrides])

  const SortIcon = ({ field }: { field: SortField }) =>
    sortField === field
      ? sortDir === 'asc'
        ? <ChevronUp className="w-3 h-3 ml-1 inline" />
        : <ChevronDown className="w-3 h-3 ml-1 inline" />
      : <ChevronUp className="w-3 h-3 ml-1 inline opacity-20" />

  return (
    <div className="flex flex-col flex-1">
      {/* Header */}
      <div className="px-8 py-6 border-b border-border bg-white">
        <h1 className="text-xl font-bold text-foreground">Users</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Manage all platform users across tenants</p>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-6">

        {/* KPI cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Users',   value: String(totalUsers),  icon: Users,      color: 'text-cyan-600',    bg: 'bg-cyan-50'    },
            { label: 'Active',        value: String(activeUsers), icon: UserCheck,  color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Pending',       value: String(pendingUsers),icon: Clock,      color: 'text-amber-500',   bg: 'bg-amber-50'   },
            { label: 'Admins',        value: String(adminCount),  icon: ShieldCheck,color: 'text-primary',     bg: 'bg-primary/10' },
          ].map((c) => (
            <div key={c.label} className="stat-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{c.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-0.5">{c.value}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center`}>
                  <c.icon className={`w-5 h-5 ${c.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          {/* Toolbar */}
          <div className="px-6 py-4 border-b border-border flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="text-sm border border-border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="super_admin">Super Admin</option>
              <option value="hr_admin">HR Admin</option>
              <option value="manager">Manager</option>
              <option value="employee">Employee</option>
            </select>
            <select
              className="text-sm border border-border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
            <span className="text-xs text-muted-foreground ml-auto">{rows.length} user{rows.length !== 1 ? 's' : ''}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full data-table">
              <thead>
                <tr>
                  {([
                    ['name',       'User'],
                    ['tenantName', 'Tenant'],
                    ['role',       'Role'],
                    ['status',     'Status'],
                    ['lastLogin',  'Last Login'],
                    ['createdAt',  'Joined'],
                  ] as [SortField, string][]).map(([f, label]) => (
                    <th
                      key={f}
                      className="text-left px-5 py-3 cursor-pointer select-none hover:text-foreground transition-colors"
                      onClick={() => handleSort(f)}
                    >
                      {label}<SortIcon field={f} />
                    </th>
                  ))}
                  <th className="px-5 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((user) => {
                  const roleBadge   = ROLE_BADGE[user.role]    ?? { label: user.role,   cls: 'bg-gray-100 text-gray-600' }
                  const statusBadge = STATUS_BADGE[user.status] ?? { label: user.status, cls: 'badge-inactive' }
                  const isActive    = user.status === 'active'
                  return (
                    <tr
                      key={user.id}
                      className="border-b border-border last:border-0 hover:bg-muted/30 cursor-pointer"
                      onClick={() => setSelected(user)}
                    >
                      {/* User */}
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full aqua-gradient flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                            {user.initials}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">{user.name}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      {/* Tenant */}
                      <td className="px-5 py-3">
                        <p className="text-sm text-foreground">{user.tenantName}</p>
                        <p className="text-xs text-muted-foreground">{user.tenantId}</p>
                      </td>
                      {/* Role */}
                      <td className="px-5 py-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${roleBadge.cls}`}>
                          {roleBadge.label}
                        </span>
                      </td>
                      {/* Status */}
                      <td className="px-5 py-3">
                        <span className={statusBadge.cls}>{statusBadge.label}</span>
                      </td>
                      {/* Last login */}
                      <td className="px-5 py-3 text-sm text-muted-foreground">
                        {relativeTime(user.lastLogin)}
                      </td>
                      {/* Joined */}
                      <td className="px-5 py-3 text-sm text-muted-foreground">
                        {fmtDate(user.createdAt)}
                      </td>
                      {/* Actions */}
                      <td className="px-5 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleToggle(user.id)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              isActive
                                ? 'hover:bg-rose-50 text-rose-400'
                                : 'hover:bg-emerald-50 text-emerald-500'
                            }`}
                            title={isActive ? 'Deactivate' : 'Activate'}
                          >
                            {isActive ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
                            title="More options"
                            onClick={() => setSelected(user)}
                          >
                            <MoreVertical className="w-3.5 h-3.5" />
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

      {selected && (
        <UserDrawer
          user={selected}
          onClose={() => setSelected(null)}
          onToggle={handleToggle}
        />
      )}
    </div>
  )
}
