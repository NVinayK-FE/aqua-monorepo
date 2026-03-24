'use client'

import { useState, useEffect } from 'react'
import {
  X, Mail, User, Building2, Briefcase, Calendar, ShieldCheck,
  MessageSquare, Send, Copy, Check, ChevronDown, AlertCircle, UserPlus,
} from 'lucide-react'
import { DEPARTMENTS } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import type { EmploymentType } from '@/types'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface InvitePayload {
  id: string
  tenantId: string
  tenantName: string
  firstName: string
  lastName: string
  email: string
  department: string
  position: string
  employmentType: EmploymentType
  role: 'hr_admin' | 'manager' | 'employee'
  startDate: string
  personalMessage: string
  invitedAt: string
  status: 'invited'
}

interface InviteEmployeeModalProps {
  open: boolean
  tenantId: string
  tenantName: string
  onClose: () => void
  onInviteSent: (invite: InvitePayload) => void
}

// ─── Constants ────────────────────────────────────────────────────────────────

const EMPLOYMENT_TYPES: { value: EmploymentType; label: string }[] = [
  { value: 'full_time', label: 'Full Time' },
  { value: 'part_time', label: 'Part Time' },
  { value: 'contract', label: 'Contract' },
  { value: 'intern', label: 'Intern' },
]

