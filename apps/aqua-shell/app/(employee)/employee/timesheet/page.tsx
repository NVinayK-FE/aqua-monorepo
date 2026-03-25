'use client'

import { useState, useMemo } from 'react'
import {
  Clock, CheckCircle2, ChevronLeft, ChevronRight,
  Save, Send, LayoutGrid, List, AlertTriangle, Plus, Trash2,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────
interface TimeEntry {
  id: string
  project: string
  task: string
  hours: number
  notes: string
}

interface DayLog {
  date: string          // YYYY-MM-DD
  entries: TimeEntry[]
  submitted: boolean
}

// ─── Constants ────────────────────────────────────────────────────────────────
const PROJECTS = ['AQUA Platform', 'Mobile App', 'Internal Tools', 'Client Portal', 'Code Review', 'Meetings', 'Documentation', 'Other']
const TASKS    = ['Development', 'Bug Fix', 'Code Review', 'Design', 'Testing', 'Planning', 'Documentation', 'Support']
const DAYS_LABEL = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MAX_DAILY  = 12

function fmt(d: Date) { return d.toISOString().slice(0, 10) }
function label(iso: string) {
  return new Date(iso + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}
function getWeekDates(anchor: Date) {
  const d = new Date(anchor)
  d.setDate(d.getDate() - d.getDay())          // Sunday
  return Array.from({ length: 7 }, (_, i) => {
    const x = new Date(d); x.setDate(d.getDate() + i); return fmt(x)
  })
}

// ─── Seed data ────────────────────────────────────────────────────────────────
function makeSeed(): Record<string, DayLog> {
  const today = new Date()
  const result: Record<string, DayLog> = {}
  // Past 2 weeks of realistic entries
  for (let w = -2; w <= 0; w++) {
    const anchor = new Date(today)
    anchor.setDate(today.getDate() + w * 7)
    const week = getWeekDates(anchor)
    week.forEach((date, idx) => {
      if (idx === 0 || idx === 6) return   // skip weekends for seed
      if (new Date(date) > today) return
      const isPast = new Date(date) < today
      if (isPast) {
        result[date] = {
          date,
          submitted: true,
          entries: [
            { id: `s-${date}-1`, project: 'AQUA Platform', task: 'Development', hours: 4, notes: 'Backend API work' },
            { id: `s-${date}-2`, project: 'Code Review',   task: 'Code Review', hours: 2, notes: '' },
            { id: `s-${date}-3`, project: 'Meetings',      task: 'Planning',    hours: 2, notes: 'Sprint planning' },
          ],
        }
      }
    })
  }
  return result
}

const SEED = makeSeed()

// ─── Entry Row component ──────────────────────────────────────────────────────
function EntryRow({
  entry,
  onChange,
  onDelete,
  locked,
}: {
  entry: TimeEntry
  onChange: (e: TimeEntry) => void
  onDelete: () => void
  locked: boolean
}) {
  return (
    <div className="grid grid-cols-12 gap-2 items-center py-2 border-b border-border/50 last:border-0">
      <div className="col-span-3">
        <select
          disabled={locked}
          value={entry.project}
          onChange={(e) => onChange({ ...entry, project: e.target.value })}
          className="w-full px-2.5 py-2 text-xs border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white disabled:bg-muted disabled:text-muted-foreground"
        >
          {PROJECTS.map((p) => <option key={p}>{p}</option>)}
        </select>
      </div>
      <div className="col-span-3">
        <select
          disabled={locked}
          value={entry.task}
          onChange={(e) => onChange({ ...entry, task: e.target.value })}
          className="w-full px-2.5 py-2 text-xs border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white disabled:bg-muted disabled:text-muted-foreground"
        >
          {TASKS.map((t) => <option key={t}>{t}</option>)}
        </select>
      </div>
      <div className="col-span-1">
        <input
          type="number"
          disabled={locked}
          min={0.5} max={MAX_DAILY} step={0.5}
          value={entry.hours}
          onChange={(e) => onChange({ ...entry, hours: parseFloat(e.target.value) || 0 })}
          className="w-full px-2.5 py-2 text-xs border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 text-center disabled:bg-muted disabled:text-muted-foreground"
        />
      </div>
      <div className="col-span-4">
        <input
          type="text"
          disabled={locked}
          placeholder="Notes..."
          value={entry.notes}
          onChange={(e) => onChange({ ...entry, notes: e.target.value })}
          className="w-full px-2.5 py-2 text-xs border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:bg-muted disabled:text-muted-foreground"
        />
      </div>
      <div className="col-span-1 flex justify-center">
        {!locked && (
          <button onClick={onDelete} className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-400 transition-colors">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Daily View ───────────────────────────────────────────────────────────────
function DailyView({
  logs,
  setLogs,
}: {
  logs: Record<string, DayLog>
  setLogs: React.Dispatch<React.SetStateAction<Record<string, DayLog>>>
}) {
  const today  = fmt(new Date())
  const [date, setDate] = useState(today)

  const log: DayLog = logs[date] ?? { date, entries: [], submitted: false }
  const totalHours = log.entries.reduce((s, e) => s + e.hours, 0)
  const locked = log.submitted

  const prev = () => { const d = new Date(date + 'T12:00:00'); d.setDate(d.getDate() - 1); setDate(fmt(d)) }
  const next = () => {
    const d = new Date(date + 'T12:00:00')
    d.setDate(d.getDate() + 1)
    if (fmt(d) <= today) setDate(fmt(d))
  }

  const addEntry = () => {
    setLogs((prev) => {
      const cur = prev[date] ?? { date, entries: [], submitted: false }
      return {
        ...prev,
        [date]: {
          ...cur,
          entries: [...cur.entries, { id: `e-${Date.now()}`, project: 'AQUA Platform', task: 'Development', hours: 1, notes: '' }],
        },
      }
    })
  }

  const updateEntry = (id: string, entry: TimeEntry) => {
    setLogs((prev) => ({
      ...prev,
      [date]: { ...(prev[date] ?? { date, entries: [], submitted: false }), entries: (prev[date]?.entries ?? []).map((e) => e.id === id ? entry : e) },
    }))
  }

  const deleteEntry = (id: string) => {
    setLogs((prev) => ({
      ...prev,
      [date]: { ...(prev[date]!), entries: prev[date]!.entries.filter((e) => e.id !== id) },
    }))
  }

  const save = () => {
    setLogs((prev) => ({ ...prev, [date]: { ...log, entries: log.entries } }))
  }

  const submit = () => {
    setLogs((prev) => ({ ...prev, [date]: { ...log, submitted: true } }))
  }

  const isWeekend = new Date(date + 'T12:00:00').getDay() === 0 || new Date(date + 'T12:00:00').getDay() === 6

  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
      {/* Date nav */}
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={prev} className="p-1.5 rounded-lg hover:bg-muted transition-colors"><ChevronLeft className="w-4 h-4" /></button>
          <div className="text-center">
            <p className="font-semibold text-foreground">{label(date)}</p>
            {date === today && <span className="text-[10px] text-primary font-semibold">Today</span>}
          </div>
          <button onClick={next} disabled={date >= today} className="p-1.5 rounded-lg hover:bg-muted transition-colors disabled:opacity-30"><ChevronRight className="w-4 h-4" /></button>
        </div>
        <div className="flex items-center gap-3">
          {locked
            ? <span className="badge-approved flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Submitted</span>
            : (
              <div className={`flex items-center gap-1.5 text-sm font-semibold ${totalHours > MAX_DAILY ? 'text-rose-500' : 'text-foreground'}`}>
                <Clock className="w-4 h-4" />
                {totalHours}h {totalHours > MAX_DAILY && <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />}
              </div>
            )
          }
        </div>
      </div>

      {isWeekend && !locked && (
        <div className="px-6 py-4 bg-muted/30 text-sm text-muted-foreground flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          This is a weekend. Logging hours is optional.
        </div>
      )}

      <div className="px-6 py-4">
        {/* Column headers */}
        <div className="grid grid-cols-12 gap-2 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          <div className="col-span-3">Project</div>
          <div className="col-span-3">Task</div>
          <div className="col-span-1 text-center">Hrs</div>
          <div className="col-span-4">Notes</div>
          <div className="col-span-1" />
        </div>

        {log.entries.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="w-8 h-8 mx-auto mb-2 opacity-20" />
            <p className="text-sm">No entries yet. Click below to add time.</p>
          </div>
        ) : (
          log.entries.map((e) => (
            <EntryRow
              key={e.id}
              entry={e}
              onChange={(updated) => updateEntry(e.id, updated)}
              onDelete={() => deleteEntry(e.id)}
              locked={locked}
            />
          ))
        )}

        {!locked && (
          <button
            onClick={addEntry}
            className="mt-3 flex items-center gap-1.5 text-sm text-primary font-medium hover:underline"
          >
            <Plus className="w-4 h-4" /> Add row
          </button>
        )}
      </div>

      {!locked && log.entries.length > 0 && (
        <div className="px-6 py-4 border-t border-border flex items-center justify-between bg-muted/20">
          <span className="text-sm text-muted-foreground">
            Total: <strong className="text-foreground">{totalHours}h</strong>
          </span>
          <div className="flex gap-2">
            <button onClick={save} className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted/50 transition-colors">
              <Save className="w-3.5 h-3.5" /> Save Draft
            </button>
            <button
              onClick={submit}
              disabled={totalHours === 0}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl aqua-gradient text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40"
            >
              <Send className="w-3.5 h-3.5" /> Submit
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Weekly View ──────────────────────────────────────────────────────────────
function WeeklyView({
  logs,
  setLogs,
}: {
  logs: Record<string, DayLog>
  setLogs: React.Dispatch<React.SetStateAction<Record<string, DayLog>>>
}) {
  const today  = new Date()
  const [anchor, setAnchor] = useState(today)
  const week   = useMemo(() => getWeekDates(anchor), [anchor])

  const prevWeek = () => { const d = new Date(anchor); d.setDate(d.getDate() - 7); setAnchor(d) }
  const nextWeek = () => {
    const d = new Date(anchor)
    d.setDate(d.getDate() + 7)
    if (d <= today) setAnchor(d)
  }

  const weekStart = week[0]
  const weekEnd   = week[6]
  const weekLabel = `${label(weekStart)} – ${label(weekEnd)}`
  const allSubmitted = week.filter((_, i) => i !== 0 && i !== 6).every((d) => logs[d]?.submitted)

  const getHours = (date: string, project: string) => {
    const log = logs[date]
    if (!log) return 0
    return log.entries.filter((e) => e.project === project).reduce((s, e) => s + e.hours, 0)
  }

  const setHours = (date: string, project: string, hours: number) => {
    const log: DayLog = logs[date] ?? { date, entries: [], submitted: false }
    if (log.submitted) return
    const existing = log.entries.find((e) => e.project === project)
    let entries
    if (hours === 0) {
      entries = log.entries.filter((e) => e.project !== project)
    } else if (existing) {
      entries = log.entries.map((e) => e.project === project ? { ...e, hours } : e)
    } else {
      entries = [...log.entries, { id: `w-${Date.now()}-${project}`, project, task: 'Development', hours, notes: '' }]
    }
    setLogs((prev) => ({ ...prev, [date]: { ...log, entries } }))
  }

  const submitWeek = () => {
    setLogs((prev) => {
      const updated = { ...prev }
      week.forEach((d, i) => {
        if (i === 0 || i === 6) return
        if (updated[d] && !updated[d].submitted) {
          updated[d] = { ...updated[d], submitted: true }
        }
      })
      return updated
    })
  }

  const weekTotal = week.reduce((s, d) => s + (logs[d]?.entries.reduce((x, e) => x + e.hours, 0) ?? 0), 0)
  const isFuture  = fmt(anchor) > fmt(today)

  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
      {/* Week nav */}
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={prevWeek} className="p-1.5 rounded-lg hover:bg-muted transition-colors"><ChevronLeft className="w-4 h-4" /></button>
          <p className="font-semibold text-foreground text-sm">{weekLabel}</p>
          <button onClick={nextWeek} disabled={isFuture} className="p-1.5 rounded-lg hover:bg-muted transition-colors disabled:opacity-30"><ChevronRight className="w-4 h-4" /></button>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-foreground flex items-center gap-1.5"><Clock className="w-4 h-4" /> {weekTotal}h total</span>
          {allSubmitted && <span className="badge-approved flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Week Submitted</span>}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground w-36">Project</th>
              {week.map((d, i) => {
                const isToday   = d === fmt(today)
                const isWeekend = i === 0 || i === 6
                const submitted = logs[d]?.submitted
                return (
                  <th key={d} className={`px-3 py-3 text-center text-xs font-semibold w-20 ${isWeekend ? 'text-muted-foreground/50' : isToday ? 'text-primary' : 'text-foreground'}`}>
                    <div>{DAYS_LABEL[i]}</div>
                    <div className={`text-[10px] font-normal ${isToday ? 'text-primary' : 'text-muted-foreground'}`}>
                      {new Date(d + 'T12:00:00').getDate()}
                    </div>
                    {submitted && <div className="mt-0.5 w-2 h-2 rounded-full bg-emerald-400 mx-auto" title="Submitted" />}
                  </th>
                )
              })}
              <th className="px-3 py-3 text-center text-xs font-semibold text-muted-foreground">Total</th>
            </tr>
          </thead>
          <tbody>
            {PROJECTS.map((proj) => {
              const projTotal = week.reduce((s, d) => s + getHours(d, proj), 0)
              return (
                <tr key={proj} className="border-b border-border/50 hover:bg-muted/20">
                  <td className="px-5 py-2.5 text-xs font-medium text-foreground">{proj}</td>
                  {week.map((d, i) => {
                    const isWeekend = i === 0 || i === 6
                    const locked    = logs[d]?.submitted || isWeekend || new Date(d) > today
                    const val       = getHours(d, proj)
                    return (
                      <td key={d} className="px-2 py-2 text-center">
                        <input
                          type="number"
                          min={0} max={MAX_DAILY} step={0.5}
                          disabled={locked}
                          value={val || ''}
                          placeholder="—"
                          onChange={(e) => setHours(d, proj, parseFloat(e.target.value) || 0)}
                          className={`w-14 px-1 py-1.5 text-center text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors ${
                            locked
                              ? 'border-transparent bg-transparent text-muted-foreground cursor-not-allowed'
                              : val > 0
                              ? 'border-primary/30 bg-primary/5 text-primary font-semibold'
                              : 'border-border bg-white text-muted-foreground'
                          }`}
                        />
                      </td>
                    )
                  })}
                  <td className="px-3 py-2 text-center text-xs font-semibold text-foreground">
                    {projTotal > 0 ? projTotal : '—'}
                  </td>
                </tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-border bg-muted/20">
              <td className="px-5 py-3 text-xs font-bold text-foreground">Daily Total</td>
              {week.map((d) => {
                const dayTotal = logs[d]?.entries.reduce((s, e) => s + e.hours, 0) ?? 0
                return (
                  <td key={d} className="px-2 py-3 text-center">
                    <span className={`text-xs font-bold ${dayTotal > 0 ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {dayTotal > 0 ? `${dayTotal}h` : '—'}
                    </span>
                  </td>
                )
              })}
              <td className="px-3 py-3 text-center text-xs font-bold text-primary">{weekTotal}h</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {!allSubmitted && weekTotal > 0 && (
        <div className="px-6 py-4 border-t border-border flex justify-end">
          <button
            onClick={submitWeek}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl aqua-gradient text-white text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <Send className="w-4 h-4" />
            Submit Week
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function TimesheetPage() {
  const [mode, setMode] = useState<'daily' | 'weekly'>('weekly')
  const [logs, setLogs] = useState<Record<string, DayLog>>(SEED)

  const totalThisWeek = useMemo(() => {
    const week = getWeekDates(new Date())
    return week.reduce((s, d) => s + (logs[d]?.entries.reduce((x, e) => x + e.hours, 0) ?? 0), 0)
  }, [logs])

  const submittedCount = Object.values(logs).filter((l) => l.submitted).length

  return (
    <div className="flex flex-col flex-1">
      <div className="px-8 py-6 border-b border-border bg-white flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground">My Timesheet</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Log and submit your daily work hours</p>
        </div>
        {/* Mode toggle */}
        <div className="flex items-center gap-1 bg-muted p-1 rounded-xl">
          {([['daily', 'Daily', List], ['weekly', 'Weekly', LayoutGrid]] as const).map(([m, label, Icon]) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                mode === m ? 'bg-white text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-6">

        {/* Quick stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'This Week',       value: `${totalThisWeek}h`,     sub: 'of ~40h target',  color: 'text-cyan-600',    bg: 'bg-cyan-50'    },
            { label: 'Days Submitted',  value: String(submittedCount),  sub: 'of working days', color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Avg Daily Hours', value: submittedCount ? `${(Object.values(logs).filter(l=>l.submitted).reduce((s,l)=>s+l.entries.reduce((x,e)=>x+e.hours,0),0)/submittedCount).toFixed(1)}h` : '—', sub: 'across logged days', color: 'text-primary',     bg: 'bg-primary/10' },
            { label: 'Top Project',     value: 'AQUA Platform',         sub: 'most logged',     color: 'text-amber-600',   bg: 'bg-amber-50'   },
          ].map((c) => (
            <div key={c.label} className="stat-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{c.label}</p>
                  <p className="text-xl font-bold text-foreground mt-0.5">{c.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{c.sub}</p>
                </div>
                <div className={`w-9 h-9 rounded-xl ${c.bg} flex items-center justify-center`}>
                  <Clock className={`w-4 h-4 ${c.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {mode === 'daily' ? (
          <DailyView logs={logs} setLogs={setLogs} />
        ) : (
          <WeeklyView logs={logs} setLogs={setLogs} />
        )}
      </div>
    </div>
  )
}
