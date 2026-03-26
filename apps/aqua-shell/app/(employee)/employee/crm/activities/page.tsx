'use client';

import React, { useState } from 'react';
import { Plus, Phone, Mail, Users, CheckSquare, LogOut } from 'lucide-react';

interface Activity {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'task';
  title: string;
  contact: string;
  company: string;
  time: string;
  date: string;
  note?: string;
}

interface UpcomingActivity {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'task';
  title: string;
  contact: string;
  time: string;
}

const ACTIVITIES_DATA: Activity[] = [
  {
    id: '1',
    type: 'call',
    title: 'Call: Vertex Enterprise Demo',
    contact: 'James Okafor',
    company: 'Vertex Solutions',
    time: '2:30 PM',
    date: 'Today',
    note: 'Discussed features and pricing',
  },
  {
    id: '2',
    type: 'email',
    title: 'Email: Proposal sent',
    contact: 'Sarah Mitchell',
    company: 'NorthBridge Tech',
    time: '1:15 PM',
    date: 'Today',
    note: 'DataBridge Pro implementation plan',
  },
  {
    id: '3',
    type: 'task',
    title: 'Task: Follow-up materials',
    contact: 'Priya Nair',
    company: 'Meridian Retail',
    time: '11:00 AM',
    date: 'Today',
  },
  {
    id: '4',
    type: 'meeting',
    title: 'Meeting: CloudSync requirements',
    contact: 'Chris Lundberg',
    company: 'Pacific Dynamics',
    time: '10:30 AM',
    date: 'Today',
    note: 'Technical requirements gathering',
  },
  {
    id: '5',
    type: 'email',
    title: 'Email: Contract review',
    contact: 'Emma Schulz',
    company: 'DataBridge',
    time: '3:45 PM',
    date: 'Yesterday',
  },
  {
    id: '6',
    type: 'call',
    title: 'Call: Budget discussion',
    contact: 'Raj Patel',
    company: 'CloudSync',
    time: '2:00 PM',
    date: 'Yesterday',
    note: 'Approved annual budget',
  },
  {
    id: '7',
    type: 'meeting',
    title: 'Meeting: Steering committee',
    contact: 'Alice Fontaine',
    company: 'Apex Analytics',
    time: '1:30 PM',
    date: 'Yesterday',
  },
  {
    id: '8',
    type: 'task',
    title: 'Task: Update opportunity record',
    contact: 'Mohammed Al-Rashid',
    company: 'Orbit Finance',
    time: '11:15 AM',
    date: 'Yesterday',
  },
  {
    id: '9',
    type: 'email',
    title: 'Email: Thank you note',
    contact: 'Yuki Tanaka',
    company: 'Stellar Labs',
    time: '4:20 PM',
    date: 'March 24',
  },
  {
    id: '10',
    type: 'call',
    title: 'Call: Implementation kickoff',
    contact: 'Carlos Rivera',
    company: 'FusionOps',
    time: '3:00 PM',
    date: 'March 24',
    note: 'Project timeline confirmed',
  },
  {
    id: '11',
    type: 'meeting',
    title: 'Meeting: Executive alignment',
    contact: 'Lisa Wong',
    company: 'Zenith Corp',
    time: '2:30 PM',
    date: 'March 24',
  },
  {
    id: '12',
    type: 'task',
    title: 'Task: Prepare quarterly review',
    contact: 'Derek Thomson',
    company: 'OldWave Inc',
    time: '10:00 AM',
    date: 'March 24',
  },
  {
    id: '13',
    type: 'email',
    title: 'Email: Status update',
    contact: 'Sophia Martinez',
    company: 'TerraForm',
    time: '5:00 PM',
    date: 'March 23',
  },
  {
    id: '14',
    type: 'call',
    title: 'Call: Renewal discussion',
    contact: 'Aditya Verma',
    company: 'Acme Corp',
    time: '2:15 PM',
    date: 'March 23',
  },
  {
    id: '15',
    type: 'meeting',
    title: 'Meeting: Product demo',
    contact: 'Rachel Green',
    company: 'BlueSky Inc',
    time: '1:45 PM',
    date: 'March 23',
  },
  {
    id: '16',
    type: 'task',
    title: 'Task: Send contract',
    contact: 'Michael Chen',
    company: 'Novex Systems',
    time: '11:30 AM',
    date: 'March 23',
  },
  {
    id: '17',
    type: 'email',
    title: 'Email: Project brief',
    contact: 'Isabella Romano',
    company: 'Legacy Co',
    time: '4:00 PM',
    date: 'March 22',
  },
  {
    id: '18',
    type: 'call',
    title: 'Call: Technical discussion',
    contact: 'David Park',
    company: 'OldWave Inc',
    time: '3:30 PM',
    date: 'March 22',
  },
  {
    id: '19',
    type: 'meeting',
    title: 'Meeting: Pipeline review',
    contact: 'Natasha Volkova',
    company: 'BlueSky Inc',
    time: '2:00 PM',
    date: 'March 22',
  },
  {
    id: '20',
    type: 'task',
    title: 'Task: Proposal revisions',
    contact: 'Marcus Johnson',
    company: 'CloudSync',
    time: '10:45 AM',
    date: 'March 22',
  },
];

