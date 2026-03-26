'use client';

import React, { useState } from 'react';
import { Plus, Search, ChevronDown } from 'lucide-react';

interface Deal {
  id: string;
  name: string;
  company: string;
  value: number;
  stage: string;
  probability: number;
  owner: string;
  ownerInitial: string;
  closeDate: string;
  daysOpen: number;
}

const DEALS_DATA: Deal[] = [
  { id: '1', name: 'Acme Corp Expansion', company: 'Acme Corp', value: 18000, stage: 'Lead', probability: 15, owner: 'John Smith', ownerInitial: 'JS', closeDate: 'Apr 15', daysOpen: 3 },
  { id: '2', name: 'BlueSky Migration', company: 'BlueSky Inc', value: 12000, stage: 'Lead', probability: 20, owner: 'Sarah Chen', ownerInitial: 'SC', closeDate: 'Apr 20', daysOpen: 7 },
  { id: '3', name: 'TerraForm Suite', company: 'TerraForm', value: 9000, stage: 'Lead', probability: 10, owner: 'Mike Davis', ownerInitial: 'MD', closeDate: 'Apr 22', daysOpen: 1 },
  { id: '4', name: 'Novex Onboarding', company: 'Novex Systems', value: 9000, stage: 'Lead', probability: 12, owner: 'Laura Wilson', ownerInitial: 'LW', closeDate: 'Apr 18', daysOpen: 5 },
  { id: '5', name: 'Vertex Enterprise', company: 'Vertex Solutions', value: 45000, stage: 'Qualified', probability: 40, owner: 'John Smith', ownerInitial: 'JS', closeDate: 'May 1', daysOpen: 12 },
  { id: '6', name: 'Meridian CRM', company: 'Meridian Retail', value: 38000, stage: 'Qualified', probability: 35, owner: 'Sarah Chen', ownerInitial: 'SC', closeDate: 'May 5', daysOpen: 8 },
  { id: '7', name: 'Pacific Group', company: 'Pacific Dynamics', value: 29000, stage: 'Qualified', probability: 45, owner: 'Mike Davis', ownerInitial: 'MD', closeDate: 'May 2', daysOpen: 15 },
  { id: '8', name: 'DataBridge Pro', company: 'DataBridge', value: 42000, stage: 'Proposal', probability: 60, owner: 'Laura Wilson', ownerInitial: 'LW', closeDate: 'Apr 28', daysOpen: 5 },
  { id: '9', name: 'CloudSync 360', company: 'CloudSync', value: 28000, stage: 'Proposal', probability: 55, owner: 'John Smith', ownerInitial: 'JS', closeDate: 'May 3', daysOpen: 9 },
  { id: '10', name: 'Apex Analytics', company: 'Apex Analytics', value: 19000, stage: 'Proposal', probability: 65, owner: 'Sarah Chen', ownerInitial: 'SC', closeDate: 'Apr 25', daysOpen: 3 },
  { id: '11', name: 'Orbit Finance', company: 'Orbit Finance', value: 39000, stage: 'Negotiation', probability: 75, owner: 'Mike Davis', ownerInitial: 'MD', closeDate: 'Apr 30', daysOpen: 14 },
  { id: '12', name: 'Stellar Labs', company: 'Stellar Labs', value: 35000, stage: 'Negotiation', probability: 80, owner: 'Laura Wilson', ownerInitial: 'LW', closeDate: 'Apr 27', daysOpen: 6 },
  { id: '13', name: 'NorthBridge Tech', company: 'NorthBridge Tech', value: 62000, stage: 'Won', probability: 100, owner: 'John Smith', ownerInitial: 'JS', closeDate: 'Mar 20', daysOpen: 45 },
  { id: '14', name: 'Zenith Corp', company: 'Zenith Corp', value: 38000, stage: 'Won', probability: 100, owner: 'Sarah Chen', ownerInitial: 'SC', closeDate: 'Mar 18', daysOpen: 52 },
  { id: '15', name: 'FusionOps', company: 'FusionOps', value: 36000, stage: 'Won', probability: 100, owner: 'Mike Davis', ownerInitial: 'MD', closeDate: 'Mar 15', daysOpen: 58 },
  { id: '16', name: 'OldWave Inc', company: 'OldWave Inc', value: 10000, stage: 'Lost', probability: 0, owner: 'Laura Wilson', ownerInitial: 'LW', closeDate: 'Feb 28', daysOpen: 89 },
  { id: '17', name: 'Legacy Co', company: 'Legacy Co', value: 8000, stage: 'Lost', probability: 0, owner: 'John Smith', ownerInitial: 'JS', closeDate: 'Feb 25', daysOpen: 95 },
  { id: '18', name: 'Sprint Analytics', company: 'Sprint Corp', value: 24000, stage: 'Lead', probability: 18, owner: 'Sarah Chen', ownerInitial: 'SC', closeDate: 'Apr 19', daysOpen: 4 },
  { id: '19', name: 'Quantum Solutions', company: 'Quantum Inc', value: 52000, stage: 'Qualified', probability: 42, owner: 'Mike Davis', ownerInitial: 'MD', closeDate: 'May 4', daysOpen: 10 },
  { id: '20', name: 'Velocity Platform', company: 'Velocity Tech', value: 31000, stage: 'Proposal', probability: 58, owner: 'Laura Wilson', ownerInitial: 'LW', closeDate: 'Apr 26', daysOpen: 8 },
  { id: '21', name: 'Horizon Ventures', company: 'Horizon Corp', value: 47000, stage: 'Negotiation', probability: 72, owner: 'John Smith', ownerInitial: 'JS', closeDate: 'May 1', daysOpen: 11 },
  { id: '22', name: 'Pinnacle Services', company: 'Pinnacle Inc', value: 55000, stage: 'Won', probability: 100, owner: 'Sarah Chen', ownerInitial: 'SC', closeDate: 'Mar 22', daysOpen: 40 },
  { id: '23', name: 'Axiom Global', company: 'Axiom LLC', value: 15000, stage: 'Lead', probability: 22, owner: 'Mike Davis', ownerInitial: 'MD', closeDate: 'Apr 21', daysOpen: 2 },
  { id: '24', name: 'Prism Consulting', company: 'Prism Group', value: 26000, stage: 'Proposal', probability: 62, owner: 'Laura Wilson', ownerInitial: 'LW', closeDate: 'Apr 29', daysOpen: 7 },
  { id: '25', name: 'Nexus Dynamics', company: 'Nexus Corp', value: 21000, stage: 'Qualified', probability: 38, owner: 'John Smith', ownerInitial: 'JS', closeDate: 'May 6', daysOpen: 13 },
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

const getProbabilityBarColor = (probability: number): string => {
  if (probability >= 75) return '#10b981';
  if (probability >= 50) return '#6366f1';
  if (probability >= 25) return '#f59e0b';
  return '#ef4444';
};

export default function DealsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState('All Stages');

  const stages = ['All Stages', 'Lead', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost'];

  const filteredDeals = DEALS_DATA.filter((deal) => {
    const matchesSearch =
      deal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.company.toLowerCase().includes(searchQuery.toLowerCase());

    if (stageFilter === 'All Stages') return matchesSearch;
    return matchesSearch && deal.stage === stageFilter;
  });

  const sortedDeals = [...filteredDeals].sort((a, b) => b.value - a.value);

  const openDeals = DEALS_DATA.filter((d) => d.stage !== 'Won' && d.stage !== 'Lost');
  const wonDeals = DEALS_DATA.filter((d) => d.stage === 'Won');
  const openValue = openDeals.reduce((sum, d) => sum + d.value, 0);
  const wonValue = wonDeals.reduce((sum, d) => sum + d.value, 0);
  const avgDealSize = (openValue / openDeals.length).toFixed(1);

  return (
    <div className="flex flex-col flex-1">
      {/* Header */}
      <div className="px-8 py-6 border-b border-border bg-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-md flex items-center justify-center text-white text-[10px] font-bold" style={{ backgroundColor: '#6366f1' }}>
              CR
            </div>
            <h1 className="text-xl font-bold text-foreground">Deals</h1>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium shadow-sm hover:opacity-90" style={{ backgroundColor: '#6366f1' }}>
            <Plus size={16} />
            New Deal
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              type="text"
              placeholder="Search deals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="relative">
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="appearance-none px-4 py-2 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              {stages.map((stage) => (
                <option key={stage} value={stage}>
                  {stage}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none" size={16} />
          </div>

          <button className="px-4 py-2 border border-border rounded-xl text-sm font-medium text-foreground hover:bg-gray-50">
            Value ↓
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="px-8 pt-6 grid grid-cols-4 gap-4">
        <div className="stat-card">
          <p className="text-xs text-muted-foreground mb-1">Open Deals</p>
          <p className="text-2xl font-bold text-foreground">{openDeals.length}</p>
          <p className="text-xs text-muted-foreground mt-1">${(openValue / 1000).toFixed(0)}k value</p>
        </div>
        <div className="stat-card">
          <p className="text-xs text-muted-foreground mb-1">Won This Month</p>
          <p className="text-2xl font-bold text-foreground">${(wonValue / 1000).toFixed(0)}k</p>
          <p className="text-xs text-muted-foreground mt-1">{wonDeals.length} deals</p>
        </div>
        <div className="stat-card">
          <p className="text-xs text-muted-foreground mb-1">Avg Deal Size</p>
          <p className="text-2xl font-bold text-foreground">${avgDealSize}k</p>
        </div>
        <div className="stat-card">
          <p className="text-xs text-muted-foreground mb-1">Pipeline Coverage</p>
          <p className="text-2xl font-bold text-foreground">2.7x</p>
          <p className="text-xs text-muted-foreground mt-1">of quota</p>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          <table className="w-full data-table">
            <thead className="bg-gray-50 border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground">Deal Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground">Company</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground">Value</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground">Stage</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground">Probability</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground">Owner</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground">Close Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground">Days Open</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sortedDeals.map((deal) => (
                <tr key={deal.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-sm text-foreground">{deal.name}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{deal.company}</td>
                  <td className="px-6 py-4 font-bold text-sm text-foreground">${(deal.value / 1000).toFixed(0)}k</td>
                  <td className="px-6 py-4">
                    <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${STAGE_BG_COLORS[deal.stage]} ${STAGE_TEXT_COLORS[deal.stage]}`}>
                      {deal.stage}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-24">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-foreground">{deal.probability}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full transition-all"
                          style={{
                            width: `${deal.probability}%`,
                            backgroundColor: getProbabilityBarColor(deal.probability),
                          }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">
                        {deal.ownerInitial}
                      </div>
                      <span className="text-sm text-foreground">{deal.owner}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">{deal.closeDate}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{deal.daysOpen}d</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
