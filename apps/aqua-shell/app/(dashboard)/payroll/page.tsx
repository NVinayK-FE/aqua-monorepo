'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ChartTableToggle } from '@/components/charts/chart-table-toggle'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import {
  DollarSign, TrendingUp, Users, CheckCircle2, Clock,
  Play, Download, MoreHorizontal, ChevronRight, AlertTriangle,
} from 'lucide-react'
import { PAYROLL_RUNS, payrollTrend, EMPLOYEES } from '@/lib/mock-data'
import { formatCurrency, formatDate, CHART_COLORS } from '@/lib/utils'
import type { PayrollStatus } from '@/types'

const STATUS_CONFIG: Record<PayrollStatus, { label: string; class: string }> = {
  draft: { label: 'Draft', class: 'badge-inactive' },
  processing: { label: 'Processing', class: 'badge-pending' },
  completed: { label: 'Completed', class: 'badge-approved' },
  failed: { label: 'Failed', class: 'badge-rejected' },
}

const salaryBands = [
  { range: '$0 – 60K', count: 22 },
  { range: '$60 – 90K', count: 41 },
  { range: '$90 – 120K', count: 55 },
  { range: '$120 – 150K', count: 34 },
  { range: '$150 – 200K', count: 18 },
  { range: '$200K+', count: 6 },
]

const deductionBreakdown = [
  { name: 'Federal Tax', value: 38, fill: CHART_COLORS.primary },
  { name: 'State Tax', value: 12, fill: CHART_COLORS.secondary },
  { name: 'Social Security', value: 6.2, fill: CHART_COLORS.accent },
  { name: 'Medicare', value: 1.45, fill: CHART_COLORS.success },
  { name: 'Health Insurance', value: 4.5, fill: CHART_COLORS.warning },
  { name: 'Retirement (401k)', value: 5, fill: CHART_COLORS.purple },
]

