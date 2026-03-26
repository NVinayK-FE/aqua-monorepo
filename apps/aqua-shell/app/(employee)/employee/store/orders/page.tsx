'use client';

import { useState } from 'react';
import { Eye, Download } from 'lucide-react';

// Mock order data
const ORDERS_DATA = [
  { id: 'ORD-7821', customer: 'Aisha Patel', items: 3, total: 287.50, payment: 'Visa ****1234', status: 'Delivered', date: '2026-03-24' },
  { id: 'ORD-7820', customer: 'Lucas Schmidt', items: 1, total: 89.99, payment: 'PayPal', status: 'Processing', date: '2026-03-26' },
  { id: 'ORD-7819', customer: 'Fatima Al-Zahra', items: 2, total: 154.25, payment: 'Visa ****5678', status: 'Shipped', date: '2026-03-25' },
  { id: 'ORD-7818', customer: 'Ryan Choi', items: 4, total: 456.75, payment: 'PayPal', status: 'Delivered', date: '2026-03-23' },
  { id: 'ORD-7817', customer: 'Noa Goldstein', items: 1, total: 45.00, payment: 'Visa ****9012', status: 'Cancelled', date: '2026-03-22' },
  { id: 'ORD-7816', customer: 'Isabella Torres', items: 5, total: 678.99, payment: 'Visa ****3456', status: 'Delivered', date: '2026-03-21' },
  { id: 'ORD-7815', customer: 'Mohammed Yusuf', items: 2, total: 195.50, payment: 'PayPal', status: 'Shipped', date: '2026-03-20' },
  { id: 'ORD-7814', customer: 'Emily Chen', items: 3, total: 328.75, payment: 'Visa ****7890', status: 'Processing', date: '2026-03-26' },
  { id: 'ORD-7813', customer: 'David Nakamura', items: 1, total: 120.00, payment: 'PayPal', status: 'Shipped', date: '2026-03-19' },
  { id: 'ORD-7812', customer: 'Sofia Mendez', items: 2, total: 234.80, payment: 'Visa ****1122', status: 'Delivered', date: '2026-03-18' },
  { id: 'ORD-7811', customer: 'James O\'Brien', items: 4, total: 512.40, payment: 'PayPal', status: 'Processing', date: '2026-03-26' },
  { id: 'ORD-7810', customer: 'Priya Singh', items: 1, total: 89.99, payment: 'Visa ****3344', status: 'Processing', date: '2026-03-26' },
  { id: 'ORD-7809', customer: 'Alex Petrov', items: 3, total: 367.20, payment: 'PayPal', status: 'Shipped', date: '2026-03-17' },
  { id: 'ORD-7808', customer: 'Layla Hassan', items: 2, total: 198.50, payment: 'Visa ****5566', status: 'Delivered', date: '2026-03-16' },
  { id: 'ORD-7807', customer: 'Marcus Williams', items: 5, total: 745.75, payment: 'PayPal', status: 'Delivered', date: '2026-03-15' },
  { id: 'ORD-7806', customer: 'Chloe Martin', items: 1, total: 35.00, payment: 'Visa ****7788', status: 'Shipped', date: '2026-03-14' },
  { id: 'ORD-7805', customer: 'Kenji Yamamoto', items: 3, total: 401.25, payment: 'PayPal', status: 'Delivered', date: '2026-03-13' },
  { id: 'ORD-7804', customer: 'Amira Osman', items: 2, total: 267.99, payment: 'Visa ****9900', status: 'Processing', date: '2026-03-26' },
  { id: 'ORD-7803', customer: 'Bruno Santos', items: 4, total: 589.40, payment: 'PayPal', status: 'Shipped', date: '2026-03-12' },
  { id: 'ORD-7802', customer: 'Hannah Weber', items: 1, total: 72.00, payment: 'Visa ****1133', status: 'Cancelled', date: '2026-03-11' },
  { id: 'ORD-7801', customer: 'Lin Wei', items: 3, total: 334.50, payment: 'PayPal', status: 'Delivered', date: '2026-03-10' },
  { id: 'ORD-7800', customer: 'Noah Anderson', items: 2, total: 156.75, payment: 'Visa ****2244', status: 'Shipped', date: '2026-03-09' },
  { id: 'ORD-7799', customer: 'Yasmin Ali', items: 5, total: 823.99, payment: 'PayPal', status: 'Delivered', date: '2026-03-08' },
  { id: 'ORD-7798', customer: 'Diego Ramirez', items: 1, total: 95.00, payment: 'Visa ****3355', status: 'Cancelled', date: '2026-03-07' },
  { id: 'ORD-7797', customer: 'Sara Johansson', items: 3, total: 445.30, payment: 'PayPal', status: 'Shipped', date: '2026-03-06' },
  { id: 'ORD-7796', customer: 'Aisha Patel', items: 2, total: 212.99, payment: 'Visa ****1234', status: 'Processing', date: '2026-03-26' },
  { id: 'ORD-7795', customer: 'Lucas Schmidt', items: 4, total: 567.50, payment: 'PayPal', status: 'Shipped', date: '2026-03-05' },
  { id: 'ORD-7794', customer: 'Fatima Al-Zahra', items: 1, total: 49.99, payment: 'Visa ****5678', status: 'Delivered', date: '2026-03-04' },
];

