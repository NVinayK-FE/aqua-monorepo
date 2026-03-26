'use client';

import { useState } from 'react';
import { FileText, Receipt, Trash2 } from 'lucide-react';

interface ApprovalItem {
  id: string;
  type: 'expense' | 'invoice';
  title: string;
  submittedBy: string;
  amount: number;
  category: string;
  note: string;
  dateSubmitted: string;
}

interface HistoryItem {
  id: string;
  type: 'expense' | 'invoice';
  title: string;
  amount: number;
  submittedBy: string;
  dateSubmitted: string;
  decidedBy: string;
  decision: 'Approved' | 'Rejected';
}

const PENDING_ITEMS: ApprovalItem[] = [
  {
    id: '1',
    type: 'expense',
    title: 'NYC Business Trip - Flight',
    submittedBy: 'Alex Thompson',
    amount: 480,
    category: 'Travel',
    note: 'Client meeting at HQ',
    dateSubmitted: '2 hours ago',
  },
  {
    id: '2',
    type: 'expense',
    title: 'Adobe Creative Suite',
    submittedBy: 'Sarah Chen',
    amount: 89,
    category: 'Software',
    note: 'Annual renewal',
    dateSubmitted: '4 hours ago',
  },
  {
    id: '3',
    type: 'expense',
    title: 'Client Dinner - Meridian',
    submittedBy: 'Tom Anderson',
    amount: 215,
    category: 'Meals',
    note: 'Closed deal dinner',
    dateSubmitted: '6 hours ago',
  },
  {
    id: '4',
    type: 'invoice',
    title: 'Consulting Services - Q1',
    submittedBy: 'Emma Schulz',
    amount: 4200,
    category: 'Invoice',
    note: 'March retainer',
    dateSubmitted: '8 hours ago',
  },
  {
    id: '5',
    type: 'expense',
    title: 'Office Chair Ergonomic',
    submittedBy: 'James Park',
    amount: 345,
    category: 'Supplies',
    note: 'WFH equipment',
    dateSubmitted: '1 day ago',
  },
  {
    id: '6',
    type: 'expense',
    title: 'Conference Registration',
    submittedBy: 'Priya Nair',
    amount: 850,
    category: 'Travel',
    note: 'TechCrunch 2026',
    dateSubmitted: '1 day ago',
  },
  {
    id: '7',
    type: 'expense',
    title: 'Zoom Pro Annual',
    submittedBy: 'Carlos Rivera',
    amount: 180,
    category: 'Software',
    note: 'Team license',
    dateSubmitted: '2 days ago',
  },
  {
    id: '8',
    type: 'invoice',
    title: 'Design Retainer March',
    submittedBy: 'Alice Kim',
    amount: 2800,
    category: 'Invoice',
    note: '',
    dateSubmitted: '2 days ago',
  },
];

const HISTORY_ITEMS: HistoryItem[] = [
  { id: '1', type: 'expense', title: 'AWS Cloud Services', amount: 1240, submittedBy: 'Tom Davis', dateSubmitted: '3 days ago', decidedBy: 'You', decision: 'Approved' },
  { id: '2', type: 'invoice', title: 'Design Services', amount: 3500, submittedBy: 'Lisa Chen', dateSubmitted: '4 days ago', decidedBy: 'Finance Manager', decision: 'Approved' },
  { id: '3', type: 'expense', title: 'Team Lunch', amount: 125, submittedBy: 'Mike Johnson', dateSubmitted: '5 days ago', decidedBy: 'You', decision: 'Rejected' },
  { id: '4', type: 'expense', title: 'Hotel NYC', amount: 380, submittedBy: 'Sarah Wilson', dateSubmitted: '6 days ago', decidedBy: 'You', decision: 'Approved' },
  { id: '5', type: 'invoice', title: 'Dev Work - Sprint 5', amount: 5200, submittedBy: 'Emma Brown', dateSubmitted: '1 week ago', decidedBy: 'Finance Manager', decision: 'Approved' },
  { id: '6', type: 'expense', title: 'Office Supplies', amount: 65, submittedBy: 'John Smith', dateSubmitted: '1 week ago', decidedBy: 'You', decision: 'Rejected' },
  { id: '7', type: 'expense', title: 'Flight to SF', amount: 620, submittedBy: 'Rachel Green', dateSubmitted: '1 week ago', decidedBy: 'You', decision: 'Approved' },
  { id: '8', type: 'invoice', title: 'Marketing Campaign', amount: 8900, submittedBy: 'David Lee', dateSubmitted: '2 weeks ago', decidedBy: 'Finance Manager', decision: 'Approved' },
  { id: '9', type: 'expense', title: 'Slack Pro', amount: 12, submittedBy: 'Chris Park', dateSubmitted: '2 weeks ago', decidedBy: 'You', decision: 'Approved' },
  { id: '10', type: 'expense', title: 'Internet Bill', amount: 89, submittedBy: 'Alex Turner', dateSubmitted: '2 weeks ago', decidedBy: 'Finance Manager', decision: 'Approved' },
  { id: '11', type: 'invoice', title: 'Consulting - Tax Planning', amount: 1500, submittedBy: 'Nina Patel', dateSubmitted: '3 weeks ago', decidedBy: 'You', decision: 'Rejected' },
  { id: '12', type: 'expense', title: 'GitHub Pro', amount: 21, submittedBy: 'Oscar Martinez', dateSubmitted: '3 weeks ago', decidedBy: 'You', decision: 'Approved' },
];

