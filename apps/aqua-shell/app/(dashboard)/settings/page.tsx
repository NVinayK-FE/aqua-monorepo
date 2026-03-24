'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Building2, Bell, Lock, Users, Globe, Palette,
  Mail, Smartphone, Save, ChevronRight, Shield, KeyRound, UserCog,
} from 'lucide-react'

const SETTINGS_SECTIONS = [
  { id: 'organization', label: 'Organization', icon: Building2 },
  { id: 'users', label: 'Users & Roles', icon: Users },
  { id: 'security', label: 'Security & SSO', icon: Lock },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'integrations', label: 'Integrations', icon: Globe },
]

const ROLES = [
  { name: 'Super Admin', description: 'Full access to all HRMS features and settings', users: 2, color: 'bg-violet-100 text-violet-700' },
  { name: 'HR Admin', description: 'Manage employees, payroll, leave, and performance', users: 5, color: 'bg-cyan-100 text-cyan-700' },
  { name: 'Manager', description: 'View team data, approve leave, and performance reviews', users: 18, color: 'bg-emerald-100 text-emerald-700' },
  { name: 'Employee', description: 'View own profile, request leave, view payslips', users: 151, color: 'bg-slate-100 text-slate-700' },
]

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('organization')
  const [notifications, setNotifications] = useState({
    emailPayroll: true,
    emailLeave: true,
    emailPerformance: false,
    smsLeave: false,
    smsPayroll: false,
  })

  return (
    <div className="flex flex-col flex-1">
      <Header title="Settings" subtitle="Configure AQUA HRMS for your organization" />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex gap-6">
          {/* Sidebar nav */}
          <aside className="w-52 flex-shrink-0">
            <nav className="space-y-0.5">
              {SETTINGS_SECTIONS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${activeSection === s.id
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                >
                  <s.icon className="w-4 h-4 flex-shrink-0" />
                  {s.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <div className="flex-1 space-y-4 min-w-0">
            {activeSection === 'organization' && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Organization Profile</CardTitle>
                    <CardDescription>Basic information about your company</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4 pb-4 border-b border-border">
                      <div className="w-16 h-16 rounded-2xl bg-cyan-100 flex items-center justify-center text-2xl flex-shrink-0">
                        🏢
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Company Logo</p>
                        <p className="text-xs text-muted-foreground mt-0.5">PNG, JPG up to 2MB. Recommended 200x200px.</p>
                        <Button variant="outline" size="sm" className="mt-2">Upload Logo</Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { label: 'Company Name', value: 'Acme Corporation', type: 'text' },
                        { label: 'Domain', value: 'acme.aqua-shell.io', type: 'text' },
                        { label: 'Industry', value: 'Technology', type: 'select', options: ['Technology', 'Healthcare', 'Finance', 'Retail', 'Manufacturing'] },
                        { label: 'Company Size', value: '101-500 employees', type: 'select', options: ['1-50', '51-100', '101-500', '501-1000', '1000+'] },
                        { label: 'Headquarters', value: 'San Francisco, CA', type: 'text' },
                        { label: 'Time Zone', value: 'America/Los_Angeles', type: 'text' },
                        { label: 'Currency', value: 'USD ($)', type: 'select', options: ['USD ($)', 'EUR (€)', 'GBP (£)', 'INR (₹)'] },
                        { label: 'Fiscal Year Start', value: 'January', type: 'select', options: ['January', 'April', 'July', 'October'] },
                      ].map((field) => (
                        <div key={field.label}>
                          <label className="block text-xs font-medium text-foreground mb-1.5">{field.label}</label>
                          {field.type === 'select' ? (
                            <select className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-ring">
                              {field.options?.map((o) => (
                                <option key={o} selected={o === field.value}>{o}</option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type="text"
                              defaultValue={field.value}
                              className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-end pt-2">
                      <Button size="sm">
                        <Save className="w-3.5 h-3.5" />
                        Save Changes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {activeSection === 'users' && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Roles & Permissions</CardTitle>
                      <CardDescription>Manage access control for your organization</CardDescription>
                    </div>
                    <Button size="sm">
                      <UserCog className="w-3.5 h-3.5" />
                      Create Role
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {ROLES.map((role) => (
                    <div key={role.name}
                      className="flex items-center gap-4 p-4 rounded-xl border border-border hover:bg-muted/30 transition-colors cursor-pointer">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${role.color}`}>
                        <Shield className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-foreground">{role.name}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${role.color}`}>
                            {role.users} users
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{role.description}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {activeSection === 'security' && (
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Configure authentication and security policies</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { title: 'Two-Factor Authentication', desc: 'Require 2FA for all admin accounts', icon: KeyRound, enabled: true },
                    { title: 'SAML SSO', desc: 'Connect with your identity provider (Okta, Azure AD, Google Workspace)', icon: Shield, enabled: true },
                    { title: 'Session Timeout', desc: 'Automatically sign out inactive users after 30 minutes', icon: Lock, enabled: false },
                    { title: 'IP Whitelist', desc: 'Restrict access to specific IP ranges', icon: Globe, enabled: false },
                  ].map((setting) => (
                    <div key={setting.title}
                      className="flex items-center gap-4 p-4 rounded-xl border border-border">
                      <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                        <setting.icon className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground">{setting.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{setting.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                        <input type="checkbox" defaultChecked={setting.enabled} className="sr-only peer" />
                        <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                      </label>
                    </div>
                  ))}
                  <div className="flex justify-end pt-2">
                    <Button size="sm">
                      <Save className="w-3.5 h-3.5" />
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeSection === 'notifications' && (
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Choose what alerts you receive and how</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <p className="text-sm font-semibold text-foreground">Email Notifications</p>
                    </div>
                    <div className="space-y-2">
                      {[
                        { key: 'emailPayroll', label: 'Payroll processed', desc: 'When payroll run completes' },
                        { key: 'emailLeave', label: 'Leave requests', desc: 'When leave is submitted or approved' },
                        { key: 'emailPerformance', label: 'Performance reviews', desc: 'Review due dates and completions' },
                      ].map((n) => (
                        <div key={n.key} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-foreground">{n.label}</p>
                            <p className="text-xs text-muted-foreground">{n.desc}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox"
                              checked={notifications[n.key as keyof typeof notifications]}
                              onChange={(e) => setNotifications((prev) => ({ ...prev, [n.key]: e.target.checked }))}
                              className="sr-only peer" />
                            <div className="w-9 h-5 bg-muted rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary" />
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button size="sm">
                      <Save className="w-3.5 h-3.5" />
                      Save Preferences
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {(activeSection === 'appearance' || activeSection === 'integrations') && (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="w-12 h-12 rounded-xl bg-muted mx-auto flex items-center justify-center mb-4">
                    {activeSection === 'appearance' ? (
                      <Palette className="w-6 h-6 text-muted-foreground" />
                    ) : (
                      <Globe className="w-6 h-6 text-muted-foreground" />
                    )}
                  </div>
                  <h3 className="text-base font-semibold text-foreground mb-1">
                    {activeSection === 'appearance' ? 'Appearance Settings' : 'Integrations'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {activeSection === 'appearance'
                      ? 'Custom themes and branding coming soon.'
                      : 'Connect with Slack, Google Workspace, Jira, and more. Coming soon.'}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
