'use client'

import { useState, useEffect, useMemo } from 'react'
import {
  X, Calendar, Clock, ChevronDown, AlertCircle, CheckCircle2,
  User, FileText, Loader2, CalendarDays, Info,
} from 'lucide-react'
import { EMPLOYEES } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import type { LeaveRequest, LeaveType } from '@/types'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface NewLeaveRequestPayload extends LeaveRequest {}

interface NewLeaveRequestModalProps {
  open: boolean
  onClose: () => void
  onRequestSubmitted: (req: NewLeaveRequestPayload) => void
}

// ─── Constants ────────────────────────────────────────────────────────────────

const LEAVE_TYPES: {
  value: LeaveType
  label: string
  color: string
  bg: string
  description: string
  maxDays: number
}[] = [
  { value: 'annual',    label: 'Annual Leave',    color: '#00bcd4', bg: '#e0f7fa', description: 'Planned vacation or personal time off',        maxDays: 25  },
  { value: 'sick',      label: 'Sick Leave',      color: '#ef5350', bg: '#ffebee', description: 'Illness or medical appointment',                maxDays: 14  },
  { value: 'maternity', label: 'Maternity Leave', color: '#ab47bc', bg: '#f3e5f5', description: 'Maternity leave for new mothers',               maxDays: 120 },
  { value: 'paternity', label: 'Paternity Leave', color: '#5c6bc0', bg: '#e8eaf6', description: 'Paternity leave for new fathers',               maxDays: 14  },
  { value: 'emergency', label: 'Emergency Leave', color: '#ff9800', bg: '#fff3e0', description: 'Unexpected personal or family emergency',       maxDays: 5   },
  { value: 'unpaid',    label: 'Unpaid Leave',    color: '#78909c', bg: '#eceff1', description: 'Leave without pay beyond allocated balance',   maxDays: 30  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Count working days (Mon–Fri) between two date strings, inclusive */
function countWorkingDays(start: string, end: string): number {
  if (!start || !end) return 0
  const s = new Date(start)
  const e = new Date(end)
  if (e < s) return 0
  let count = 0
  const cur = new Date(s)
  while (cur <= e) {
    const day = cur.getDay()
    if (day !== 0 && day !== 6) count++
    cur.setDate(cur.getDate() + 1)
  }
  return count
}

/** Remaining balance for a leave type (mock — based on existing requests) */
function getBalance(leaveType: LeaveType, employeeId: string) {
  const lt = LEAVE_TYPES.find((t) => t.value === leaveType)
  if (!lt) return { total: 0, used: 0, remaining: 0 }
  // Simplified mock: everyone starts with maxDays, deduct 0 for now
  return { total: lt.maxDays, used: 0, remaining: lt.maxDays }
}

const today = new Date().toISOString().split('T')[0]

// ─── Component ────────────────────────────────────────────────────────────────

export function NewLeaveRequestModal({
  open,
  onClose,
  onRequestSubmitted,
}: NewLeaveRequestModalProps) {

  // Form
  const [employeeId, setEmployeeId]   = useState('')
  const [employeeSearch, setEmployeeSearch] = useState('')
  const [showEmpDrop, setShowEmpDrop] = useState(false)
  const [leaveType, setLeaveType]     = useState<LeaveType | ''>('')
  const [startDate, setStartDate]     = useState('')
  const [endDate, setEndDate]         = useState('')
  const [reason, setReason]           = useState('')

  // UI
  const [step, setStep]       = useState<'form' | 'success'>('form')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [submitted, setSubmitted] = useState<NewLeaveRequestPayload | null>(null)

  // Derived
  const selectedEmployee = EMPLOYEES.find((e) => e.id === employeeId)
  const workingDays      = countWorkingDays(startDate, endDate)
  const balance          = leaveType && employeeId ? getBalance(leaveType as LeaveType, employeeId) : null
  const balanceWarning   = balance && workingDays > balance.remaining

  const filteredEmployees = useMemo(() => {
    const q = employeeSearch.toLowerCase()
    return EMPLOYEES.filter(
      (e) =>
        `${e.firstName} ${e.lastName}`.toLowerCase().includes(q) ||
        e.department.toLowerCase().includes(q) ||
        e.position.toLowerCase().includes(q)
    ).slice(0, 8)
  }, [employeeSearch])

  // Reset on close
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setEmployeeId(''); setEmployeeSearch(''); setShowEmpDrop(false)
        setLeaveType(''); setStartDate(''); setEndDate('')
        setReason(''); setStep('form'); setError(''); setSubmitted(null)
      }, 300)
    }
  }, [open])

  // Escape key
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', h)
    return () => document.removeEventListener('keydown', h)
  }, [onClose])

  // Auto-set end date to start date when start is picked
  useEffect(() => {
    if (startDate && (!endDate || endDate < startDate)) setEndDate(startDate)
  }, [startDate])

  const handleSubmit = async () => {
    if (!employeeId)         return setError('Please select an employee.')
    if (!leaveType)          return setError('Please select a leave type.')
    if (!startDate)          return setError('Please select a start date.')
    if (!endDate)            return setError('Please select an end date.')
    if (endDate < startDate) return setError('End date cannot be before start date.')
    if (workingDays === 0)   return setError('The selected date range has no working days.')
    if (reason.trim().length < 10) return setError('Please provide a reason (at least 10 characters).')

    setError('')
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1200))

    const emp = EMPLOYEES.find((e) => e.id === employeeId)!
    const payload: NewLeaveRequestPayload = {
      id:           `lr-${Date.now()}`,
      employeeId,
      employeeName: `${emp.firstName} ${emp.lastName}`,
      department:   emp.department,
      leaveType:    leaveType as LeaveType,
      startDate,
      endDate,
      days:         workingDays,
      reason:       reason.trim(),
      status:       'pending',
      createdAt:    new Date().toISOString(),
    }

    setLoading(false)
    setSubmitted(payload)
    setStep('success')
    onRequestSubmitted(payload)
  }

  if (!open) return null

  const selectedType = LEAVE_TYPES.find((t) => t.value === leaveType)

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-white shadow-2xl flex flex-col animate-slide-in-right">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl aqua-gradient flex items-center justify-center shadow-sm">
              <CalendarDays className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">New Leave Request</h2>
              <p className="text-xs text-muted-foreground">Submit on behalf of an employee</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">

          {/* ── Success ──────────────────────────────────────────────────── */}
          {step === 'success' && submitted && (
            <div className="flex flex-col items-center text-center px-8 py-12 gap-5">
              <div className="w-16 h-16 rounded-full aqua-gradient flex items-center justify-center shadow-md">
                <CheckCircle2 className="w-7 h-7 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Request submitted!</h3>
                <p className="text-muted-foreground text-sm mt-1.5 max-w-xs mx-auto">
                  The leave request for <strong className="text-foreground">{submitted.employeeName}</strong> has been
                  submitted and is awaiting approval.
                </p>
              </div>

              {/* Summary */}
              <div className="w-full bg-muted/40 rounded-xl border border-border p-4 text-left space-y-2.5">
                {[
                  { label: 'Employee',   value: submitted.employeeName },
                  { label: 'Department', value: submitted.department },
                  { label: 'Leave type', value: LEAVE_TYPES.find((t) => t.value === submitted.leaveType)?.label ?? submitted.leaveType },
                  { label: 'Start date', value: new Date(submitted.startDate).toLocaleDateString('en-US', { dateStyle: 'medium' }) },
                  { label: 'End date',   value: new Date(submitted.endDate).toLocaleDateString('en-US', { dateStyle: 'medium' }) },
                  { label: 'Working days', value: `${submitted.days} day${submitted.days !== 1 ? 's' : ''}` },
                  { label: 'Status',     value: 'Pending approval' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium text-foreground">{value}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 w-full pt-2">
                <button
                  onClick={() => setStep('form')}
                  className="flex-1 py-2.5 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
                >
                  New request
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 aqua-gradient text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  Done
                </button>
              </div>
            </div>
          )}

          {/* ── Form ─────────────────────────────────────────────────────── */}
          {step === 'form' && (
            <div className="px-6 py-6 space-y-6">

              {/* Section 1: Employee */}
              <section>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" /> Employee
                </h3>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowEmpDrop(!showEmpDrop)}
                    className="w-full flex items-center justify-between px-4 py-3 border border-input rounded-xl bg-white text-sm hover:border-primary/50 transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    {selectedEmployee ? (
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {selectedEmployee.firstName[0]}{selectedEmployee.lastName[0]}
                        </div>
                        <div className="text-left">
                          <div className="font-medium text-foreground">
                            {selectedEmployee.firstName} {selectedEmployee.lastName}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {selectedEmployee.position} · {selectedEmployee.department}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Select employee…</span>
                    )}
                    <ChevronDown className={cn('w-4 h-4 text-muted-foreground transition-transform flex-shrink-0', showEmpDrop && 'rotate-180')} />
                  </button>

                  {showEmpDrop && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-border rounded-xl shadow-lg overflow-hidden">
                      {/* Search */}
                      <div className="p-2 border-b border-border">
                        <input
                          type="text"
                          value={employeeSearch}
                          onChange={(e) => setEmployeeSearch(e.target.value)}
                          placeholder="Search by name, department…"
                          className="w-full px-3 py-2 text-xs bg-muted rounded-lg outline-none"
                          autoFocus
                        />
                      </div>
                      <div className="max-h-52 overflow-y-auto">
                        {filteredEmployees.map((emp) => (
                          <button
                            key={emp.id}
                            type="button"
                            onClick={() => {
                              setEmployeeId(emp.id)
                              setEmployeeSearch('')
                              setShowEmpDrop(false)
                            }}
                            className={cn(
                              'w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors text-left',
                              employeeId === emp.id && 'bg-accent/40'
                            )}
                          >
                            <div className="w-7 h-7 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                              {emp.firstName[0]}{emp.lastName[0]}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-foreground truncate">
                                {emp.firstName} {emp.lastName}
                              </div>
                              <div className="text-xs text-muted-foreground truncate">
                                {emp.position} · {emp.department}
                              </div>
                            </div>
                            {employeeId === emp.id && (
                              <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                            )}
                          </button>
                        ))}
                        {filteredEmployees.length === 0 && (
                          <p className="px-4 py-3 text-sm text-muted-foreground text-center">No employees found</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* Section 2: Leave type */}
              <section>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> Leave Type
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {LEAVE_TYPES.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setLeaveType(t.value)}
                      className={cn(
                        'flex items-start gap-3 p-3 rounded-xl border-2 text-left transition-all',
                        leaveType === t.value
                          ? 'border-primary bg-accent/30 shadow-sm'
                          : 'border-border bg-white hover:border-primary/40'
                      )}
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ backgroundColor: t.bg }}
                      >
                        <Calendar className="w-3.5 h-3.5" style={{ color: t.color }} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-foreground leading-tight">{t.label}</div>
                        <div className="text-[10px] text-muted-foreground mt-0.5 leading-tight line-clamp-2">{t.description}</div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Balance indicator */}
                {balance && selectedType && (
                  <div
                    className={cn(
                      'mt-3 flex items-center gap-3 px-4 py-3 rounded-xl border text-sm',
                      balanceWarning
                        ? 'border-amber-200 bg-amber-50'
                        : 'border-border bg-muted/30'
                    )}
                  >
                    <Info className={cn('w-4 h-4 flex-shrink-0', balanceWarning ? 'text-amber-500' : 'text-muted-foreground')} />
                    <div>
                      <span className={balanceWarning ? 'text-amber-800' : 'text-foreground'}>
                        <strong>{balance.remaining}</strong> of <strong>{balance.total}</strong> days remaining
                      </span>
                      {balanceWarning && (
                        <p className="text-xs text-amber-700 mt-0.5">
                          Request exceeds balance by {workingDays - balance.remaining} day{workingDays - balance.remaining !== 1 ? 's' : ''}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </section>

              {/* Section 3: Dates */}
              <section>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> Date Range
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                      Start date <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      min={today}
                      className="w-full px-3 py-2.5 border border-input rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                      End date <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      min={startDate || today}
                      className="w-full px-3 py-2.5 border border-input rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>

                {/* Working days badge */}
                {startDate && endDate && workingDays > 0 && (
                  <div className="mt-3 inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-accent/40 border border-primary/20 text-sm">
                    <CalendarDays className="w-4 h-4 text-primary" />
                    <span className="font-semibold text-primary">{workingDays}</span>
                    <span className="text-muted-foreground">working day{workingDays !== 1 ? 's' : ''}</span>
                    <span className="text-xs text-muted-foreground">(weekends excluded)</span>
                  </div>
                )}
              </section>

              {/* Section 4: Reason */}
              <section>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" /> Reason
                </h3>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value.slice(0, 500))}
                  rows={4}
                  placeholder="Describe the reason for the leave request…"
                  className="w-full px-4 py-3 border border-input rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
                <p className="text-xs text-muted-foreground text-right mt-1">
                  {reason.length}/500
                </p>
              </section>

            </div>
          )}
        </div>

        {/* Footer */}
        {step === 'form' && (
          <div className="px-6 py-5 border-t border-border bg-white">
            {error && (
              <div className="flex items-center gap-2 bg-destructive/10 text-destructive text-xs px-3 py-2.5 rounded-lg mb-4">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                {error}
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 py-2.5 aqua-gradient text-white rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-70 transition-opacity flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</>
                ) : (
                  'Submit request'
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
