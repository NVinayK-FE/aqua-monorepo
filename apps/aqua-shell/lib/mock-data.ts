import type { Employee, PayrollRun, LeaveRequest, PerformanceReview, Department } from '@/types'

export const DEPARTMENTS: Department[] = [
  { id: 'd1', name: 'Engineering', headId: 'e1', employeeCount: 45, budget: 2_800_000 },
  { id: 'd2', name: 'Product', headId: 'e2', employeeCount: 18, budget: 1_200_000 },
  { id: 'd3', name: 'Design', headId: 'e3', employeeCount: 12, budget: 850_000 },
  { id: 'd4', name: 'Marketing', headId: 'e4', employeeCount: 22, budget: 1_100_000 },
  { id: 'd5', name: 'Sales', headId: 'e5', employeeCount: 35, budget: 1_800_000 },
  { id: 'd6', name: 'HR', headId: 'e6', employeeCount: 10, budget: 650_000 },
  { id: 'd7', name: 'Finance', headId: 'e7', employeeCount: 14, budget: 900_000 },
  { id: 'd8', name: 'Operations', headId: 'e8', employeeCount: 20, budget: 1_050_000 },
]

export const EMPLOYEES: Employee[] = [
  { id: 'e1', tenantId: 'acme', employeeId: 'EMP-001', firstName: 'Sarah', lastName: 'Chen', email: 'sarah.chen@acme.com', phone: '+1-555-0101', department: 'Engineering', position: 'VP Engineering', employmentType: 'full_time', status: 'active', hireDate: '2019-03-15', salary: 185000, currency: 'USD', location: 'San Francisco, CA', skills: ['React', 'Node.js', 'AWS'], performanceScore: 4.8, managerId: undefined },
  { id: 'e2', tenantId: 'acme', employeeId: 'EMP-002', firstName: 'Marcus', lastName: 'Johnson', email: 'marcus.j@acme.com', phone: '+1-555-0102', department: 'Product', position: 'Product Director', employmentType: 'full_time', status: 'active', hireDate: '2020-01-10', salary: 165000, currency: 'USD', location: 'New York, NY', skills: ['Product Strategy', 'Agile', 'Analytics'], performanceScore: 4.5, managerId: undefined },
  { id: 'e3', tenantId: 'acme', employeeId: 'EMP-003', firstName: 'Priya', lastName: 'Sharma', email: 'priya.s@acme.com', phone: '+1-555-0103', department: 'Design', position: 'Head of Design', employmentType: 'full_time', status: 'active', hireDate: '2020-06-22', salary: 145000, currency: 'USD', location: 'Austin, TX', skills: ['Figma', 'UX Research', 'Prototyping'], performanceScore: 4.7, managerId: undefined },
  { id: 'e4', tenantId: 'acme', employeeId: 'EMP-004', firstName: 'David', lastName: 'Kim', email: 'david.k@acme.com', phone: '+1-555-0104', department: 'Marketing', position: 'Marketing Manager', employmentType: 'full_time', status: 'active', hireDate: '2021-02-14', salary: 110000, currency: 'USD', location: 'Chicago, IL', skills: ['SEO', 'Content Strategy', 'Analytics'], performanceScore: 4.2, managerId: undefined },
  { id: 'e5', tenantId: 'acme', employeeId: 'EMP-005', firstName: 'Aisha', lastName: 'Williams', email: 'aisha.w@acme.com', phone: '+1-555-0105', department: 'Sales', position: 'Sales Director', employmentType: 'full_time', status: 'active', hireDate: '2019-09-01', salary: 155000, currency: 'USD', location: 'Miami, FL', skills: ['B2B Sales', 'CRM', 'Negotiation'], performanceScore: 4.9, managerId: undefined },
  { id: 'e6', tenantId: 'acme', employeeId: 'EMP-006', firstName: 'James', lastName: 'Okafor', email: 'james.o@acme.com', phone: '+1-555-0106', department: 'HR', position: 'HR Manager', employmentType: 'full_time', status: 'active', hireDate: '2020-11-08', salary: 95000, currency: 'USD', location: 'Remote', skills: ['Recruitment', 'HRIS', 'Compliance'], performanceScore: 4.4, managerId: undefined },
  { id: 'e7', tenantId: 'acme', employeeId: 'EMP-007', firstName: 'Natalie', lastName: 'Torres', email: 'natalie.t@acme.com', phone: '+1-555-0107', department: 'Finance', position: 'CFO', employmentType: 'full_time', status: 'active', hireDate: '2018-07-30', salary: 195000, currency: 'USD', location: 'San Francisco, CA', skills: ['Financial Modeling', 'M&A', 'FP&A'], performanceScore: 4.6, managerId: undefined },
  { id: 'e8', tenantId: 'acme', employeeId: 'EMP-008', firstName: 'Alex', lastName: 'Rivera', email: 'alex.r@acme.com', phone: '+1-555-0108', department: 'Operations', position: 'COO', employmentType: 'full_time', status: 'active', hireDate: '2017-04-12', salary: 210000, currency: 'USD', location: 'New York, NY', skills: ['Operations', 'Supply Chain', 'Six Sigma'], performanceScore: 4.8, managerId: undefined },
  { id: 'e9', tenantId: 'acme', employeeId: 'EMP-009', firstName: 'Linda', lastName: 'Zhang', email: 'linda.z@acme.com', phone: '+1-555-0109', department: 'Engineering', position: 'Senior Engineer', employmentType: 'full_time', status: 'on_leave', hireDate: '2021-05-17', salary: 130000, currency: 'USD', location: 'Seattle, WA', skills: ['Python', 'ML', 'TensorFlow'], performanceScore: 4.3, managerId: 'e1' },
  { id: 'e10', tenantId: 'acme', employeeId: 'EMP-010', firstName: 'Tom', lastName: 'Anderson', email: 'tom.a@acme.com', phone: '+1-555-0110', department: 'Engineering', position: 'Full Stack Developer', employmentType: 'full_time', status: 'active', hireDate: '2022-01-03', salary: 105000, currency: 'USD', location: 'Remote', skills: ['TypeScript', 'React', 'GraphQL'], performanceScore: 3.9, managerId: 'e1' },
  { id: 'e11', tenantId: 'acme', employeeId: 'EMP-011', firstName: 'Emma', lastName: 'Davis', email: 'emma.d@acme.com', phone: '+1-555-0111', department: 'Marketing', position: 'Content Strategist', employmentType: 'part_time', status: 'active', hireDate: '2022-08-15', salary: 72000, currency: 'USD', location: 'Boston, MA', skills: ['Copywriting', 'SEO', 'WordPress'], performanceScore: 4.1, managerId: 'e4' },
  { id: 'e12', tenantId: 'acme', employeeId: 'EMP-012', firstName: 'Ryan', lastName: 'Patel', email: 'ryan.p@acme.com', phone: '+1-555-0112', department: 'Sales', position: 'Account Executive', employmentType: 'full_time', status: 'active', hireDate: '2023-03-27', salary: 90000, currency: 'USD', location: 'Dallas, TX', skills: ['Salesforce', 'Cold Outreach', 'Demos'], performanceScore: 3.7, managerId: 'e5' },
]