const UPCOMING_ACTIVITIES: UpcomingActivity[] = [
  { id: '1', type: 'call', title: 'Call: Orbit Finance Q2 Planning', contact: 'Mohammed Al-Rashid', time: '10:00 AM' },
  { id: '2', type: 'meeting', title: 'Meeting: Apex Analytics onboarding', contact: 'Alice Fontaine', time: '1:30 PM' },
  { id: '3', type: 'email', title: 'Email: Send contract to Stellar Labs', contact: 'Yuki Tanaka', time: '3:00 PM' },
  { id: '4', type: 'call', title: 'Call: CloudSync renewal discussion', contact: 'Raj Patel', time: '11:00 AM' },
  { id: '5', type: 'task', title: 'Task: Update CRM records', contact: 'Internal', time: '2:30 PM' },
];

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'call':
      return <Phone size={18} />;
    case 'email':
      return <Mail size={18} />;
    case 'meeting':
      return <Users size={18} />;
    case 'task':
      return <CheckSquare size={18} />;
    default:
      return <LogOut size={18} />;
  }
};

const getActivityColor = (type: string) => {
  switch (type) {
    case 'call':
      return '#3b82f6';
    case 'email':
      return '#6366f1';
    case 'meeting':
      return '#10b981';
    case 'task':
      return '#f59e0b';
    default:
      return '#6b7280';
  }
};

const groupActivitiesByDate = (activities: Activity[]) => {
  const grouped: Record<string, Activity[]> = {};
  activities.forEach((activity) => {
    if (!grouped[activity.date]) {
      grouped[activity.date] = [];
    }
    grouped[activity.date].push(activity);
  });
  return grouped;
};

export default function ActivitiesPage() {
  const [activeFilter, setActiveFilter] = useState('All');

  const filterOptions = ['All', 'Calls', 'Emails', 'Meetings', 'Tasks'];

  const filteredActivities = ACTIVITIES_DATA.filter((activity) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Calls') return activity.type === 'call';
    if (activeFilter === 'Emails') return activity.type === 'email';
    if (activeFilter === 'Meetings') return activity.type === 'meeting';
    if (activeFilter === 'Tasks') return activity.type === 'task';
    return true;
  });

  const groupedActivities = groupActivitiesByDate(filteredActivities);
  const dateOrder = ['Today', 'Yesterday', 'March 24', 'March 23', 'March 22'];

  const callCount = ACTIVITIES_DATA.filter((a) => a.type === 'call').length;
  const emailCount = ACTIVITIES_DATA.filter((a) => a.type === 'email').length;
  const meetingCount = ACTIVITIES_DATA.filter((a) => a.type === 'meeting').length;
  const taskCount = ACTIVITIES_DATA.filter((a) => a.type === 'task').length;

  return (
    <div className="flex flex-col flex-1">
      {/* Header */}
      <div className="px-8 py-6 border-b border-border bg-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-md flex items-center justify-center text-white text-[10px] font-bold" style={{ backgroundColor: '#6366f1' }}>
              CR
            </div>
            <h1 className="text-xl font-bold text-foreground">Activities</h1>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium shadow-sm hover:opacity-90" style={{ backgroundColor: '#6366f1' }}>
            <Plus size={16} />
            Log Activity
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2">
          {filterOptions.map((option) => (
            <button
              key={option}
              onClick={() => setActiveFilter(option)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeFilter === option ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-8 space-y-6">
        <div className="grid grid-cols-3 gap-6">
          {/* Left Panel - Activity Feed (60%) */}
          <div className="col-span-2 space-y-6">
            {dateOrder.map((date) => {
              if (!groupedActivities[date]) return null;
              return (
                <div key={date}>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-4">{date}</h3>
                  <div className="space-y-3">
                    {groupedActivities[date].map((activity) => (
                      <div key={activity.id} className="bg-white rounded-2xl border border-border p-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex gap-4">
                          <div
                            className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white"
                            style={{ backgroundColor: getActivityColor(activity.type) }}
                          >
                            {getActivityIcon(activity.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm text-foreground">{activity.title}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {activity.contact} • {activity.company}
                            </p>
                            {activity.note && <p className="text-xs text-muted-foreground mt-2">{activity.note}</p>}
                            <p className="text-xs text-muted-foreground mt-2">{activity.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Panel (40%) */}
          <div className="col-span-1 space-y-6">
            {/* Upcoming Activities Card */}
            <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
              <h3 className="font-semibold text-foreground mb-4">Upcoming</h3>
              <div className="space-y-3">
                {UPCOMING_ACTIVITIES.map((activity) => (
                  <div key={activity.id} className="flex gap-3 pb-3 border-b border-border last:border-b-0 last:pb-0">
                    <div
                      className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white"
                      style={{ backgroundColor: getActivityColor(activity.type) }}
                    >
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-foreground truncate">{activity.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.contact}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity Summary Card */}
            <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
              <h3 className="font-semibold text-foreground mb-4">Activity Summary</h3>
              <p className="text-xs text-muted-foreground mb-4">This week</p>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#3b82f6' }} />
                    <span className="text-sm text-foreground">Calls</span>
                  </div>
                  <span className="font-semibold text-sm text-foreground">{callCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#6366f1' }} />
                    <span className="text-sm text-foreground">Emails</span>
                  </div>
                  <span className="font-semibold text-sm text-foreground">{emailCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#10b981' }} />
                    <span className="text-sm text-foreground">Meetings</span>
                  </div>
                  <span className="font-semibold text-sm text-foreground">{meetingCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#f59e0b' }} />
                    <span className="text-sm text-foreground">Tasks</span>
                  </div>
                  <span className="font-semibold text-sm text-foreground">{taskCount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
