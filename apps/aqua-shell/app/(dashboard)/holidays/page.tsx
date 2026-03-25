'use client'

import { useState, useMemo } from 'react'
import {
  CalendarDays, Plus, X, Search, ChevronLeft, ChevronRight,
  Globe, Edit2, Trash2, CheckCircle2, AlertTriangle, Save, Gift,
} from 'lucide-react'
import {
  HOLIDAYS_2026, CATEGORY_BADGE, CATEGORY_LABEL, REGION_FLAG,
  getDaysUntil, fmtHolidayDate,
  type Holiday, type HolidayCategory, type HolidayRegion,
} from '@/lib/holidays-data'

const MONTHS     = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const FULL_MONTHS= ['January','February','March','April','May','June','July','August','September','October','November','December']
const DAYS       = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

// ─── Add/Edit Holiday Drawer ──────────────────────────────────────────────────
function HolidayDrawer({
  holiday,
  onClose,
  onSave,
}: {
  holiday?: Holiday
  onClose: () => void
  onSave: (h: Omit<Holiday, 'id'> & { id?: string }) => void
}) {
  const [name, setName]       = useState(holiday?.name        ?? '')
  const [date, setDate]       = useState(holiday?.date        ?? '')
  const [desc, setDesc]       = useState(holiday?.description ?? '')
  const [cat, setCat]         = useState<HolidayCategory>(holiday?.category ?? 'company')
  const [region, setRegion]   = useState<HolidayRegion>(holiday?.region  ?? 'All')
  const [paid, setPaid]       = useState(holiday?.paid        ?? true)
  const [optional, setOptional] = useState(holiday?.optional  ?? false)
  const [error, setError]     = useState('')

  const submit = () => {
    if (!name.trim()) { setError('Holiday name is required.'); return }
    if (!date)        { setError('Date is required.'); return }
    setError('')
    onSave({ id: holiday?.id, name: name.trim(), date, description: desc.trim(), category: cat, region, paid, optional, color: cat === 'national' ? 'bg-cyan-500' : cat === 'company' ? 'bg-emerald-500' : 'bg-purple-500' })
    onClose()
  }

  const isEdit = !!holiday

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="w-[460px] bg-white shadow-2xl flex flex-col animate-slide-in-right">
        <div className="px-6 py-5 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="font-bold text-foreground text-lg">{isEdit ? 'Edit Holiday' : 'Add Holiday'}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">{isEdit ? 'Update this entry' : 'Add a company or national holiday'}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Holiday Name *</label>
            <input
              value={name}
              onChange={(e) => { setName(e.target.value); setError('') }}
              placeholder="e.g. Company Anniversary"
              className="w-full px-4 py-2.5 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Date *</label>
            <input
              type="date"
              value={date}
              onChange={(e) => { setDate(e.target.value); setError('') }}
              className="w-full px-4 py-2.5 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Description</label>
            <textarea
              rows={3}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Brief description of the holiday..."
              className="w-full px-4 py-2.5 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Category</label>
              <select
                value={cat}
                onChange={(e) => setCat(e.target.value as HolidayCategory)}
                className="w-full px-3 py-2.5 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white"
              >
                <option value="national">National</option>
                <option value="company">Company</option>
                <option value="regional">Regional</option>
                <option value="religious">Religious</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Region</label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value as HolidayRegion)}
                className="w-full px-3 py-2.5 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white"
              >
                <option value="All">🌐 All regions</option>
                <option value="US">🇺🇸 US</option>
                <option value="Europe">🇪🇺 Europe</option>
                <option value="Asia Pacific">🌏 Asia Pacific</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {[
              { label: 'Paid holiday', sub: 'Employees receive full pay',      val: paid,     set: setPaid     },
              { label: 'Optional / Floating', sub: 'Employee chooses when to use it', val: optional, set: setOptional },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between px-4 py-3 rounded-xl bg-muted/30 border border-border/50">
                <div>
                  <p className="text-sm font-medium text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.sub}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={item.val} onChange={(e) => item.set(e.target.checked)} className="sr-only peer" />
                  <div className="w-10 h-6 bg-muted peer-checked:bg-primary rounded-full transition-colors after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
                </label>
              </div>
            ))}
          </div>

          {error && (
            <p className="text-xs text-rose-500 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" /> {error}
            </p>
          )}
        </div>

        <div className="px-6 py-4 border-t border-border flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted/50 transition-colors">
            Cancel
          </button>
          <button onClick={submit} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl aqua-gradient text-white text-sm font-semibold hover:opacity-90 transition-opacity">
            <Save className="w-4 h-4" />
            {isEdit ? 'Save Changes' : 'Add Holiday'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Calendar widget ──────────────────────────────────────────────────────────
function MonthCalendar({ holidays }: { holidays: Holiday[] }) {
  const today      = new Date()
  const [year, setYear]   = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())

  const totalDays  = new Date(year, month + 1, 0).getDate()
  const startPad   = new Date(year, month, 1).getDay()

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
        <h3 className="font-bold text-sm text-foreground">{FULL_MONTHS[month]} {year}</h3>
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
          return (
            <div
              key={day}
              title={hs.map(h => h.name).join(' · ') || undefined}
              className={`aspect-square flex flex-col items-center justify-start pt-0.5 rounded-lg text-xs font-medium transition-colors ${
                hs.length > 0
                  ? hs[0].category === 'company' ? 'bg-emerald-100 text-emerald-800 font-bold' : 'bg-cyan-100 text-cyan-800 font-bold'
                  : isToday ? 'bg-primary text-white font-bold'
                  : isWeekend ? 'text-muted-foreground/50' : 'text-foreground hover:bg-muted/40'
              }`}
            >
              {day}
              {hs.length > 0 && <div className={`w-1 h-1 rounded-full mt-0.5 ${hs[0].category === 'company' ? 'bg-emerald-500' : 'bg-cyan-500'}`} />}
            </div>
          )
        })}
      </div>
      <div className="flex gap-3 mt-3 justify-center border-t border-border pt-3">
        {[{ c: 'bg-cyan-400', l: 'National' }, { c: 'bg-emerald-400', l: 'Company' }, { c: 'bg-primary', l: 'Today' }].map(x => (
          <div key={x.l} className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${x.c}`} />
            <span className="text-[10px] text-muted-foreground">{x.l}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function HolidaysPage() {
  const [customHolidays, setCustomHolidays] = useState<Holiday[]>([])
  const [search, setSearch]   = useState('')
  const [regionFilter, setRegionFilter] = useState<'all' | HolidayRegion>('all')
  const [catFilter, setCatFilter]       = useState<'all' | HolidayCategory>('all')
  const [drawerOpen, setDrawerOpen]     = useState(false)
  const [editTarget, setEditTarget]     = useState<Holiday | undefined>(undefined)
  const [deleteId, setDeleteId]         = useState<string | null>(null)
  const [savedMsg, setSavedMsg]         = useState(false)

  const allHolidays = useMemo(() => {
    const deduped = new Map<string, Holiday>()
    ;[...HOLIDAYS_2026, ...customHolidays].forEach((h) => {
      deduped.set(h.id, h)
    })
    return Array.from(deduped.values()).sort((a, b) => a.date.localeCompare(b.date))
  }, [customHolidays])

  const displayed = useMemo(() => {
    let data = allHolidays
    if (regionFilter !== 'all') data = data.filter((h) => h.region === 'All' || h.region === regionFilter)
    if (catFilter !== 'all')    data = data.filter((h) => h.category === catFilter)
    if (search) data = data.filter((h) => h.name.toLowerCase().includes(search.toLowerCase()) || h.description.toLowerCase().includes(search.toLowerCase()))
    return data
  }, [allHolidays, regionFilter, catFilter, search])

  const handleSave = (h: Omit<Holiday, 'id'> & { id?: string }) => {
    if (h.id) {
      setCustomHolidays((prev) => prev.map((c) => c.id === h.id ? { ...h, id: h.id! } : c))
      // also check in HOLIDAYS_2026 — for base data we just track override in custom list
    } else {
      setCustomHolidays((prev) => [...prev, { ...h, id: `c-${Date.now()}` }])
    }
    setSavedMsg(true)
    setTimeout(() => setSavedMsg(false), 2000)
  }

  const handleDelete = (id: string) => {
    setCustomHolidays((prev) => prev.filter((c) => c.id !== id))
    setDeleteId(null)
  }

  const openEdit = (h: Holiday) => { setEditTarget(h); setDrawerOpen(true) }
  const openAdd  = () => { setEditTarget(undefined); setDrawerOpen(true) }

  // Stats
  const totalHolidays  = allHolidays.length
  const companyCount   = allHolidays.filter((h) => h.category === 'company').length
  const nationalCount  = allHolidays.filter((h) => h.category === 'national').length
  const upcomingCount  = allHolidays.filter((h) => h.date >= new Date().toISOString().slice(0,10)).length

  // Group by month
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
          <p className="text-sm text-muted-foreground mt-0.5">Manage company and national holidays for your team</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl aqua-gradient text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Holiday
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-6">

        {savedMsg && (
          <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 px-4 py-3 rounded-xl">
            <CheckCircle2 className="w-4 h-4" /> Holiday saved successfully
          </div>
        )}

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Holidays',    value: String(totalHolidays), sub: 'full year', icon: CalendarDays, color: 'text-cyan-600',    bg: 'bg-cyan-50'    },
            { label: 'Upcoming',          value: String(upcomingCount), sub: 'remaining', icon: Gift,         color: 'text-primary',     bg: 'bg-primary/10' },
            { label: 'National',          value: String(nationalCount), sub: 'public',    icon: Globe,        color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Company Added',     value: String(companyCount),  sub: 'by Acme',   icon: Plus,         color: 'text-amber-600',   bg: 'bg-amber-50'   },
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Calendar */}
          <div className="space-y-4">
            <MonthCalendar holidays={allHolidays} />

            {/* Region breakdown */}
            <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-foreground mb-3">By Region</h3>
              <div className="space-y-2">
                {(['US', 'Europe', 'Asia Pacific', 'All'] as HolidayRegion[]).map((r) => {
                  const count = allHolidays.filter((h) => h.region === r).length
                  return (
                    <div key={r} className="flex items-center justify-between py-1">
                      <span className="text-sm text-muted-foreground">{REGION_FLAG[r]} {r}</span>
                      <span className="text-sm font-semibold text-foreground">{count}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* List */}
          <div className="lg:col-span-2 space-y-4">
            {/* Filters */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative flex-1 min-w-[160px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="Search..."
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

            {/* Month-grouped table */}
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
                        const past      = new Date(h.date) < new Date(new Date().toDateString())
                        const isCustom  = h.id.startsWith('c-')
                        return (
                          <div key={h.id} className={`px-5 py-3.5 flex items-center gap-4 hover:bg-muted/20 transition-colors ${past ? 'opacity-50' : ''}`}>
                            {/* Date */}
                            <div className="w-10 text-center flex-shrink-0">
                              <p className="text-[10px] font-semibold text-muted-foreground uppercase">{MONTHS[new Date(h.date + 'T12:00:00').getMonth()]}</p>
                              <p className="text-xl font-black text-foreground leading-tight">{new Date(h.date + 'T12:00:00').getDate()}</p>
                              <p className="text-[9px] text-muted-foreground">{new Date(h.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short' })}</p>
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="text-sm font-semibold text-foreground">{h.name}</p>
                                {h.optional && <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 font-semibold">Floating</span>}
                                {isCustom  && <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 font-semibold">Custom</span>}
                              </div>
                              <div className="flex items-center gap-3 mt-0.5">
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${CATEGORY_BADGE[h.category]}`}>{CATEGORY_LABEL[h.category]}</span>
                                <span className="text-[10px] text-muted-foreground">{REGION_FLAG[h.region]} {h.region}</span>
                                {h.paid && <span className="text-[10px] text-emerald-600 font-semibold">✓ Paid</span>}
                              </div>
                            </div>

                            {/* Days until */}
                            {!past && (
                              <span className="text-xs text-muted-foreground flex-shrink-0">{getDaysUntil(h.date)}</span>
                            )}

                            {/* Actions */}
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <button
                                onClick={() => openEdit(h)}
                                className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                                title="Edit"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              {isCustom && (
                                deleteId === h.id ? (
                                  <div className="flex items-center gap-1">
                                    <button onClick={() => handleDelete(h.id)} className="text-[10px] text-rose-600 font-semibold hover:underline">Yes</button>
                                    <span className="text-muted-foreground text-[10px]">/</span>
                                    <button onClick={() => setDeleteId(null)} className="text-[10px] text-muted-foreground hover:underline">No</button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => setDeleteId(h.id)}
                                    className="p-1.5 rounded-lg hover:bg-rose-50 text-muted-foreground hover:text-rose-500 transition-colors"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
              {grouped.size === 0 && (
                <div className="bg-white rounded-2xl border border-border text-center py-12 text-muted-foreground">
                  <CalendarDays className="w-10 h-10 mx-auto mb-2 opacity-20" />
                  <p className="text-sm">No holidays match your filter</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {drawerOpen && (
        <HolidayDrawer
          holiday={editTarget}
          onClose={() => { setDrawerOpen(false); setEditTarget(undefined) }}
          onSave={handleSave}
        />
      )}
    </div>
  )
}
