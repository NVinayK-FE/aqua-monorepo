'use client';

import { useState } from 'react';
import { Check, X } from 'lucide-react';

interface Expense {
  id: string;
  description: string;
  category: 'Infrastructure' | 'Travel' | 'Meals' | 'Software' | 'Supplies' | 'Other';
  amount: number;
  date: string;
  receipt: boolean;
  status: 'Approved' | 'Pending' | 'Rejected';
}

const EXPENSES: Expense[] = [
  { id: '1', description: 'AWS Cloud Services', category: 'Infrastructure', amount: 1240, date: 'Mar 22', receipt: true, status: 'Approved' },
  { id: '2', description: 'Team Offsite Lunch', category: 'Meals', amount: 320, date: 'Mar 18', receipt: true, status: 'Approved' },
  { id: '3', description: 'Adobe Creative Suite', category: 'Software', amount: 89, date: 'Mar 15', receipt: true, status: 'Pending' },
  { id: '4', description: 'Office Supplies', category: 'Supplies', amount: 145, date: 'Mar 10', receipt: false, status: 'Pending' },
  { id: '5', description: 'Flight to NYC', category: 'Travel', amount: 480, date: 'Mar 8', receipt: true, status: 'Approved' },
  { id: '6', description: 'Hotel (2 nights)', category: 'Travel', amount: 380, date: 'Mar 8', receipt: true, status: 'Approved' },
  { id: '7', description: 'Taxi/Uber', category: 'Travel', amount: 65, date: 'Mar 7', receipt: true, status: 'Pending' },
  { id: '8', description: 'GitHub Pro', category: 'Software', amount: 21, date: 'Mar 5', receipt: true, status: 'Approved' },
  { id: '9', description: 'Client Dinner', category: 'Meals', amount: 215, date: 'Mar 3', receipt: true, status: 'Pending' },
  { id: '10', description: 'Printer Paper', category: 'Supplies', amount: 45, date: 'Mar 1', receipt: false, status: 'Pending' },
  { id: '11', description: 'AWS (Feb)', category: 'Infrastructure', amount: 1180, date: 'Feb 28', receipt: true, status: 'Approved' },
  { id: '12', description: 'Notion Team', category: 'Software', amount: 48, date: 'Feb 25', receipt: true, status: 'Approved' },
  { id: '13', description: 'Conference Ticket', category: 'Travel', amount: 850, date: 'Feb 20', receipt: true, status: 'Approved' },
  { id: '14', description: 'Coffee Meeting', category: 'Meals', amount: 45, date: 'Feb 18', receipt: false, status: 'Rejected' },
  { id: '15', description: 'Zoom Pro', category: 'Software', amount: 15, date: 'Feb 15', receipt: true, status: 'Approved' },
  { id: '16', description: 'Server Hosting', category: 'Infrastructure', amount: 320, date: 'Feb 12', receipt: true, status: 'Approved' },
  { id: '17', description: 'Uber to Client', category: 'Travel', amount: 42, date: 'Feb 10', receipt: true, status: 'Approved' },
  { id: '18', description: 'Team Lunch', category: 'Meals', amount: 125, date: 'Feb 8', receipt: true, status: 'Pending' },
  { id: '19', description: 'Slack Pro', category: 'Software', amount: 12, date: 'Feb 5', receipt: true, status: 'Approved' },
  { id: '20', description: 'Desk Supplies', category: 'Supplies', amount: 67, date: 'Feb 1', receipt: false, status: 'Rejected' },
];

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Infrastructure: { bg: '#eef2ff', text: '#3730a3', border: '#c7d2fe' },
  Travel: { bg: '#eff6ff', text: '#0c4a6e', border: '#bae6fd' },
  Meals: { bg: '#fff7ed', text: '#92400e', border: '#fed7aa' },
  Software: { bg: '#f3e8ff', text: '#6b21a8', border: '#ddd6fe' },
  Supplies: { bg: '#f1f5f9', text: '#475569', border: '#cbd5e1' },
  Other: { bg: '#f3f4f6', text: '#374151', border: '#d1d5db' },
};

