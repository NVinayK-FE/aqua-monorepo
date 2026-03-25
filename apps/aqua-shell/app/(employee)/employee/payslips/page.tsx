'use client'

import { useState, useMemo } from 'react'
import {
  DollarSign, Download, Eye, X, TrendingUp,
  FileText, CheckCircle2, ChevronDown, ChevronUp, Printer,
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { EMPLOYEES } from '@/lib/mock-data'

// ─── Tom Anderson ─────────────────────────────────────────────────────────────
const ME = EMPLOYEES.find((e) => e.id === 'e10')!

interface Payslip {
  id: string
  period: string
  month: string
  year: number
  paidOn: string
  gross: number
  net: number
  basic: number
  housing: number
  transport: number
  performance: number
  incomeTax: number
  socialSecurity: number
  healthInsurance: number
  pension: number
  status: 'paid' | 'pending'
}

const PAYSLIPS: Payslip[] = [
  { id: 'PS-0326', period: 'March 2026',    month: 'March',    year: 2026, paidOn: '2026-03-28', gross: 8750, net: 6562, basic: 6500, housing: 1300, transport: 500, performance: 450, incomeTax: 1225, socialSecurity: 350, healthInsurance: 350, pension: 263, status: 'paid' },
  { id: 'PS-0226', period: 'February 2026', month: 'February', year: 2026, paidOn: '2026-02-26', gross: 8750, net: 6562, basic: 6500, housing: 1300, transport: 500, performance: 450, incomeTax: 1225, socialSecurity: 350, healthInsurance: 350, pension: 263, status: 'paid' },
  { id: 'PS-0126', period: 'January 2026',  month: 'January',  year: 2026, paidOn: '2026-01-30', gross: 8750, net: 6562, basic: 6500, housing: 1300, transport: 500, performance: 450, incomeTax: 1225, socialSecurity: 350, healthInsurance: 350, pension: 263, status: 'paid' },
  { id: 'PS-1225', period: 'December 2025', month: 'December', year: 2025, paidOn: '2025-12-29', gross: 9250, net: 6987, basic: 6500, housing: 1300, transport: 500, performance: 950, incomeTax: 1295, socialSecurity: 370, healthInsurance: 350, pension: 248, status: 'paid' },
  { id: 'PS-1125', period: 'November 2025', month: 'November', year: 2025, paidOn: '2025-11-28', gross: 8750, net: 6562, basic: 6500, housing: 1300, transport: 500, performance: 450, incomeTax: 1225, socialSecurity: 350, healthInsurance: 350, pension: 263, status: 'paid' },
  { id: 'PS-1025', period: 'October 2025',  month: 'October',  year: 2025, paidOn: '2025-10-30', gross: 8750, net: 6562, basic: 6500, housing: 1300, transport: 500, performance: 450, incomeTax: 1225, socialSecurity: 350, healthInsurance: 350, pension: 263, status: 'paid' },
]

// ─── PDF Generator (print to PDF) ────────────────────────────────────────────
function printPayslip(p: Payslip) {
  const deductions  = p.gross - p.net
  const html = `
<!DOCTYPE html>
<html>
<head>
<title>Payslip – ${p.period}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Segoe UI', Arial, sans-serif; }
  body { padding: 40px; color: #1a1a2e; font-size: 14px; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; padding-bottom: 24px; border-bottom: 2px solid #00bcd4; }
  .logo { font-size: 22px; font-weight: 800; background: linear-gradient(135deg,#00bcd4,#0e7490); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .payslip-title { font-size: 18px; font-weight: 700; margin-top: 4px; }
  .period { font-size: 13px; color: #6b7280; }
  .badge { display: inline-block; background: #d1fae5; color: #065f46; border-radius: 9999px; padding: 3px 12px; font-size: 12px; font-weight: 600; }
  .section { margin-bottom: 24px; }
  .section h3 { font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: .05em; color: #9ca3af; margin-bottom: 12px; }
  .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px 24px; }
  .info-row { display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid #f3f4f6; }
  .info-label { color: #6b7280; }
  .info-value { font-weight: 600; }
  .earnings-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
  .table { width: 100%; border-collapse: collapse; }
  .table th { text-align: left; padding: 8px 12px; background: #f9fafb; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: .04em; color: #6b7280; }
  .table td { padding: 10px 12px; border-bottom: 1px solid #f3f4f6; font-size: 13px; }
  .table td:last-child { text-align: right; font-weight: 600; }
  .total-row td { font-size: 14px; font-weight: 700; background: #f0fdff; color: #0e7490; border-top: 2px solid #00bcd4; }
  .net-pay { margin-top: 24px; padding: 20px; background: linear-gradient(135deg,#ecfeff,#e0f2fe); border-radius: 12px; display: flex; justify-content: space-between; align-items: center; border: 2px solid #00bcd4; }
  .net-label { font-size: 15px; font-weight: 700; color: #0e7490; }
  .net-amount { font-size: 28px; font-weight: 800; color: #0e7490; }
  .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e5e7eb; font-size: 11px; color: #9ca3af; text-align: center; }
  @media print { body { padding: 24px; } }
</style>
</head>
<body>
<div class="header">
  <div>
    <div class="logo">AQUA SUITE</div>
    <div class="payslip-title">Payslip</div>
    <div class="period">${p.period} &nbsp;&nbsp; ${p.id}</div>
  </div>
  <div style="text-align:right">
    <span class="badge">✓ Paid</span>
    <div style="margin-top:8px; font-size:13px; color:#6b7280">Paid on ${new Date(p.paidOn).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
  </div>
</div>

<div class="section">
  <h3>Employee Information</h3>
  <div class="info-grid">
    <div class="info-row"><span class="info-label">Name</span><span class="info-value">${ME.firstName} ${ME.lastName}</span></div>
    <div class="info-row"><span class="info-label">Employee ID</span><span class="info-value">${ME.id}</span></div>
    <div class="info-row"><span class="info-label">Position</span><span class="info-value">${ME.position}</span></div>
    <div class="info-row"><span class="info-label">Department</span><span class="info-value">${ME.department}</span></div>
    <div class="info-row"><span class="info-label">Email</span><span class="info-value">${ME.email}</span></div>
    <div class="info-row"><span class="info-label">Hire Date</span><span class="info-value">${new Date(ME.hireDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span></div>
  </div>
</div>

<div class="section earnings-grid">
  <div>
    <h3>Earnings</h3>
    <table class="table">
      <tr><th>Description</th><th>Amount</th></tr>
      <tr><td>Basic Salary</td><td>$${p.basic.toLocaleString()}</td></tr>
      <tr><td>Housing Allowance</td><td>$${p.housing.toLocaleString()}</td></tr>
      <tr><td>Transport Allowance</td><td>$${p.transport.toLocaleString()}</td></tr>
      <tr><td>Performance Bonus</td><td>$${p.performance.toLocaleString()}</td></tr>
      <tr class="total-row"><td>Gross Pay</td><td>$${p.gross.toLocaleString()}</td></tr>
    </table>
  </div>
  <div>
    <h3>Deductions</h3>
    <table class="table">
      <tr><th>Description</th><th>Amount</th></tr>
      <tr><td>Income Tax (14%)</td><td>$${p.incomeTax.toLocaleString()}</td></tr>
      <tr><td>Social Security (4%)</td><td>$${p.socialSecurity.toLocaleString()}</td></tr>
      <tr><td>Health Insurance</td><td>$${p.healthInsurance.toLocaleString()}</td></tr>
      <tr><td>Pension (3%)</td><td>$${p.pension.toLocaleString()}</td></tr>
      <tr class="total-row"><td>Total Deductions</td><td>$${deductions.toLocaleString()}</td></tr>
    </table>
  </div>
</div>

<div class="net-pay">
  <div class="net-label">Net Pay — Take Home</div>
  <div class="net-amount">$${p.net.toLocaleString()}</div>
</div>

<div class="footer">
  This is a computer-generated payslip. No signature required. &nbsp;·&nbsp; AQUA SUITE HRMS &nbsp;·&nbsp; Acme Corporation
</div>

<script>window.onload = () => window.print()</script>
</body>
</html>`

  const win = window.open('', '_blank')
  if (win) { win.document.write(html); win.document.close() }
}

// ─── Payslip Detail Modal ────────────────────────────────────────────────────
function PayslipDetail({ p, onClose }: { p: Payslip; onClose: () => void }) {
  const deductions = p.gross - p.net

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        {/* Header */}
        <div className="aqua-gradient px-6 py-5 text-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white/70 text-xs">Payslip</p>
              <h2 className="text-xl font-bold mt-0.5">{p.period}</h2>
              <p className="text-sm text-white/70 mt-1">Paid on {new Date(p.paidOn).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-4 flex items-end justify-between">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white">{p.id}</span>
            <div className="text-right">
              <p className="text-white/70 text-xs">Net Pay</p>
              <p className="text-3xl font-black">{formatCurrency(p.net)}</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
          {/* Earnings */}
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Earnings</h4>
            <div className="space-y-1.5">
              {[
                { label: 'Basic Salary',        value: p.basic       },
                { label: 'Housing Allowance',   value: p.housing     },
                { label: 'Transport Allowance', value: p.transport   },
                { label: 'Performance Bonus',   value: p.performance },
              ].map((item) => (
                <div key={item.label} className="flex justify-between text-sm py-1 border-b border-border/50">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-semibold text-foreground">{formatCurrency(item.value)}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm py-2 bg-cyan-50 px-3 rounded-lg">
                <span className="font-bold text-cyan-700">Gross Pay</span>
                <span className="font-bold text-cyan-700">{formatCurrency(p.gross)}</span>
              </div>
            </div>
          </div>

          {/* Deductions */}
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Deductions</h4>
            <div className="space-y-1.5">
              {[
                { label: 'Income Tax (14%)',    value: p.incomeTax        },
                { label: 'Social Security (4%)',value: p.socialSecurity   },
                { label: 'Health Insurance',    value: p.healthInsurance  },
                { label: 'Pension (3%)',         value: p.pension          },
              ].map((item) => (
                <div key={item.label} className="flex justify-between text-sm py-1 border-b border-border/50">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-semibold text-rose-500">-{formatCurrency(item.value)}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm py-2 bg-rose-50 px-3 rounded-lg">
                <span className="font-bold text-rose-600">Total Deductions</span>
                <span className="font-bold text-rose-600">-{formatCurrency(deductions)}</span>
              </div>
            </div>
          </div>

          {/* Net pay highlight */}
          <div className="flex items-center justify-between p-4 rounded-xl border-2 border-primary/20 bg-primary/5">
            <div>
              <p className="text-xs text-muted-foreground">Take Home Pay</p>
              <p className="text-2xl font-black text-primary">{formatCurrency(p.net)}</p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={() => printPayslip(p)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted/50 transition-colors"
          >
            <Printer className="w-4 h-4 text-muted-foreground" />
            Print / PDF
          </button>
          <button
            onClick={() => printPayslip(p)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl aqua-gradient text-white text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function MyPayslipsPage() {
  const [yearFilter, setYearFilter] = useState('all')
  const [selected, setSelected]     = useState<Payslip | null>(null)

  const years  = Array.from(new Set(PAYSLIPS.map((p) => p.year))).sort((a, b) => b - a)
  const ytd    = PAYSLIPS.filter((p) => p.year === 2026).reduce((s, p) => s + p.net, 0)
  const ytdGross = PAYSLIPS.filter((p) => p.year === 2026).reduce((s, p) => s + p.gross, 0)

  const displayed = yearFilter === 'all' ? PAYSLIPS : PAYSLIPS.filter((p) => p.year === parseInt(yearFilter))

  return (
    <div className="flex flex-col flex-1">
      <div className="px-8 py-6 border-b border-border bg-white">
        <h1 className="text-xl font-bold text-foreground">My Payslips</h1>
        <p className="text-sm text-muted-foreground mt-0.5">View and download your payslips</p>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-6">

        {/* Summary KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: '2026 YTD Net',        value: formatCurrency(ytd),         sub: '3 months paid',         color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: '2026 YTD Gross',       value: formatCurrency(ytdGross),    sub: 'before deductions',     color: 'text-cyan-600',    bg: 'bg-cyan-50'    },
            { label: 'Monthly Net Pay',      value: formatCurrency(PAYSLIPS[0].net), sub: 'current month',     color: 'text-primary',     bg: 'bg-primary/10' },
            { label: 'Annual Salary',        value: formatCurrency(ME.salary),   sub: 'package',               color: 'text-amber-600',   bg: 'bg-amber-50'   },
          ].map((c) => (
            <div key={c.label} className="stat-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{c.label}</p>
                  <p className="text-lg font-bold text-foreground mt-0.5">{c.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{c.sub}</p>
                </div>
                <div className={`w-9 h-9 rounded-xl ${c.bg} flex items-center justify-center`}>
                  <DollarSign className={`w-4 h-4 ${c.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between flex-wrap gap-3">
            <h3 className="font-semibold text-foreground">Payslip History</h3>
            <div className="flex items-center gap-3">
              <select
                className="text-sm border border-border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white"
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
              >
                <option value="all">All Years</option>
                {years.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>

          <table className="w-full data-table">
            <thead>
              <tr>
                <th className="text-left px-6 py-3">Period</th>
                <th className="text-right px-4 py-3">Gross Pay</th>
                <th className="text-right px-4 py-3">Deductions</th>
                <th className="text-right px-4 py-3">Net Pay</th>
                <th className="text-left px-4 py-3">Paid On</th>
                <th className="text-center px-4 py-3">Status</th>
                <th className="text-center px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayed.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/20 cursor-pointer" onClick={() => setSelected(p)}>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-sm text-foreground">{p.period}</p>
                    <p className="text-xs text-muted-foreground">{p.id}</p>
                  </td>
                  <td className="px-4 py-4 text-right text-sm text-foreground">{formatCurrency(p.gross)}</td>
                  <td className="px-4 py-4 text-right text-sm text-rose-500">-{formatCurrency(p.gross - p.net)}</td>
                  <td className="px-4 py-4 text-right">
                    <span className="text-sm font-bold text-emerald-600">{formatCurrency(p.net)}</span>
                  </td>
                  <td className="px-4 py-4 text-sm text-muted-foreground">
                    {new Date(p.paidOn).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="badge-approved">Paid</span>
                  </td>
                  <td className="px-4 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => setSelected(p)}
                        className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                        title="View"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => printPayslip(p)}
                        className="p-2 rounded-lg hover:bg-emerald-50 text-emerald-600 transition-colors"
                        title="Download PDF"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && <PayslipDetail p={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
