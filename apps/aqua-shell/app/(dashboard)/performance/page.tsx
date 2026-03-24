'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ChartTableToggle } from '@/components/charts/chart-table-toggle'
import {
  BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts'
import {
  Star, TrendingUp, Target, Award, Plus,
  MoreHorizontal, CheckCircle2, Clock, AlertCircle,
} from 'lucide-react'
import { PERFORMANCE_REVIEWS, performanceDistribution } from '@/lib/mock-data'
import { formatDate, getInitials, getAvatarColor, CHART_COLORS } from '@/lib/utils'
import type { ReviewStatus } from '@/types'

const STATUS_CONFIG: Record<ReviewStatus, { label: string; class: string; icon: any }> = {
  scheduled: { label: 'Scheduled', class: 'badge-inactive', icon: Clock },
  in_progress: { label: 'In Progress', class: 'badge-pending', icon: Clock },
  completed: { label: 'Completed', class: 'badge-approved', icon: CheckCircle2 },
  overdue: { label: 'Overdue', class: 'badge-rejected', icon: AlertCircle },
}

const RATING_LABELS = ['', 'Unsatisfactory', 'Below Expectations', 'Meets Expectations', 'Exceeds Expectations', 'Exceptional']

const radarData = [
  { subject: 'Technical', A: 4.5, B: 3.8 },
  { subject: 'Leadership', A: 4.2, B: 3.5 },
  { subject: 'Teamwork', A: 4.8, B: 4.2 },
  { subject: 'Communication', A: 4.1, B: 4.0 },
  { subject: 'Innovation', A: 4.6, B: 3.7 },
  { subject: 'Delivery', A: 4.4, B: 3.9 },
]

const ratingColors = [CHART_COLORS.success, CHART_COLORS.primary, CHART_COLORS.accent, CHART_COLORS.warning, CHART_COLORS.danger]

export default function PerformancePage() {
  const [filter, setFilter] = useState<string>('all')

  const filtered = PERFORMANCE_REVIEWS.filter(
    (r) => filter === 'all' || r.status === filter
  )

  return (
    <div className="flex flex-col flex-1">
      <Header
        title="Performance & Appraisals"
        subtitle="Track employee performance reviews, goals, and ratings"
        actions={
          <Button size="sm">
            <Plus className="w-3.5 h-3.5" />
            New Review
          </Button>
        }
      />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            { label: 'Avg Rating', value: '4.3 / 5', icon: Star, color: 'text-amber-500', bg: 'bg-amber-50', sub: 'Q1 2025' },
            { label: 'Reviews Completed', value: '3 / 5', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', sub: 'This cycle' },
            { label: 'Goals On Track', value: '4 / 6', icon: Target, color: 'text-cyan-600', bg: 'bg-cyan-50', sub: 'Active goals' },
            { label: 'Top Performers', value: '24', icon: Award, color: 'text-purple-600', bg: 'bg-purple-50', sub: 'Rating ≥ 4.5' },
          ].map((c) => (
            <div key={c.label} className="stat-card">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{c.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{c.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{c.sub}</p>
                </div>
                <div className={`w-9 h-9 rounded-xl ${c.bg} flex items-center justify-center flex-shrink-0`}>
                  <c.icon className={`w-4.5 h-4.5 ${c.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Performance Distribution</CardTitle>
              <CardDescription>Q1 2025 — 176 employees rated</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartTableToggle
                chartContent={
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={performanceDistribution} barSize={36}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="rating" tick={{ fontSize: 9 }} axisLine={false} tickLine={false}
                        tickFormatter={(v) => v.split(' — ')[0]} />
                      <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                      <Tooltip formatter={(v, n, p) => [v, p.payload.rating]} />
                      <Bar dataKey="count" name="Employees" radius={[6, 6, 0, 0]}>
                        {performanceDistribution.map((_, i) => (
                          <Cell key={i} fill={ratingColors[i]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                }
                tableContent={
                  <table className="w-full text-sm data-table">
                    <thead><tr>
                      <th className="text-left px-3 py-2 rounded-l-lg">Rating</th>
                      <th className="text-right px-3 py-2">Count</th>
                      <th className="text-right px-3 py-2 rounded-r-lg">%</th>
                    </tr></thead>
                    <tbody>
                      {performanceDistribution.map((row) => (
                        <tr key={row.rating} className="border-b border-border last:border-0 hover:bg-muted/30">
                          <td className="px-3 py-2.5">{row.rating}</td>
                          <td className="px-3 py-2.5 text-right font-medium">{row.count}</td>
                          <td className="px-3 py-2.5 text-right text-muted-foreground">{row.percent}%</td>
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
              <CardTitle>Competency Radar</CardTitle>
              <CardDescription>Top performer vs. team average (scale 1–5)</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartTableToggle
                chartContent={
                  <ResponsiveContainer width="100%" height={220}>
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="#e2e8f0" />
                      <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                      <Radar name="Top Performer" dataKey="A" stroke={CHART_COLORS.primary}
                        fill={CHART_COLORS.primary} fillOpacity={0.2} strokeWidth={2} />
                      <Radar name="Team Average" dataKey="B" stroke={CHART_COLORS.warning}
                        fill={CHART_COLORS.warning} fillOpacity={0.1} strokeWidth={2} />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                }
                tableContent={
                  <table className="w-full text-sm data-table">
                    <thead><tr>
                      <th className="text-left px-3 py-2 rounded-l-lg">Competency</th>
                      <th className="text-right px-3 py-2">Top Performer</th>
                      <th className="text-right px-3 py-2 rounded-r-lg">Team Avg</th>
                    </tr></thead>
                    <tbody>
                      {radarData.map((row) => (
                        <tr key={row.subject} className="border-b border-border last:border-0 hover:bg-muted/30">
                          <td className="px-3 py-2.5 font-medium">{row.subject}</td>
                          <td className="px-3 py-2.5 text-right text-cyan-600 font-semibold">{row.A}</td>
                          <td className="px-3 py-2.5 text-right text-muted-foreground">{row.B}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                }
              />
            </CardContent>
          </Card>
        </div>

        {/* Reviews list */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle>Performance Reviews</CardTitle>
                <CardDescription>Q1 2025</CardDescription>
              </div>
              <div className="flex rounded-lg border border-input overflow-hidden text-xs">
                {(['all', 'completed', 'in_progress', 'scheduled', 'overdue'] as const).map((s) => (
                  <button key={s} onClick={() => setFilter(s)}
                    className={`px-3 py-1.5 capitalize transition-colors ${
                      filter === s ? 'bg-primary text-white' : 'bg-white text-muted-foreground hover:bg-muted'
                    }`}>
                    {s.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full data-table">
              <thead>
                <tr>
                  <th className="text-left px-6 py-3">Employee</th>
                  <th className="text-left px-4 py-3">Reviewer</th>
                  <th className="text-left px-4 py-3">Period</th>
                  <th className="text-center px-4 py-3">Rating</th>
                  <th className="text-left px-4 py-3">Goals</th>
                  <th className="text-center px-4 py-3">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((review) => {
                  const initials = getInitials(review.employeeName)
                  const avatarClass = getAvatarColor(review.employeeName)
                  const s = STATUS_CONFIG[review.status]
                  const avgGoalProgress = review.goals.length
                    ? Math.round(review.goals.reduce((sum, g) => sum + Math.min(g.progress, 100), 0) / review.goals.length)
                    : 0
                  return (
                    <tr key={review.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${avatarClass}`}>
                            {initials}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">{review.employeeName}</p>
                            <p className="text-xs text-muted-foreground">{review.department}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-muted-foreground">{review.reviewerName}</td>
                      <td className="px-4 py-4 text-sm text-foreground">{review.period}</td>
                      <td className="px-4 py-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={`w-3.5 h-3.5 ${s <= review.rating ? 'text-amber-400 fill-amber-400' : 'text-muted'}`}
                              />
                            ))}
                          </div>
                          <span className="text-xs font-medium text-foreground">{review.rating}.0</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{RATING_LABELS[review.rating]}</p>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <Progress value={avgGoalProgress} className="h-1.5 w-20 flex-shrink-0" />
                          <span className="text-xs text-muted-foreground">{avgGoalProgress}%</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {review.goals.filter((g) => g.status === 'completed').length}/{review.goals.length} goals done
                        </p>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className={s.class}>{s.label}</span>
                      </td>
                      <td className="px-4 py-4">
                        <button className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Individual goal tracking */}
        <Card>
          <CardHeader>
            <CardTitle>Goal Progress Tracker</CardTitle>
            <CardDescription>All active goals across Q1 2025 reviews</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {PERFORMANCE_REVIEWS.flatMap((r) =>
                r.goals.map((goal) => (
                  <div key={goal.id} className="flex items-start gap-4 p-4 rounded-xl border border-border hover:bg-muted/30 transition-colors">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      goal.status === 'completed' ? 'bg-emerald-50' :
                      goal.status === 'overdue' ? 'bg-rose-50' :
                      goal.status === 'in_progress' ? 'bg-cyan-50' : 'bg-muted'
                    }`}>
                      {goal.status === 'completed' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> :
                       goal.status === 'overdue' ? <AlertCircle className="w-4 h-4 text-rose-600" /> :
                       <Target className="w-4 h-4 text-cyan-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div>
                          <p className="text-sm font-semibold text-foreground">{goal.title}</p>
                          <p className="text-xs text-muted-foreground">{goal.description}</p>
                        </div>
                        <span className={`text-xs flex-shrink-0 ${
                          goal.status === 'completed' ? 'badge-approved' :
                          goal.status === 'overdue' ? 'badge-rejected' :
                          goal.status === 'in_progress' ? 'badge-pending' : 'badge-inactive'
                        }`}>
                          {goal.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-2">
                        <Progress value={Math.min(goal.progress, 100)} className="flex-1 h-1.5" />
                        <span className="text-xs font-semibold text-foreground w-10 text-right">
                          {goal.progress}%
                        </span>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-1.5">
                        Target: {formatDate(goal.targetDate)} · {PERFORMANCE_REVIEWS.find((r) => r.goals.some((g) => g.id === goal.id))?.employeeName}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
