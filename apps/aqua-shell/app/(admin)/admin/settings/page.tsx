'use client'

import { useState } from 'react'
import {
  Settings, Shield, Bell, CreditCard, Key, ClipboardList,
  Save, Eye, EyeOff, Copy, RefreshCw, CheckCircle2, ChevronRight,
  Globe, Lock, Mail, AlertTriangle, Trash2,
} from 'lucide-react'

type TabId = 'general' | 'security' | 'notifications' | 'billing' | 'api' | 'audit'

const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: 'general',       label: 'General',       icon: Settings    },
  { id: 'security',      label: 'Security',       icon: Shield      },
  { id: 'notifications', label: 'Notifications',  icon: Bell        },
  { id: 'billing',       label: 'Billing',        icon: CreditCard  },
  { id: 'api',           label: 'API Keys',        icon: Key         },
  { id: 'audit',         label: 'Audit Log',       icon: ClipboardList },
]

const AUDIT_LOG = [
  { id: 1, actor: 'admin@aquasuite.io', action: 'Suspended tenant',    target: 'Stellar Consulting',   time: '2026-03-24 09:41',  level: 'warn' },
  { id: 2, actor: 'admin@aquasuite.io', action: 'Upgraded plan',       target: 'Apex Logistics → Growth', time: '2026-03-24 09:12', level: 'info' },
  { id: 3, actor: 'admin@aquasuite.io', action: 'Added API key',       target: 'Production v2',        time: '2026-03-23 17:55',  level: 'info' },
  { id: 4, actor: 'system',            action: 'Trial expiry reminder',target: 'Sunrise Education',    time: '2026-03-23 08:00',  level: 'info' },
  { id: 5, actor: 'admin@aquasuite.io', action: 'Deactivated user',    target: 'Olga Petrov',          time: '2026-03-22 14:30',  level: 'warn' },
  { id: 6, actor: 'system',            action: 'Backup completed',     target: 'Full backup 2026-03-22', time: '2026-03-22 03:00', level: 'info' },
  { id: 7, actor: 'admin@aquasuite.io', action: 'Updated pricing',     target: 'Enterprise plan',      time: '2026-03-21 11:15',  level: 'info' },
  { id: 8, actor: 'system',            action: 'Payment failed',       target: 'Stellar Consulting',   time: '2026-03-15 00:00',  level: 'error'},
]

// ─── Sub-sections ─────────────────────────────────────────────────────────────

function GeneralTab() {
  const [saved, setSaved] = useState(false)
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
        <h3 className="font-semibold text-foreground mb-5">Platform Settings</h3>
        <div className="space-y-4 max-w-xl">
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Platform Name</label>
            <input
              defaultValue="AQUA SUITE"
              className="w-full px-4 py-2.5 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Support Email</label>
            <input
              defaultValue="support@aquasuite.io"
              type="email"
              className="w-full px-4 py-2.5 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Default Timezone</label>
            <select className="w-full px-4 py-2.5 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white">
              <option>UTC (Coordinated Universal Time)</option>
              <option>America/New_York (Eastern)</option>
              <option>America/Los_Angeles (Pacific)</option>
              <option>Europe/London (GMT)</option>
              <option>Asia/Singapore (SGT)</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Default Language</label>
            <select className="w-full px-4 py-2.5 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white">
              <option>English (US)</option>
              <option>English (UK)</option>
              <option>German</option>
              <option>French</option>
              <option>Japanese</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
        <h3 className="font-semibold text-foreground mb-5">Trial Settings</h3>
        <div className="space-y-4 max-w-xl">
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Trial Duration (days)</label>
            <input
              defaultValue="14"
              type="number"
              className="w-full px-4 py-2.5 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-foreground">Require credit card for trial</p>
              <p className="text-xs text-muted-foreground">Users must add payment info to start trial</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-10 h-6 bg-muted peer-checked:bg-primary rounded-full transition-colors after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
            </label>
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-foreground">Auto-send expiry reminders</p>
              <p className="text-xs text-muted-foreground">Send emails 3 days before trial ends</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-10 h-6 bg-muted peer-checked:bg-primary rounded-full transition-colors after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={save}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            saved ? 'bg-emerald-500 text-white' : 'aqua-gradient text-white hover:opacity-90'
          }`}
        >
          {saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}

function SecurityTab() {
  const [saved, setSaved] = useState(false)
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
        <h3 className="font-semibold text-foreground mb-5">Authentication</h3>
        <div className="space-y-4">
          {[
            { label: 'Enforce 2FA for all admins',      sub: 'All admin accounts must use two-factor authentication', defaultChecked: true  },
            { label: 'Enforce 2FA for all HR admins',   sub: 'HR admin accounts must use two-factor authentication',  defaultChecked: false },
            { label: 'Allow SSO login',                 sub: 'Enable Single Sign-On via SAML 2.0 or OAuth',           defaultChecked: true  },
            { label: 'Session timeout (inactivity)',    sub: 'Auto-logout after period of inactivity',                 defaultChecked: true  },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between py-3 border-b border-border last:border-0">
              <div>
                <p className="text-sm font-medium text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.sub}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked={item.defaultChecked} className="sr-only peer" />
                <div className="w-10 h-6 bg-muted peer-checked:bg-primary rounded-full transition-colors after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
        <h3 className="font-semibold text-foreground mb-5">Password Policy</h3>
        <div className="space-y-4 max-w-xl">
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Minimum password length</label>
            <input
              defaultValue="12"
              type="number"
              min={8}
              className="w-full px-4 py-2.5 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Password expiry (days, 0 = never)</label>
            <input
              defaultValue="90"
              type="number"
              min={0}
              className="w-full px-4 py-2.5 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Max login attempts before lockout</label>
            <input
              defaultValue="5"
              type="number"
              min={3}
              className="w-full px-4 py-2.5 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={save}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            saved ? 'bg-emerald-500 text-white' : 'aqua-gradient text-white hover:opacity-90'
          }`}
        >
          {saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}

