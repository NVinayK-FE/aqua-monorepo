// ─── Shared holidays data ────────────────────────────────────────────────────

export type HolidayCategory = 'national' | 'company' | 'regional' | 'religious'
export type HolidayRegion   = 'All' | 'US' | 'Europe' | 'Asia Pacific'

export interface Holiday {
  id: string
  name: string
  date: string          // YYYY-MM-DD
  category: HolidayCategory
  region: HolidayRegion
  description: string
  paid: boolean
  optional: boolean     // optional observance / floating holiday
  color: string         // tailwind bg class
}

export const HOLIDAYS_2026: Holiday[] = [
  // ── National / Federal (US) ───────────────────────────────────────────────
  { id: 'h01', name: "New Year's Day",           date: '2026-01-01', category: 'national', region: 'US',  description: 'Federal holiday – start of the new year.',                   paid: true,  optional: false, color: 'bg-cyan-500'    },
  { id: 'h02', name: 'Martin Luther King Jr. Day',date: '2026-01-19', category: 'national', region: 'US',  description: 'Honors the civil rights leader Dr. Martin Luther King Jr.',  paid: true,  optional: false, color: 'bg-cyan-500'    },
  { id: 'h03', name: "Presidents' Day",           date: '2026-02-16', category: 'national', region: 'US',  description: 'Federal holiday honoring US presidents.',                     paid: true,  optional: false, color: 'bg-cyan-500'    },
  { id: 'h04', name: 'Memorial Day',              date: '2026-05-25', category: 'national', region: 'US',  description: 'Honors fallen military service members.',                     paid: true,  optional: false, color: 'bg-cyan-500'    },
  { id: 'h05', name: 'Juneteenth',                date: '2026-06-19', category: 'national', region: 'US',  description: 'Commemorates the emancipation of enslaved Americans.',        paid: true,  optional: false, color: 'bg-cyan-500'    },
  { id: 'h06', name: 'Independence Day',          date: '2026-07-03', category: 'national', region: 'US',  description: 'Independence Day observed (Jul 4 falls on Saturday).',        paid: true,  optional: false, color: 'bg-cyan-500'    },
  { id: 'h07', name: 'Labor Day',                 date: '2026-09-07', category: 'national', region: 'US',  description: 'Federal holiday celebrating American workers.',               paid: true,  optional: false, color: 'bg-cyan-500'    },
  { id: 'h08', name: 'Columbus Day',              date: '2026-10-12', category: 'national', region: 'US',  description: 'Commemorates Christopher Columbus arrival in the Americas.',  paid: true,  optional: true,  color: 'bg-cyan-500'    },
  { id: 'h09', name: "Veterans Day",              date: '2026-11-11', category: 'national', region: 'US',  description: 'Honors military veterans of the US Armed Forces.',            paid: true,  optional: false, color: 'bg-cyan-500'    },
  { id: 'h10', name: 'Thanksgiving Day',          date: '2026-11-26', category: 'national', region: 'US',  description: 'Annual day of giving thanks and family gathering.',           paid: true,  optional: false, color: 'bg-cyan-500'    },
  { id: 'h11', name: 'Christmas Day',             date: '2026-12-25', category: 'national', region: 'US',  description: 'Federal holiday celebrating Christmas.',                      paid: true,  optional: false, color: 'bg-cyan-500'    },

  // ── Europe Public Holidays ────────────────────────────────────────────────
  { id: 'h12', name: "New Year's Day",            date: '2026-01-01', category: 'national', region: 'Europe', description: 'Public holiday across Europe.',                           paid: true,  optional: false, color: 'bg-teal-500'    },
  { id: 'h13', name: 'Good Friday',               date: '2026-04-03', category: 'national', region: 'Europe', description: 'Public holiday in many European countries.',              paid: true,  optional: false, color: 'bg-teal-500'    },
  { id: 'h14', name: 'Easter Monday',             date: '2026-04-06', category: 'national', region: 'Europe', description: 'Public holiday following Easter Sunday.',                 paid: true,  optional: false, color: 'bg-teal-500'    },
  { id: 'h15', name: 'Labour Day',                date: '2026-05-01', category: 'national', region: 'Europe', description: 'International Workers Day.',                              paid: true,  optional: false, color: 'bg-teal-500'    },
  { id: 'h16', name: 'Christmas Day',             date: '2026-12-25', category: 'national', region: 'Europe', description: 'Public holiday across Europe.',                           paid: true,  optional: false, color: 'bg-teal-500'    },
  { id: 'h17', name: 'Boxing Day',                date: '2026-12-26', category: 'national', region: 'Europe', description: 'Public holiday in UK and parts of Europe.',               paid: true,  optional: false, color: 'bg-teal-500'    },

  // ── Asia Pacific ─────────────────────────────────────────────────────────
  { id: 'h18', name: 'Chinese New Year',          date: '2026-02-17', category: 'national', region: 'Asia Pacific', description: 'Lunar New Year, year of the Horse.',               paid: true,  optional: false, color: 'bg-rose-500'    },
  { id: 'h19', name: 'Hari Raya Aidilfitri',     date: '2026-03-31', category: 'national', region: 'Asia Pacific', description: 'Celebration marking end of Ramadan.',              paid: true,  optional: false, color: 'bg-rose-500'    },
  { id: 'h20', name: 'ANZAC Day',                 date: '2026-04-25', category: 'national', region: 'Asia Pacific', description: 'Commemoration day in Australia and New Zealand.',  paid: true,  optional: false, color: 'bg-rose-500'    },
  { id: 'h21', name: 'Diwali',                    date: '2026-11-08', category: 'national', region: 'Asia Pacific', description: 'Festival of lights observed across South Asia.',   paid: true,  optional: true,  color: 'bg-rose-500'    },

  // ── Company Holidays (All regions) ───────────────────────────────────────
  { id: 'h22', name: 'Company Founder Day',       date: '2026-03-15', category: 'company',  region: 'All', description: 'Acme Corporation founding anniversary — full day off.',    paid: true,  optional: false, color: 'bg-emerald-500' },
  { id: 'h23', name: 'Spring Wellness Day',       date: '2026-03-20', category: 'company',  region: 'All', description: 'Dedicated mental wellness day — no meetings required.',     paid: true,  optional: false, color: 'bg-emerald-500' },
  { id: 'h24', name: 'Learning Day (Q2)',         date: '2026-06-05', category: 'company',  region: 'All', description: 'Quarterly L&D day — courses, workshops, and training.',    paid: true,  optional: false, color: 'bg-emerald-500' },
  { id: 'h25', name: 'Summer Day Off',            date: '2026-08-03', category: 'company',  region: 'All', description: 'Extra summer day — enjoy the sunshine!',                   paid: true,  optional: false, color: 'bg-emerald-500' },
  { id: 'h26', name: 'Learning Day (Q4)',         date: '2026-10-02', category: 'company',  region: 'All', description: 'Quarterly L&D day — courses, workshops, and training.',    paid: true,  optional: false, color: 'bg-emerald-500' },
  { id: 'h27', name: 'Thanksgiving Friday',       date: '2026-11-27', category: 'company',  region: 'All', description: 'Day after Thanksgiving — extended holiday weekend.',        paid: true,  optional: false, color: 'bg-emerald-500' },
  { id: 'h28', name: 'Christmas Eve',             date: '2026-12-24', category: 'company',  region: 'All', description: 'Half-day from 1 PM — enjoy the festive season.',           paid: true,  optional: false, color: 'bg-emerald-500' },
  { id: 'h29', name: 'Holiday Shutdown',          date: '2026-12-28', category: 'company',  region: 'All', description: 'Company shutdown — Dec 28–31. Offices fully closed.',      paid: true,  optional: false, color: 'bg-emerald-500' },
  { id: 'h30', name: 'Holiday Shutdown',          date: '2026-12-29', category: 'company',  region: 'All', description: 'Company shutdown — offices fully closed.',                  paid: true,  optional: false, color: 'bg-emerald-500' },
  { id: 'h31', name: 'Holiday Shutdown',          date: '2026-12-30', category: 'company',  region: 'All', description: 'Company shutdown — offices fully closed.',                  paid: true,  optional: false, color: 'bg-emerald-500' },
  { id: 'h32', name: "New Year's Eve",            date: '2026-12-31', category: 'company',  region: 'All', description: 'Company shutdown — ring in the new year!',                  paid: true,  optional: false, color: 'bg-emerald-500' },

  // ── Optional / Floating ───────────────────────────────────────────────────
  { id: 'h33', name: 'Floating Holiday (Q1)',     date: '2026-02-20', category: 'company',  region: 'All', description: 'Use anytime in Q1 — coordinate with your manager.',        paid: true,  optional: true,  color: 'bg-purple-500'  },
  { id: 'h34', name: 'Floating Holiday (Q3)',     date: '2026-08-21', category: 'company',  region: 'All', description: 'Use anytime in Q3 — coordinate with your manager.',        paid: true,  optional: true,  color: 'bg-purple-500'  },
]

