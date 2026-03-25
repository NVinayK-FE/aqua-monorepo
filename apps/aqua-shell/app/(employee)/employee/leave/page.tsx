'use client'

import { useState, useMemo } from 'react'
import {
  Calendar, Plus, X, ChevronLeft, ChevronRight,
  CheckCircle2, Clock, XCircle, AlertTriangle, FileText,
} from 'lucide-react'
import { LEAVE_REQUESTS } from '@/lib/mock-data'
import type { LeaveType, LeaveStatus } from '@/types'

// ─── Tom Anderson data ────────────────────────────────────────────────────────
const MY_SEED = LEAVE_REQUESTS.filter((r) => r.employeeId === 'e10')

const BALANCES: { type: LeaveType; label: string; total: number; used: number; color: string }[] = [
  { type: 'annual',    label: 'Annual',    total: 25, used: 5,  color: '#00bcd4' },
  { type: 'sick',      label: 'Sick',      total: 14, used: 2,  color: '#ef5350' },
  { type: 'emergency', label: 'Emergency', total: 5,  used: 0,  color: '#ff9800' },
  { type: 'unpaid',    label: 'Unpaid',    total: 30, used: 0,  color: '#9e9e9e' },
]

const LEAVE_COLORS: Record<string, string> = {
  annual: 'bg-cyan-100 text-cyan-700',
  sick: 'bg-rose-100 text-rose-700',
  maternity: 'bg-pink-100 text-pink-700',
  paternity: 'bg-blue-100 text-blue-700',
  emergency: 'bg-amber-100 text-amber-700',
  unpaid: 'bg-gray-100 text-gray-600',
}

function countWorkingDays(start: string, end: string) {
  if (!start || !end) return 0
  let count = 0
  const cur = new Date(start)
  const last = new Date(end)
  while (cur <= last) {
    const d = cur.getDay()
    if (d !== 0 && d !== 6) count++
    cur.setDate(cur.getDate() + 1)
  }
  return count
}

const STATUS_CONF: Record<LeaveStatus, { label: string; cls: string; icon: React.ElementType }> = {
  pending:   { label: 'Pending',   cls: 'badge-pending',  icon: Clock        },
  approved:  { label: 'Approved',  cls: 'badge-approved', icon: CheckCircle2 },
  rejected:  { label: 'Rejected',  cls: 'badge-rejected', icon: XCircle      },
  cancelled: { label: 'Cancelled', cls: 'badge-inactive', icon: XCircle      },
}