function NotificationsTab() {
  const [saved, setSaved] = useState(false)
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  const groups = [
    {
      title: 'Tenant Alerts',
      items: [
        { label: 'New tenant registered',      email: true,  inApp: true  },
        { label: 'Trial about to expire',       email: true,  inApp: true  },
        { label: 'Tenant suspended',            email: true,  inApp: false },
        { label: 'Tenant cancelled',            email: true,  inApp: true  },
      ],
    },
    {
      title: 'Billing Alerts',
      items: [
        { label: 'Payment failed',              email: true,  inApp: true  },
        { label: 'Subscription upgraded',       email: false, inApp: true  },
        { label: 'Subscription downgraded',     email: true,  inApp: false },
        { label: 'Refund issued',               email: true,  inApp: true  },
      ],
    },
    {
      title: 'System Alerts',
      items: [
        { label: 'New user invitation sent',    email: false, inApp: true  },
        { label: 'System backup completed',     email: false, inApp: false },
        { label: 'API usage threshold reached', email: true,  inApp: true  },
      ],
    },
  ]

  return (
    <div className="space-y-6">
      {groups.map((g) => (
        <div key={g.title} className="bg-white rounded-2xl border border-border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">{g.title}</h3>
            <div className="grid grid-cols-2 gap-8 text-xs text-muted-foreground font-medium pr-1">
              <span className="text-center">Email</span>
              <span className="text-center">In-App</span>
            </div>
          </div>
          <div className="space-y-3">
            {g.items.map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                <span className="text-sm text-foreground">{item.label}</span>
                <div className="grid grid-cols-2 gap-8">
                  <div className="flex justify-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked={item.email} className="sr-only peer" />
                      <div className="w-9 h-5 bg-muted peer-checked:bg-primary rounded-full transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
                    </label>
                  </div>
                  <div className="flex justify-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked={item.inApp} className="sr-only peer" />
                      <div className="w-9 h-5 bg-muted peer-checked:bg-primary rounded-full transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="flex justify-end">
        <button
          onClick={save}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            saved ? 'bg-emerald-500 text-white' : 'aqua-gradient text-white hover:opacity-90'
          }`}
        >
          {saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}

function BillingTab() {
  return (
    <div className="space-y-6">
      {/* Plan pricing */}
      <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
        <h3 className="font-semibold text-foreground mb-5">Plan Pricing</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { plan: 'Starter',    monthlyPer: 9,   color: 'bg-cyan-50 border-cyan-200 text-cyan-800' },
            { plan: 'Growth',     monthlyPer: 19,  color: 'bg-primary/5 border-primary/20 text-primary' },
            { plan: 'Enterprise', monthlyPer: 35,  color: 'bg-teal-50 border-teal-200 text-teal-800' },
          ].map((p) => (
            <div key={p.plan} className={`rounded-xl border p-4 ${p.color}`}>
              <p className="font-semibold mb-3">{p.plan}</p>
              <div className="space-y-2">
                <div>
                  <label className="text-xs font-medium opacity-70 block mb-1">Monthly (per seat)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium">$</span>
                    <input
                      defaultValue={p.monthlyPer}
                      type="number"
                      className="w-full pl-7 pr-3 py-2 text-sm border border-current/20 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-current/30"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium opacity-70 block mb-1">Annual discount %</label>
                  <input
                    defaultValue={20}
                    type="number"
                    className="w-full px-3 py-2 text-sm border border-current/20 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-current/30"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment gateway */}
      <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
        <h3 className="font-semibold text-foreground mb-5">Payment Gateway</h3>
        <div className="space-y-4 max-w-xl">
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Gateway</label>
            <select className="w-full px-4 py-2.5 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white">
              <option>Stripe</option>
              <option>PayPal</option>
              <option>Braintree</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Publishable Key</label>
            <input
              defaultValue="pk_live_••••••••••••••••"
              className="w-full px-4 py-2.5 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 font-mono"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Secret Key</label>
            <input
              defaultValue="sk_live_••••••••••••••••"
              type="password"
              className="w-full px-4 py-2.5 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 font-mono"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Webhook Secret</label>
            <input
              defaultValue="whsec_••••••••••••••••"
              type="password"
              className="w-full px-4 py-2.5 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 font-mono"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function ApiTab() {
  const [keys, setKeys] = useState([
    { id: 'k1', name: 'Production v2', key: 'aq_live_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6', created: 'Mar 23, 2026', lastUsed: '2h ago',  active: true  },
    { id: 'k2', name: 'Staging',       key: 'aq_test_x9y8z7w6v5u4t3s2r1q0p9o8n7m6l5k4', created: 'Jan 10, 2026', lastUsed: '5d ago',  active: true  },
    { id: 'k3', name: 'Legacy v1',     key: 'aq_live_z1y2x3w4v5u6t7s8r9q0p1o2n3m4l5k6', created: 'Nov 5, 2025',  lastUsed: '60d ago', active: false },
  ])
  const [visible, setVisible] = useState<Record<string, boolean>>({})
  const [copied, setCopied]   = useState<string | null>(null)

  const toggleVisible = (id: string) => setVisible((v) => ({ ...v, [id]: !v[id] }))
  const copyKey = (id: string, key: string) => {
    navigator.clipboard.writeText(key).catch(() => {})
    setCopied(id)
    setTimeout(() => setCopied(null), 1500)
  }
  const revokeKey = (id: string) => setKeys((ks) => ks.map((k) => k.id === id ? { ...k, active: false } : k))

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-foreground">API Keys</h3>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl aqua-gradient text-white text-sm font-semibold hover:opacity-90 transition-opacity">
            <Key className="w-4 h-4" />
            Generate New Key
          </button>
        </div>

        <div className="space-y-3">
          {keys.map((k) => (
            <div
              key={k.id}
              className={`rounded-xl border p-4 transition-all ${k.active ? 'border-border' : 'border-border/50 opacity-60'}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <p className="font-medium text-sm text-foreground">{k.name}</p>
                    {k.active
                      ? <span className="badge-active">Active</span>
                      : <span className="badge-inactive">Revoked</span>
                    }
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded truncate max-w-[300px]">
                      {visible[k.id] ? k.key : k.key.slice(0, 14) + '••••••••••••••••••••'}
                    </code>
                    <button onClick={() => toggleVisible(k.id)} className="p-1 hover:text-foreground text-muted-foreground">
                      {visible[k.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                    <button onClick={() => copyKey(k.id, k.key)} className="p-1 hover:text-foreground text-muted-foreground">
                      {copied === k.id ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5">Created {k.created} · Last used {k.lastUsed}</p>
                </div>
                {k.active && (
                  <button
                    onClick={() => revokeKey(k.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-200 text-rose-500 text-xs font-medium hover:bg-rose-50 transition-colors flex-shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Revoke
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
        <h3 className="font-semibold text-foreground mb-4">Rate Limits</h3>
        <div className="space-y-3 max-w-lg">
          {[
            { label: 'Requests per minute',  value: '1,000' },
            { label: 'Requests per hour',    value: '50,000' },
            { label: 'Requests per day',     value: '500,000' },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <span className="text-sm text-muted-foreground">{item.label}</span>
              <span className="text-sm font-semibold text-foreground">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function AuditTab() {
  const levelCls: Record<string, string> = {
    info:  'bg-cyan-50 text-cyan-700',
    warn:  'bg-amber-50 text-amber-700',
    error: 'bg-rose-50 text-rose-600',
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Recent Activity</h3>
          <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
        </div>
        <div className="divide-y divide-border">
          {AUDIT_LOG.map((entry) => (
            <div key={entry.id} className="px-6 py-4 flex items-start gap-4 hover:bg-muted/20 transition-colors">
              <span className={`mt-0.5 px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${levelCls[entry.level]}`}>
                {entry.level}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{entry.action}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  <span className="font-medium">{entry.actor}</span> · {entry.target}
                </p>
              </div>
              <span className="text-xs text-muted-foreground flex-shrink-0">{entry.time}</span>
            </div>
          ))}
        </div>
        <div className="px-6 py-4 border-t border-border">
          <button className="flex items-center gap-1.5 text-sm text-primary font-medium hover:underline">
            View full audit log <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>('general')

  const TabContent = {
    general:       <GeneralTab />,
    security:      <SecurityTab />,
    notifications: <NotificationsTab />,
    billing:       <BillingTab />,
    api:           <ApiTab />,
    audit:         <AuditTab />,
  }[activeTab]

  return (
    <div className="flex flex-col flex-1">
      {/* Header */}
      <div className="px-8 py-6 border-b border-border bg-white">
        <h1 className="text-xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Manage platform configuration and preferences</p>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left nav */}
        <aside className="w-56 border-r border-border bg-white flex-shrink-0 pt-4">
          {TABS.map((tab) => {
            const isActive = tab.id === activeTab
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-5 py-3 text-sm font-medium transition-all ${
                  isActive
                    ? 'text-primary bg-primary/5 border-r-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                }`}
              >
                <tab.icon className={`w-4 h-4 ${isActive ? 'text-primary' : ''}`} />
                {tab.label}
              </button>
            )
          })}
        </aside>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-8">
          {TabContent}
        </main>
      </div>
    </div>
  )
}
