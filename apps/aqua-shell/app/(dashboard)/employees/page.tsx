'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ChartTableToggle } from '@/components/charts/chart-table-toggle'
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import {
  Search, Plus, Filter, Download, MoreHorizontal,
  MapPin, Briefcase, Mail, Phone, Users, TrendingUp,
} from 'lucide-react'
import { EMPLOYEES, DEPARTMENTS, departmentHeadcount } from '@/lib/mock-data'
import { formatCurrency, getInitials, getAvatarColor, CHART_COLORS } from '@/lib/utils'
import type { Employee, EmployeeStatus } from '@/types'

const DEPT_COLORS = [
  CHART_COLORS.primary, CHART_COLORS.secondary, CHART_COLORS.accent,
  CHART_COLORS.success, CHART_COLORS.warning, CHART_COLORS.purple,
  CHART_COLORS.pink, CHART_COLORS.indigo,
]

const STATUS_CONFIG: Record<EmployeeStatus, { label: string; class: string }> = {
  active: { label: 'Active', class: 'badge-active' },
  inactive: { label: 'Inactive', class: 'badge-inactive' },
  on_leave: { label: 'On Leave', class: 'badge-pending' },
  terminated: { label: 'Terminated', class: 'badge-rejected' },
}

const EMP_TYPE_LABELS = {
  full_time: 'Full Time',
  part_time: 'Part Time',
  contract: 'Contract',
  intern: 'Intern',
}

const employmentTypeData = [
  { name: 'Full Time', value: 142 },
  { name: 'Part Time', value: 18 },
  { name: 'Contract', value: 12 },
  { name: 'Intern', value: 4 },
]

