'use client';

import { useState } from 'react';
import { Eye, Download } from 'lucide-react';

interface Invoice {
  id: string;
  number: string;
  client: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
}

const INVOICES: Invoice[] = [
  { id: '1', number: 'INV-1042', client: 'Northbridge Tech', issueDate: 'Mar 1', dueDate: 'Mar 10', amount: 4200, status: 'paid' },
  { id: '2', number: 'INV-1041', client: 'Vertex Solutions', issueDate: 'Mar 5', dueDate: 'Mar 28', amount: 8750, status: 'pending' },
  { id: '3', number: 'INV-1040', client: 'Meridian Retail', issueDate: 'Feb 20', dueDate: 'Mar 5', amount: 1350, status: 'overdue' },
  { id: '4', number: 'INV-1039', client: 'Pacific Dynamics', issueDate: 'Feb 15', dueDate: 'Feb 28', amount: 6100, status: 'paid' },
  { id: '5', number: 'INV-1038', client: 'DataBridge Pro', issueDate: 'Feb 10', dueDate: 'Feb 25', amount: 3800, status: 'paid' },
  { id: '6', number: 'INV-1037', client: 'CloudSync 360', issueDate: 'Feb 1', dueDate: 'Feb 20', amount: 2100, status: 'paid' },
  { id: '7', number: 'INV-1036', client: 'Apex Analytics', issueDate: 'Jan 25', dueDate: 'Feb 10', amount: 5400, status: 'paid' },
  { id: '8', number: 'INV-1035', client: 'Orbit Finance', issueDate: 'Jan 20', dueDate: 'Feb 5', amount: 9200, status: 'paid' },
  { id: '9', number: 'INV-1034', client: 'Stellar Labs', issueDate: 'Jan 15', dueDate: 'Jan 30', amount: 1800, status: 'overdue' },
  { id: '10', number: 'INV-1033', client: 'FusionOps', issueDate: 'Jan 10', dueDate: 'Jan 25', amount: 4500, status: 'paid' },
  { id: '11', number: 'INV-1032', client: 'NorthBridge Tech', issueDate: 'Jan 5', dueDate: 'Jan 20', amount: 7300, status: 'paid' },
  { id: '12', number: 'INV-1031', client: 'Zenith Corp', issueDate: 'Dec 28', dueDate: 'Jan 12', amount: 2900, status: 'paid' },
  { id: '13', number: 'INV-1030', client: 'Acme Corp', issueDate: 'Dec 20', dueDate: 'Jan 5', amount: 3600, status: 'paid' },
  { id: '14', number: 'INV-1029', client: 'BlueSky', issueDate: 'Dec 15', dueDate: 'Dec 30', amount: 1050, status: 'overdue' },
  { id: '15', number: 'INV-1028', client: 'TerraForm', issueDate: 'Dec 10', dueDate: 'Dec 25', amount: 4800, status: 'paid' },
  { id: '16', number: 'INV-1027', client: 'Novex', issueDate: 'Dec 5', dueDate: 'Dec 20', amount: 2200, status: 'pending' },
];

const FILTER_TABS = [
  { label: 'All', value: 'all' },
  { label: 'Paid', value: 'paid' },
  { label: 'Pending', value: 'pending' },
  { label: 'Overdue', value: 'overdue' },
];

export default function InvoicesPage() {
  const [activeTab, setActiveTab] = useState('all');

  const filteredInvoices = INVOICES.filter(inv =>
    activeTab === 'all' || inv.status === activeTab
  );

  const totalInvoiced = INVOICES.reduce((sum, inv) => sum + inv.amount, 0);
  const totalPaid = INVOICES.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0);
  const totalOverdue = INVOICES.filter(inv => inv.status === 'overdue').reduce((sum, inv) => sum + inv.amount, 0);

  const getStatusBadge = (status: string) => {
    const baseClasses = 'inline-block px-3 py-1 rounded-full text-xs font-medium';
    if (status === 'paid') return <span className={`${baseClasses} badge-active`}>Paid</span>;
    if (status === 'pending') return <span className={`${baseClasses} badge-pending`}>Pending</span>;
    if (status === 'overdue') return <span className={`${baseClasses} badge-rejected`}>Overdue</span>;
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="px-8 py-6 border-b border-border bg-white">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-md flex items-center justify-center text-white text-[10px] font-bold" style={{ backgroundColor: '#10b981' }}>BK</div>
          <h1 className="text-xl font-bold text-foreground">Invoices</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
            <div className="text-sm text-muted-foreground font-medium">Total Invoiced</div>
            <div className="text-2xl font-bold text-foreground mt-2">${totalInvoiced.toLocaleString()}</div>
          </div>
          <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
            <div className="text-sm text-muted-foreground font-medium">Paid</div>
            <div className="text-2xl font-bold mt-2" style={{ color: '#10b981' }}>${totalPaid.toLocaleString()}</div>
          </div>
          <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
            <div className="text-sm text-muted-foreground font-medium">Overdue</div>
            <div className="text-2xl font-bold mt-2" style={{ color: '#ef4444' }}>${totalOverdue.toLocaleString()}</div>
          </div>
        </div>

        {/* Filter Tabs & Create Button */}
        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            {FILTER_TABS.map(tab => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  activeTab === tab.value
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab.label} ({tab.value === 'all' ? INVOICES.length : INVOICES.filter(i => i.status === tab.value).length})
              </button>
            ))}
          </div>
          <button
            className="px-4 py-2 rounded-xl text-white font-medium transition hover:opacity-90"
            style={{ backgroundColor: '#10b981' }}
          >
            Create Invoice
          </button>
        </div>

        {/* Invoices Table */}
        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          <table className="w-full data-table">
            <thead>
              <tr className="border-b border-border bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Invoice #</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Client</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Issue Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Due Date</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Status</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map(invoice => (
                <tr key={invoice.id} className="border-b border-border hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm font-mono font-semibold text-foreground">{invoice.number}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{invoice.client}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{invoice.issueDate}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{invoice.dueDate}</td>
                  <td className="px-6 py-4 text-sm font-bold text-foreground text-right">${invoice.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm">{getStatusBadge(invoice.status)}</td>
                  <td className="px-6 py-4 text-sm text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-1.5 hover:bg-gray-100 rounded-lg transition" title="View">
                        <Eye size={18} className="text-gray-600" />
                      </button>
                      <button className="p-1.5 hover:bg-gray-100 rounded-lg transition" title="Download">
                        <Download size={18} className="text-gray-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
