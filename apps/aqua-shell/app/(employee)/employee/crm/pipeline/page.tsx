'use client';

import React from 'react';
import { Plus } from 'lucide-react';

interface Deal {
  id: string;
  title: string;
  company: string;
  value: number;
  probability: number;
  daysOpen: number;
}

interface PipelineStage {
  name: string;
  color: string;
  count: number;
  totalValue: number;
  deals: Deal[];
}

const PIPELINE_DATA: PipelineStage[] = [
  {
    name: 'Lead',
    color: '#6366f1',
    count: 24,
    totalValue: 48000,
    deals: [
      { id: '1', title: 'Acme Corp Expansion', company: 'Acme Corp', value: 18000, probability: 15, daysOpen: 3 },
      { id: '2', title: 'BlueSky Migration', company: 'BlueSky Inc', value: 12000, probability: 20, daysOpen: 7 },
      { id: '3', title: 'TerraForm Suite', company: 'TerraForm', value: 9000, probability: 10, daysOpen: 1 },
      { id: '4', title: 'Novex Onboarding', company: 'Novex Systems', value: 9000, probability: 12, daysOpen: 5 },
    ],
  },
  {
    name: 'Qualified',
    color: '#7c3aed',
    count: 15,
    totalValue: 112000,
    deals: [
      { id: '5', title: 'Vertex Enterprise', company: 'Vertex Solutions', value: 45000, probability: 40, daysOpen: 12 },
      { id: '6', title: 'Meridian CRM', company: 'Meridian Retail', value: 38000, probability: 35, daysOpen: 8 },
      { id: '7', title: 'Pacific Group', company: 'Pacific Dynamics', value: 29000, probability: 45, daysOpen: 15 },
    ],
  },
  {
    name: 'Proposal',
    color: '#8b5cf6',
    count: 9,
    totalValue: 89000,
    deals: [
      { id: '8', title: 'DataBridge Pro', company: 'DataBridge', value: 42000, probability: 60, daysOpen: 5 },
      { id: '9', title: 'CloudSync 360', company: 'CloudSync', value: 28000, probability: 55, daysOpen: 9 },
      { id: '10', title: 'Apex Analytics', company: 'Apex Analytics', value: 19000, probability: 65, daysOpen: 3 },
    ],
  },
  {
    name: 'Negotiation',
    color: '#a855f7',
    count: 5,
    totalValue: 74000,
    deals: [
      { id: '11', title: 'Orbit Finance', company: 'Orbit Finance', value: 39000, probability: 75, daysOpen: 14 },
      { id: '12', title: 'Stellar Labs', company: 'Stellar Labs', value: 35000, probability: 80, daysOpen: 6 },
    ],
  },
  {
    name: 'Won',
    color: '#10b981',
    count: 8,
    totalValue: 136000,
    deals: [
      { id: '13', title: 'NorthBridge Tech', company: 'NorthBridge Tech', value: 62000, probability: 100, daysOpen: 0 },
      { id: '14', title: 'Zenith Corp', company: 'Zenith Corp', value: 38000, probability: 100, daysOpen: 0 },
      { id: '15', title: 'FusionOps', company: 'FusionOps', value: 36000, probability: 100, daysOpen: 0 },
    ],
  },
  {
    name: 'Lost',
    color: '#94a3b8',
    count: 3,
    totalValue: 18000,
    deals: [
      { id: '16', title: 'OldWave Inc', company: 'OldWave Inc', value: 10000, probability: 0, daysOpen: 0 },
      { id: '17', title: 'Legacy Co', company: 'Legacy Co', value: 8000, probability: 0, daysOpen: 0 },
    ],
  },
];

const getTotalPipelineValue = () => {
  return PIPELINE_DATA.reduce((sum, stage) => sum + stage.totalValue, 0);
};

const getWinRate = () => {
  return 34;
};

const getProbabilityBarColor = (probability: number): string => {
  if (probability >= 75) return '#10b981';
  if (probability >= 50) return '#6366f1';
  if (probability >= 25) return '#f59e0b';
  return '#ef4444';
};

export default function PipelinePage() {
  return (
    <div className="flex flex-col flex-1">
      {/* Header */}
      <div className="px-8 py-6 border-b border-border bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-md flex items-center justify-center text-white text-[10px] font-bold" style={{ backgroundColor: '#6366f1' }}>
              CR
            </div>
            <h1 className="text-xl font-bold text-foreground">Sales Pipeline</h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
              <p className="text-xs text-muted-foreground">Total Pipeline</p>
              <p className="text-lg font-bold text-foreground">${(getTotalPipelineValue() / 1000).toFixed(0)}k</p>
            </div>
            <div className="flex flex-col items-end">
              <p className="text-xs text-muted-foreground">Win Rate</p>
              <p className="text-lg font-bold text-foreground">{getWinRate()}%</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium shadow-sm hover:opacity-90" style={{ backgroundColor: '#6366f1' }}>
              <Plus size={16} />
              Add Deal
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-x-auto p-8">
        <div className="flex gap-6 min-w-max">
          {PIPELINE_DATA.map((stage) => (
            <div key={stage.name} className="flex-shrink-0 w-96">
              {/* Column Header */}
              <div
                className="px-4 py-3 rounded-t-2xl border-b-4"
                style={{ borderTopColor: stage.color, backgroundColor: '#f9fafb' }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-foreground">{stage.name}</h3>
                  <div className="bg-white px-2 py-1 rounded-full text-xs font-medium text-foreground border border-border">
                    {stage.count}
                  </div>
                </div>
                <p className="text-sm font-bold text-foreground">${(stage.totalValue / 1000).toFixed(0)}k</p>
              </div>

              {/* Deal Cards */}
              <div className="space-y-3 mt-4">
                {stage.deals.map((deal) => (
                  <div key={deal.id} className="bg-white rounded-xl border border-border p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <h4 className="font-semibold text-sm text-foreground mb-1">{deal.title}</h4>
                    <p className="text-xs text-muted-foreground mb-3">{deal.company}</p>

                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-bold text-sm text-foreground">${(deal.value / 1000).toFixed(0)}k</p>
                        <span className="text-xs font-medium text-muted-foreground">{deal.probability}%</span>
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

                    {deal.daysOpen > 0 && (
                      <p className="text-xs text-muted-foreground">Open {deal.daysOpen}d</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