export default function EmployeesPage() {
  const [search, setSearch] = useState('')
  const [deptFilter, setDeptFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = EMPLOYEES.filter((e) => {
    const fullName = `${e.firstName} ${e.lastName}`.toLowerCase()
    const matchSearch = !search || fullName.includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase()) ||
      e.position.toLowerCase().includes(search.toLowerCase())
    const matchDept = deptFilter === 'all' || e.department === deptFilter
    const matchStatus = statusFilter === 'all' || e.status === statusFilter
    return matchSearch && matchDept && matchStatus
  })

  return (
    <div className="flex flex-col flex-1">
      <Header
        title="Employees"
        subtitle="Manage your workforce — 176 employees across 8 departments"
        actions={
          <Button size="sm">
            <Plus className="w-3.5 h-3.5" />
            Add Employee
          </Button>
        }
      />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Summary KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Employees', value: 176, icon: Users, color: 'text-cyan-600', bg: 'bg-cyan-50' },
            { label: 'Active', value: 162, icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'On Leave', value: 12, icon: Users, color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'New This Month', value: 5, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
          ].map((s) => (
            <div key={s.label} className="stat-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-0.5">{s.value}</p>
                </div>
                <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center`}>
                  <s.icon className={`w-4.5 h-4.5 ${s.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>By Department</CardTitle>
              <CardDescription>Employee count per department</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartTableToggle
                chartContent={
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={departmentHeadcount} layout="vertical" barSize={14}>
                      <XAxis type="number" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={80} axisLine={false} tickLine={false} />
                      <Tooltip />
                      <Bar dataKey="value" name="Employees" radius={[0, 6, 6, 0]}>
                        {departmentHeadcount.map((_, i) => (
                          <Cell key={i} fill={DEPT_COLORS[i % DEPT_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                }
                tableContent={
                  <table className="w-full text-sm data-table">
                    <thead><tr>
                      <th className="text-left px-3 py-2 rounded-l-lg">Department</th>
                      <th className="text-right px-3 py-2">Employees</th>
                      <th className="text-right px-3 py-2 rounded-r-lg">Budget</th>
                    </tr></thead>
                    <tbody>
                      {DEPARTMENTS.map((d) => (
                        <tr key={d.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                          <td className="px-3 py-2.5 font-medium">{d.name}</td>
                          <td className="px-3 py-2.5 text-right">{d.employeeCount}</td>
                          <td className="px-3 py-2.5 text-right text-muted-foreground">{formatCurrency(d.budget)}</td>
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
              <CardTitle>Employment Types</CardTitle>
              <CardDescription>Full-time, part-time, contract, intern</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartTableToggle
                chartContent={
                  <div className="flex items-center gap-4">
                    <ResponsiveContainer width="55%" height={180}>
                      <PieChart>
                        <Pie data={employmentTypeData} cx="50%" cy="50%" innerRadius={45} outerRadius={70}
                          dataKey="value" paddingAngle={3}>
                          {employmentTypeData.map((_, i) => (
                            <Cell key={i} fill={DEPT_COLORS[i]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex-1 space-y-2.5">
                      {employmentTypeData.map((item, i) => (
                        <div key={item.name} className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: DEPT_COLORS[i] }} />
                          <span className="text-xs text-muted-foreground flex-1">{item.name}</span>
                          <span className="text-xs font-semibold text-foreground">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                }
                tableContent={
                  <table className="w-full text-sm data-table">
                    <thead><tr>
                      <th className="text-left px-3 py-2 rounded-l-lg">Type</th>
                      <th className="text-right px-3 py-2">Count</th>
                      <th className="text-right px-3 py-2 rounded-r-lg">%</th>
                    </tr></thead>
                    <tbody>
                      {employmentTypeData.map((item) => (
                        <tr key={item.name} className="border-b border-border last:border-0">
                          <td className="px-3 py-2.5">{item.name}</td>
                          <td className="px-3 py-2.5 text-right font-medium">{item.value}</td>
                          <td className="px-3 py-2.5 text-right text-muted-foreground">
                            {Math.round((item.value / 176) * 100)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                }
              />
            </CardContent>
          </Card>
        </div>

        {/* Employee list */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle>All Employees</CardTitle>
                <CardDescription>{filtered.length} employees shown</CardDescription>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {/* Search */}
                <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2 w-52">
                  <Search className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search employees..."
                    className="bg-transparent text-xs outline-none flex-1"
                  />
                </div>

                {/* Dept filter */}
                <select
                  value={deptFilter}
                  onChange={(e) => setDeptFilter(e.target.value)}
                  className="text-xs border border-input rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="all">All Departments</option>
                  {DEPARTMENTS.map((d) => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </select>

                {/* Status filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="text-xs border border-input rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="on_leave">On Leave</option>
                  <option value="inactive">Inactive</option>
                </select>

                <Button variant="outline" size="sm">
                  <Download className="w-3.5 h-3.5" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full data-table">
                <thead>
                  <tr>
                    <th className="text-left px-6 py-3">Employee</th>
                    <th className="text-left px-4 py-3">Department</th>
                    <th className="text-left px-4 py-3">Position</th>
                    <th className="text-left px-4 py-3">Type</th>
                    <th className="text-left px-4 py-3">Status</th>
                    <th className="text-right px-4 py-3">Salary</th>
                    <th className="text-center px-4 py-3">Performance</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((emp) => {
                    const initials = getInitials(`${emp.firstName} ${emp.lastName}`)
                    const avatarClass = getAvatarColor(emp.firstName)
                    const statusConf = STATUS_CONFIG[emp.status]
                    return (
                      <tr key={emp.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 ${avatarClass}`}>
                              {initials}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-foreground">
                                {emp.firstName} {emp.lastName}
                              </p>
                              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                <span>{emp.employeeId}</span>
                                <span>·</span>
                                <MapPin className="w-3 h-3" />
                                <span>{emp.location}</span>
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-sm text-foreground">{emp.department}</span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-sm text-foreground">{emp.position}</span>
                        </td>
                        <td className="px-4 py-4">
                          <Badge variant="muted" className="text-xs">
                            {EMP_TYPE_LABELS[emp.employmentType]}
                          </Badge>
                        </td>
                        <td className="px-4 py-4">
                          <span className={statusConf.class}>{statusConf.label}</span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <span className="text-sm font-medium text-foreground">
                            {formatCurrency(emp.salary)}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <span className="text-sm font-semibold text-foreground">{emp.performanceScore}</span>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <div
                                  key={s}
                                  className={`w-2 h-2 rounded-sm mx-0.5 ${
                                    s <= Math.round(emp.performanceScore) ? 'bg-amber-400' : 'bg-muted'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
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

              {filtered.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm font-medium">No employees found</p>
                  <p className="text-xs mt-1">Try adjusting your search or filters</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-border">
              <p className="text-xs text-muted-foreground">
                Showing {filtered.length} of 176 employees
              </p>
              <div className="flex items-center gap-1">
                {[1, 2, 3, '...', 15].map((p, i) => (
                  <button
                    key={i}
                    className={`min-w-[32px] h-8 px-2.5 rounded-lg text-xs font-medium transition-colors ${
                      p === 1
                        ? 'aqua-gradient text-white'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
