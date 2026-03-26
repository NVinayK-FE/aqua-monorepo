'use client';

import { useState } from 'react';
import { Search, Plus, Eye, Mail, X } from 'lucide-react';

// Mock customer data
const CUSTOMERS_DATA = [
  // VIP Customers
  { id: 1, name: 'Emma Richardson', email: 'emma@example.com', phone: '+44 20 7946 0958', location: 'London, UK', country: '🇬🇧', orders: 23, totalSpent: 3240, avgOrder: 141, lastOrder: '2026-03-20', segment: 'VIP' },
  { id: 2, name: 'Carlos Mendes', email: 'carlos@example.com', phone: '+55 11 3149 5000', location: 'São Paulo, BR', country: '🇧🇷', orders: 18, totalSpent: 2180, avgOrder: 121, lastOrder: '2026-03-19', segment: 'VIP' },
  { id: 3, name: 'Yuki Tanaka', email: 'yuki@example.com', phone: '+81 3-1234-5678', location: 'Tokyo, JP', country: '🇯🇵', orders: 15, totalSpent: 1950, avgOrder: 130, lastOrder: '2026-03-21', segment: 'VIP' },
  { id: 4, name: 'Sarah O\'Connor', email: 'sarah@example.com', phone: '+353 1 636 3600', location: 'Dublin, IE', country: '🇮🇪', orders: 12, totalSpent: 1720, avgOrder: 143, lastOrder: '2026-03-18', segment: 'VIP' },
  // Regular Customers
  { id: 5, name: 'David Chen', email: 'david.c@example.com', phone: '+1 415-555-0123', location: 'San Francisco, US', country: '🇺🇸', orders: 8, totalSpent: 980, avgOrder: 122, lastOrder: '2026-03-17', segment: 'Regular' },
  { id: 6, name: 'Sophie Laurent', email: 'sophie@example.com', phone: '+33 1 42 68 53 00', location: 'Paris, FR', country: '🇫🇷', orders: 7, totalSpent: 895, avgOrder: 128, lastOrder: '2026-03-16', segment: 'Regular' },
  { id: 7, name: 'Marco Rossi', email: 'marco@example.com', phone: '+39 06 6789 1234', location: 'Rome, IT', country: '🇮🇹', orders: 9, totalSpent: 1050, avgOrder: 116, lastOrder: '2026-03-15', segment: 'Regular' },
  { id: 8, name: 'Anna Mueller', email: 'anna@example.com', phone: '+49 30 1234 5678', location: 'Berlin, DE', country: '🇩🇪', orders: 6, totalSpent: 750, avgOrder: 125, lastOrder: '2026-03-14', segment: 'Regular' },
  { id: 9, name: 'James Henderson', email: 'james@example.com', phone: '+44 131 555 0123', location: 'Edinburgh, UK', country: '🇬🇧', orders: 10, totalSpent: 1200, avgOrder: 120, lastOrder: '2026-03-13', segment: 'Regular' },
  { id: 10, name: 'Lisa Anderson', email: 'lisa@example.com', phone: '+46 8 1234 5678', location: 'Stockholm, SE', country: '🇸🇪', orders: 5, totalSpent: 650, avgOrder: 130, lastOrder: '2026-03-12', segment: 'Regular' },
  { id: 11, name: 'Michael Zhang', email: 'michael.z@example.com', phone: '+86 10 1234 5678', location: 'Beijing, CN', country: '🇨🇳', orders: 7, totalSpent: 920, avgOrder: 131, lastOrder: '2026-03-11', segment: 'Regular' },
  { id: 12, name: 'Elena Petrov', email: 'elena@example.com', phone: '+7 495 123-45-67', location: 'Moscow, RU', country: '🇷🇺', orders: 8, totalSpent: 1050, avgOrder: 131, lastOrder: '2026-03-10', segment: 'Regular' },
  { id: 13, name: 'Robert Kim', email: 'robert@example.com', phone: '+82 2-1234-5678', location: 'Seoul, KR', country: '🇰🇷', orders: 6, totalSpent: 780, avgOrder: 130, lastOrder: '2026-03-09', segment: 'Regular' },
  { id: 14, name: 'Patricia Gomez', email: 'patricia@example.com', phone: '+1 212-555-0123', location: 'New York, US', country: '🇺🇸', orders: 9, totalSpent: 1150, avgOrder: 127, lastOrder: '2026-03-08', segment: 'Regular' },
  // New Customers
  { id: 15, name: 'Alex Wilson', email: 'alex.w@example.com', phone: '+44 20 1234 5678', location: 'London, UK', country: '🇬🇧', orders: 1, totalSpent: 125, avgOrder: 125, lastOrder: '2026-03-22', segment: 'New' },
  { id: 16, name: 'Jordan Phillips', email: 'jordan@example.com', phone: '+1 310-555-0123', location: 'Los Angeles, US', country: '🇺🇸', orders: 2, totalSpent: 280, avgOrder: 140, lastOrder: '2026-03-21', segment: 'New' },
  { id: 17, name: 'Maya Patel', email: 'maya@example.com', phone: '+91 98765 43210', location: 'Mumbai, IN', country: '🇮🇳', orders: 1, totalSpent: 95, avgOrder: 95, lastOrder: '2026-03-20', segment: 'New' },
  { id: 18, name: 'Lucas Garcia', email: 'lucas@example.com', phone: '+34 91 555 0123', location: 'Madrid, ES', country: '🇪🇸', orders: 2, totalSpent: 230, avgOrder: 115, lastOrder: '2026-03-19', segment: 'New' },
  { id: 19, name: 'Olivia Brown', email: 'olivia@example.com', phone: '+1 617-555-0123', location: 'Boston, US', country: '🇺🇸', orders: 1, totalSpent: 150, avgOrder: 150, lastOrder: '2026-03-18', segment: 'New' },
  { id: 20, name: 'Thomas Schmidt', email: 'thomas@example.com', phone: '+43 1 1234 5678', location: 'Vienna, AT', country: '🇦🇹', orders: 2, totalSpent: 260, avgOrder: 130, lastOrder: '2026-03-17', segment: 'New' },
  // At-Risk Customers
  { id: 21, name: 'Jessica Taylor', email: 'jessica@example.com', phone: '+1 205-555-0123', location: 'Birmingham, US', country: '🇺🇸', orders: 4, totalSpent: 520, avgOrder: 130, lastOrder: '2025-11-15', segment: 'At-Risk' },
  { id: 22, name: 'Christopher Lee', email: 'christopher@example.com', phone: '+1 425-555-0123', location: 'Seattle, US', country: '🇺🇸', orders: 3, totalSpent: 390, avgOrder: 130, lastOrder: '2025-10-22', segment: 'At-Risk' },
  { id: 23, name: 'Rachel Green', email: 'rachel@example.com', phone: '+1 404-555-0123', location: 'Atlanta, US', country: '🇺🇸', orders: 2, totalSpent: 280, avgOrder: 140, lastOrder: '2025-12-05', segment: 'At-Risk' },
  { id: 24, name: 'Kevin Johnson', email: 'kevin@example.com', phone: '+44 121 1234 5678', location: 'Birmingham, UK', country: '🇬🇧', orders: 5, totalSpent: 650, avgOrder: 130, lastOrder: '2025-11-28', segment: 'At-Risk' },
  { id: 25, name: 'Nicole Adams', email: 'nicole@example.com', phone: '+61 2 1234 5678', location: 'Sydney, AU', country: '🇦🇺', orders: 3, totalSpent: 420, avgOrder: 140, lastOrder: '2025-09-14', segment: 'At-Risk' },
];