const CATEGORY_COLORS: Record<string, string> = {
  Infrastructure: '#6366f1',
  Travel: '#3b82f6',
  Meals: '#f97316',
  Software: '#a855f7',
  Supplies: '#64748b',
  Invoice: '#10b981',
  Other: '#9ca3af',
};

export default function ApprovalsPage() {
  const [activeTab, setActiveTab] = useState('pending');
  const [pendingItems, setPendingItems] = useState(PENDING_ITEMS);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const handleApprove = (id: string) => {
    setRemovingId(id);
    setTimeout(() => {
      setPendingItems(pendingItems.filter(item => item.id !== id));
      setRemovingId(null);
    }, 300);
  };

  const handleReject = (id: string) => {
    setRemovingId(id);
    setTimeout(() => {
      setPendingItems(pendingItems.filter(item => item.id !== id));
      setRemovingId(null);
    }, 300);
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="px-8 py-6 border-b border-border bg-white">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-md flex items-center justify-center text-white text-[10px] font-bold" style={{ backgroundColor: '#10b981' }}>BK</div>
          <h1 className="text-xl font-bold text-foreground">Approvals</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-6">
        {/* Tab Navigation */}
        <div className="flex gap-4 border-b border-border">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
              activeTab === 'pending'
                ? 'border-emerald-600 text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Pending Approvals ({pendingItems.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
              activeTab === 'history'
                ? 'border-emerald-600 text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Approval History ({HISTORY_ITEMS.length})
          </button>
        </div>

        {/* Pending Approvals Tab */}
        {activeTab === 'pending' && (
          <div className="space-y-4">
            {pendingItems.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-muted-foreground">No pending approvals</div>
              </div>
            ) : (
              pendingItems.map(item => (
                <div
                  key={item.id}
                  className={`bg-white rounded-2xl border border-border p-6 shadow-sm flex items-center justify-between transition-all ${
                    removingId === item.id ? 'opacity-50' : 'opacity-100'
                  }`}
                >
                  {/* Left Content */}
                  <div className="flex items-start gap-4 flex-1">
                    {/* Icon */}
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: CATEGORY_COLORS[item.category] + '15' }}
                    >
                      {item.type === 'expense' ? (
                        <Receipt size={24} style={{ color: CATEGORY_COLORS[item.category] }} />
                      ) : (
                        <FileText size={24} style={{ color: CATEGORY_COLORS[item.category] }} />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">
                          Submitted by <span className="font-medium text-foreground">{item.submittedBy}</span>
                        </span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">{item.dateSubmitted}</span>
                      </div>
                      {item.note && (
                        <p className="text-xs text-muted-foreground italic mt-2 line-clamp-2">{item.note}</p>
                      )}
                      <div className="flex gap-2 mt-2">
                        <span
                          className="inline-block px-2.5 py-0.5 rounded-md text-xs font-medium text-white"
                          style={{ backgroundColor: CATEGORY_COLORS[item.category] }}
                        >
                          {item.category}
                        </span>
                        <span className="inline-block px-2.5 py-0.5 rounded-md text-xs font-medium bg-amber-100 text-amber-700">
                          Pending
                        </span>
                      </div>
                    </div>

                    {/* Amount */}
                    <div className="text-right flex-shrink-0">
                      <div className="text-lg font-bold text-foreground">${item.amount.toLocaleString()}</div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 ml-6 flex-shrink-0">
                    <button
                      onClick={() => handleApprove(item.id)}
                      className="px-4 py-2 rounded-xl text-white font-medium transition hover:opacity-90"
                      style={{ backgroundColor: '#10b981' }}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(item.id)}
                      className="px-4 py-2 rounded-xl text-rose-600 font-medium border border-rose-200 bg-rose-50 hover:bg-rose-100 transition"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
            <table className="w-full data-table">
              <thead>
                <tr className="border-b border-border bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Item</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Type</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Submitted By</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Decided By</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Decision</th>
                </tr>
              </thead>
              <tbody>
                {HISTORY_ITEMS.map(item => (
                  <tr key={item.id} className="border-b border-border hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm font-medium text-foreground">{item.title}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="inline-flex items-center gap-1.5">
                        {item.type === 'expense' ? (
                          <Receipt size={16} className="text-blue-600" />
                        ) : (
                          <FileText size={16} className="text-green-600" />
                        )}
                        <span className="capitalize text-gray-600">{item.type}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-right text-foreground">
                      ${item.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">{item.submittedBy}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{item.dateSubmitted}</td>
                    <td className="px-6 py-4 text-sm text-foreground">{item.decidedBy}</td>
                    <td className="px-6 py-4 text-sm">
                      {item.decision === 'Approved' ? (
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium badge-active">
                          Approved
                        </span>
                      ) : (
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium badge-rejected">
                          Rejected
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style jsx>{`
        .badge-active {
          background-color: #ecfdf5;
          color: #047857;
        }
        .badge-rejected {
          background-color: #fef2f2;
          color: #dc2626;
        }
      `}</style>
    </div>
  );
}