// Count orders by status
const getStatusCounts = () => {
  const counts = { All: 0, Processing: 0, Shipped: 0, Delivered: 0, Cancelled: 0 };
  ORDERS_DATA.forEach(order => {
    counts.All++;
    counts[order.status as keyof typeof counts]++;
  });
  return counts;
};

const statusCounts = getStatusCounts();

const getAvatarColor = (name: string) => {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'];
  return colors[name.charCodeAt(0) % colors.length];
};

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

const getStatusBadgeClass = (status: string) => {
  const baseClass = 'inline-block px-3 py-1 rounded-full text-xs font-semibold';
  if (status === 'Processing') return baseClass + ' badge-active';
  if (status === 'Shipped') return baseClass + ' badge-pending';
  if (status === 'Delivered') return baseClass + ' badge-active';
  if (status === 'Cancelled') return baseClass + ' badge-rejected';
  return baseClass;
};

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<'All' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled'>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOrders = ORDERS_DATA.filter(order => {
    const matchesTab = activeTab === 'All' || order.status === activeTab;
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const tabs: Array<'All' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled'> = ['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  return (
    <div className="flex flex-col flex-1">
      {/* Header */}
      <div className="px-8 py-6 border-b border-border bg-white">
        <h1 className="text-xl font-bold text-foreground">Orders</h1>
      </div>

      {/* KPI Cards */}
      <div className="px-8 pt-8 pb-4 space-y-2">
        <div className="grid grid-cols-4 gap-4">
          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total Orders</p>
                <p className="text-2xl font-bold text-foreground mt-2">84</p>
              </div>
              <span className="text-xs font-semibold text-green-600">+8% MoM</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Revenue</p>
                <p className="text-2xl font-bold text-foreground mt-2">$12,400</p>
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Avg Order</p>
                <p className="text-2xl font-bold text-foreground mt-2">$147.6</p>
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Returns</p>
                <p className="text-2xl font-bold text-foreground mt-2">2</p>
              </div>
              <span className="text-xs font-semibold text-red-600">2.4%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-8 space-y-6">
        {/* Filters and Search */}
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search orders by ID or customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
              />
            </div>
            <button style={{ backgroundColor: '#f59e0b' }} className="text-white px-4 py-2 rounded-xl shadow-sm hover:opacity-90 flex items-center gap-2 font-medium text-sm">
              <Download size={16} />
              Export
            </button>
          </div>

          {/* Status Tabs */}
          <div className="flex gap-2 border-b border-border overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-amber-500 text-foreground'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab} ({statusCounts[tab]})
              </button>
            ))}
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          <table className="w-full data-table">
            <thead>
              <tr className="border-b border-border bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-semibold text-foreground">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-foreground">Customer</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-foreground">Items</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-foreground">Total</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-foreground">Payment</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-foreground">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-foreground">Date</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-foreground">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredOrders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-sm font-semibold text-foreground">{order.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: getAvatarColor(order.customer) }}
                      >
                        {getInitials(order.customer)}
                      </div>
                      <span className="text-sm font-medium text-foreground">{order.customer}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-foreground">{order.items}</td>
                  <td className="px-6 py-4 text-right text-sm font-bold text-foreground">${order.total.toFixed(2)}</td>
                  <td className="px-6 py-4 text-xs text-muted-foreground">{order.payment}</td>
                  <td className="px-6 py-4">
                    <span className={getStatusBadgeClass(order.status)}>
                      {order.status === 'Processing' && '🔄 Processing'}
                      {order.status === 'Shipped' && '📦 Shipped'}
                      {order.status === 'Delivered' && '✓ Delivered'}
                      {order.status === 'Cancelled' && '✕ Cancelled'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{order.date}</td>
                  <td className="px-6 py-4 text-center">
                    <button className="text-amber-600 hover:text-amber-700 p-1">
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No orders found matching your criteria.</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .stat-card {
          background-color: white;
          border: 1px solid #e5e7eb;
          border-radius: 1rem;
          padding: 1.5rem;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }

        .badge-active {
          background-color: #dcfce7;
          color: #166534;
        }

        .badge-pending {
          background-color: #dbeafe;
          color: #0c4a6e;
        }

        .badge-rejected {
          background-color: #fee2e2;
          color: #991b1b;
        }

        .data-table tbody tr {
          border-color: #e5e7eb;
        }
      `}</style>
    </div>
  );
}
