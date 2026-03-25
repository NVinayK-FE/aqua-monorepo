// ─── Shared admin mock data ───────────────────────────────────────────────────

export type TenantStatus = 'active' | 'trial' | 'suspended' | 'cancelled'
export type PlanName     = 'Starter' | 'Growth' | 'Enterprise'
export type BillingCycle = 'monthly' | 'annual'
export type AdminRole    = 'super_admin' | 'hr_admin' | 'manager' | 'employee'

export interface AdminTenant {
  id: string
  name: string
  domain: string
  plan: PlanName
  status: TenantStatus
  employees: number
  mrr: number
  billingCycle: BillingCycle
  region: string
  joined: string
  trialEnds?: string
  contactName: string
  contactEmail: string
  logo: string
}

export interface AdminSubscription {
  id: string
  tenantId: string
  tenantName: string
  plan: PlanName
  billingCycle: BillingCycle
  seats: number
  usedSeats: number
  amount: number
  status: 'active' | 'trial' | 'past_due' | 'cancelled'
  startDate: string
  nextRenewal: string
  paymentMethod: string
}

export interface AdminUser {
  id: string
  tenantId: string
  tenantName: string
  name: string
  email: string
  role: AdminRole
  status: 'active' | 'inactive' | 'pending'
  lastLogin: string
  createdAt: string
  initials: string
}

// ─── Tenants ──────────────────────────────────────────────────────────────────

export const ADMIN_TENANTS: AdminTenant[] = [
  { id: 'T-1241', name: 'CloudBridge Systems',   domain: 'cloudbridge.aqua-shell.io',  plan: 'Enterprise', status: 'active',    employees: 820, mrr: 16400, billingCycle: 'annual',  region: 'US West',      joined: '2026-03-08', contactName: 'Rachel Torres',   contactEmail: 'r.torres@cloudbridge.io',  logo: 'CB' },
  { id: 'T-1242', name: 'Peak Performance Ltd',  domain: 'peak.aqua-shell.io',          plan: 'Growth',     status: 'active',    employees: 210, mrr: 3990,  billingCycle: 'monthly', region: 'Europe',       joined: '2026-03-10', contactName: 'Hans Mueller',    contactEmail: 'h.mueller@peak.de',        logo: 'PP' },
  { id: 'T-1243', name: 'Sunrise Education',     domain: 'sunrise.aqua-shell.io',       plan: 'Starter',    status: 'trial',     employees: 34,  mrr: 0,     billingCycle: 'monthly', region: 'Asia Pacific', joined: '2026-03-14', trialEnds: '2026-03-28', contactName: 'Aiko Tanaka', contactEmail: 'a.tanaka@sunrise.edu', logo: 'SE' },
  { id: 'T-1244', name: 'Apex Logistics',        domain: 'apex.aqua-shell.io',          plan: 'Growth',     status: 'active',    employees: 95,  mrr: 1805,  billingCycle: 'monthly', region: 'US East',      joined: '2026-03-15', contactName: 'Marcus Webb',     contactEmail: 'm.webb@apexlog.com',       logo: 'AL' },
  { id: 'T-1245', name: 'Meridian Health',       domain: 'meridian.aqua-shell.io',      plan: 'Enterprise', status: 'active',    employees: 540, mrr: 10800, billingCycle: 'annual',  region: 'US East',      joined: '2026-03-18', contactName: 'Dr. Priya Nair',  contactEmail: 'p.nair@meridianhealth.com', logo: 'MH' },
  { id: 'T-1246', name: 'BlueSky Analytics',     domain: 'bluesky.aqua-shell.io',       plan: 'Starter',    status: 'active',    employees: 18,  mrr: 162,   billingCycle: 'monthly', region: 'Europe',       joined: '2026-03-20', contactName: 'Sophie Martin',   contactEmail: 's.martin@bluesky.fr',      logo: 'BA' },
  { id: 'T-1247', name: 'NovaTech Inc.',         domain: 'novatech.aqua-shell.io',      plan: 'Growth',     status: 'trial',     employees: 120, mrr: 0,     billingCycle: 'monthly', region: 'US West',      joined: '2026-03-22', trialEnds: '2026-04-05', contactName: 'Jason Cole', contactEmail: 'j.cole@novatech.io', logo: 'NT' },
  { id: 'T-1240', name: 'Ironclad Finance',      domain: 'ironclad.aqua-shell.io',      plan: 'Enterprise', status: 'active',    employees: 1200,mrr: 24000, billingCycle: 'annual',  region: 'US East',      joined: '2026-02-14', contactName: 'Victoria Chen',   contactEmail: 'v.chen@ironcladfinance.com',logo: 'IF' },
  { id: 'T-1239', name: 'Vantage Retail',        domain: 'vantage.aqua-shell.io',       plan: 'Growth',     status: 'active',    employees: 320, mrr: 6080,  billingCycle: 'annual',  region: 'Asia Pacific', joined: '2026-02-01', contactName: 'Kevin Lim',       contactEmail: 'k.lim@vantage.sg',         logo: 'VR' },
  { id: 'T-1238', name: 'Stellar Consulting',    domain: 'stellar.aqua-shell.io',       plan: 'Starter',    status: 'suspended', employees: 22,  mrr: 0,     billingCycle: 'monthly', region: 'Europe',       joined: '2026-01-15', contactName: 'Olga Petrov',     contactEmail: 'o.petrov@stellar.eu',      logo: 'SC' },
  { id: 'T-1237', name: 'GreenLeaf Farms',       domain: 'greenleaf.aqua-shell.io',     plan: 'Starter',    status: 'active',    employees: 45,  mrr: 405,   billingCycle: 'monthly', region: 'US West',      joined: '2026-01-10', contactName: 'Daniel Park',     contactEmail: 'd.park@greenleaffarms.com', logo: 'GF' },
  { id: 'T-1236', name: 'Orbit Media Group',     domain: 'orbit.aqua-shell.io',         plan: 'Growth',     status: 'active',    employees: 88,  mrr: 1672,  billingCycle: 'monthly', region: 'US East',      joined: '2026-01-05', contactName: 'Zara Ahmed',      contactEmail: 'z.ahmed@orbitmedia.com',   logo: 'OM' },
]

