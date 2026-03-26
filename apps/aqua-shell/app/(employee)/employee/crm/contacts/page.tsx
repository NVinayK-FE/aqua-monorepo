'use client';

import React, { useState } from 'react';
import { Plus, Phone, Mail, Search } from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  company: string;
  title: string;
  phone: string;
  email: string;
  status: 'hot' | 'warm' | 'cold';
  lastActivity: string;
  avatar: string;
}

const CONTACTS_DATA: Contact[] = [
  { id: '1', name: 'Sarah Mitchell', company: 'NorthBridge Tech', title: 'VP Sales', phone: '+1 (415) 555-0132', email: 'sarah.m@northbridge.com', status: 'hot', lastActivity: '2 hours ago', avatar: 'SM' },
  { id: '2', name: 'James Okafor', company: 'Vertex Solutions', title: 'CEO', phone: '+1 (415) 555-0143', email: 'james@vertex.com', status: 'warm', lastActivity: '1 day ago', avatar: 'JO' },
  { id: '3', name: 'Priya Nair', company: 'Meridian Retail', title: 'Head of Ops', phone: '+1 (415) 555-0154', email: 'priya.nair@meridian.com', status: 'cold', lastActivity: '5 days ago', avatar: 'PN' },
  { id: '4', name: 'Chris Lundberg', company: 'Pacific Dynamics', title: 'CTO', phone: '+1 (415) 555-0165', email: 'chris.l@pacific.com', status: 'warm', lastActivity: '3 days ago', avatar: 'CL' },
  { id: '5', name: 'Emma Schulz', company: 'DataBridge', title: 'Procurement', phone: '+1 (415) 555-0176', email: 'emma.schulz@databridge.com', status: 'hot', lastActivity: '4 hours ago', avatar: 'ES' },
  { id: '6', name: 'Raj Patel', company: 'CloudSync', title: 'Director', phone: '+1 (415) 555-0187', email: 'raj.patel@cloudsync.com', status: 'warm', lastActivity: '2 days ago', avatar: 'RP' },
  { id: '7', name: 'Alice Fontaine', company: 'Apex Analytics', title: 'COO', phone: '+1 (415) 555-0198', email: 'alice.f@apex.com', status: 'cold', lastActivity: '1 week ago', avatar: 'AF' },
  { id: '8', name: 'Mohammed Al-Rashid', company: 'Orbit Finance', title: 'SVP', phone: '+1 (415) 555-0109', email: 'm.rashid@orbit.com', status: 'hot', lastActivity: '1 hour ago', avatar: 'MA' },
  { id: '9', name: 'Yuki Tanaka', company: 'Stellar Labs', title: 'Product Manager', phone: '+1 (415) 555-0120', email: 'yuki.t@stellar.com', status: 'warm', lastActivity: '6 hours ago', avatar: 'YT' },
  { id: '10', name: 'Carlos Rivera', company: 'FusionOps', title: 'CEO', phone: '+1 (415) 555-0131', email: 'carlos@fusionops.com', status: 'cold', lastActivity: '3 days ago', avatar: 'CR' },
  { id: '11', name: 'Lisa Wong', company: 'Zenith Corp', title: 'CFO', phone: '+1 (415) 555-0142', email: 'lisa.w@zenith.com', status: 'hot', lastActivity: '30 mins ago', avatar: 'LW' },
  { id: '12', name: 'Derek Thomson', company: 'OldWave Inc', title: 'Head of IT', phone: '+1 (415) 555-0153', email: 'derek.t@oldwave.com', status: 'cold', lastActivity: '2 weeks ago', avatar: 'DT' },
  { id: '13', name: 'Sophia Martinez', company: 'TerraForm', title: 'VP Marketing', phone: '+1 (415) 555-0164', email: 'sophia.m@terraform.com', status: 'warm', lastActivity: '4 days ago', avatar: 'SM' },
  { id: '14', name: 'Aditya Verma', company: 'Acme Corp', title: 'Procurement Lead', phone: '+1 (415) 555-0175', email: 'aditya.v@acme.com', status: 'hot', lastActivity: '8 hours ago', avatar: 'AV' },
  { id: '15', name: 'Rachel Green', company: 'BlueSky Inc', title: 'Operations Director', phone: '+1 (415) 555-0186', email: 'rachel.g@bluesky.com', status: 'warm', lastActivity: '1 day ago', avatar: 'RG' },
  { id: '16', name: 'Michael Chen', company: 'Novex Systems', title: 'CIO', phone: '+1 (415) 555-0197', email: 'michael.c@novex.com', status: 'cold', lastActivity: '4 days ago', avatar: 'MC' },
  { id: '17', name: 'Isabella Romano', company: 'Legacy Co', title: 'Director of Sales', phone: '+1 (415) 555-0108', email: 'isabella.r@legacy.com', status: 'warm', lastActivity: '5 days ago', avatar: 'IR' },
  { id: '18', name: 'David Park', company: 'OldWave Inc', title: 'VP Product', phone: '+1 (415) 555-0119', email: 'david.p@oldwave.com', status: 'cold', lastActivity: '1 week ago', avatar: 'DP' },
  { id: '19', name: 'Natasha Volkova', company: 'BlueSky Inc', title: 'Head of Finance', phone: '+1 (415) 555-0130', email: 'natasha.v@bluesky.com', status: 'hot', lastActivity: '2 hours ago', avatar: 'NV' },
  { id: '20', name: 'Marcus Johnson', company: 'CloudSync', title: 'VP Engineering', phone: '+1 (415) 555-0141', email: 'marcus.j@cloudsync.com', status: 'warm', lastActivity: '3 hours ago', avatar: 'MJ' },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'hot':
      return 'badge-active';
    case 'warm':
      return 'badge-pending';
    case 'cold':
      return 'badge-inactive';
    default:
      return 'badge-inactive';
  }
};

