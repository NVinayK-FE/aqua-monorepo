'use client'

import { useState } from 'react'
import {
  Star, Target, TrendingUp, Award, ChevronRight,
  CheckCircle2, Clock, AlertCircle, Zap, MessageSquare,
} from 'lucide-react'
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip,
  Cell,
} from 'recharts'
import { EMPLOYEES } from '@/lib/mock-data'

// ─── Tom Anderson data ────────────────────────────────────────────────────────
const ME = EMPLOYEES.find((e) => e.id === 'e10')!

// Performance scores per competency (out of 5)
const COMPETENCIES = [
  { subject: 'Technical',      A: 4.5 },
  { subject: 'Teamwork',       A: 4.2 },
  { subject: 'Communication',  A: 3.8 },
  { subject: 'Leadership',     A: 3.5 },
  { subject: 'Delivery',       A: 4.4 },
  { subject: 'Innovation',     A: 4.0 },
]

// Quarter history
const QUARTERLY = [
  { quarter: 'Q2 2025', score: 3.5 },
  { quarter: 'Q3 2025', score: 3.8 },
  { quarter: 'Q4 2025', score: 4.0 },
  { quarter: 'Q1 2026', score: 4.2 },
]

interface Goal {
  id: string
  title: string
  description: string
  progress: number
  dueDate: string
  status: 'completed' | 'in_progress' | 'overdue' | 'not_started'
  category: 'technical' | 'leadership' | 'growth' | 'project'
}

const GOALS: Goal[] = [
  { id: 'g1', title: 'Complete Microservices Migration',     description: 'Migrate backend monolith to microservices architecture', progress: 65,  dueDate: '2026-04-30', status: 'in_progress',  category: 'technical'   },
  { id: 'g2', title: 'Mentor 2 Junior Developers',          description: 'Provide weekly 1-on-1 coaching sessions',                  progress: 50,  dueDate: '2026-06-30', status: 'in_progress',  category: 'leadership'  },
  { id: 'g3', title: 'AWS Solutions Architect Certification',description: 'Pass AWS SAA-C03 exam',                                   progress: 40,  dueDate: '2026-05-31', status: 'in_progress',  category: 'growth'      },
  { id: 'g4', title: 'Launch v3 API Gateway',               description: 'Design, build, and deploy new API gateway service',        progress: 100, dueDate: '2026-02-28', status: 'completed',    category: 'project'     },
  { id: 'g5', title: 'Reduce API Response Time by 30%',     description: 'Performance optimization across key endpoints',            progress: 85,  dueDate: '2026-03-31', status: 'in_progress',  category: 'technical'   },
  { id: 'g6', title: 'Q4 Sprint Documentation',             description: 'Document all sprint deliverables and architecture',        progress: 20,  dueDate: '2026-01-15', status: 'overdue',       category: 'project'     },
]

interface Feedback {
  id: string
  from: string
  initials: string
  role: string
  date: string
  rating: 1 | 2 | 3 | 4 | 5
  comment: string
}

const FEEDBACK: Feedback[] = [
  { id: 'f1', from: 'Sarah Chen',    initials: 'SC', role: 'Engineering Lead',       date: '2026-03-15', rating: 5, comment: 'Tom consistently delivers high-quality code. His refactoring of the payment module was exceptional — clean, well-documented, and fully tested.' },
  { id: 'f2', from: 'Marcus Johnson',initials: 'MJ', role: 'Product Manager',        date: '2026-03-10', rating: 4, comment: 'Great collaboration on the dashboard redesign. Tom was proactive about flagging technical constraints early, which saved us two sprints of rework.' },
  { id: 'f3', from: 'Priya Sharma',  initials: 'PS', role: 'Senior Designer',        date: '2026-02-28', rating: 4, comment: 'Working with Tom is smooth. He implements designs accurately and always asks the right questions before making assumptions.' },
]

const GOAL_STATUS_CONF = {
  completed:   { label: 'Completed',   cls: 'badge-approved',  icon: CheckCircle2 },
  in_progress: { label: 'In Progress', cls: 'badge-pending',   icon: Clock        },
  overdue:     { label: 'Overdue',     cls: 'badge-rejected',  icon: AlertCircle  },
  not_started: { label: 'Not Started', cls: 'badge-inactive',  icon: Clock        },
}

const CATEGORY_COLORS = {
  technical:  'bg-cyan-100 text-cyan-700',
  leadership: 'bg-purple-100 text-purple-700',
  growth:     'bg-amber-100 text-amber-700',
  project:    'bg-emerald-100 text-emerald-700',
}

const BAR_COLORS = ['#00bcd4', '#0e7490', '#00bcd4', '#0891b2']