// ─── Subscriptions ────────────────────────────────────────────────────────────

export const ADMIN_SUBSCRIPTIONS: AdminSubscription[] = [
  { id: 'SUB-001', tenantId: 'T-1241', tenantName: 'CloudBridge Systems',  plan: 'Enterprise', billingCycle: 'annual',  seats: 1000, usedSeats: 820,  amount: 196800, status: 'active',   startDate: '2026-03-08', nextRenewal: '2027-03-08', paymentMethod: 'Visa •••• 4242' },
  { id: 'SUB-002', tenantId: 'T-1242', tenantName: 'Peak Performance Ltd', plan: 'Growth',     billingCycle: 'monthly', seats: 250,  usedSeats: 210,  amount: 3990,   status: 'active',   startDate: '2026-03-10', nextRenewal: '2026-04-10', paymentMethod: 'Mastercard •••• 1234' },
  { id: 'SUB-003', tenantId: 'T-1243', tenantName: 'Sunrise Education',    plan: 'Starter',    billingCycle: 'monthly', seats: 50,   usedSeats: 34,   amount: 0,      status: 'trial',    startDate: '2026-03-14', nextRenewal: '2026-03-28', paymentMethod: '—' },
  { id: 'SUB-004', tenantId: 'T-1244', tenantName: 'Apex Logistics',       plan: 'Growth',     billingCycle: 'monthly', seats: 100,  usedSeats: 95,   amount: 1805,   status: 'active',   startDate: '2026-03-15', nextRenewal: '2026-04-15', paymentMethod: 'Visa •••• 8891' },
  { id: 'SUB-005', tenantId: 'T-1245', tenantName: 'Meridian Health',      plan: 'Enterprise', billingCycle: 'annual',  seats: 600,  usedSeats: 540,  amount: 129600, status: 'active',   startDate: '2026-03-18', nextRenewal: '2027-03-18', paymentMethod: 'ACH •••• 5678' },
  { id: 'SUB-006', tenantId: 'T-1246', tenantName: 'BlueSky Analytics',    plan: 'Starter',    billingCycle: 'monthly', seats: 25,   usedSeats: 18,   amount: 162,    status: 'active',   startDate: '2026-03-20', nextRenewal: '2026-04-20', paymentMethod: 'Visa •••• 3311' },
  { id: 'SUB-007', tenantId: 'T-1247', tenantName: 'NovaTech Inc.',        plan: 'Growth',     billingCycle: 'monthly', seats: 150,  usedSeats: 120,  amount: 0,      status: 'trial',    startDate: '2026-03-22', nextRenewal: '2026-04-05', paymentMethod: '—' },
  { id: 'SUB-008', tenantId: 'T-1240', tenantName: 'Ironclad Finance',     plan: 'Enterprise', billingCycle: 'annual',  seats: 1500, usedSeats: 1200, amount: 288000, status: 'active',   startDate: '2026-02-14', nextRenewal: '2027-02-14', paymentMethod: 'ACH •••• 9922' },
  { id: 'SUB-009', tenantId: 'T-1239', tenantName: 'Vantage Retail',       plan: 'Growth',     billingCycle: 'annual',  seats: 350,  usedSeats: 320,  amount: 72960,  status: 'active',   startDate: '2026-02-01', nextRenewal: '2027-02-01', paymentMethod: 'Visa •••• 7755' },
  { id: 'SUB-010', tenantId: 'T-1238', tenantName: 'Stellar Consulting',   plan: 'Starter',    billingCycle: 'monthly', seats: 25,   usedSeats: 22,   amount: 198,    status: 'past_due', startDate: '2026-01-15', nextRenewal: '2026-03-15', paymentMethod: 'Mastercard •••• 6600' },
  { id: 'SUB-011', tenantId: 'T-1237', tenantName: 'GreenLeaf Farms',      plan: 'Starter',    billingCycle: 'monthly', seats: 50,   usedSeats: 45,   amount: 405,    status: 'active',   startDate: '2026-01-10', nextRenewal: '2026-04-10', paymentMethod: 'Visa •••• 4410' },
  { id: 'SUB-012', tenantId: 'T-1236', tenantName: 'Orbit Media Group',    plan: 'Growth',     billingCycle: 'monthly', seats: 100,  usedSeats: 88,   amount: 1672,   status: 'active',   startDate: '2026-01-05', nextRenewal: '2026-04-05', paymentMethod: 'Amex •••• 0021' },
]

