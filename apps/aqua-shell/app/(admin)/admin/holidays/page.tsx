'use client'

import { useState, useMemo } from 'react'
import {
  CalendarDays, Globe, Plus, Search, ChevronLeft, ChevronRight,
  Pencil, Trash2, CheckCircle2, BarChart2, ToggleLeft, ToggleRight,
} from 'lucide-react'
import {
  HOLIDAYS_2026, CATEGORY_BADGE, CATEGORY_LABEL, REGION_FLAG,
  getDaysUntil, type Holiday, type HolidayRegion, type HolidayCategory,
} from '@/lib/holidays-data'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts'

const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const DAYS         = ['Su','Mo','Tu','We','Th','Fr','Sa']

// ─── Calendar ─────────────────────────────────────────────────────────────────
function AdminCalendar({ holidays }: { holidays: Holiday[] }) {
  const today = new Date()
  const [year, setYear]   = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())

  const totalDays = new Date(year, month + 1, 0).getDate()
  const startPad  = new Date(year, month, 1).getDay()

  const prevMonth = () => { if (month === 0) { setYear(y => y - 1); setMonth(11) } else setMonth(m => m - 1) }
  const nextMonth = () => { if (month === 11) { setYear(y => y + 1); setMonth(0) } else setMonth(m => m + 1) }

  const dayMap = new Map<number, Holiday[]>()
  holidays.forEach((h) => {
    const d = new Date(h.date + 'T12:00:00')
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate()
      if (!dayMap.has(day)) dayMap.set(day, [])
      dayMap.get(day)!.push(h)
    }
  })

  return (
    <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-muted"><ChevronLeft className="w-4 h-4" /></button>
        <h3 className="font-bold text-sm text-foreground">{MONTHS_SHORT[month]} {year}</h3>
        <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-muted"><ChevronRight className="w-4 h-4" /></button>
      </div>
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map((d) => <div key={d} className="text-center text-[10px] font-semibold text-muted-foreground py-1">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {Array.from({ length: startPad }).map((_, i) => <div key={`p${i}`} />)}
        {Array.from({ length: totalDays }).map((_, i) => {
          const day = i + 1
          const hs  = dayMap.get(day) ?? []
          const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
          const isWeekend = new Date(year, month, day).getDay() === 0 || new Date(year, month, day).getDay() === 6
          const h0  = hs[0]
          return (
            <div
              key={day}
              title={hs.map(h => `${h.name} (${h.region})`).join('\n') || undefined}
              className={`aspect-square flex flex-col items-center justify-start pt-0.5 rounded-lg text-[11px] font-medium transition-all cursor-default ${
                hs.length > 0
                  ? h0.category === 'national' ? 'bg-cyan-100 text-cyan-800 font-bold'
                  : h0.category === 'company'  ? 'bg-emerald-100 text-emerald-800 font-bold'
                  : 'bg-purple-100 text-purple-800 font-bold'
                  : isToday ? 'bg-primary text-white font-bold'
                  : isWeekend ? 'text-muted-foreground/40' : 'text-foreground hover:bg-muted/30'
              }`}
            >
              {day}
              {hs.length > 0 && <div className={`w-1 h-1 rounded-full mt-0.5 ${h0.category === 'national' ? 'bg-cyan-500' : h0.category === 'company' ? 'bg-emerald-500' : 'bg-purple-500'}`} />}
            </div>
          )
        })}
      </div>
      <div className="flex gap-3 mt-3 justify-center border-t border-border pt-3">
        {[{ c: 'bg-cyan-400', l: 'National' }, { c: 'bg-emerald-400', l: 'Company' }, { c: 'bg-purple-400', l: 'Regional' }].map(x => (
          <div key={x.l} className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${x.c}`} />
            <span className="text-[10px] text-muted-foreground">{x.l}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function AdminHolidaysPage() {
  const [search, setSearch]         = useState('')
  const [regionFilter, setRegionFilter] = useState<'all' | HolidayRegion>('all')
  const [catFilter, setCatFilter]   = useState<'all' | HolidayCategory>('all')
  const [yearFilter, setYearFilter] = useState('2026')
  // Track which holidays are "enabled" for tenants (all on by default)
  const [disabled, setDisabled]     = useState<Set<string>>(new Set())

  const toggleEnabled = (id: string) =>
    setDisabled((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })

  const allHolidays = HOLIDAYS_2026

  // Stats
  const byRegion = (['US', 'Europe', 'Asia Pacific', 'All'] as HolidayRegion[]).map((r) => ({
    name: r === 'All' ? 'Global' : r,
    count: allHolidays.filter((h) => h.region === r).length,
  }))

  const byMonth = MONTHS_SHORT.map((m, idx) => ({
    month: m,
    count: allHolidays.filter((h) => new Date(h.date + 'T12:00:00').getMonth() === idx).length,
  })).filter((x) => x.count > 0)

  const displayed = useMemo(() => {
    let data = allHolidays
    if (regionFilter !== 'all') data = data.filter((h) => h.region === regionFilter || h.region === 'All')
    if (catFilter !== 'all')    data = data.filter((h) => h.category === catFilter)
    if (search) data = data.filter((h) => h.name.toLowerCase().includes(search.toLowerCase()))
    return data.sort((a, b) => a.date.localeCompare(b.date))
  }, [regionFilter, catFilter, search])

  const enabledCount  = allHolidays.length - disabled.size
  const paidCount     = allHolidays.filter((h) => h.paid).length
  const optionalCount = allHolidays.filter((h) => h.optional).length

  const BAR_COLORS = ['#00bcd4', '#0e7490', '#0891b2', '#0369a1']

  // Grouped by month for the list
  const grouped = useMemo(() => {
    const map = new Map<string, Holiday[]>()
    displayed.forEach((h) => {
      const key = h.date.slice(0, 7)
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(h)
    })
    return map
  }, [displayed])

  return (
    <div className="flex flex-col flex-1">
      <div className="px-8 py-6 border-b border-border bg-white flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Holidays</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Configure platform-wide holiday calendar across all tenant regions</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl aqua-gradient text-white text-sm font-semibold hover:opacity-90 shadow-sm">
          <Plus className="w-4 h-4" /> Add Global Holiday
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-6">

        {/* KPI cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Holidays',   value: String(allHolidays.length), sub: 'across all regions', icon: CalendarDays, color: 'text-cyan-600',    bg: 'bg-cyan-50'    },
            { label: 'Enabled for Tenants', value: String(enabledCount),   sub: 'visible to all tenants',  icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Paid Holidays',    value: String(paidCount),          sub: 'paid days off',      icon: Globe,        color: 'text-primary',     bg: 'bg-primary/10' },
            { label: 'Optional Days',    value: String(optionalCount),      sub: 'floating observances',icon: CalendarDays, color: 'text-purple-600',  bg: 'bg-purple-50'  },
          ].map((c) => (
            <div key={c.label} className="stat-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{c.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-0.5">{c.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{c.sub}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center`}>
                  <c.icon className={`w-5 h-5 ${c.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <AdminCalendar holidays={allHolidays} />

          {/* Holidays by region bar */}
          <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-primary" /> By Region
            </h3>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={byRegion} barSize={32} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={80} />
                <Tooltip formatter={(v: number) => [v, 'Holidays']} />
                <Bar dataKey="count" radius={[0,6,6,0]}>
                  {byRegion.map((_, i) => <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Holidays by month bar */}
          <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-primary" /> By Month
            </h3>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={byMonth} barSize={20}>
                <XAxis dataKey="month" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip formatter={(v: number) => [v, 'Holidays']} />
                <Bar dataKey="count" fill="#00bcd4" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          {/* Toolbar */}
          <div className="px-6 py-4 border-b border-border flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="Search holidays..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="text-sm border border-border rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value as any)}
            >
              <option value="all">All Regions</option>
              <option value="US">🇺🇸 US</option>
              <option value="Europe">🇪🇺 Europe</option>
              <option value="Asia Pacific">🌏 Asia Pacific</option>
              <option value="All">🌐 Global</option>
            </select>
            <select
              className="text-sm border border-border rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
              value={catFilter}
              onChange={(e) => setCatFilter(e.target.value as any)}
            >
              <option value="all">All Types</option>
              <option value="national">National</option>
              <option value="company">Company</option>
              <option value="regional">Regional</option>
              <option value="religious">Religious</option>
            </select>
            <span className="text-xs text-muted-foreground ml-auto">{displayed.length} entries</span>
          </div>

          {/* Grouped rows */}
          {Array.from(grouped.entries()).map(([monthKey, holidays]) => {
            const [y, m] = monthKey.split('-').map(Number)
            const monthLabel = new Date(y, m - 1, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
            return (
              <div key={monthKey}>
                <div className="px-6 py-2.5 bg-muted/20 border-b border-border flex items-center justify-between">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{monthLabel}</span>
                  <span className="text-xs text-muted-foreground">{holidays.length} holiday{holidays.length !== 1 ? 's' : ''}</span>
                </div>
                {holidays.map((h) => {
                  const isDisabled = disabled.has(h.id)
                  const past = new Date(h.date) < new Date(new Date().toDateString())
                  return (
                    <div key={h.id} className={`px-6 py-3.5 border-b border-border flex items-center gap-4 hover:bg-muted/10 transition-colors ${isDisabled ? 'opacity-50' : ''}`}>
                      {/* Date */}
                      <div className="w-12 text-center flex-shrink-0">
                        <p className="text-[10px] font-semibold text-muted-foreground uppercase">{MONTHS_SHORT[new Date(h.date + 'T12:00:00').getMonth()]}</p>
                        <p className="text-xl font-black text-foreground leading-tight">{new Date(h.date + 'T12:00:00').getDate()}</p>
                        <p className="text-[9px] text-muted-foreground">{new Date(h.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short' })}</p>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <p className={`text-sm font-semibold ${isDisabled ? 'line-through text-muted-foreground' : 'text-foreground'}`}>{h.name}</p>
                          {h.optional && <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 font-semibold">Floating</span>}
                        </div>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${CATEGORY_BADGE[h.category]}`}>{CATEGORY_LABEL[h.category]}</span>
                          <span className="text-[10px] text-muted-foreground">{REGION_FLAG[h.region]} {h.region}</span>
                          {h.paid && <span className="text-[10px] text-emerald-600 font-semibold">✓ Paid</span>}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{h.description}</p>
                      </div>

                      {/* Days until */}
                      {!past && (
                        <span className="text-xs text-muted-foreground flex-shrink-0 w-20 text-right">{getDaysUntil(h.date)}</span>
                      )}

                      {/* Toggle + Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => toggleEnabled(h.id)}
                          title={isDisabled ? 'Enable for tenants' : 'Disable for tenants'}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                            isDisabled
                              ? 'border-border text-muted-foreground hover:border-emerald-300 hover:text-emerald-600'
                              : 'border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                          }`}
                        >
                          {isDisabled
                            ? <><ToggleLeft className="w-3.5 h-3.5" /> Disabled</>
                            : <><ToggleRight className="w-3.5 h-3.5" /> Enabled</>
                          }
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors" title="Edit">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          })}

          {grouped.size === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <CalendarDays className="w-10 h-10 mx-auto mb-2 opacity-20" />
              <p className="text-sm">No holidays match your filter</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