const getStatusBgColor = (status: string) => {
  switch (status) {
    case 'hot':
      return 'bg-rose-50';
    case 'warm':
      return 'bg-amber-50';
    case 'cold':
      return 'bg-blue-50';
    default:
      return 'bg-gray-50';
  }
};

const getStatusTextColor = (status: string) => {
  switch (status) {
    case 'hot':
      return 'text-rose-700';
    case 'warm':
      return 'text-amber-700';
    case 'cold':
      return 'text-blue-700';
    default:
      return 'text-gray-700';
  }
};

export default function ContactsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const filterOptions = ['All', 'Hot', 'Warm', 'Cold', 'New'];

  const filteredContacts = CONTACTS_DATA.filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeFilter === 'All') return matchesSearch;
    if (activeFilter === 'Hot') return matchesSearch && contact.status === 'hot';
    if (activeFilter === 'Warm') return matchesSearch && contact.status === 'warm';
    if (activeFilter === 'Cold') return matchesSearch && contact.status === 'cold';
    if (activeFilter === 'New') return matchesSearch;

    return matchesSearch;
  });

  const hotCount = CONTACTS_DATA.filter((c) => c.status === 'hot').length;
  const warmCount = CONTACTS_DATA.filter((c) => c.status === 'warm').length;
  const coldCount = CONTACTS_DATA.filter((c) => c.status === 'cold').length;

  return (
    <div className="flex flex-col flex-1">
      {/* Header */}
      <div className="px-8 py-6 border-b border-border bg-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-md flex items-center justify-center text-white text-[10px] font-bold" style={{ backgroundColor: '#6366f1' }}>
              CR
            </div>
            <h1 className="text-xl font-bold text-foreground">Contacts</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end text-xs">
              <p className="text-muted-foreground">Total Contacts</p>
              <p className="font-bold text-foreground text-base">{CONTACTS_DATA.length}</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium shadow-sm hover:opacity-90" style={{ backgroundColor: '#6366f1' }}>
              <Plus size={16} />
              Add Contact
            </button>
          </div>
        </div>

        {/* Search and Stats */}
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex gap-2">
            {filterOptions.map((option) => (
              <button
                key={option}
                onClick={() => setActiveFilter(option)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeFilter === option
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#f43f5e' }} />
            <span className="text-muted-foreground">{hotCount} Hot</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#f59e0b' }} />
            <span className="text-muted-foreground">{warmCount} Warm</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#3b82f6' }} />
            <span className="text-muted-foreground">{coldCount} Cold</span>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          <table className="w-full data-table">
            <thead className="bg-gray-50 border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground">Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground">Company</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground">Title</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground">Phone</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground">Email</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground">Last Activity</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredContacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">
                        {contact.avatar}
                      </div>
                      <span className="font-medium text-sm text-foreground">{contact.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">{contact.company}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{contact.title}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{contact.phone}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{contact.email}</td>
                  <td className="px-6 py-4">
                    <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusBgColor(contact.status)} ${getStatusTextColor(contact.status)}`}>
                      {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{contact.lastActivity}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors">
                        <Phone size={16} className="text-gray-600" />
                      </button>
                      <button className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors">
                        <Mail size={16} className="text-gray-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
