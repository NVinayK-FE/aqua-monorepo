'use client';

import { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

// Mock analytics data
const REVENUE_DATA = [
  { date: 'Mar 1', revenue: 380 },
  { date: 'Mar 4', revenue: 520 },
  { date: 'Mar 7', revenue: 390 },
  { date: 'Mar 10', revenue: 610 },
  { date: 'Mar 13', revenue: 480 },
  { date: 'Mar 16', revenue: 720 },
  { date: 'Mar 19', revenue: 550 },
  { date: 'Mar 22', revenue: 890 },
  { date: 'Mar 25', revenue: 740 },
  { date: 'Mar 26', revenue: 620 },
];

const TOP_PRODUCTS = [
  { name: 'Laptop Stand', units: 38 },
  { name: 'USB-C Hub', units: 29 },
  { name: 'Aqua Hoodie', units: 27 },
  { name: 'Wireless Charger', units: 24 },
  { name: '4K Webcam', units: 19 },
];

const CATEGORY_DATA = [
  { name: 'Electronics', value: 45 },
  { name: 'Accessories', value: 22 },
  { name: 'Apparel', value: 15 },
  { name: 'Home', value: 12 },
  { name: 'Books', value: 6 },
];

const COUNTRY_DATA = [
  { country: '🇺🇸 USA', orders: 34, revenue: 4820, percentage: 39 },
  { country: '🇬🇧 UK', orders: 18, revenue: 2340, percentage: 19 },
  { country: '🇩🇪 Germany', orders: 12, revenue: 1560, percentage: 13 },
  { country: '🇧🇷 Brazil', orders: 9, revenue: 1170, percentage: 9 },
  { country: '🇯🇵 Japan', orders: 8, revenue: 1040, percentage: 8 },
  { country: 'Others', orders: 3, revenue: 470, percentage: 4 },
];

const FUNNEL_DATA = [
  { step: 'Visitors', count: 2625, percentage: 100 },
  { step: 'Sessions', count: 1840, percentage: 70 },
  { step: 'Product Views', count: 892, percentage: 48.5 },
  { step: 'Add to Cart', count: 312, percentage: 35 },
  { step: 'Checkout', count: 124, percentage: 39.7 },
  { step: 'Purchase', count: 84, percentage: 67.7 },
];

const ORDERS_TREND = [
  { month: 'Oct', orders: 62 },
  { month: 'Nov', orders: 71 },
  { month: 'Dec', orders: 54 },
  { month: 'Jan', orders: 78 },
  { month: 'Feb', orders: 79 },
  { month: 'Mar', orders: 84 },
];

const CATEGORY_COLORS = ['#f59e0b', '#fbbf24', '#fcd34d', '#fef3c7', '#fef9e7'];

const getPeriodLabel = (period: string) => {
  switch(period) {
    case '7d': return 'Last 7 days';
    case '30d': return 'Last 30 days';
    case '90d': return 'Last 90 days';
    case 'year': return 'This Year';
    default: return period;
  }
};

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | 'year'>('30d');

  return (
    <div className="flex flex-col flex-1">
      {/* Header */}
      <div className="px-8 py-6 border-b border-border bg-white flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">Analytics</h1>
        <div className="flex gap-2">
          {['7d', '30d', '90d', 'year'].map(period => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedPeriod === period
                  ? 'bg-amber-100 text-amber-700 border border-amber-300'
                  : 'bg-gray-100 text-muted-foreground hover:bg-gray-200'
              }`}
            >
              {getPeriodLabel(period)}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="px-8 pt-8 pb-4">
        <div className="grid grid-cols-4 gap-4">
          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Revenue</p>
                <p className="text-2xl font-bold text-foreground mt-2">$12,400</p>
              </div>
              <span className="text-xs font-semibold text-green-600">+22% MoM</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Orders</p>
                <p className="text-2xl font-bold text-foreground mt-2">84</p>
              </div>
              <span className="text-xs font-semibold text-green-600">+8%</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Conversion Rate</p>
                <p className="text-2xl font-bold text-foreground mt-2">3.2%</p>
              </div>
              <span className="text-xs font-semibold text-green-600">+0.4pp</span>
            </div>
          </div>
          <div className="stat-card">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Avg Session</p>
              <p className="text-2xl font-bold text-foreground mt-2">4m 32s</p>
              <span className="text-xs font-semibold text-green-600 inline-block mt-2">+12s</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-8 space-y-6">
        {/* Row 1: Revenue Trend (2/3) + Top Products (1/3) */}
        <div className="grid grid-cols-3 gap-6">
          {/* Revenue Trend */}
          <div className="col-span-2 bg-white rounded-2xl border border-border p-6 shadow-sm">
            <h3 className="font-semibold text-foreground mb-4">Revenue Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={REVENUE_DATA}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.75rem',
                  }}
                  formatter={(value) => `$${value}`}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#f59e0b"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
            <h3 className="font-semibold text-foreground mb-4">Top Products</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={TOP_PRODUCTS}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} stroke="#9ca3af" width={115} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.75rem',
                  }}
                  formatter={(value) => `${value} units`}
                />
                <Bar dataKey="units" fill="#f59e0b" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Row 2: Sales by Category (1/3) + Top Countries (1/3) + Conversion Funnel (1/3) */}
        <div className="grid grid-cols-3 gap-6">
          {/* Sales by Category */}
          <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
            <h3 className="font-semibold text-foreground mb-4">Sales by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={CATEGORY_DATA}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {CATEGORY_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Top Countries */}
          <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
            <h3 className="font-semibold text-foreground mb-4">Top Countries</h3>
            <div className="space-y-4">
              {COUNTRY_DATA.map((country, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-foreground">{country.country}</span>
                    <span className="text-xs text-muted-foreground">${country.revenue.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ backgroundColor: '#f59e0b', width: `${country.percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">{country.orders} orders</p>
                </div>
              ))}
            </div>
          </div>

          {/* Conversion Funnel */}
          <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
            <h3 className="font-semibold text-foreground mb-4">Conversion Funnel</h3>
            <div className="space-y-2">
              {FUNNEL_DATA.map((step, idx) => {
                const maxWidth = 100;
                const width = maxWidth * (step.percentage / 100);
                const colors = ['#f59e0b', '#fbbf24', '#fcd34d', '#fde047', '#fef08a', '#fef9e7'];
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-medium text-foreground">{step.step}</span>
                      <span className="text-xs font-semibold text-foreground">{step.percentage.toFixed(1)}%</span>
                    </div>
                    <div
                      className="rounded-lg transition-all"
                      style={{
                        backgroundColor: colors[idx],
                        height: '32px',
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        paddingLeft: '12px',
                      }}
                    >
                      <span className="text-xs font-bold text-amber-900">{step.count.toLocaleString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Row 3: Orders Over Time (Full Width) */}
        <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
          <h3 className="font-semibold text-foreground mb-4">Orders Over Time</h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={ORDERS_TREND}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.75rem',
                }}
                formatter={(value) => `${value} orders`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="orders"
                stroke="#f59e0b"
                strokeWidth={3}
                dot={{ fill: '#f59e0b', r: 6 }}
                activeDot={{ r: 8 }}
                name="Orders"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <style jsx>{`
        .stat-card {
          background-color: white;
          border: 1px solid #e5e7eb;
          border-radius: 1rem;
          padding: 1.5rem;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }
      `}</style>
    </div>
  );
}