// ─── Users ────────────────────────────────────────────────────────────────────

export const ADMIN_USERS: AdminUser[] = [
  { id: 'U-001', tenantId: 'platform',  tenantName: 'AQUA SUITE Platform',  name: 'Super Admin',       email: 'admin@aquasuite.io',        role: 'super_admin', status: 'active',   lastLogin: '2026-03-24T09:12:00Z', createdAt: '2024-01-01', initials: 'SA' },
  { id: 'U-002', tenantId: 'T-1245',    tenantName: 'Meridian Health',       name: 'Dr. Priya Nair',    email: 'p.nair@meridianhealth.com',  role: 'hr_admin',    status: 'active',   lastLogin: '2026-03-24T08:45:00Z', createdAt: '2026-03-18', initials: 'PN' },
  { id: 'U-003', tenantId: 'T-1241',    tenantName: 'CloudBridge Systems',   name: 'Rachel Torres',     email: 'r.torres@cloudbridge.io',    role: 'hr_admin',    status: 'active',   lastLogin: '2026-03-23T17:30:00Z', createdAt: '2026-03-08', initials: 'RT' },
  { id: 'U-004', tenantId: 'T-1242',    tenantName: 'Peak Performance Ltd',  name: 'Hans Mueller',      email: 'h.mueller@peak.de',          role: 'hr_admin',    status: 'active',   lastLogin: '2026-03-23T14:10:00Z', createdAt: '2026-03-10', initials: 'HM' },
  { id: 'U-005', tenantId: 'T-1244',    tenantName: 'Apex Logistics',        name: 'Marcus Webb',       email: 'm.webb@apexlog.com',         role: 'manager',     status: 'active',   lastLogin: '2026-03-22T11:00:00Z', createdAt: '2026-03-15', initials: 'MW' },
  { id: 'U-006', tenantId: 'T-1241',    tenantName: 'CloudBridge Systems',   name: 'Lena Fischer',      email: 'l.fischer@cloudbridge.io',   role: 'manager',     status: 'active',   lastLogin: '2026-03-22T09:30:00Z', createdAt: '2026-03-09', initials: 'LF' },
  { id: 'U-007', tenantId: 'T-1246',    tenantName: 'BlueSky Analytics',     name: 'Sophie Martin',     email: 's.martin@bluesky.fr',        role: 'hr_admin',    status: 'active',   lastLogin: '2026-03-21T16:45:00Z', createdAt: '2026-03-20', initials: 'SM' },
  { id: 'U-008', tenantId: 'T-1247',    tenantName: 'NovaTech Inc.',         name: 'Jason Cole',        email: 'j.cole@novatech.io',         role: 'hr_admin',    status: 'pending',  lastLogin: '—',                    createdAt: '2026-03-22', initials: 'JC' },
  { id: 'U-009', tenantId: 'T-1240',    tenantName: 'Ironclad Finance',      name: 'Victoria Chen',     email: 'v.chen@ironcladfinance.com', role: 'hr_admin',    status: 'active',   lastLogin: '2026-03-21T10:00:00Z', createdAt: '2026-02-14', initials: 'VC' },
  { id: 'U-010', tenantId: 'T-1239',    tenantName: 'Vantage Retail',        name: 'Kevin Lim',         email: 'k.lim@vantage.sg',           role: 'hr_admin',    status: 'active',   lastLogin: '2026-03-20T08:15:00Z', createdAt: '2026-02-01', initials: 'KL' },
  { id: 'U-011', tenantId: 'T-1238',    tenantName: 'Stellar Consulting',    name: 'Olga Petrov',       email: 'o.petrov@stellar.eu',        role: 'hr_admin',    status: 'inactive', lastLogin: '2026-02-28T12:00:00Z', createdAt: '2026-01-15', initials: 'OP' },
  { id: 'U-012', tenantId: 'T-1242',    tenantName: 'Peak Performance Ltd',  name: 'Erik Sorenson',     email: 'e.sorenson@peak.de',         role: 'employee',    status: 'active',   lastLogin: '2026-03-23T09:00:00Z', createdAt: '2026-03-11', initials: 'ES' },
  { id: 'U-013', tenantId: 'T-1244',    tenantName: 'Apex Logistics',        name: 'Fatima Al-Rashid',  email: 'f.alrashid@apexlog.com',     role: 'employee',    status: 'active',   lastLogin: '2026-03-22T15:30:00Z', createdAt: '2026-03-16', initials: 'FA' },
  { id: 'U-014', tenantId: 'T-1245',    tenantName: 'Meridian Health',       name: 'James Okafor',      email: 'james.o@acme.com',           role: 'hr_admin',    status: 'active',   lastLogin: '2026-03-24T07:55:00Z', createdAt: '2026-03-19', initials: 'JO' },
  { id: 'U-015', tenantId: 'T-1237',    tenantName: 'GreenLeaf Farms',       name: 'Daniel Park',       email: 'd.park@greenleaffarms.com',  role: 'hr_admin',    status: 'active',   lastLogin: '2026-03-20T13:00:00Z', createdAt: '2026-01-10', initials: 'DP' },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

export const PLAN_BADGE: Record<string, string> = {
  Starter:    'bg-cyan-100 text-cyan-700',
  Growth:     'bg-primary/10 text-primary',
  Enterprise: 'bg-teal-900/10 text-teal-800',
}

export const STATUS_BADGE: Record<string, { label: string; cls: string }> = {
  active:    { label: 'Active',    cls: 'badge-active'   },
  trial:     { label: 'Trial',     cls: 'badge-pending'  },
  suspended: { label: 'Suspended', cls: 'badge-rejected' },
  cancelled: { label: 'Cancelled', cls: 'badge-inactive' },
  past_due:  { label: 'Past Due',  cls: 'badge-rejected' },
  pending:   { label: 'Pending',   cls: 'badge-pending'  },
  inactive:  { label: 'Inactive',  cls: 'badge-inactive' },
}

export const ROLE_BADGE: Record<string, { label: string; cls: string }> = {
  super_admin: { label: 'Super Admin', cls: 'bg-cyan-100 text-cyan-700'    },
  hr_admin:    { label: 'HR Admin',    cls: 'bg-emerald-100 text-emerald-700' },
  manager:     { label: 'Manager',     cls: 'bg-purple-100 text-purple-700'   },
  employee:    { label: 'Employee',    cls: 'bg-gray-100 text-gray-600'       },
}

export function fmtMoney(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)     return `$${(n / 1_000).toFixed(0)}K`
  return `$${n.toLocaleString()}`
}

export function fmtDate(d: string) {
  if (!d || d === '—') return '—'
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function relativeTime(iso: string) {
  if (!iso || iso === '—') return '—'
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}