export default function ExpensesPage() {
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Infrastructure', 'Travel', 'Meals', 'Software', 'Supplies', 'Other'];

  const filteredExpenses = activeCategory === 'All'
    ? EXPENSES
    : EXPENSES.filter(exp => exp.category === activeCategory);

  const totalThisMonth = EXPENSES.reduce((sum, exp) => sum + exp.amount, 0);
  const approvedTotal = EXPENSES.filter(exp => exp.status === 'Approved').reduce((sum, exp) => sum + exp.amount, 0);
  const pendingTotal = EXPENSES.filter(exp => exp.status === 'Pending').reduce((sum, exp) => sum + exp.amount, 0);

  const categorySpend = categories.slice(1).map(cat => ({
    category: cat,
    amount: EXPENSES.filter(exp => exp.category === cat).reduce((sum, exp) => sum + exp.amount, 0),
  }));

  const getStatusBadge = (status: string) => {
    const baseClasses = 'inline-block px-3 py-1 rounded-full text-xs font-medium';
    if (status === 'Approved') return <span className={`${baseClasses} badge-active`}>Approved</span>;
    if (status === 'Pending') return <span className={`${baseClasses} badge-pending`}>Pending</span>;
    if (status === 'Rejected') return <span className={`${baseClasses} badge-rejected`}>Rejected</span>;
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="px-8 py-6 border-b border-border bg-white">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-md flex items-center justify-center text-white text-[10px] font-bold" style={{ backgroundColor: '#10b981' }}>BK</div>
          <h1 className="text-xl font-bold text-foreground">Expenses</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-6">
        {/* Category Filter & Add Expense */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                  activeCategory === cat
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <button
            className="px-4 py-2 rounded-xl text-white font-medium transition hover:opacity-90"
            style={{ backgroundColor: '#10b981' }}
          >
            Add Expense
          </button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
            <div className="text-sm text-muted-foreground font-medium">Total This Month</div>
            <div className="text-2xl font-bold text-foreground mt-2">${totalThisMonth.toLocaleString()}</div>
          </div>
          <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
            <div className="text-sm text-muted-foreground font-medium">Approved</div>
            <div className="text-2xl font-bold mt-2" style={{ color: '#10b981' }}>${approvedTotal.toLocaleString()}</div>
          </div>
          <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
            <div className="text-sm text-muted-foreground font-medium">Pending Review</div>
            <div className="text-2xl font-bold mt-2" style={{ color: '#f59e0b' }}>${pendingTotal.toLocaleString()}</div>
          </div>
        </div>

        {/* Main Content: Table & Breakdown */}
        <div className="grid grid-cols-3 gap-6">
          {/* Expenses Table */}
          <div className="col-span-2">
            <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
              <table className="w-full data-table">
                <thead>
                  <tr className="border-b border-border bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Category</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Date</th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700">Receipt</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExpenses.map(expense => {
                    const colors = CATEGORY_COLORS[expense.category];
                    return (
                      <tr key={expense.id} className="border-b border-border hover:bg-gray-50 transition">
                        <td className="px-6 py-4 text-sm text-foreground">{expense.description}</td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className="inline-block px-2.5 py-1 rounded-md text-xs font-medium"
                            style={{ backgroundColor: colors.bg, color: colors.text, borderColor: colors.border }}
                          >
                            {expense.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-right" style={{ color: '#ef4444' }}>
                          ${expense.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">{expense.date}</td>
                        <td className="px-6 py-4 text-center">
                          {expense.receipt ? (
                            <Check size={18} className="inline" style={{ color: '#10b981' }} />
                          ) : (
                            <X size={18} className="inline text-gray-400" />
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm">{getStatusBadge(expense.status)}</td>
                        <td className="px-6 py-4 text-sm text-right">
                          <button className="text-blue-600 hover:text-blue-800 font-medium transition">
                            {expense.status === 'Pending' ? 'Submit' : 'Edit'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-foreground mb-4">Spend by Category</h3>
            <div className="space-y-3">
              {categorySpend.map(item => {
                const total = categorySpend.reduce((sum, c) => sum + c.amount, 0);
                const percentage = total > 0 ? (item.amount / total) * 100 : 0;
                const colors = CATEGORY_COLORS[item.category];

                return (
                  <div key={item.category}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs font-medium text-gray-700">{item.category}</span>
                      <span className="text-xs font-semibold text-foreground">${item.amount.toLocaleString()}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full transition-all"
                        style={{ backgroundColor: colors.text, width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{percentage.toFixed(0)}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .badge-active {
          background-color: #ecfdf5;
          color: #047857;
        }
        .badge-pending {
          background-color: #fffbeb;
          color: #b45309;
        }
        .badge-rejected {
          background-color: #fef2f2;
          color: #dc2626;
        }
      `}</style>
    </div>
  );
}
