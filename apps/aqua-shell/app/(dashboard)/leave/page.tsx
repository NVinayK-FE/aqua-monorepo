'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChartTableToggle } from '@/components/charts/chart-table-toggle'
import { NewLeaveRequestModal } from '@/components/leave/new-leave-request-modal'
import type { NewLeaveRequestPayload } from '@/components/leave/new-leave-request-modal'
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import {
  Calendar, Clock, CheckCircle2, XCircle, Plus,
  Check, X, MoreHorizontal, Download, ThumbsUp, ThumbsDown,
} from 'lucide-react'
import { LEAVE_REQUESTS, leaveByType } from '@/lib/mock-data'
import { formatDate, getInitials, getAvatarColor, CHART_COLORS } from '@/lib/utils'
import type { LeaveRequest, LeaveStatus, LeaveType } from '@/types'

// ─── Static config ─────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<LeaveStatus, { label: string; class: string }> = {
  pending:   { label: 'Pending',   class: 'badge-pending'  },
  approved:  { label: 'Approved',  class: 'badge-approved' },
  rejected:  { label: 'Rejected',  class: 'badge-rejected' },
  cancelled: { label: 'Cancelled', class: 'badge-inactive' },
}

const LEAVE_TYPE_LABELS: Record<LeaveType, string> = {
  annual:    'Annual',
  sick:      'Sick',
  maternity: 'Maternity',
  paternity: 'Paternity',
  emergency: 'Emergency',
  unpaid:    'Unpaid',
}

const LEAVE_COLORS: Record<LeaveType, string> = {
  annual:    CHART_COLORS.primary,
  sick:      CHART_COLORS.danger,
  maternity: CHART_COLORS.purple,
  paternity: CHART_COLORS.indigo,
  emergency: CHART_COLORS.warning,
  unpaid:    CHART_COLORS.muted,
}

const monthlyLeave = [
  { month: 'Oct', approved: 12, pending: 2, rejected: 1 },
  { month: 'Nov', approved: 15, pending: 3, rejected: 2 },
  { month: 'Dec', approved: 8,  pending: 1, rejected: 0 },
  { month: 'Jan', approved: 18, pending: 4, rejected: 1 },
  { month: 'Feb', approved: 14, pending: 3, rejected: 2 },
  { month: 'Mar', approved: 16, pending: 3, rejected: 1 },
]

// ─── Component ─────────────────────────────────────────────────────────────────