const SEGMENTS = ['All', 'VIP', 'Regular', 'New', 'At-Risk'];

const getAvatarColor = (name: string) => {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'];
  return colors[name.charCodeAt(0) % colors.length];
};

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

const getSegmentBadgeClass = (segment: string) => {
  const baseClass = 'inline-block px-3 py-1 rounded-full text-xs font-semibold';
  if (segment === 'VIP') return baseClass + ' badge-vip';
  if (segment === 'Regular') return baseClass + ' badge-regular';
  if (segment === 'New') return baseClass + ' badge-new';
  if (segment === 'At-Risk') return baseClass + ' badge-atrisk';
  return baseClass;
};

const getSegmentBadgeLabel = (segment: string) => {
  if (segment === 'VIP') return '👑 VIP';
  if (segment === 'Regular') return '⭐ Regular';
  if (segment === 'New') return '✨ New';
  if (segment === 'At-Risk') return '⚠️ At-Risk';
  return segment;
};

const getRelativeDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date('2026-03-26');
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return `${Math.floor(diffDays / 30)}m ago`;
};

export default function CustomersPage() {
  const [activeSegment, setActiveSegment] = useState<'All' | 'VIP' | 'Regular' | 'New' | 'At-Risk'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<typeof CUSTOMERS_DATA[0] | null>(null);

  const filteredCustomers = CUSTOMERS_DATA.filter(customer => {
    const matchesSegment = activeSegment === 'All' || customer.segment === activeSegment;
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSegment && matchesSearch;
  });

  const stats = {
    total: CUSTOMERS_DATA.length,
    newThisMonth: CUSTOMERS_DATA.filter(c => c.segment === 'New').length,
    avgLTV: Math.round(CUSTOMERS_DATA.reduce((sum, c) => sum + c.totalSpent, 0) / CUSTOMERS_DATA.length),
    repeatRate: Math.round((CUSTOMERS_DATA.filter(c => c.orders > 1).length / CUSTOMERS_DATA.length) * 100),
  };

  return (
    <div className="flex flex-col flex-1">
      {/* Header */}
      <div className="px-8 py-6 border-b border-border bg-white">
        <h1 className="text-xl font-bold text-foreground">Customers</h1>
      </div>

      {/* KPI Cards */}
      <div className="px-8 pt-8 pb-4">
        <div className="grid grid-cols-4 gap-4">
          <div className="stat-card">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total Customers</p>
            <p className="text-2xl font-bold text-foreground mt-2">{stats.total}</p>
          </div>
          <div className="stat-card">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">New This Month</p>
            <p className="text-2xl font-bold text-foreground mt-2">{stats.newThisMonth}</p>
          </div>
          <div className="stat-card">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Avg LTV</p>
            <p className="text-2xl font-bold text-foreground mt-2">${stats.avgLTV}</p>
          </div>
          <div className="stat-card">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Repeat Purchase Rate</p>
            <p className="text-2xl font-bold text-foreground mt-2">{stats.repeatRate}%</p>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-8 space-y-6">
        {/* Controls */}
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search customers by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
              />
              <Search size={16} className="absolute left-3 top-3 text-muted-foreground" />
            </div>
            <button style={{ backgroundColor: '#f59e0b' }} className="text-white px-4 py-2 rounded-xl shadow-sm hover:opacity-90 flex items-center gap-2 font-medium text-sm">
              <Plus size={16} />
              Add Customer
            </button>
          </div>

          {/* Segment Tabs */}
          <div className="flex gap-2 border-b border-border overflow-x-auto">
            {SEGMENTS.map(segment => {
              const count = segment === 'All'
                ? CUSTOMERS_DATA.length
                : CUSTOMERS_DATA.filter(c => c.segment === segment).length;
              return (
                <button
                  key={segment}
                  onClick={() => setActiveSegment(segment as any)}
                  className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeSegment === segment
                      ? 'border-amber-500 text-foreground'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {segment} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Customers Table */}
        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          <table className="w-full data-table">
            <thead>
              <tr className="border-b border-border bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-semibold text-foreground">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-foreground">Location</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-foreground">Orders</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-foreground">Total Spent</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-foreground">Avg Order</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-foreground">Last Order</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-foreground">Segment</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredCustomers.map(customer => (
                <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: getAvatarColor(customer.name) }}
                      >
                        {getInitials(customer.name)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{customer.name}</p>
                        <p className="text-xs text-muted-foreground">{customer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    {customer.country} {customer.location}
                  </td>
                  <td className="px-6 py-4 text-center text-sm font-medium text-foreground">{customer.orders}</td>
                  <td className="px-6 py-4 text-right text-sm font-bold text-foreground">${customer.totalSpent.toFixed(2)}</td>
                  <td className="px-6 py-4 text-right text-sm text-foreground">${customer.avgOrder.toFixed(0)}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{getRelativeDate(customer.lastOrder)}</td>
                  <td className="px-6 py-4">
                    <span className={getSegmentBadgeClass(customer.segment)}>
                      {getSegmentBadgeLabel(customer.segment)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => setSelectedCustomer(customer)}
                        className="text-amber-600 hover:text-amber-700 p-1"
                      >
                        <Eye size={16} />
                      </button>
                      <button className="text-amber-600 hover:text-amber-700 p-1">
                        <Mail size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCustomers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No customers found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Customer Detail Side Panel */}
      {selectedCustomer && (
        <div className="fixed right-0 top-0 bottom-0 w-80 bg-white shadow-xl z-50 flex flex-col border-l border-border">
          {/* Header */}
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <h2 className="font-bold text-foreground">Customer Details</h2>
            <button
              onClick={() => setSelectedCustomer(null)}
              className="text-muted-foreground hover:text-foreground p-1"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Avatar & Basic Info */}
            <div className="text-center space-y-3">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto"
                style={{ backgroundColor: getAvatarColor(selectedCustomer.name) }}
              >
                {getInitials(selectedCustomer.name)}
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{selectedCustomer.name}</h3>
                <p className="text-xs text-muted-foreground">{selectedCustomer.segment}</p>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-3 pb-4 border-b border-border">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Email</p>
                <p className="text-sm text-foreground mt-1">{selectedCustomer.email}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Phone</p>
                <p className="text-sm text-foreground mt-1">{selectedCustomer.phone}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Location</p>
                <p className="text-sm text-foreground mt-1">{selectedCustomer.country} {selectedCustomer.location}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="space-y-3 pb-4 border-b border-border">
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-sm font-bold text-foreground">{selectedCustomer.orders}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">Lifetime Value</p>
                <p className="text-sm font-bold text-foreground">${selectedCustomer.totalSpent}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">Avg Order Value</p>
                <p className="text-sm font-bold text-foreground">${selectedCustomer.avgOrder}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">Last Order</p>
                <p className="text-sm font-semibold text-foreground">{getRelativeDate(selectedCustomer.lastOrder)}</p>
              </div>
            </div>

            {/* Recent Orders */}
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold mb-3">Recent Orders</p>
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="p-3 bg-gray-50 rounded-lg border border-border">
                    <div className="flex justify-between items-center">
                      <p className="text-xs font-mono font-semibold text-foreground">#ORD-{7800 + (selectedCustomer.id * 10) - i}</p>
                      <p className="text-xs font-bold text-foreground">${(100 + i * 20).toFixed(2)}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{i} days ago</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-6 border-t border-border space-y-2">
            <button style={{ backgroundColor: '#f59e0b' }} className="w-full text-white px-4 py-2 rounded-xl shadow-sm hover:opacity-90 flex items-center justify-center gap-2 font-medium text-sm">
              <Mail size={16} />
              Send Email
            </button>
            <button className="w-full text-amber-600 px-4 py-2 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 font-medium text-sm">
              View Full Profile
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .stat-card {
          background-color: white;
          border: 1px solid #e5e7eb;
          border-radius: 1rem;
          padding: 1.5rem;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }

        .badge-vip {
          background-color: #ede9fe;
          color: #6d28d9;
        }

        .badge-regular {
          background-color: #dbeafe;
          color: #0c4a6e;
        }

        .badge-new {
          background-color: #dcfce7;
          color: #166534;
        }

        .badge-atrisk {
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