const ACCESS_ROLES: { value: InvitePayload['role']; label: string; desc: string }[] = [
  { value: 'employee', label: 'Employee', desc: 'Can view own profile, payslips and leave.' },
  { value: 'manager', label: 'Manager', desc: "Can manage their team's leave, performance and reports." },
  { value: 'hr_admin', label: 'HR Admin', desc: 'Full access to HR features for this tenant.' },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generateInviteLink(email: string, tenantId: string) {
  const token = btoa(`${tenantId}:${email}:${Date.now()}`).replace(/=/g, '')
  return `${window.location.origin}/register?invite=${token}`
}

// ─── Component ────────────────────────────────────────────────────────────────

export function InviteEmployeeModal({
  open,
  tenantId,
  tenantName,
  onClose,
  onInviteSent,
}: InviteEmployeeModalProps) {
  // Form fields
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [department, setDepartment] = useState('')
  const [position, setPosition] = useState('')
  const [employmentType, setEmploymentType] = useState<EmploymentType>('full_time')
  const [role, setRole] = useState<InvitePayload['role']>('employee')
  const [startDate, setStartDate] = useState('')
  const [personalMessage, setPersonalMessage] = useState('')

  // UI state
  const [step, setStep] = useState<'form' | 'success'>('form')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showDeptDropdown, setShowDeptDropdown] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)
  const [inviteLink, setInviteLink] = useState('')
  const [sentPayload, setSentPayload] = useState<InvitePayload | null>(null)

  // Reset when modal closes
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setEmail(''); setFirstName(''); setLastName('')
        setDepartment(''); setPosition(''); setEmploymentType('full_time')
        setRole('employee'); setStartDate(''); setPersonalMessage('')
        setStep('form'); setError(''); setLinkCopied(false)
        setInviteLink(''); setSentPayload(null)
      }, 300)
    }
  }, [open])

  // Trap Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  const handleSubmit = async () => {
    // Validate
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return setError('Please enter a valid email address.')
    if (!firstName.trim()) return setError("Please enter the invitee's first name.")
    if (!lastName.trim()) return setError("Please enter the invitee's last name.")
    if (!department) return setError('Please select a department.')
    if (!position.trim()) return setError('Please enter a job title / position.')
    if (!startDate) return setError('Please enter an expected start date.')

    setError('')
    setLoading(true)

    // Simulate API call
    await new Promise((r) => setTimeout(r, 1400))

    const link = generateInviteLink(email, tenantId)
    const payload: InvitePayload = {
      id: `inv-${Date.now()}`,
      tenantId,
      tenantName,
      firstName,
      lastName,
      email,
      department,
      position,
      employmentType,
      role,
      startDate,
      personalMessage,
      invitedAt: new Date().toISOString(),
      status: 'invited',
    }

    setInviteLink(link)
    setSentPayload(payload)
    setLoading(false)
    setStep('success')
    onInviteSent(payload)
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink).then(() => {
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2500)
    })
  }

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-white shadow-2xl flex flex-col animate-slide-in-right">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl aqua-gradient flex items-center justify-center shadow-sm">
              <UserPlus className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">Invite Employee</h2>
              <p className="text-xs text-muted-foreground">{tenantName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Body ────────────────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto">

          {step === 'success' && sentPayload ? (
            /* ── Success state ────────────────────────────────────────────── */
            <div className="flex flex-col items-center text-center px-8 py-12 gap-5">
              <div className="w-16 h-16 rounded-full aqua-gradient flex items-center justify-center shadow-md">
                <Send className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Invite sent!</h3>
                <p className="text-muted-foreground text-sm mt-1.5 max-w-xs mx-auto">
                  An invitation email has been sent to{' '}
                  <strong className="text-foreground">{sentPayload.email}</strong>. They'll appear
                  in your employee list as <span className="badge-pending">Invited</span> until they accept.
                </p>
              </div>

              {/* Summary card */}
              <div className="w-full bg-muted/40 rounded-xl border border-border p-4 text-left space-y-2.5">
                {[
                  { label: 'Name', value: `${sentPayload.firstName} ${sentPayload.lastName}` },
                  { label: 'Email', value: sentPayload.email },
                  { label: 'Department', value: sentPayload.department },
                  { label: 'Position', value: sentPayload.position },
                  { label: 'Start date', value: new Date(sentPayload.startDate).toLocaleDateString('en-US', { dateStyle: 'medium' }) },
                  { label: 'Access role', value: ACCESS_ROLES.find(r => r.value === sentPayload.role)?.label ?? sentPayload.role },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium text-foreground">{value}</span>
                  </div>
                ))}
              </div>

              {/* Copy invite link */}
              <div className="w-full">
                <p className="text-xs text-muted-foreground mb-2">Or share this invite link directly:</p>
                <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2.5 border border-border">
                  <span className="text-xs text-muted-foreground truncate flex-1 font-mono">{inviteLink}</span>
                  <button
                    onClick={handleCopyLink}
                    className={cn(
                      'flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md transition-all flex-shrink-0',
                      linkCopied
                        ? 'bg-emerald-100 text-emerald-600'
                        : 'bg-white border border-border text-foreground hover:bg-muted'
                    )}
                  >
                    {linkCopied ? <><Check className="w-3 h-3" /> Copied!</> : <><Copy className="w-3 h-3" /> Copy</>}
                  </button>
                </div>
              </div>

              <div className="flex gap-3 w-full pt-2">
                <button
                  onClick={() => setStep('form')}
                  className="flex-1 py-2.5 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
                >
                  Invite another
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 aqua-gradient text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  Done
                </button>
              </div>
            </div>

          ) : (
            /* ── Form ──────────────────────────────────────────────────────── */
            <div className="px-6 py-6 space-y-6">

              {/* Tenant badge */}
              <div className="flex items-center gap-2 px-3 py-2 bg-accent/40 border border-primary/20 rounded-lg">
                <Building2 className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-xs font-medium text-primary">
                  Inviting to: <strong>{tenantName}</strong>
                </span>
              </div>

              {/* ── Section 1: Personal details ──────────────────────────── */}
              <section>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Personal Details
                </h3>
                <div className="space-y-3">
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      Work email <span className="text-destructive">*</span>
                    </label>
                    <div className="flex items-center border border-input rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-ring bg-white">
                      <div className="flex items-center px-3 border-r border-input bg-muted/30 py-2.5">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="jane@yourcompany.com"
                        className="flex-1 px-3 py-2.5 text-sm bg-transparent outline-none"
                      />
                    </div>
                  </div>

                  {/* Name row */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        First name <span className="text-destructive">*</span>
                      </label>
                      <div className="flex items-center border border-input rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-ring bg-white">
                        <div className="flex items-center px-3 border-r border-input bg-muted/30 py-2.5">
                          <User className="w-3.5 h-3.5 text-muted-foreground" />
                        </div>
                        <input
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="Jane"
                          className="flex-1 px-3 py-2.5 text-sm bg-transparent outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        Last name <span className="text-destructive">*</span>
                      </label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Doe"
                        className="w-full px-4 py-2.5 border border-input rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* ── Section 2: Role & Position ───────────────────────────── */}
              <section>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Role & Position
                </h3>
                <div className="space-y-3">
                  {/* Department */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      Department <span className="text-destructive">*</span>
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowDeptDropdown(!showDeptDropdown)}
                        className="w-full flex items-center justify-between px-4 py-2.5 border border-input rounded-lg bg-white text-sm hover:border-primary/50 transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <span className={department ? 'text-foreground' : 'text-muted-foreground'}>
                          {department || 'Select department'}
                        </span>
                        <ChevronDown className={cn('w-4 h-4 text-muted-foreground transition-transform', showDeptDropdown && 'rotate-180')} />
                      </button>
                      {showDeptDropdown && (
                        <div className="absolute z-50 w-full mt-1 bg-white border border-border rounded-lg shadow-lg overflow-hidden max-h-48 overflow-y-auto">
                          {DEPARTMENTS.map((d) => (
                            <button
                              key={d.id}
                              type="button"
                              onClick={() => { setDepartment(d.name); setShowDeptDropdown(false) }}
                              className={cn(
                                'w-full text-left px-4 py-2.5 text-sm hover:bg-muted transition-colors',
                                department === d.name ? 'bg-accent/50 text-primary font-medium' : 'text-foreground'
                              )}
                            >
                              {d.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Position */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      Job title / Position <span className="text-destructive">*</span>
                    </label>
                    <div className="flex items-center border border-input rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-ring bg-white">
                      <div className="flex items-center px-3 border-r border-input bg-muted/30 py-2.5">
                        <Briefcase className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <input
                        type="text"
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                        placeholder="e.g. Senior Engineer"
                        className="flex-1 px-3 py-2.5 text-sm bg-transparent outline-none"
                      />
                    </div>
                  </div>

                  {/* Employment type */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      Employment type
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {EMPLOYMENT_TYPES.map((t) => (
                        <button
                          key={t.value}
                          type="button"
                          onClick={() => setEmploymentType(t.value)}
                          className={cn(
                            'px-3 py-2 rounded-lg border text-xs font-medium transition-all text-left',
                            employmentType === t.value
                              ? 'border-primary bg-accent/40 text-primary'
                              : 'border-input bg-white text-muted-foreground hover:border-primary/40 hover:text-foreground'
                          )}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Start date */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      Expected start date <span className="text-destructive">*</span>
                    </label>
                    <div className="flex items-center border border-input rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-ring bg-white">
                      <div className="flex items-center px-3 border-r border-input bg-muted/30 py-2.5">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="flex-1 px-3 py-2.5 text-sm bg-transparent outline-none"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* ── Section 3: Access & Permissions ─────────────────────── */}
              <section>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> Access & Permissions
                </h3>
                <div className="space-y-2">
                  {ACCESS_ROLES.map((r) => (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => setRole(r.value)}
                      className={cn(
                        'w-full text-left flex items-start gap-3 rounded-xl border-2 px-4 py-3 transition-all',
                        role === r.value
                          ? 'border-primary bg-accent/30'
                          : 'border-border bg-white hover:border-primary/40'
                      )}
                    >
                      <div className={cn(
                        'mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors',
                        role === r.value ? 'border-primary' : 'border-muted-foreground/40'
                      )}>
                        {role === r.value && <div className="w-2 h-2 rounded-full bg-primary" />}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-foreground">{r.label}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{r.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              {/* ── Section 4: Personal message ──────────────────────────── */}
              <section>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5" /> Personal Message <span className="text-muted-foreground font-normal normal-case tracking-normal">(optional)</span>
                </h3>
                <textarea
                  value={personalMessage}
                  onChange={(e) => setPersonalMessage(e.target.value.slice(0, 300))}
                  rows={3}
                  placeholder={`Hi ${firstName || 'there'}, we're excited to welcome you to ${tenantName}! Click the link below to set up your account…`}
                  className="w-full px-4 py-3 border border-input rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
                <p className="text-xs text-muted-foreground text-right mt-1">{personalMessage.length}/300</p>
              </section>

            </div>
          )}
        </div>

        {/* ── Footer (form mode only) ────────────────────────────────────── */}
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
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending invite…</>
                ) : (
                  <><Send className="w-3.5 h-3.5" /> Send invite</>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