export default function LeavePage() {
  const [modalOpen, setModalOpen]     = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [newRequests, setNewRequests] = useState<LeaveRequest[]>([])
  // Track status overrides for approve/reject (applies to both seed + new)
  const [statusOverrides, setStatusOverrides] = useState<Record<string, LeaveStatus>>({})
  // Confirmation popover id
  const [confirmId, setConfirmId]     = useState<string | null>(null)
  const [confirmAction, setConfirmAction] = useState<'approved' | 'rejected' | null>(null)

  // Merge seed data + newly submitted
  const allRequests: LeaveRequest[] = [
    ...newRequests,
    ...LEAVE_REQUESTS,
  ]

  // Apply status overrides
  const withOverrides = allRequests.map((r) =>
    statusOverrides[r.id] ? { ...r, status: statusOverrides[r.id] } : r
  )

  const filtered = withOverrides.filter(
    (l) => statusFilter === 'all' || l.status === statusFilter
  )

  const pendingCount  = withOverrides.filter((l) => l.status === 'pending').length
  const approvedCount = withOverrides.filter((l) => l.status === 'approved').length
  const rejectedCount = withOverrides.filter((l) => l.status === 'rejected').length

  const handleRequestSubmitted = (req: NewLeaveRequestPayload) => {
    setNewRequests((prev) => [req, ...prev])
  }

  const startAction = (id: string, action: 'approved' | 'rejected') => {
    setConfirmId(id)
    setConfirmAction(action)
  }

  const confirmStatusChange = () => {
    if (confirmId && confirmAction) {
      setStatusOverrides((prev) => ({ ...prev, [confirmId]: confirmAction }))
    }
    setConfirmId(null)
    setConfirmAction(null)
  }

  const cancelAction = () => {
    setConfirmId(null)
    setConfirmAction(null)
  }

  return (
    <div className="flex flex-col flex-1">
      <Header
        title="Leave & Attendance"
        subtitle="Manage employee leave requests, balances, and attendance"
        actions={
          <Button size="sm" onClick={() => setModalOpen(true)}>
            <Plus className="w-3.5 h-3.5" />
            New Request
          </Button>
        }
      />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">

        {/* ── New submissions banner ────────────────────────────────────── */}
        {newRequests.length > 0 && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-amber-200 bg-amber-50 text-sm">
            <Clock className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <span className="text-amber-800 font-medium">
              {newRequests.filter((r) => !statusOverrides[r.id]).length} new request{newRequests.filter((r) => !statusOverrides[r.id]).length !== 1 ? 's' : ''} pending approval
            </span>
            <button
              onClick={() => setStatusFilter('pending')}
              className="ml-auto text-xs text-amber-700 underline hover:text-amber-900 transition-colors"
            >
              View pending
            </button>
          </div>
        )}

        {/* ── KPIs ──────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            { label: 'On Leave Today',    value: '12',                          icon: Calendar,    color: 'text-cyan-600',    bg: 'bg-cyan-50'    },
            { label: 'Pending Requests',  value: String(pendingCount),          icon: Clock,       color: 'text-amber-600',   bg: 'bg-amber-50'   },
            { label: 'Approved (Q1)',     value: String(approvedCount),         icon: CheckCircle2,color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Rejected (Q1)',     value: String(rejectedCount),         icon: XCircle,     color: 'text-rose-600',    bg: 'bg-rose-50'    },
          ].map((c) => (
            <div key={c.label} className="stat-card">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{c.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{c.value}</p>
                </div>
                <div className={`w-9 h-9 rounded-xl ${c.bg} flex items-center justify-center flex-shrink-0`}>
                  <c.icon className={`w-4.5 h-4.5 ${c.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Charts ────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Monthly Leave Trend</CardTitle>
              <CardDescription>Approved, pending, and rejected by month</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartTableToggle
                chartContent={
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={monthlyLeave} barGap={2}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Bar dataKey="approved" name="Approved" fill={CHART_COLORS.success}  radius={[4, 4, 0, 0]} />
                      <Bar dataKey="pending"  name="Pending"  fill={CHART_COLORS.warning}  radius={[4, 4, 0, 0]} />
                      <Bar dataKey="rejected" name="Rejected" fill={CHART_COLORS.danger}   radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                }
                tableContent={
                  <table className="w-full text-sm data-table">
                    <thead><tr>
                      <th className="text-left px-3 py-2 rounded-l-lg">Month</th>
                      <th className="text-right px-3 py-2">Approved</th>
                      <th className="text-right px-3 py-2">Pending</th>
                      <th className="text-right px-3 py-2 rounded-r-lg">Rejected</th>
                    </tr></thead>
                    <tbody>
                      {monthlyLeave.map((row) => (
                        <tr key={row.month} className="border-b border-border last:border-0 hover:bg-muted/30">
                          <td className="px-3 py-2.5 font-medium">{row.month}</td>
                          <td className="px-3 py-2.5 text-right text-emerald-600">{row.approved}</td>
                          <td className="px-3 py-2.5 text-right text-amber-600">{row.pending}</td>
                          <td className="px-3 py-2.5 text-right text-rose-600">{row.rejected}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                }
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Leave by Type</CardTitle>
              <CardDescription>Days taken per leave category this quarter</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartTableToggle
                chartContent={
                  <>
                    <ResponsiveContainer width="100%" height={160}>
                      <PieChart>
                        <Pie
                          data={leaveByType} cx="50%" cy="50%" outerRadius={65}
                          dataKey="count" paddingAngle={2}
                          label={({ type, percent }) => `${type} ${(percent * 100).toFixed(0)}%`}
                          labelLine={false}
                        >
                          {leaveByType.map((entry, i) => (
                            <Cell key={i} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(v) => [`${v} days`, '']} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {leaveByType.map((l) => (
                        <div key={l.type} className="flex items-center gap-2 text-xs">
                          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: l.fill }} />
                          <span className="text-muted-foreground">{l.type}</span>
                          <span className="font-medium ml-auto">{l.count}d</span>
                        </div>
                      ))}
                    </div>
                  </>
                }
                tableContent={
                  <table className="w-full text-sm data-table">
                    <thead><tr>
                      <th className="text-left px-3 py-2 rounded-l-lg">Leave Type</th>
                      <th className="text-right px-3 py-2">Days</th>
                      <th className="text-right px-3 py-2 rounded-r-lg">% Share</th>
                    </tr></thead>
                    <tbody>
                      {leaveByType.map((l) => (
                        <tr key={l.type} className="border-b border-border last:border-0 hover:bg-muted/30">
                          <td className="px-3 py-2.5">{l.type}</td>
                          <td className="px-3 py-2.5 text-right font-medium">{l.count}</td>
                          <td className="px-3 py-2.5 text-right text-muted-foreground">
                            {Math.round((l.count / leaveByType.reduce((s, x) => s + x.count, 0)) * 100)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                }
              />
            </CardContent>
          </Card>
        </div>

        {/* ── Leave requests table ──────────────────────────────────────── */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle>Leave Requests</CardTitle>
                <CardDescription>{filtered.length} request{filtered.length !== 1 ? 's' : ''}</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                {/* Status filter tabs */}
                <div className="flex rounded-lg border border-input overflow-hidden text-xs">
                  {(['all', 'pending', 'approved', 'rejected'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatusFilter(s)}
                      className={`px-3 py-1.5 capitalize transition-colors ${
                        statusFilter === s
                          ? 'bg-primary text-white'
                          : 'bg-white text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <Button variant="outline" size="sm">
                  <Download className="w-3.5 h-3.5" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full data-table">
                <thead>
                  <tr>
                    <th className="text-left px-6 py-3">Employee</th>
                    <th className="text-left px-4 py-3">Type</th>
                    <th className="text-left px-4 py-3">Duration</th>
                    <th className="text-left px-4 py-3">Days</th>
                    <th className="text-left px-4 py-3">Reason</th>
                    <th className="text-center px-4 py-3">Status</th>
                    <th className="text-center px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((req) => {
                    const initials    = getInitials(req.employeeName)
                    const avatarClass = getAvatarColor(req.employeeName)
                    const s           = STATUS_CONFIG[req.status]
                    const lColor      = LEAVE_COLORS[req.leaveType]
                    const isPending   = req.status === 'pending'
                    const isNew       = newRequests.some((n) => n.id === req.id)
                    const isConfirming = confirmId === req.id

                    return (
                      <tr
                        key={req.id}
                        className={`border-b border-border last:border-0 transition-colors ${
                          isNew && isPending ? 'bg-amber-50/50 hover:bg-amber-50' : 'hover:bg-muted/30'
                        }`}
                      >
                        {/* Employee */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${avatarClass}`}>
                              {initials}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                                {req.employeeName}
                                {isNew && (
                                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700">NEW</span>
                                )}
                              </p>
                              <p className="text-xs text-muted-foreground">{req.department}</p>
                            </div>
                          </div>
                        </td>

                        {/* Leave type */}
                        <td className="px-4 py-4">
                          <span
                            className="inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full"
                            style={{ backgroundColor: lColor + '20', color: lColor }}
                          >
                            {LEAVE_TYPE_LABELS[req.leaveType]}
                          </span>
                        </td>

                        {/* Duration */}
                        <td className="px-4 py-4 text-sm text-muted-foreground whitespace-nowrap">
                          {formatDate(req.startDate, { month: 'short', day: 'numeric' })} –{' '}
                          {formatDate(req.endDate,   { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>

                        {/* Days */}
                        <td className="px-4 py-4">
                          <span className="text-sm font-semibold text-foreground">{req.days}d</span>
                        </td>

                        {/* Reason */}
                        <td className="px-4 py-4 max-w-[160px]">
                          <span className="text-sm text-muted-foreground line-clamp-1">{req.reason}</span>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-4 text-center">
                          <span className={s.class}>{s.label}</span>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-4 text-center">
                          {isPending ? (
                            isConfirming ? (
                              /* Inline confirmation */
                              <div className="flex items-center justify-center gap-1.5">
                                <span className="text-xs text-muted-foreground mr-1">
                                  {confirmAction === 'approved' ? 'Approve?' : 'Reject?'}
                                </span>
                                <button
                                  onClick={confirmStatusChange}
                                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold text-white transition-colors ${
                                    confirmAction === 'approved' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-rose-500 hover:bg-rose-600'
                                  }`}
                                >
                                  Yes
                                </button>
                                <button
                                  onClick={cancelAction}
                                  className="px-2.5 py-1 rounded-lg text-xs font-medium border border-border hover:bg-muted transition-colors"
                                >
                                  No
                                </button>
                              </div>
                            ) : (
                              /* Approve / Reject buttons */
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  onClick={() => startAction(req.id, 'approved')}
                                  title="Approve"
                                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 text-xs font-medium transition-colors"
                                >
                                  <Check className="w-3.5 h-3.5" /> Approve
                                </button>
                                <button
                                  onClick={() => startAction(req.id, 'rejected')}
                                  title="Reject"
                                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-medium transition-colors"
                                >
                                  <X className="w-3.5 h-3.5" /> Reject
                                </button>
                              </div>
                            )
                          ) : (
                            <button className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors mx-auto">
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>

              {filtered.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Calendar className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm font-medium">No requests found</p>
                  <p className="text-xs mt-1">Try changing your filter or submit a new request</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal */}
      <NewLeaveRequestModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onRequestSubmitted={handleRequestSubmitted}
      />
    </div>
  )
}
