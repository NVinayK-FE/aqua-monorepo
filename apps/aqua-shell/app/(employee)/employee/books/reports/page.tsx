'use client';

import { useState } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface ChartDataPoint {
  name: string;
  revenue?: number;
  expenses?: number;
  profit?: number;
}

interface ClientData {
  name: string;
  invoices: number;
  total: number;
  percentage: number;
}

const REVENUE_EXPENSES_DATA: ChartDataPoint[] = [
  { name: 'Oct', revenue: 14200, expenses: 1420 },
  { name: 'Nov', revenue: 16800, expenses: 1680 },
  { name: 'Dec', revenue: 12400, expenses: 1350 },
  { name: 'Jan', revenue: 18900, expenses: 1820 },
  { name: 'Feb', revenue: 19200, expenses: 1790 },
  { name: 'Mar', revenue: 20400, expenses: 1794 },
];

const PROFIT_DATA: ChartDataPoint[] = [
  { name: 'Oct', profit: 12780 },
  { name: 'Nov', profit: 15120 },
  { name: 'Dec', profit: 11050 },
  { name: 'Jan', profit: 17080 },
  { name: 'Feb', profit: 17410 },
  { name: 'Mar', profit: 18606 },
];

const EXPENSE_BREAKDOWN = [
  { name: 'Infrastructure', value: 69 },
  { name: 'Travel', value: 15 },
  { name: 'Software', value: 10 },
  { name: 'Meals', value: 4 },
  { name: 'Supplies', value: 2 },
];

const PIE_COLORS = ['#10b981', '#059669', '#047857', '#065f46', '#064e3b'];

const TOP_CLIENTS: ClientData[] = [
  { name: 'Orbit Finance', invoices: 3, total: 9200, percentage: 45.1 },
  { name: 'Vertex Solutions', invoices: 1, total: 8750, percentage: 42.9 },
  { name: 'Pacific Dynamics', invoices: 2, total: 6100, percentage: 29.9 },
  { name: 'Apex Analytics', invoices: 1, total: 5400, percentage: 26.5 },
  { name: 'FusionOps', invoices: 1, total: 4500, percentage: 22.1 },
];

export default function ReportsPage() {
  const [activePeriod, setActivePeriod] = useState('month');

  const periods = [
    { label: 'This Month', value: 'month' },
    { label: 'Last 3 Months', value: '3m' },
    { label: 'This Year', value: 'year' },
    { label: 'Custom', value: 'custom' },
  ];

  const grossRevenue = 20400;
  const operatingExpenses = 1794;
  const netProfit = 18606;
  const profitMargin = 91.2;

  return (
    <div className="flex flex-col flex-1">
      <div className="px-8 py-6 border-b border-border bg-white">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-md flex items-center justify-center text-white text-[10px] font-bold" style={{ backgroundColor: '#10b981' }}>BK</div>
          <h1 className="text-xl font-bold text-foreground">Reports</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-6">
        {/* Period Selector */}
        <div className="flex gap-3">
          {periods.map(period => (
            <button
              key={period.value}
              onClick={() => setActivePeriod(period.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                activePeriod === period.value
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-4">
          <div className="stat-card">
            <div className="text-sm text-muted-foreground font-medium">Gross Revenue</div>
            <div className="text-2xl font-bold text-foreground mt-2">${grossRevenue.toLocaleString()}</div>
            <div className="text-xs text-green-600 font-medium mt-1">+18% YoY</div>
          </div>
          <div className="stat-card">
            <div className="text-sm text-muted-foreground font-medium">Operating Expenses</div>
            <div className="text-2xl font-bold text-foreground mt-2">${operatingExpenses.toLocaleString()}</div>
            <div className="text-xs text-green-600 font-medium mt-1">-5%</div>
          </div>
          <div className="stat-card">
            <div className="text-sm text-muted-foreground font-medium">Net Profit</div>
            <div className="text-2xl font-bold text-foreground mt-2">${netProfit.toLocaleString()}</div>
            <div className="text-xs text-green-600 font-medium mt-1">+21%</div>
          </div>
          <div className="stat-card">
            <div className="text-sm text-muted-foreground font-medium">Profit Margin</div>
            <div className="text-2xl font-bold text-foreground mt-2">{profitMargin}%</div>
            <div className="text-xs text-green-600 font-medium mt-1">+2.1pp</div>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-3 gap-6">
          {/* Revenue vs Expenses */}
          <div className="col-span-2 bg-white rounded-2xl border border-border p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-foreground mb-4">Revenue vs Expenses</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={REVENUE_EXPENSES_DATA}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  name="Revenue"
                />
                <Area
                  type="monotone"
                  dataKey="expenses"
                  stroke="#f43f5e"
                  fillOpacity={1}
                  fill="url(#colorExpenses)"
                  name="Expenses"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Expense Breakdown Pie */}
          <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-foreground mb-4">Expense Breakdown</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={EXPENSE_BREAKDOWN}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {EXPENSE_BREAKDOWN.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Profit Chart */}
        <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-foreground mb-4">Monthly Profit Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={PROFIT_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="profit" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Charts Row 3 */}
        <div className="grid grid-cols-2 gap-6">
          {/* Top Clients */}
          <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-foreground mb-4">Top Clients by Revenue</h3>
            <div className="space-y-4">
              {TOP_CLIENTS.map((client, idx) => (
                <div key={idx} className="flex items-center justify-between pb-4 border-b border-border last:pb-0 last:border-b-0">
                  <div>
                    <div className="text-sm font-medium text-foreground">{client.name}</div>
                    <div className="text-xs text-muted-foreground">{client.invoices} invoice{client.invoices > 1 ? 's' : ''}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-foreground">${client.total.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">{client.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tax Summary */}
          <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-foreground mb-4">Tax Summary</h3>
            <div className="space-y-4">
              <div className="pb-4 border-b border-border">
                <div className="text-sm text-muted-foreground mb-1">Taxable Income</div>
                <div className="text-2xl font-bold text-foreground">${netProfit.toLocaleString()}</div>
              </div>
              <div className="pb-4 border-b border-border">
                <div className="text-sm text-muted-foreground mb-1">Estimated Tax (25%)</div>
                <div className="text-2xl font-bold" style={{ color: '#f59e0b' }}>
                  ${Math.round(netProfit * 0.25).toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Net After Tax</div>
                <div className="text-2xl font-bold" style={{ color: '#10b981' }}>
                  ${Math.round(netProfit * 0.75).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .stat-card {
          background-color: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 1rem;
          padding: 1.5rem;
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        }
      `}</style>
    </div>
  );
}