// ─── New Leave Request Drawer ─────────────────────────────────────────────────
function NewLeaveDrawer({ onClose, onSubmit }: {
  onClose: () => void
  onSubmit: (r: { leaveType: LeaveType; startDate: string; endDate: string; days: number; reason: string }) => void
}) {
  const [leaveType, setLeaveType] = useState<LeaveType>('annual')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate]     = useState('')
  const [reason, setReason]       = useState('')
  const [error, setError]         = useState('')

  const workingDays = countWorkingDays(startDate, endDate)
  const balance     = BALANCES.find((b) => b.type === leaveType)
  const remaining   = balance ? balance.total - balance.used : 99
  const overBalance = leaveType !== 'unpaid' && workingDays > remaining

  const submit = () => {
    if (!startDate || !endDate || !reason.trim()) { setError('Please fill all fields.'); return }
    if (new Date(endDate) < new Date(startDate)) { setError('End date must be after start date.'); return }
    if (workingDays === 0) { setError('Selected range contains no working days.'); return }
    onSubmit({ leaveType, startDate, endDate, days: workingDays, reason: reason.trim() })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="w-[460px] bg-white shadow-2xl flex flex-col animate-slide-in-right">
        <div className="px-6 py-5 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="font-bold text-foreground text-lg">New Leave Request</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Request will be sent to your manager</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Leave type */}
          <div>
            <label className="text-sm font-semibold text-foreground block mb-3">Leave Type</label>
            <div className="grid grid-cols-2 gap-2">
              {BALANCES.map((b) => (
                <button
                  key={b.type}
                  onClick={() => setLeaveType(b.type)}
                  className={`relative flex flex-col px-4 py-3 rounded-xl border-2 text-left transition-all ${
                    leaveType === b.type
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/40'
                  }`}
                >
                  <span className="text-sm font-semibold text-foreground">{b.label}</span>
                  <span className="text-xs text-muted-foreground mt-0.5">
                    {b.type === 'unpaid' ? 'No limit' : `${b.total - b.used} / ${b.total} days left`}
                  </span>
                  {b.total - b.used <= 3 && b.type !== 'unpaid' && (
                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-400" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Date range */}
          <div>
            <label className="text-sm font-semibold text-foreground block mb-3">Date Range</label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Start Date</label>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">End Date</label>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
                  min={startDate}
                  className="w-full px-3 py-2.5 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
            </div>
            {workingDays > 0 && (
              <div className={`mt-2 flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                overBalance ? 'bg-rose-50 text-rose-600' : 'bg-cyan-50 text-cyan-700'
              }`}>
                {overBalance ? <AlertTriangle className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
                <span>
                  <strong>{workingDays} working day{workingDays > 1 ? 's' : ''}</strong>
                  {overBalance && ` — exceeds your ${remaining}-day balance`}
                </span>
              </div>
            )}
          </div>

          {/* Reason */}
          <div>
            <label className="text-sm font-semibold text-foreground block mb-2">Reason</label>
            <textarea
              rows={4}
              placeholder="Briefly describe your reason for leave..."
              value={reason}
              onChange={(e) => { setReason(e.target.value); setError('') }}
              maxLength={500}
              className="w-full px-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
            />
            <p className="text-xs text-muted-foreground text-right mt-1">{reason.length}/500</p>
          </div>

          {error && (
            <p className="text-xs text-rose-500 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" /> {error}
            </p>
          )}
        </div>

        <div className="px-6 py-4 border-t border-border flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted/50 transition-colors">
            Cancel
          </button>
          <button
            onClick={submit}
            className="flex-1 px-4 py-2.5 rounded-xl aqua-gradient text-white text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Submit Request
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Calendar mini ────────────────────────────────────────────────────────────
function MiniCalendar({ leaves }: { leaves: { startDate: string; endDate: string; status: LeaveStatus; leaveType: LeaveType }[] }) {
  const today = new Date()
  const [year, setYear]   = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())

  const monthStart = new Date(year, month, 1)
  const monthEnd   = new Date(year, month + 1, 0)
  const startPad   = monthStart.getDay()
  const totalDays  = monthEnd.getDate()

  const leaveMap = new Map<string, { type: LeaveType; status: LeaveStatus }>()
  leaves.forEach((lr) => {
    if (lr.status === 'cancelled') return
    const cur = new Date(lr.startDate)
    const end = new Date(lr.endDate)
    while (cur <= end) {
      if (cur.getMonth() === month && cur.getFullYear() === year) {
        const key = cur.toISOString().slice(0, 10)
        leaveMap.set(key, { type: lr.leaveType, status: lr.status })
      }
      cur.setDate(cur.getDate() + 1)
    }
  })

  const prevMonth = () => { if (month === 0) { setYear(y => y - 1); setMonth(11) } else setMonth(m => m - 1) }
  const nextMonth = () => { if (month === 11) { setYear(y => y + 1); setMonth(0) } else setMonth(m => m + 1) }
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const days   = ['Su','Mo','Tu','We','Th','Fr','Sa']

  return (
    <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-muted transition-colors"><ChevronLeft className="w-4 h-4" /></button>
        <h3 className="font-semibold text-foreground text-sm">{months[month]} {year}</h3>
        <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-muted transition-colors"><ChevronRight className="w-4 h-4" /></button>
      </div>
      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {days.map((d) => <div key={d} className="text-center text-[10px] font-semibold text-muted-foreground py-1">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {Array.from({ length: startPad }).map((_, i) => <div key={`p${i}`} />)}
        {Array.from({ length: totalDays }).map((_, i) => {
          const d = i + 1
          const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
          const entry  = leaveMap.get(key)
          const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear()
          return (
            <div
              key={key}
              title={entry ? `${entry.type} (${entry.status})` : undefined}
              className={`aspect-square flex items-center justify-center text-xs rounded-lg font-medium transition-colors ${
                entry
                  ? entry.status === 'approved'
                    ? 'bg-cyan-100 text-cyan-700'
                    : entry.status === 'pending'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-rose-100 text-rose-500'
                  : isToday
                  ? 'bg-primary text-white'
                  : 'hover:bg-muted/50 text-foreground'
              }`}
            >
              {d}
            </div>
          )
        })}
      </div>
      <div className="flex items-center gap-4 mt-4 justify-center">
        {[{ color: 'bg-cyan-100 text-cyan-700', label: 'Approved' }, { color: 'bg-amber-100 text-amber-700', label: 'Pending' }, { color: 'bg-primary text-white', label: 'Today' }].map((l) => (
          <div key={l.label} className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded ${l.color}`} />
            <span className="text-[10px] text-muted-foreground">{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function MyLeavePage() {
  const [newLeaves, setNewLeaves] = useState<typeof MY_SEED>([])
  const [showDrawer, setShowDrawer] = useState(false)
  const [filter, setFilter] = useState<'all' | LeaveStatus>('all')

  const allLeaves = useMemo(() => [...MY_SEED, ...newLeaves], [newLeaves])

  const handleSubmit = (r: { leaveType: LeaveType; startDate: string; endDate: string; days: number; reason: string }) => {
    setNewLeaves((prev) => [{
      id: `new-${Date.now()}`,
      employeeId: 'e10',
      employeeName: 'Tom Anderson',
      department: 'Engineering',
      leaveType: r.leaveType,
      startDate: r.startDate,
      endDate: r.endDate,
      days: r.days,
      reason: r.reason,
      status: 'pending' as LeaveStatus,
      createdAt: new Date().toISOString().slice(0, 10),
    }, ...prev])
  }

  const displayed = filter === 'all' ? allLeaves : allLeaves.filter((l) => l.status === filter)

  return (
    <div className="flex flex-col flex-1">
      <div className="px-8 py-6 border-b border-border bg-white flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">My Leave</h1>
          <p className="text-sm text-muted-foreground mt-0.5">View balances, request and track your leave</p>
        </div>
        <button
          onClick={() => setShowDrawer(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl aqua-gradient text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm"
        >
          <Plus className="w-4 h-4" />
          New Request
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-6">

        {/* Balance cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {BALANCES.map((b) => {
            const rem = b.total - b.used
            const pct = Math.round((rem / b.total) * 100)
            return (
              <div key={b.type} className="stat-card">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs text-muted-foreground">{b.label} Leave</p>
                  <span className="text-xs font-semibold text-foreground">{b.type === 'unpaid' ? '∞' : `${rem}/${b.total}`} days</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{b.type === 'unpaid' ? '—' : rem}</p>
                {b.type !== 'unpaid' && (
                  <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: b.color }} />
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  {b.type === 'unpaid' ? 'Unpaid leave available' : `${b.used} used this year`}
                </p>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <MiniCalendar leaves={allLeaves} />

          {/* Requests table */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between flex-wrap gap-3">
              <h3 className="font-semibold text-foreground">Leave Requests</h3>
              <div className="flex items-center gap-2">
                {(['all', 'pending', 'approved', 'rejected'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${
                      filter === f
                        ? 'aqua-gradient text-white'
                        : 'bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {f === 'all' ? `All (${allLeaves.length})` : f}
                  </button>
                ))}
              </div>
            </div>

            {displayed.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Calendar className="w-10 h-10 mx-auto mb-2 opacity-20" />
                <p className="text-sm">No leave requests found</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {displayed.map((r) => {
                  const conf = STATUS_CONF[r.status as LeaveStatus]
                  const Icon = conf.icon
                  const isNew = r.id.startsWith('new-')
                  return (
                    <div key={r.id} className="px-6 py-4 flex items-start gap-4 hover:bg-muted/20 transition-colors">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${LEAVE_COLORS[r.leaveType]}`}>
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${LEAVE_COLORS[r.leaveType]}`}>
                            {r.leaveType}
                          </span>
                          {isNew && <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary">NEW</span>}
                        </div>
                        <p className="text-sm font-medium text-foreground mt-1">
                          {new Date(r.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          {' – '}
                          {new Date(r.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          <span className="text-muted-foreground font-normal"> · {r.days} day{r.days > 1 ? 's' : ''}</span>
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{r.reason}</p>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <Icon className={`w-3.5 h-3.5 ${r.status === 'approved' ? 'text-emerald-500' : r.status === 'rejected' ? 'text-rose-500' : 'text-amber-500'}`} />
                        <span className={conf.cls}>{conf.label}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {showDrawer && <NewLeaveDrawer onClose={() => setShowDrawer(false)} onSubmit={handleSubmit} />}
    </div>
  )
}