export const PAYROLL_RUNS: PayrollRun[] = [
  { id: 'pr1', tenantId: 'acme', period: 'March 2025', totalGross: 1_250_400, totalDeductions: 312_600, totalNet: 937_800, employeeCount: 176, status: 'completed', processedAt: '2025-03-28', createdAt: '2025-03-25' },
  { id: 'pr2', tenantId: 'acme', period: 'February 2025', totalGross: 1_240_800, totalDeductions: 310_200, totalNet: 930_600, employeeCount: 174, status: 'completed', processedAt: '2025-02-26', createdAt: '2025-02-23' },
  { id: 'pr3', tenantId: 'acme', period: 'January 2025', totalGross: 1_235_200, totalDeductions: 308_800, totalNet: 926_400, employeeCount: 172, status: 'completed', processedAt: '2025-01-30', createdAt: '2025-01-27' },
  { id: 'pr4', tenantId: 'acme', period: 'December 2024', totalGross: 1_380_600, totalDeductions: 345_150, totalNet: 1_035_450, employeeCount: 171, status: 'completed', processedAt: '2024-12-27', createdAt: '2024-12-24' },
  { id: 'pr5', tenantId: 'acme', period: 'November 2024', totalGross: 1_220_400, totalDeductions: 305_100, totalNet: 915_300, employeeCount: 169, status: 'completed', processedAt: '2024-11-28', createdAt: '2024-11-25' },
  { id: 'pr6', tenantId: 'acme', period: 'April 2025', totalGross: 1_263_000, totalDeductions: 315_750, totalNet: 947_250, employeeCount: 178, status: 'draft', createdAt: '2025-04-01' },
]