// ── Helpers ──────────────────────────────────────────────────────────────────
export const CATEGORY_LABEL: Record<HolidayCategory, string> = {
  national: 'National',
  company:  'Company',
  regional: 'Regional',
  religious:'Religious',
}

export const CATEGORY_BADGE: Record<HolidayCategory, string> = {
  national: 'bg-cyan-100 text-cyan-700',
  company:  'bg-emerald-100 text-emerald-700',
  regional: 'bg-rose-100 text-rose-600',
  religious:'bg-purple-100 text-purple-700',
}

export const REGION_FLAG: Record<HolidayRegion, string> = {
  'All':          '🌐',
  'US':           '🇺🇸',
  'Europe':       '🇪🇺',
  'Asia Pacific': '🌏',
}

export function getHolidaysForRegion(region: HolidayRegion) {
  return HOLIDAYS_2026.filter((h) => h.region === 'All' || h.region === region)
}

export function getUpcoming(region: HolidayRegion = 'All', count = 5) {
  const today = new Date().toISOString().slice(0, 10)
  return getHolidaysForRegion(region)
    .filter((h) => h.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
    .filter((h, i, arr) => arr.findIndex((x) => x.date === h.date && x.name === h.name) === i) // dedupe same-day
    .slice(0, count)
}

export function getDaysUntil(dateStr: string) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(dateStr + 'T00:00:00')
  const diff   = Math.round((target.getTime() - today.getTime()) / 86400000)
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Tomorrow'
  if (diff < 0)  return `${Math.abs(diff)} days ago`
  return `In ${diff} days`
}

export function fmtHolidayDate(dateStr: string) {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  })
}
