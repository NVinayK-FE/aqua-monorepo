'use client'

import { Header } from '@/components/layout/header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChartTableToggle } from '@/components/charts/chart-table-toggle'
import { Button } from '@/components/ui/button'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import {
  Users, DollarSign, Calendar, Star, TrendingUp, TrendingDown,
  ArrowUpRight, Clock, CheckCircle2, AlertCircle, Download,
} from 'lucide-react'
import {
  headcountTrend, payrollTrend, departmentHeadcount,
  leaveByType, performanceDistribution, attendanceData,
  LEAVE_REQUESTS, PERFORMANCE_REVIEWS,
} from '@/lib/mock-data'
import { formatCurrency, CHART_COLORS } from '@/lib/utils'

const KPI_CARDS = [
  {
    title: 'Total Employees',
    value: '176',
    change: '+5',
    trend: 'up',
    sub: 'vs last month',
    icon: Users,
    color: 'text-cyan-600',
    bg: 'bg-cyan-50',
  },
  {
    title: 'Monthly Payroll',
    value: '$937.8K',
    change: '+0.8%',
    trend: 'up',
    sub: 'net disbursed',
    icon: DollarSign,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  {
    title: 'On Leave Today',
    value: '12',
    change: '-2',
    trend: 'down',
    sub: 'vs yesterday',
    icon: Calendar,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
  {
    title: 'Avg Performance',
    value: '4.3 / 5',
    change: '+0.2',
    trend: 'up',
    sub: 'Q1 2025',
    icon: Star,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
  },
]

const DEPT_COLORS = [
  CHART_COLORS.primary, CHART_COLORS.secondary, CHART_COLORS.accent,
  CHART_COLORS.success, CHART_COLORS.warning, CHART_COLORS.purple,
  CHART_COLORS.pink, CHART_COLORS.indigo,
]

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-border rounded-lg p-3 shadow-md text-xs">
      <p className="font-semibold text-foreground mb-1">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-muted-foreground">{p.name}:</span>
          <span className="font-medium text-foreground">
            {typeof p.value === 'number' && p.name?.toLowerCase().includes('gross') || p.name?.toLowerCase().includes('net')
              ? formatCurrency(p.value)
              : p.value}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function DashboardPage() {
  const pendingLeave = LEAVE_REQUESTS.filter((l) => l.status === 'pending').length
  const pendingReviews = PERFORMANCE_REVIEWS.filter((r) => r.status === 'in_progress' || r.status === 'scheduled').length

  return (
    <div className="flex flex-col flex-1">
      <Header
        title="Dashboard"
        subtitle="Welcome back, James — here's what's happening at Acme Corp."
        actions={
          <Button variant="outline" size="sm">
            <Download className="w-3.5 h-3.5" />
            Export
          </Button>
        }
      />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {KPI_CARDS.map((card) => (
            <div key={card.title} className="stat-card">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{card.title}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{card.value}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center`}>
                  <card.icon className={`w-5 h-5 ${card.color}`} />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-3">
                {card.trend === 'up' ? (
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5 text-rose-500" />
                )}
                <span className={`text-xs font-medium ${card.trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {card.change}
                </span>
                <span className="text-xs text-muted-foreground">{card.sub}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Headcount + Payroll trend */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Headcount Trend</CardTitle>
                  <CardDescription>6-month employee growth</CardDescription>
                </div>
                <Badge variant="success">+15.8% YTD</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ChartTableToggle
                chartContent={
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={headcountTrend}>
                      <defs>
                        <linearGradient id="headcountGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.2} />
                          <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} domain={[140, 185]} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone" dataKey="count" name="Total"
                        stroke={CHART_COLORS.primary} strokeWidth={2}
                        fill="url(#headcountGrad)" dot={{ fill: CHART_COLORS.primary, strokeWidth: 0, r: 3 }}
                      />
                      <Bar dataKey="hires" name="Hires" fill={CHART_COLORS.success} radius={[4, 4, 0, 0]} />
                      <Bar dataKey="exits" name="Exits" fill={CHART_COLORS.danger} radius={[4, 4, 0, 0]} />
                    </AreaChart>
                  </ResponsiveContainer>
                }
                tableContent={
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm data-table">
                      <thead>
                        <tr>
                          <th className="text-left px-3 py-2 rounded-l-lg">Month</th>
                          <th className="text-right px-3 py-2">Total</th>
                          <th className="text-right px-3 py-2">Hires</th>
                          <th className="text-right px-3 py-2 rounded-r-lg">Exits</th>
                        </tr>
                      </thead>
                      <tbody>
                        {headcountTrend.map((row) => (
                          <tr key={row.month} className="border-b border-border last:border-0 hover:bg-muted/30">
                            <td className="px-3 py-2.5 font-medium">{row.month}</td>
                            <td className="px-3 py-2.5 text-right">{row.count}</td>
                            <td className="px-3 py-2.5 text-right text-emerald-600">+{row.hires}</td>
                            <td className="px-3 py-2.5 text-right text-rose-600">-{row.exits}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                }
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Payroll Overview</CardTitle>
                  <CardDescription>Monthly gross vs net disbursement</CardDescription>
                </div>
                <Badge>Last 6 months</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ChartTableToggle
                chartContent={
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={payrollTrend} barGap={4}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis
                        tick={{ fontSize: 11 }} axisLine={false} tickLine={false}
                        tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Bar dataKey="gross" name="Gross" fill={CHART_COLORS.primary} radius={[4, 4, 0, 0]} />
                      <Bar dataKey="net" name="Net" fill={CHART_COLORS.success} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                }
                tableContent={
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm data-table">
                      <thead>
                        <tr>
                          <th className="text-left px-3 py-2 rounded-l-lg">Month</th>
                          <th className="text-right px-3 py-2">Gross</th>
                          <th className="text-right px-3 py-2">Net</th>
                          <th className="text-right px-3 py-2 rounded-r-lg">Deductions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {payrollTrend.map((row) => (
                          <tr key={row.month} className="border-b border-border last:border-0 hover:bg-muted/30">
                            <td className="px-3 py-2.5 font-medium">{row.month}</td>
                            <td className="px-3 py-2.5 text-right">{formatCurrency(row.gross)}</td>
                            <td className="px-3 py-2.5 text-right text-emerald-600">{formatCurrency(row.net)}</td>
                            <td className="px-3 py-2.5 text-right text-muted-foreground">{formatCurrency(row.gross - row.net)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                }
              />
            </CardContent>
          </Card>
        </div>

        {/* Dept breakdown + Leave distribution + Attendance */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Dept pie */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>By Department</CardTitle>
              <CardDescription>Headcount distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartTableToggle
                chartContent={
                  <>
                    <ResponsiveContainer width="100%" height={180}>
                      <PieChart>
                        <Pie data={departmentHeadcount} cx="50%" cy="50%" innerRadius={45} outerRadius={70}
                          dataKey="value" paddingAngle={2}>
                          {departmentHeadcount.map((_, i) => (
                            <Cell key={i} fill={DEPT_COLORS[i % DEPT_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(v) => [`${v} employees`, '']} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-2">
                      {departmentHeadcount.map((d, i) => (
                        <div key={d.name} className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: DEPT_COLORS[i % DEPT_COLORS.length] }} />
                          <span className="text-xs text-muted-foreground truncate">{d.name}</span>
                          <span className="text-xs font-medium ml-auto">{d.value}</span>
                        </div>
                      ))}
                    </div>
                  </>
                }
                tableContent={
                  <table className="w-full text-sm data-table">
                    <thead><tr>
                      <th className="text-left px-2 py-2 rounded-l-lg">Dept</th>
                      <th className="text-right px-2 py-2 rounded-r-lg">Count</th>
                    </tr></thead>
                    <tbody>
                      {departmentHeadcount.map((d) => (
                        <tr key={d.name} className="border-b border-border last:border-0">
                          <td className="px-2 py-2">{d.name}</td>
                          <td className="px-2 py-2 text-right font-medium">{d.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                }
              />
            </CardContent>
          </Card>

          {/* Leave by type */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Leave Distribution</CardTitle>
              <CardDescription>By type this quarter</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartTableToggle
                chartContent={
                  <>
                    <ResponsiveContainer width="100%" height={180}>
                      <BarChart data={leaveByType} layout="vertical" barSize={14}>
                        <XAxis type="number" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                        <YAxis dataKey="type" type="category" tick={{ fontSize: 10 }} width={65} axisLine={false} tickLine={false} />
                        <Tooltip />
                        <Bar dataKey="count" name="Days" radius={[0, 4, 4, 0]}>
                          {leaveByType.map((entry, i) => (
                            <Cell key={i} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                    <div className="flex items-center justify-between mt-2 px-1">
                      <span className="text-xs text-muted-foreground">Total leave days</span>
                      <span className="text-sm font-bold text-foreground">
                        {leaveByType.reduce((s, l) => s + l.count, 0)}
                      </span>
                    </div>
                  </>
                }
                tableContent={
                  <table className="w-full text-sm data-table">
                    <thead><tr>
                      <th className="text-left px-2 py-2 rounded-l-lg">Type</th>
                      <th className="text-right px-2 py-2 rounded-r-lg">Days</th>
                    </tr></thead>
                    <tbody>
                      {leaveByType.map((l) => (
                        <tr key={l.type} className="border-b border-border last:border-0">
                          <td className="px-2 py-2">{l.type}</td>
                          <td className="px-2 py-2 text-right font-medium">{l.count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                }
              />
            </CardContent>
          </Card>

          {/* Attendance */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Attendance Rate</CardTitle>
              <CardDescription>Monthly attendance % breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartTableToggle
                chartContent={
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={attendanceData} barSize={14} barGap={2}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: 10 }} />
                      <Bar dataKey="present" name="Present %" fill={CHART_COLORS.success} radius={[4, 4, 0, 0]} />
                      <Bar dataKey="absent" name="Absent %" fill={CHART_COLORS.danger} radius={[4, 4, 0, 0]} />
                      <Bar dataKey="late" name="Late %" fill={CHART_COLORS.warning} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                }
                tableContent={
                  <table className="w-full text-sm data-table">
                    <thead><tr>
                      <th className="text-left px-2 py-2 rounded-l-lg">Month</th>
                      <th className="text-right px-2 py-2">Present</th>
                      <th className="text-right px-2 py-2">Absent</th>
                      <th className="text-right px-2 py-2 rounded-r-lg">Late</th>
                    </tr></thead>
                    <tbody>
                      {attendanceData.map((row) => (
                        <tr key={row.month} className="border-b border-border last:border-0">
                          <td className="px-2 py-2 font-medium">{row.month}</td>
                          <td className="px-2 py-2 text-right text-emerald-600">{row.present}%</td>
                          <td className="px-2 py-2 text-right text-rose-600">{row.absent}%</td>
                          <td className="px-2 py-2 text-right text-amber-600">{row.late}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                }
              />
            </CardContent>
          </Card>
        </div>

        {/* Action items + Recent activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Quick actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Pending Actions</CardTitle>
              <CardDescription>Items requiring your attention</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4 text-amber-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">Leave approvals</p>
                  <p className="text-xs text-muted-foreground">{pendingLeave} requests pending</p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              </div>

              <div className="flex items-center gap-3 p-3 bg-sky-50 rounded-lg border border-sky-100">
                <div className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center flex-shrink-0">
                  <Star className="w-4 h-4 text-sky-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">Performance reviews</p>
                  <p className="text-xs text-muted-foreground">{pendingReviews} in progress</p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              </div>

              <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">April payroll</p>
                  <p className="text-xs text-muted-foreground">Ready to process</p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              </div>

              <div className="flex items-center gap-3 p-3 bg-rose-50 rounded-lg border border-rose-100">
                <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">Contract expiring</p>
                  <p className="text-xs text-muted-foreground">2 contractors this month</p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              </div>
            </CardContent>
          </Card>

          {/* Performance distribution */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Performance Distribution</CardTitle>
                  <CardDescription>Q1 2025 rating breakdown — 176 employees</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ChartTableToggle
                chartContent={
                  <>
                    <div className="space-y-3">
                      {performanceDistribution.map((item, i) => (
                        <div key={item.rating} className="flex items-center gap-3">
                          <div className="w-32 text-xs text-muted-foreground truncate flex-shrink-0">
                            {item.rating}
                          </div>
                          <div className="flex-1 bg-muted rounded-full h-2.5 overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${item.percent}%`,
                                backgroundColor: [
                                  CHART_COLORS.success, CHART_COLORS.primary, CHART_COLORS.accent,
                                  CHART_COLORS.warning, CHART_COLORS.danger,
                                ][i],
                              }}
                            />
                          </div>
                          <div className="w-14 text-right flex-shrink-0">
                            <span className="text-xs font-semibold text-foreground">{item.count}</span>
                            <span className="text-xs text-muted-foreground ml-1">({item.percent}%)</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-foreground">4.3</p>
                        <p className="text-xs text-muted-foreground">Average rating</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-emerald-600">53%</p>
                        <p className="text-xs text-muted-foreground">Exceeds expectations</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-amber-600">13%</p>
                        <p className="text-xs text-muted-foreground">Needs improvement</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-foreground">176</p>
                        <p className="text-xs text-muted-foreground">Reviews completed</p>
                      </div>
                    </div>
                  </>
                }
                tableContent={
                  <table className="w-full text-sm data-table">
                    <thead><tr>
                      <th className="text-left px-3 py-2 rounded-l-lg">Rating</th>
                      <th className="text-right px-3 py-2">Count</th>
                      <th className="text-right px-3 py-2 rounded-r-lg">% of Total</th>
                    </tr></thead>
                    <tbody>
                      {performanceDistribution.map((item) => (
                        <tr key={item.rating} className="border-b border-border last:border-0 hover:bg-muted/30">
                          <td className="px-3 py-2.5">{item.rating}</td>
                          <td className="px-3 py-2.5 text-right font-medium">{item.count}</td>
                          <td className="px-3 py-2.5 text-right text-muted-foreground">{item.percent}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                }
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