function StarRating({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map((i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${i <= value ? 'text-amber-400 fill-amber-400' : 'text-muted-foreground/30'}`}
        />
      ))}
    </div>
  )
}

export default function MyPerformancePage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'goals' | 'feedback'>('overview')

  const overallScore = ME.performanceScore
  const completedGoals = GOALS.filter((g) => g.status === 'completed').length
  const inProgressGoals = GOALS.filter((g) => g.status === 'in_progress').length

  return (
    <div className="flex flex-col flex-1">
      <div className="px-8 py-6 border-b border-border bg-white">
        <h1 className="text-xl font-bold text-foreground">My Performance</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Track your goals, ratings, and peer feedback</p>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-6">

        {/* KPI row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Overall Rating',      value: `${overallScore} / 5`,         icon: Star,       color: 'text-amber-500',   bg: 'bg-amber-50'   },
            { label: 'Goals Completed',     value: `${completedGoals} / ${GOALS.length}`, icon: Target, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Active Goals',        value: String(inProgressGoals),        icon: Zap,        color: 'text-cyan-600',    bg: 'bg-cyan-50'    },
            { label: 'Peer Reviews',        value: String(FEEDBACK.length),        icon: MessageSquare, color: 'text-purple-600', bg: 'bg-purple-50' },
          ].map((c) => (
            <div key={c.label} className="stat-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{c.label}</p>
                  <p className="text-xl font-bold text-foreground mt-0.5">{c.value}</p>
                </div>
                <div className={`w-9 h-9 rounded-xl ${c.bg} flex items-center justify-center`}>
                  <c.icon className={`w-4 h-4 ${c.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Current review status card */}
        <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="badge-pending flex items-center gap-1"><Clock className="w-3 h-3" /> In Progress</span>
                <span className="text-xs text-muted-foreground">Q1 2026 Review</span>
              </div>
              <h3 className="font-bold text-foreground text-lg">Quarterly Performance Review</h3>
              <p className="text-sm text-muted-foreground mt-0.5">Reviewer: Sarah Chen (Engineering Lead) · Due Apr 30, 2026</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-3xl font-black text-primary">{overallScore}</p>
                <p className="text-xs text-muted-foreground">/ 5.0</p>
              </div>
              <div className="flex flex-col gap-0.5">
                {[5,4,3,2,1].map((s) => (
                  <div key={s} className="flex items-center gap-1.5">
                    <span className="text-[10px] text-muted-foreground w-2">{s}</span>
                    <div className={`h-1.5 rounded-full ${s <= Math.round(overallScore) ? 'bg-amber-400' : 'bg-muted'}`} style={{ width: s <= Math.round(overallScore) ? 24 : 10 }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-muted p-1 rounded-xl w-fit">
          {([['overview', 'Overview'], ['goals', 'Goals'], ['feedback', 'Peer Feedback']] as const).map(([t, label]) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === t ? 'bg-white text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── Overview ── */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Radar */}
            <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
              <h3 className="font-semibold text-foreground mb-4">Competency Breakdown</h3>
              <ResponsiveContainer width="100%" height={260}>
                <RadarChart data={COMPETENCIES}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                  <Radar name="Score" dataKey="A" stroke="#00bcd4" fill="#00bcd4" fillOpacity={0.25} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Bar — quarterly trend */}
            <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
              <h3 className="font-semibold text-foreground mb-4">Quarterly Score Trend</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={QUARTERLY} barSize={36}>
                  <XAxis dataKey="quarter" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 5]} ticks={[0,1,2,3,4,5]} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip formatter={(v: number) => [v.toFixed(1), 'Score']} />
                  <Bar dataKey="score" radius={[6,6,0,0]}>
                    {QUARTERLY.map((_, i) => (
                      <Cell key={i} fill={i === QUARTERLY.length - 1 ? '#00bcd4' : '#0e7490'} fillOpacity={i === QUARTERLY.length - 1 ? 1 : 0.6} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Competency detail list */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-border p-6 shadow-sm">
              <h3 className="font-semibold text-foreground mb-4">Competency Scores</h3>
              <div className="space-y-4">
                {COMPETENCIES.map((c) => (
                  <div key={c.subject}>
                    <div className="flex items-center justify-between mb-1.5 text-sm">
                      <span className="font-medium text-foreground">{c.subject}</span>
                      <div className="flex items-center gap-2">
                        <StarRating value={Math.round(c.A)} />
                        <span className="text-sm font-bold text-foreground">{c.A}</span>
                      </div>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full aqua-gradient rounded-full" style={{ width: `${(c.A / 5) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Goals ── */}
        {activeTab === 'goals' && (
          <div className="space-y-3">
            {GOALS.map((g) => {
              const conf = GOAL_STATUS_CONF[g.status]
              const Icon = conf.icon
              const catCls = CATEGORY_COLORS[g.category]
              const overdue = g.status === 'overdue'
              return (
                <div key={g.id} className="bg-white rounded-2xl border border-border p-5 shadow-sm hover:border-primary/20 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${g.status === 'completed' ? 'bg-emerald-50' : overdue ? 'bg-rose-50' : 'bg-primary/10'}`}>
                      <Icon className={`w-5 h-5 ${g.status === 'completed' ? 'text-emerald-500' : overdue ? 'text-rose-400' : 'text-primary'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h4 className="font-semibold text-foreground text-sm">{g.title}</h4>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${catCls}`}>{g.category}</span>
                        <span className={conf.cls}>{conf.label}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{g.description}</p>
                      <div className="mt-3">
                        <div className="flex items-center justify-between mb-1.5 text-xs">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-semibold text-foreground">{g.progress}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${g.progress}%`,
                              backgroundColor: g.status === 'completed' ? '#10b981' : overdue ? '#ef5350' : '#00bcd4',
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs text-muted-foreground">Due</p>
                      <p className="text-xs font-semibold text-foreground">{new Date(g.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* ── Peer Feedback ── */}
        {activeTab === 'feedback' && (
          <div className="space-y-4">
            {FEEDBACK.map((f) => (
              <div key={f.id} className="bg-white rounded-2xl border border-border p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full aqua-gradient flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {f.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
                      <div>
                        <span className="font-semibold text-foreground text-sm">{f.from}</span>
                        <span className="text-muted-foreground text-xs ml-2">{f.role}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <StarRating value={f.rating} />
                        <span className="text-xs text-muted-foreground">{new Date(f.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{f.comment}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
