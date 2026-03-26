'use client';

import React from 'react';
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
  Legend,
} from 'recharts';

interface Deal {
  dealName: string;
  company: string;
  value: number;
  stage: string;
  probability: number;
}

const REVENUE_DATA = [
  { month: 'Oct', revenue: 89 },
  { month: 'Nov', revenue: 102 },
  { month: 'Dec', revenue: 78 },
  { month: 'Jan', revenue: 115 },
  { month: 'Feb', revenue: 128 },
  { month: 'Mar', revenue: 136 },
];

const WIN_LOSS_DATA = [
  { name: 'Won', value: 34 },
  { name: 'Lost', value: 66 },
];

const PIPELINE_STAGE_DATA = [
  { stage: 'Lead', value: 48 },
  { stage: 'Qualified', value: 112 },
  { stage: 'Proposal', value: 89 },
  { stage: 'Negotiation', value: 74 },
];

const ACTIVITY_DATA = [
  { activity: 'Calls', count: 12 },
  { activity: 'Emails', count: 28 },
  { activity: 'Meetings', count: 5 },
  { activity: 'Tasks', count: 9 },
];

const TOP_DEALS: Deal[] = [
  { dealName: 'NorthBridge Tech', company: 'NorthBridge Tech', value: 62000, stage: 'Won', probability: 100 },
  { dealName: 'Zenith Corp', company: 'Zenith Corp', value: 38000, stage: 'Won', probability: 100 },
  { dealName: 'FusionOps', company: 'FusionOps', value: 36000, stage: 'Won', probability: 100 },
  { dealName: 'Vertex Enterprise', company: 'Vertex Solutions', value: 45000, stage: 'Qualified', probability: 40 },
  { dealName: 'Meridian CRM', company: 'Meridian Retail', value: 38000, stage: 'Qualified', probability: 35 },
];

const STAGE_COLORS: Record<string, string> = {
  Lead: '#6366f1',
  Qualified: '#7c3aed',
  Proposal: '#8b5cf6',
  Negotiation: '#a855f7',
  Won: '#10b981',
  Lost: '#94a3b8',
};

const STAGE_BG_COLORS: Record<string, string> = {
  Lead: 'bg-indigo-50',
  Qualified: 'bg-purple-50',
  Proposal: 'bg-violet-50',
  Negotiation: 'bg-fuchsia-50',
  Won: 'bg-green-50',
  Lost: 'bg-slate-50',
};

const STAGE_TEXT_COLORS: Record<string, string> = {
  Lead: 'text-indigo-700',
  Qualified: 'text-purple-700',
  Proposal: 'text-violet-700',
  Negotiation: 'text-fuchsia-700',
  Won: 'text-green-700',
  Lost: 'text-slate-700',
};

const CustomTooltip = (props: any) => {
  const { active, payload } = props;
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-border rounded-lg shadow-lg">
        <p className="text-xs font-semibold text-foreground">${payload[0].value}k</p>
      </div>
    );
  }
  return null;
};

const CustomPieTooltip = (props: any) => {
  const { active, payload } = props;
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-border rounded-lg shadow-lg">
        <p className="text-xs font-semibold text-foreground">{payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

export default function ReportsPage() {
  return (
    <div className="flex flex-col flex-1">
      {/* Header */}
      <div className="px-8 py-6 border-b border-border bg-white">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-md flex items-center justify-center text-white text-[10px] font-bold" style={{ backgroundColor: '#6366f1' }}>
            CR
          </div>
          <h1 className="text-xl font-bold text-foreground">CRM Reports & Analytics</h1>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-8 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-4">
          <div className="stat-card">
            <p className="text-xs text-muted-foreground mb-1">Won Revenue</p>
            <p className="text-2xl font-bold text-foreground">$136k</p>
            <p className="text-xs text-green-600 mt-1">+22% MoM</p>
          </div>
          <div className="stat-card">
            <p className="text-xs text-muted-foreground mb-1">Win Rate</p>
            <p className="text-2xl font-bold text-foreground">34%</p>
            <p className="text-xs text-green-600 mt-1">+4pp</p>
          </div>
          <div className="stat-card">
            <p className="text-xs text-muted-foreground mb-1">Avg Deal Size</p>
            <p className="text-2xl font-bold text-foreground">$17.2k</p>
            <p className="text-xs text-green-600 mt-1">+$3k</p>
          </div>
          <div className="stat-card">
            <p className="text-xs text-muted-foreground mb-1">Avg Cycle</p>
            <p className="text-2xl font-bold text-foreground">22d</p>
            <p className="text-xs text-green-600 mt-1">-3d</p>
          </div>
        </div>

        {/* Row 1: Revenue Trend + Win/Loss */}
        <div className="grid grid-cols-3 gap-6">
          {/* Revenue Trend */}
          <div className="col-span-2 bg-white rounded-2xl border border-border p-6 shadow-sm">
            <h3 className="font-semibold text-foreground mb-4">Revenue Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={REVENUE_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Win/Loss Pie */}
          <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
            <h3 className="font-semibold text-foreground mb-4">Win / Loss Rate</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={WIN_LOSS_DATA} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value">
                  <Cell fill="#10b981" />
                  <Cell fill="#ef4444" />
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#10b981' }} />
                <span className="text-muted-foreground">Won 34%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#ef4444' }} />
                <span className="text-muted-foreground">Lost 66%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Pipeline by Stage */}
        <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
          <h3 className="font-semibold text-foreground mb-4">Pipeline by Stage</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={PIPELINE_STAGE_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="stage" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" fill="#6366f1" radius={[8, 8, 0, 0]} isAnimationActive={false}>
                {PIPELINE_STAGE_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={STAGE_COLORS[entry.stage] || '#6366f1'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Row 3: Activity Breakdown + Top Deals */}
        <div className="grid grid-cols-2 gap-6">
          {/* Activity Breakdown */}
          <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
            <h3 className="font-semibold text-foreground mb-4">Activity Breakdown</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={ACTIVITY_DATA} layout="vertical" margin={{ top: 10, right: 30, left: 100, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" stroke="#9ca3af" />
                <YAxis dataKey="activity" type="category" stroke="#9ca3af" width={95} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="#6366f1" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Top Deals Table */}
          <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
            <h3 className="font-semibold text-foreground mb-4">Top Deals</h3>
            <div className="space-y-3">
              {TOP_DEALS.map((deal, index) => (
                <div key={index} className="pb-3 border-b border-border last:border-b-0 last:pb-0">
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{deal.dealName}</p>
                      <p className="text-xs text-muted-foreground">{deal.company}</p>
                    </div>
                    <p className="text-sm font-bold text-foreground ml-2">${(deal.value / 1000).toFixed(0)}k</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${STAGE_BG_COLORS[deal.stage]} ${STAGE_TEXT_COLORS[deal.stage]}`}>
                      {deal.stage}
                    </div>
                    <span className="text-xs text-muted-foreground">{deal.probability}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
