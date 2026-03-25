'use client'

import {
  Calendar, DollarSign, Star, MapPin, Phone, Mail,
  Briefcase, Clock, CheckCircle2, AlertCircle, TrendingUp,
} from 'lucide-react'
import { EMPLOYEES, LEAVE_REQUESTS } from '@/lib/mock-data'
import { formatDate, formatCurrency } from '@/lib/utils'

// Tom Anderson is the logged-in employee
const ME = EMPLOYEES.find((e) => e.id === 'e10')!
const MY_LEAVES = LEAVE_REQUESTS.filter((r) => r.employeeId === 'e10')

const LEAVE_BALANCE = [
  { type: 'Annual',    total: 25, used: 5,  color: '#00bcd4' },
  { type: 'Sick',      total: 14, used: 0,  color: '#ef5350' },
  { type: 'Emergency', total: 5,  used: 0,  color: '#ff9800' },
]

const MY_PAYSLIPS = [
  { period: 'March 2026',    gross: 8750, net: 6825, status: 'paid', date: '2026-03-28' },
  { period: 'February 2026', gross: 8750, net: 6825, status: 'paid', date: '2026-02-26' },
  { period: 'January 2026',  gross: 8750, net: 6825, status: 'paid', date: '2026-01-30' },
]

const STATUS_CONF: Record<string, { label: string; cls: string }> = {
  pending:  { label: 'Pending',  cls: 'badge-pending'  },
  approved: { label: 'Approved', cls: 'badge-approved' },
  rejected: { label: 'Rejected', cls: 'badge-rejected' },
}

const LEAVE_TYPE_LABELS: Record<string, string> = {
  annual: 'Annual', sick: 'Sick', maternity: 'Maternity',
  paternity: 'Paternity', emergency: 'Emergency', unpaid: 'Unpaid',
}

const hour = new Date().getHours()
const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

export default function EmployeeDashboardPage() {
  return (
    <div className="flex flex-col flex-1">
      {/* Header */}
      <div className="px-8 py-6 border-b border-border bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">
              {greeting}, {ME.firstName}! 👋
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {ME.position} · {ME.department} · Acme Corporation
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Next payday</p>
            <p className="text-sm font-semibold text-foreground">Apr 28, 2026</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-6">

        {/* Quick stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Annual Leave Left', value: '20 days', icon: Calendar,   color: 'text-cyan-600',    bg: 'bg-cyan-50'    },
            { label: 'YTD Earnings',      value: formatCurrency(ME.salary / 12 * 3), icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Performance Score', value: `${ME.performanceScore} / 5`, icon: Star, color: 'text-amber-500', bg: 'bg-amber-50' },
            { label: 'Days at Acme',      value: `${Math.floor((Date.now() - new Date(ME.hireDate).getTime()) / 86400000)} d`, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
          ].map((c) => (
            <div key={c.label} className="stat-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{c.label}</p>
                  <p className="text-xl font-bold text-foreground mt-0.5">{c.value}</p>
                </div>
                <div className={`w-9 h-9 rounded-xl ${c.bg} flex items-center justify-center`}>
                  <c.icon className={`w-4.5 h-4.5 ${c.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Profile card */}
          <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
            <h3 className="font-semibold text-foreground mb-4">My Profile</h3>
            <div className="flex flex-col items-center text-center mb-5">
              <div className="w-16 h-16 rounded-full aqua-gradient flex items-center justify-center text-white font-bold text-xl mb-3 shadow-sm">
                TA
              </div>
              <p className="font-bold text-foreground">{ME.firstName} {ME.lastName}</p>
              <p className="text-sm text-primary font-medium">{ME.position}</p>
              <span className="mt-2 badge-active">Active</span>
            </div>
            <div className="space-y-2.5 text-sm">
              {[
                { icon: Mail,     value: ME.email         },
                { icon: Phone,    value: ME.phone         },
                { icon: Briefcase,value: ME.department    },
                { icon: MapPin,   value: ME.location      },
                { icon: Clock,    value: `Since ${formatDate(ME.hireDate, { month: 'short', year: 'numeric', day: 'numeric' })}` },
              ].map(({ icon: Icon, value }) => (
                <div key={value} className="flex items-center gap-3 text-muted-foreground">
                  <Icon className="w-4 h-4 flex-shrink-0 text-primary/60" />
                  <span className="text-xs truncate">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Leave balance + requests */}
          <div className="lg:col-span-2 space-y-4">

            {/* Leave balances */}
            <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
              <h3 className="font-semibold text-foreground mb-4">Leave Balance</h3>
              <div className="space-y-3">
                {LEAVE_BALANCE.map((lb) => {
                  const pct = Math.round(((lb.total - lb.used) / lb.total) * 100)
                  return (
                    <div key={lb.type}>
                      <div className="flex items-center justify-between mb-1.5 text-sm">
                        <span className="font-medium text-foreground">{lb.type}</span>
                        <span className="text-muted-foreground">
                          <strong className="text-foreground">{lb.total - lb.used}</strong> / {lb.total} days remaining
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${pct}%`, backgroundColor: lb.color }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* My leave requests */}
            <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-border">
                <h3 className="font-semibold text-foreground">My Leave Requests</h3>
              </div>
              {MY_LEAVES.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No leave requests yet</p>
                </div>
              ) : (
                <table className="w-full data-table">
                  <thead>
                    <tr>
                      <th className="text-left px-5 py-3">Type</th>
                      <th className="text-left px-4 py-3">Duration</th>
                      <th className="text-left px-4 py-3">Days</th>
                      <th className="text-center px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MY_LEAVES.map((r) => (
                      <tr key={r.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                        <td className="px-5 py-3 text-sm font-medium text-foreground capitalize">
                          {LEAVE_TYPE_LABELS[r.leaveType]}
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">
                          {formatDate(r.startDate, { month: 'short', day: 'numeric' })} – {formatDate(r.endDate, { month: 'short', day: 'numeric' })}
                        </td>
                        <td className="px-4 py-3 text-sm font-semibold text-foreground">{r.days}d</td>
                        <td className="px-4 py-3 text-center">
                          <span className={STATUS_CONF[r.status]?.cls ?? 'badge-inactive'}>
                            {STATUS_CONF[r.status]?.label ?? r.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* Recent payslips */}
        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Recent Payslips</h3>
            <span className="text-xs text-muted-foreground">Annual salary: {formatCurrency(ME.salary)}</span>
          </div>
          <table className="w-full data-table">
            <thead>
              <tr>
                <th className="text-left px-6 py-3">Period</th>
                <th className="text-right px-4 py-3">Gross Pay</th>
                <th className="text-right px-4 py-3">Net Pay</th>
                <th className="text-right px-4 py-3">Deductions</th>
                <th className="text-left px-4 py-3">Paid On</th>
                <th className="text-center px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {MY_PAYSLIPS.map((p) => (
                <tr key={p.period} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-6 py-3 text-sm font-semibold text-foreground">{p.period}</td>
                  <td className="px-4 py-3 text-right text-sm text-foreground">{formatCurrency(p.gross)}</td>
                  <td className="px-4 py-3 text-right text-sm font-semibold text-emerald-600">{formatCurrency(p.net)}</td>
                  <td className="px-4 py-3 text-right text-sm text-rose-500">-{formatCurrency(p.gross - p.net)}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {new Date(p.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="badge-active">Paid</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  )
}