export default function PayrollPage() {
  const [activeRun] = useState(PAYROLL_RUNS[5]) // draft
  const completedRuns = PAYROLL_RUNS.filter((r) => r.status === 'completed')

  return (
    <div className="flex flex-col flex-1">
      <Header
        title="Payroll"
        subtitle="Process and manage payroll runs for all employees"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-3.5 h-3.5" />
              Reports
            </Button>
            <Button size="sm">
              <Play className="w-3.5 h-3.5" />
              Run Payroll
            </Button>
          </div>
        }
      />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            { label: 'Monthly Gross', value: formatCurrency(1_250_400), sub: 'March 2025', icon: DollarSign, color: 'text-cyan-600', bg: 'bg-cyan-50', trend: '+0.8%' },
            { label: 'Net Disbursed', value: formatCurrency(937_800), sub: 'After deductions', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+0.9%' },
            { label: 'Employees Paid', value: '176', sub: 'This cycle', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50', trend: '+1.1%' },
            { label: 'Pending Payroll', value: formatCurrency(1_263_000), sub: 'April (draft)', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', trend: 'Processing soon' },
          ].map((c) => (
            <div key={c.label} className="stat-card">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{c.label}</p>
                  <p className="text-xl font-bold text-foreground mt-1">{c.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{c.sub}</p>
                </div>
                <div className={`w-9 h-9 rounded-xl ${c.bg} flex items-center justify-center flex-shrink-0`}>
                  <c.icon className={`w-4.5 h-4.5 ${c.color}`} />
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-border">
                <span className="text-xs font-medium text-emerald-600">{c.trend}</span>
                <span className="text-xs text-muted-foreground ml-1">vs prev month</span>
              </div>
            </div>
          ))}
        </div>

        {/* Next payroll banner */}
        <Card className="border-amber-200 bg-amber-50/50">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">April 2025 payroll is in draft</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {activeRun.employeeCount} employees · Estimated gross {formatCurrency(activeRun.totalGross)} ·
                Schedule by April 28, 2025
              </p>
            </div>
            <Button size="sm">
              <Play className="w-3.5 h-3.5" />
              Process Now
            </Button>
          </CardContent>
        </Card>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Payroll Trend</CardTitle>
              <CardDescription>Gross vs Net over 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartTableToggle
                chartContent={
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={payrollTrend}>
                      <defs>
                        <linearGradient id="grossGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.15} />
                          <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="netGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={CHART_COLORS.success} stopOpacity={0.15} />
                          <stop offset="95%" stopColor={CHART_COLORS.success} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false}
                        tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
                      <Tooltip formatter={(v: number) => formatCurrency(v)} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Area type="monotone" dataKey="gross" name="Gross" stroke={CHART_COLORS.primary}
                        strokeWidth={2} fill="url(#grossGrad)" dot={{ r: 3, fill: CHART_COLORS.primary }} />
                      <Area type="monotone" dataKey="net" name="Net" stroke={CHART_COLORS.success}
                        strokeWidth={2} fill="url(#netGrad)" dot={{ r: 3, fill: CHART_COLORS.success }} />
                    </AreaChart>
                  </ResponsiveContainer>
                }
                tableContent={
                  <table className="w-full text-sm data-table">
                    <thead><tr>
                      <th className="text-left px-3 py-2 rounded-l-lg">Month</th>
                      <th className="text-right px-3 py-2">Gross</th>
                      <th className="text-right px-3 py-2">Net</th>
                      <th className="text-right px-3 py-2 rounded-r-lg">Deductions</th>
                    </tr></thead>
                    <tbody>
                      {payrollTrend.map((row) => (
                        <tr key={row.month} className="border-b border-border last:border-0 hover:bg-muted/30">
                          <td className="px-3 py-2.5 font-medium">{row.month}</td>
                          <td className="px-3 py-2.5 text-right">{formatCurrency(row.gross)}</td>
                          <td className="px-3 py-2.5 text-right text-emerald-600">{formatCurrency(row.net)}</td>
                          <td className="px-3 py-2.5 text-right text-muted-foreground">
                            {formatCurrency(row.gross - row.net)}
                          </td>
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
              <CardTitle>Salary Distribution</CardTitle>
              <CardDescription>Employees by salary band</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartTableToggle
                chartContent={
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={salaryBands} barSize={28}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="range" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                      <Tooltip />
                      <Bar dataKey="count" name="Employees" fill={CHART_COLORS.primary} radius={[6, 6, 0, 0]}>
                        {salaryBands.map((_, i) => (
                          <Cell key={i} fill={`hsl(${187 + i * 8}, ${90 - i * 8}%, ${42 + i * 5}%)`} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                }
                tableContent={
                  <table className="w-full text-sm data-table">
                    <thead><tr>
                      <th className="text-left px-3 py-2 rounded-l-lg">Salary Band</th>
                      <th className="text-right px-3 py-2">Count</th>
                      <th className="text-right px-3 py-2 rounded-r-lg">% of Total</th>
                    </tr></thead>
                    <tbody>
                      {salaryBands.map((b) => (
                        <tr key={b.range} className="border-b border-border last:border-0 hover:bg-muted/30">
                          <td className="px-3 py-2.5">{b.range}</td>
                          <td className="px-3 py-2.5 text-right font-medium">{b.count}</td>
                          <td className="px-3 py-2.5 text-right text-muted-foreground">
                            {Math.round((b.count / 176) * 100)}%
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

        {/* Deduction breakdown + Payroll history */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Deductions pie */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle>Deduction Breakdown</CardTitle>
              <CardDescription>March 2025 — {formatCurrency(312_600)} total</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartTableToggle
                chartContent={
                  <>
                    <ResponsiveContainer width="100%" height={160}>
                      <PieChart>
                        <Pie data={deductionBreakdown} cx="50%" cy="50%" innerRadius={40} outerRadius={65}
                          dataKey="value" paddingAngle={2}>
                          {deductionBreakdown.map((entry, i) => (
                            <Cell key={i} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(v) => [`${v}%`, '']} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-1.5 mt-2">
                      {deductionBreakdown.map((d) => (
                        <div key={d.name} className="flex items-center gap-2 text-xs">
                          <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: d.fill }} />
                          <span className="text-muted-foreground flex-1">{d.name}</span>
                          <span className="font-medium text-foreground">{d.value}%</span>
                        </div>
                      ))}
                    </div>
                  </>
                }
                tableContent={
                  <table className="w-full text-sm data-table">
                    <thead><tr>
                      <th className="text-left px-2 py-2 rounded-l-lg">Type</th>
                      <th className="text-right px-2 py-2 rounded-r-lg">Rate</th>
                    </tr></thead>
                    <tbody>
                      {deductionBreakdown.map((d) => (
                        <tr key={d.name} className="border-b border-border last:border-0">
                          <td className="px-2 py-2">{d.name}</td>
                          <td className="px-2 py-2 text-right font-medium">{d.value}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                }
              />
            </CardContent>
          </Card>

          {/* Payroll runs */}
          <Card className="lg:col-span-3">
            <CardHeader className="pb-3">
              <CardTitle>Payroll History</CardTitle>
              <CardDescription>All payroll runs</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-sm data-table">
                <thead>
                  <tr>
                    <th className="text-left px-6 py-3">Period</th>
                    <th className="text-right px-4 py-3">Employees</th>
                    <th className="text-right px-4 py-3">Gross</th>
                    <th className="text-right px-4 py-3">Net</th>
                    <th className="text-center px-4 py-3">Status</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {PAYROLL_RUNS.map((run) => {
                    const s = STATUS_CONFIG[run.status]
                    return (
                      <tr key={run.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-medium text-foreground">{run.period}</p>
                          {run.processedAt && (
                            <p className="text-xs text-muted-foreground">
                              Processed {formatDate(run.processedAt)}
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-4 text-right">{run.employeeCount}</td>
                        <td className="px-4 py-4 text-right font-medium">{formatCurrency(run.totalGross)}</td>
                        <td className="px-4 py-4 text-right text-emerald-600">{formatCurrency(run.totalNet)}</td>
                        <td className="px-4 py-4 text-center">
                          <span className={s.class}>{s.label}</span>
                        </td>
                        <td className="px-4 py-4">
                          <button className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