export const LEAVE_REQUESTS: LeaveRequest[] = [
  { id: 'lr1', employeeId: 'e9', employeeName: 'Linda Zhang', department: 'Engineering', leaveType: 'maternity', startDate: '2025-03-01', endDate: '2025-05-30', days: 91, reason: 'Maternity leave', status: 'approved', approvedBy: 'James Okafor', createdAt: '2025-02-15' },
  { id: 'lr2', employeeId: 'e10', employeeName: 'Tom Anderson', department: 'Engineering', leaveType: 'annual', startDate: '2025-04-10', endDate: '2025-04-17', days: 5, reason: 'Family vacation', status: 'pending', createdAt: '2025-03-28' },
  { id: 'lr3', employeeId: 'e12', employeeName: 'Ryan Patel', department: 'Sales', leaveType: 'sick', startDate: '2025-04-02', endDate: '2025-04-03', days: 2, reason: 'Flu and fever', status: 'approved', approvedBy: 'Aisha Williams', createdAt: '2025-04-02' },
  { id: 'lr4', employeeId: 'e11', employeeName: 'Emma Davis', department: 'Marketing', leaveType: 'annual', startDate: '2025-04-21', endDate: '2025-04-25', days: 5, reason: 'Personal travel', status: 'pending', createdAt: '2025-03-30' },
  { id: 'lr5', employeeId: 'e4', employeeName: 'David Kim', department: 'Marketing', leaveType: 'emergency', startDate: '2025-03-25', endDate: '2025-03-27', days: 3, reason: 'Family emergency', status: 'approved', approvedBy: 'James Okafor', createdAt: '2025-03-25' },
  { id: 'lr6', employeeId: 'e3', employeeName: 'Priya Sharma', department: 'Design', leaveType: 'annual', startDate: '2025-05-05', endDate: '2025-05-09', days: 5, reason: 'Vacation', status: 'pending', createdAt: '2025-03-29' },
  { id: 'lr7', employeeId: 'e6', employeeName: 'James Okafor', department: 'HR', leaveType: 'annual', startDate: '2025-04-28', endDate: '2025-05-02', days: 5, reason: 'Holiday break', status: 'rejected', createdAt: '2025-03-20' },
]

