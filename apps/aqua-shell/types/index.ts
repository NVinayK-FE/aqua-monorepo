// ─── Tenant / Auth ─────────────────────────────────────────────────────────
export interface Tenant {
  id: string
  name: string
  domain: string
  logo: string
  plan: 'starter' | 'pro' | 'enterprise'
  employeeCount: number
  createdAt: string
  status: 'active' | 'suspended' | 'trial'
}

export interface User {
  id: string
  tenantId: string
  name: string
  email: string
  role: 'super_admin' | 'hr_admin' | 'manager' | 'employee'
  avatar?: string
  department: string
  position: string
}

// ─── Employee ───────────────────────────────────────────────────────────────
export type EmploymentType = 'full_time' | 'part_time' | 'contract' | 'intern'
export type EmployeeStatus = 'active' | 'inactive' | 'on_leave' | 'terminated'

export interface Employee {
  id: string
  tenantId: string
  employeeId: string
  firstName: string
  lastName: string
  email: string
  phone: string
  avatar?: string
  department: string
  position: string
  managerId?: string
  employmentType: EmploymentType
  status: EmployeeStatus
  hireDate: string
  salary: number
  currency: string
  location: string
  skills: string[]
  performanceScore: number
}

// ─── Department ─────────────────────────────────────────────────────────────
export interface Department {
  id: string
  name: string
  headId: string
  employeeCount: number
  budget: number
}

// ─── Payroll ─────────────────────────────────────────────────────────────────
export type PayrollStatus = 'draft' | 'processing' | 'completed' | 'failed'

export interface PayrollRun {
  id: string
  tenantId: string
  period: string
  totalGross: number
  totalDeductions: number
  totalNet: number
  employeeCount: number
  status: PayrollStatus
  processedAt?: string
  createdAt: string
}

export interface PaySlip {
  id: string
  employeeId: string
  payrollRunId: string
  period: string
  basicSalary: number
  allowances: { name: string; amount: number }[]
  deductions: { name: string; amount: number }[]
  grossPay: number
  netPay: number
  paidAt?: string
}

// ─── Leave ───────────────────────────────────────────────────────────────────
export type LeaveType = 'annual' | 'sick' | 'maternity' | 'paternity' | 'emergency' | 'unpaid'
export type LeaveStatus = 'pending' | 'approved' | 'rejected' | 'cancelled'

export interface LeaveRequest {
  id: string
  employeeId: string
  employeeName: string
  department: string
  leaveType: LeaveType
  startDate: string
  endDate: string
  days: number
  reason: string
  status: LeaveStatus
  approvedBy?: string
  createdAt: string
}

export interface LeaveBalance {
  employeeId: string
  annual: { total: number; used: number; remaining: number }
  sick: { total: number; used: number; remaining: number }
  maternity: { total: number; used: number; remaining: number }
  paternity: { total: number; used: number; remaining: number }
}

// ─── Performance ──────────────────────────────────────────────────────────────
export type ReviewStatus = 'scheduled' | 'in_progress' | 'completed' | 'overdue'
export type Rating = 1 | 2 | 3 | 4 | 5

export interface PerformanceReview {
  id: string
  employeeId: string
  employeeName: string
  department: string
  reviewerId: string
  reviewerName: string
  period: string
  rating: Rating
  goals: Goal[]
  status: ReviewStatus
  completedAt?: string
  createdAt: string
}

export interface Goal {
  id: string
  title: string
  description: string
  progress: number
  targetDate: string
  status: 'not_started' | 'in_progress' | 'completed' | 'overdue'
}

// ─── Licensing ───────────────────────────────────────────────────────────────
export type PlanId = 'starter' | 'pro' | 'enterprise'

export interface Plan {
  id: PlanId
  name: string
  price: number
  billingCycle: 'monthly' | 'annual'
  maxEmployees: number
  features: string[]
  color: string
}

export interface License {
  id: string
  tenantId: string
  planId: PlanId
  startDate: string
  endDate: string
  status: 'active' | 'expired' | 'cancelled'
  seats: number
  usedSeats: number
  autoRenew: boolean
}
