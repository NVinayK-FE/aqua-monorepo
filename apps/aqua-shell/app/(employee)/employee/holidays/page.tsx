'use client'

import { useState, useMemo } from 'react'
import {
  CalendarDays, ChevronLeft, ChevronRight, PartyPopper,
  Globe, Clock, Gift, Sparkles,
} from 'lucide-react'
import {
  HOLIDAYS_2026, CATEGORY_BADGE, CATEGORY_LABEL,
  REGION_FLAG, getDaysUntil, fmtHolidayDate, getUpcoming,
  type HolidayCategory, type Holiday,
} from '@/lib/holidays-data'

// Tom's region is US (Engineering, Acme US office)
const MY_REGION = 'US' as const

// Deduplicate — keep first occurrence for a given date+name when both All and US exist
function dedup(list: Holiday[]) {
  const seen = new Set<string>()
  return list.filter((h) => {
    const key = `${h.date}|${h.name}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

const MY_HOLIDAYS = dedup(
  HOLIDAYS_2026
    .filter((h) => h.region === 'All' || h.region === MY_REGION)
    .sort((a, b) => a.date.localeCompare(b.date))
)

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const DAYS   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

// ─── Calendar ─────────────────────────────────────────────────────────────────
function HolidayCalendar({ holidays }: { holidays: Holiday[] }) {
  const today      = new Date()
  const [year, setYear]   = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())

  const monthStart = new Date(year, month, 1)
  const totalDays  = new Date(year, month + 1, 0).getDate()
  const startPad   = monthStart.getDay()

  const prevMonth = () => { if (month === 0) { setYear(y => y - 1); setMonth(11) } else setMonth(m => m - 1) }
  const nextMonth = () => { if (month === 11) { setYear(y => y + 1); setMonth(0) } else setMonth(m => m + 1) }

  // Map date → holidays for this month
  const dayMap = new Map<number, Holiday[]>()
  holidays.forEach((h) => {
    const d = new Date(h.date + 'T12:00:00')
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate()
      if (!dayMap.has(day)) dayMap.set(day, [])
      dayMap.get(day)!.push(h)
    }
  })

  const [hoveredDay, setHoveredDay] = useState<number | null>(null)

  return (
    <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
      {/* Nav */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <h3 className="font-bold text-foreground">{MONTHS[month]} {year}</h3>
        <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-[10px] font-semibold text-muted-foreground py-1">{d}</div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-0.5">
        {Array.from({ length: startPad }).map((_, i) => <div key={`p${i}`} />)}
        {Array.from({ length: totalDays }).map((_, i) => {
          const day      = i + 1
          const hs       = dayMap.get(day) ?? []
          const isToday  = day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
          const isWeekend= new Date(year, month, day).getDay() === 0 || new Date(year, month, day).getDay() === 6
          const hasHoliday = hs.length > 0
          const h0       = hs[0]

          return (
            <div
              key={day}
              className="relative aspect-square"
              onMouseEnter={() => hasHoliday ? setHoveredDay(day) : undefined}
              onMouseLeave={() => setHoveredDay(null)}
            >
              <div className={`w-full h-full flex flex-col items-center justify-start pt-1 rounded-xl text-xs font-medium transition-colors cursor-default ${
                hasHoliday
                  ? h0.category === 'company'
                    ? 'bg-emerald-100 text-emerald-800 font-bold'
                    : 'bg-cyan-100 text-cyan-800 font-bold'
                  : isToday
                  ? 'bg-primary text-white font-bold'
                  : isWeekend
                  ? 'text-muted-foreground/60'
                  : 'text-foreground hover:bg-muted/40'
              }`}>
                {day}
                {hasHoliday && (
                  <div className={`w-1.5 h-1.5 rounded-full mt-0.5 ${
                    h0.category === 'company' ? 'bg-emerald-500' : 'bg-cyan-500'
                  }`} />
                )}
              </div>

              {/* Tooltip */}
              {hoveredDay === day && hasHoliday && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-20 bg-gray-900 text-white text-[11px] rounded-lg px-3 py-2 shadow-xl whitespace-nowrap pointer-events-none max-w-[180px] text-center">
                  {hs.map((h) => h.name).join(' · ')}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 justify-center border-t border-border pt-3">
        {[
          { color: 'bg-cyan-400',    label: 'National'  },
          { color: 'bg-emerald-400', label: 'Company'   },
          { color: 'bg-primary',     label: 'Today'     },
        ].map((l) => (
          <div key={l.label} className="flex items-center gap-1.5">
            <div className={`w-2.5 h-2.5 rounded-full ${l.color}`} />
            <span className="text-[10px] text-muted-foreground">{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Upcoming card ────────────────────────────────────────────────────────────
function UpcomingCard({ holiday }: { holiday: Holiday }) {
  const daysUntil = getDaysUntil(holiday.date)
  const isToday   = daysUntil === 'Today'
  const isTomorrow= daysUntil === 'Tomorrow'
  const isSoon    = !isToday && !isTomorrow && daysUntil.startsWith('In') && parseInt(daysUntil.split(' ')[1]) <= 14

  return (
    <div className={`flex items-start gap-3 p-3 rounded-xl border transition-colors ${
      isToday ? 'border-primary/30 bg-primary/5' : isSoon ? 'border-amber-200 bg-amber-50/50' : 'border-border hover:bg-muted/20'
    }`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${
        holiday.category === 'company' ? 'bg-emerald-100' : 'bg-cyan-100'
      }`}>
        {isToday ? '🎉' : holiday.category === 'company' ? '🏢' : '🌍'}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground truncate">{holiday.name}</p>
        <p className="text-xs text-muted-foreground">
          {new Date(holiday.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
        </p>
      </div>
      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${
        isToday ? 'bg-primary text-white' :
        isTomorrow ? 'bg-amber-100 text-amber-700' :
        isSoon ? 'bg-amber-50 text-amber-600' :
        'bg-muted text-muted-foreground'
      }`}>
        {daysUntil}
      </span>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function EmployeeHolidaysPage() {
  const [categoryFilter, setCategoryFilter] = useState<'all' | HolidayCategory>('all')
  const [search, setSearch] = useState('')

  const upcoming = useMemo(() => getUpcoming('US', 6), [])

  const totalHolidays   = MY_HOLIDAYS.length
  const paidDays        = MY_HOLIDAYS.filter((h) => h.paid && !h.optional).length
  const companyHolidays = MY_HOLIDAYS.filter((h) => h.category === 'company').length
  const optionalDays    = MY_HOLIDAYS.filter((h) => h.optional).length

  const filtered = useMemo(() => {
    let data = MY_HOLIDAYS
    if (categoryFilter !== 'all') data = data.filter((h) => h.category === categoryFilter)
    if (search) data = data.filter((h) => h.name.toLowerCase().includes(search.toLowerCase()))
    return data
  }, [categoryFilter, search])

  // Group by month
  const grouped = useMemo(() => {
    const map = new Map<string, Holiday[]>()
    filtered.forEach((h) => {
      const key = h.date.slice(0, 7) // YYYY-MM
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(h)
    })
    return map
  }, [filtered])

  return (
    <div className="flex flex-col flex-1">
      <div className="px-8 py-6 border-b border-border bg-white">
        <h1 className="text-xl font-bold text-foreground">Holidays</h1>
        <p className="text-sm text-muted-foreground mt-0.5">2026 company and public holidays for your region</p>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-6">

        {/* KPI cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Holidays',    value: String(totalHolidays),   sub: 'this year',         icon: CalendarDays, color: 'text-cyan-600',    bg: 'bg-cyan-50'    },
            { label: 'Paid Days Off',     value: String(paidDays),        sub: 'guaranteed paid',   icon: Gift,         color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Company Holidays',  value: String(companyHolidays), sub: 'Acme extras',       icon: Sparkles,     color: 'text-primary',     bg: 'bg-primary/10' },
            { label: 'Floating Holidays', value: String(optionalDays),    sub: 'use as you choose', icon: PartyPopper,  color: 'text-purple-600',  bg: 'bg-purple-50'  },
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

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Upcoming panel */}
          <div className="space-y-4">
            {/* Calendar */}
            <HolidayCalendar holidays={MY_HOLIDAYS} />

            {/* Upcoming list */}
            <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" /> Upcoming Holidays
              </h3>
              <div className="space-y-2">
                {upcoming.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No upcoming holidays</p>
                ) : (
                  upcoming.map((h) => <UpcomingCard key={h.id} holiday={h} />)
                )}
              </div>
            </div>
          </div>

          {/* Full list */}
          <div className="lg:col-span-2 space-y-4">
            {/* Toolbar */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative flex-1 min-w-[180px]">
                <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white"
                  placeholder="Search holidays..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-1 bg-muted p-1 rounded-xl">
                {(['all', 'national', 'company'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setCategoryFilter(f)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                      categoryFilter === f ? 'bg-white text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {f === 'all' ? 'All' : CATEGORY_LABEL[f]}
                  </button>
                ))}
              </div>
            </div>

            {/* Month-grouped list */}
            <div className="space-y-4">
              {Array.from(grouped.entries()).map(([monthKey, holidays]) => {
                const [y, m] = monthKey.split('-').map(Number)
                const monthLabel = new Date(y, m - 1, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                return (
                  <div key={monthKey} className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
                    <div className="px-5 py-3 border-b border-border bg-muted/30 flex items-center justify-between">
                      <h4 className="font-semibold text-foreground text-sm">{monthLabel}</h4>
                      <span className="text-xs text-muted-foreground">{holidays.length} holiday{holidays.length !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="divide-y divide-border">
                      {holidays.map((h) => {
                        const daysUntil = getDaysUntil(h.date)
                        const past      = new Date(h.date) < new Date(new Date().toDateString())
                        return (
                          <div key={h.id} className={`px-5 py-4 flex items-start gap-4 ${past ? 'opacity-50' : 'hover:bg-muted/20'} transition-colors`}>
                            {/* Date box */}
                            <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex flex-col items-center justify-center border ${
                              h.category === 'national'
                                ? 'border-cyan-200 bg-cyan-50'
                                : h.category === 'company'
                                ? 'border-emerald-200 bg-emerald-50'
                                : 'border-purple-200 bg-purple-50'
                            }`}>
                              <span className="text-[10px] font-bold uppercase text-muted-foreground leading-none">
                                {MONTHS[new Date(h.date + 'T12:00:00').getMonth()]}
                              </span>
                              <span className="text-lg font-black leading-tight text-foreground">
                                {new Date(h.date + 'T12:00:00').getDate()}
                              </span>
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                                <p className="text-sm font-semibold text-foreground">{h.name}</p>
                                {h.optional && (
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-semibold">Optional</span>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground">{h.description}</p>
                              <div className="flex items-center gap-3 mt-1.5">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${CATEGORY_BADGE[h.category]}`}>
                                  {CATEGORY_LABEL[h.category]}
                                </span>
                                <span className="text-[10px] text-muted-foreground">
                                  {REGION_FLAG[h.region]} {h.region}
                                </span>
                                {h.paid && <span className="text-[10px] text-emerald-600 font-semibold">✓ Paid</span>}
                              </div>
                            </div>

                            {!past && (
                              <div className="text-right flex-shrink-0">
                                <p className="text-xs font-semibold text-foreground">{daysUntil}</p>
                                <p className="text-[10px] text-muted-foreground mt-0.5">
                                  {new Date(h.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short' })}
                                </p>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
              {grouped.size === 0 && (
                <div className="text-center py-12 text-muted-foreground bg-white rounded-2xl border border-border">
                  <CalendarDays className="w-10 h-10 mx-auto mb-2 opacity-20" />
                  <p className="text-sm">No holidays match your filter</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