export const PERFORMANCE_REVIEWS: PerformanceReview[] = [
  { id: 'rev1', employeeId: 'e1', employeeName: 'Sarah Chen', department: 'Engineering', reviewerId: 'e8', reviewerName: 'Alex Rivera', period: 'Q1 2025', rating: 5, status: 'completed', completedAt: '2025-04-01', createdAt: '2025-03-01', goals: [{ id: 'g1', title: 'Launch v3 platform', description: 'Deliver new platform architecture', progress: 100, targetDate: '2025-03-31', status: 'completed' }, { id: 'g2', title: 'Grow engineering team', description: 'Hire 5 senior engineers', progress: 80, targetDate: '2025-06-30', status: 'in_progress' }] },
  { id: 'rev2', employeeId: 'e5', employeeName: 'Aisha Williams', department: 'Sales', reviewerId: 'e8', reviewerName: 'Alex Rivera', period: 'Q1 2025', rating: 5, status: 'completed', completedAt: '2025-03-30', createdAt: '2025-03-01', goals: [{ id: 'g3', title: 'Exceed Q1 quota', description: '$2M ARR target', progress: 115, targetDate: '2025-03-31', status: 'completed' }] },
  { id: 'rev3', employeeId: 'e10', employeeName: 'Tom Anderson', department: 'Engineering', reviewerId: 'e1', reviewerName: 'Sarah Chen', period: 'Q1 2025', rating: 4, status: 'in_progress', createdAt: '2025-03-15', goals: [{ id: 'g4', title: 'Complete backend refactor', description: 'Migrate to microservices', progress: 65, targetDate: '2025-04-30', status: 'in_progress' }] },
  { id: 'rev4', employeeId: 'e12', employeeName: 'Ryan Patel', department: 'Sales', reviewerId: 'e5', reviewerName: 'Aisha Williams', period: 'Q1 2025', rating: 3, status: 'completed', completedAt: '2025-03-28', createdAt: '2025-03-01', goals: [{ id: 'g5', title: 'Close 10 new accounts', description: 'Mid-market accounts', progress: 70, targetDate: '2025-03-31', status: 'overdue' }] },
  { id: 'rev5', employeeId: 'e3', employeeName: 'Priya Sharma', department: 'Design', reviewerId: 'e2', reviewerName: 'Marcus Johnson', period: 'Q1 2025', rating: 5, status: 'scheduled', createdAt: '2025-03-15', goals: [{ id: 'g6', title: 'Design system v2', description: 'Complete new component library', progress: 90, targetDate: '2025-04-15', status: 'in_progress' }] },
]

// ─── Chart data ───────────────────────────────────────────────────────────────
export const headcountTrend = [
  { month: 'Oct', count: 152, hires: 4, exits: 1 },
  { month: 'Nov', count: 158, hires: 7, exits: 1 },
  { month: 'Dec', count: 162, hires: 5, exits: 1 },
  { month: 'Jan', count: 168, hires: 8, exits: 2 },
  { month: 'Feb', count: 172, hires: 6, exits: 2 },
  { month: 'Mar', count: 176, hires: 5, exits: 1 },
]

export const payrollTrend = [
  { month: 'Oct', gross: 1_190_000, net: 908_000 },
  { month: 'Nov', gross: 1_220_400, net: 915_300 },
  { month: 'Dec', gross: 1_380_600, net: 1_035_450 },
  { month: 'Jan', gross: 1_235_200, net: 926_400 },
  { month: 'Feb', gross: 1_240_800, net: 930_600 },
  { month: 'Mar', gross: 1_250_400, net: 937_800 },
]

export const departmentHeadcount = DEPARTMENTS.map((d) => ({
  name: d.name,
  value: d.employeeCount,
}))

export const leaveByType = [
  { type: 'Annual', count: 42, fill: '#00bcd4' },
  { type: 'Sick', count: 18, fill: '#0097a7' },
  { type: 'Maternity', count: 5, fill: '#4dd0e1' },
  { type: 'Paternity', count: 3, fill: '#80deea' },
  { type: 'Emergency', count: 9, fill: '#b2ebf2' },
  { type: 'Unpaid', count: 2, fill: '#e0f7fa' },
]

export const performanceDistribution = [
  { rating: '5 — Exceptional', count: 24, percent: 14 },
  { rating: '4 — Exceeds', count: 68, percent: 39 },
  { rating: '3 — Meets', count: 60, percent: 34 },
  { rating: '2 — Below', count: 18, percent: 10 },
  { rating: '1 — Unsatisfactory', count: 6, percent: 3 },
]

export const attendanceData = [
  { month: 'Oct', present: 94, absent: 4, late: 2 },
  { month: 'Nov', present: 92, absent: 5, late: 3 },
  { month: 'Dec', present: 88, absent: 8, late: 4 },
  { month: 'Jan', present: 95, absent: 3, late: 2 },
  { month: 'Feb', present: 93, absent: 4, late: 3 },
  { month: 'Mar', present: 96, absent: 2, late: 2 },
]
