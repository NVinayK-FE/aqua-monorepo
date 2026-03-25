'use client'

import { useState } from 'react'
import {
  User, Mail, Phone, MapPin, Building2, Briefcase,
  Calendar, Globe, Edit2, Save, CheckCircle2, Eye, EyeOff,
  Shield, Camera, AlertTriangle,
} from 'lucide-react'
import { EMPLOYEES } from '@/lib/mock-data'
import { formatDate } from '@/lib/utils'

const ME = EMPLOYEES.find((e) => e.id === 'e10')!

// ─── Section wrapper ──────────────────────────────────────────────────────────
function Section({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
      <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-border">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="w-4 h-4 text-primary" />
        </div>
        <h3 className="font-semibold text-foreground">{title}</h3>
      </div>
      {children}
    </div>
  )
}

// ─── Editable field ───────────────────────────────────────────────────────────
function Field({
  label, value, type = 'text', disabled, onChange, options,
}: {
  label: string
  value: string
  type?: string
  disabled?: boolean
  onChange?: (v: string) => void
  options?: string[]
}) {
  return (
    <div>
      <label className="text-xs font-medium text-muted-foreground block mb-1.5">{label}</label>
      {options ? (
        <select
          disabled={disabled}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="w-full px-3 py-2.5 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white disabled:bg-muted/50 disabled:text-muted-foreground"
        >
          {options.map((o) => <option key={o}>{o}</option>)}
        </select>
      ) : (
        <input
          type={type}
          disabled={disabled}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="w-full px-3 py-2.5 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:bg-muted/50 disabled:text-muted-foreground"
        />
      )}
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function MyProfilePage() {
  const [editSection, setEditSection] = useState<string | null>(null)
  const [saved, setSaved]       = useState<string | null>(null)
  const [pwVisible, setPwVisible] = useState(false)
  const [pwConfVisible, setPwConfVisible] = useState(false)

  // Personal info state
  const [personal, setPersonal] = useState({
    firstName: ME.firstName,
    lastName:  ME.lastName,
    email:     ME.email,
    phone:     ME.phone,
    location:  ME.location,
    bio:       'Full Stack Developer passionate about clean code and scalable systems. 3+ years at Acme Corporation building AQUA SUITE.',
  })

  // Job info (read-only with HR note)
  const jobInfo = {
    position:       ME.position,
    department:     ME.department,
    employmentType: ME.employmentType.replace('_', ' '),
    hireDate:       formatDate(ME.hireDate, { month: 'long', day: 'numeric', year: 'numeric' }),
    reportsTo:      'Sarah Chen',
    workLocation:   'Remote',
  }

  // Emergency contact
  const [emergency, setEmergency] = useState({
    name:         'Patricia Anderson',
    relationship: 'Spouse',
    phone:        '+1 (555) 987-6543',
    email:        'patricia.a@gmail.com',
  })

  // Password
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' })
  const [pwError, setPwError] = useState('')

  const saveSection = (section: string) => {
    setEditSection(null)
    setSaved(section)
    setTimeout(() => setSaved(null), 2000)
  }

  const handlePwSave = () => {
    if (!pw.current || !pw.next || !pw.confirm) { setPwError('Please fill all password fields.'); return }
    if (pw.next !== pw.confirm) { setPwError('New passwords do not match.'); return }
    if (pw.next.length < 8)    { setPwError('Password must be at least 8 characters.'); return }
    setPwError('')
    setPw({ current: '', next: '', confirm: '' })
    setSaved('password')
    setEditSection(null)
    setTimeout(() => setSaved(null), 2500)
  }

  const pwStrength = (p: string) => {
    let s = 0
    if (p.length >= 8) s++
    if (/[A-Z]/.test(p)) s++
    if (/[0-9]/.test(p)) s++
    if (/[^A-Za-z0-9]/.test(p)) s++
    return s
  }
  const strength = pwStrength(pw.next)
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength]
  const strengthColor = ['', 'bg-rose-400', 'bg-amber-400', 'bg-cyan-400', 'bg-emerald-400'][strength]

  return (
    <div className="flex flex-col flex-1">
      <div className="px-8 py-6 border-b border-border bg-white">
        <h1 className="text-xl font-bold text-foreground">My Profile</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Manage your personal information and account settings</p>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-6">

        {/* Avatar header card */}
        <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-full aqua-gradient flex items-center justify-center text-white font-black text-2xl shadow-md">
                TA
              </div>
              <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-white border-2 border-border flex items-center justify-center shadow-sm hover:bg-muted transition-colors">
                <Camera className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">{ME.firstName} {ME.lastName}</h2>
              <p className="text-sm text-primary font-medium">{ME.position}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="badge-active">Active</span>
                <span className="text-xs text-muted-foreground">{ME.department}</span>
                <span className="text-xs text-muted-foreground">·</span>
                <span className="text-xs text-muted-foreground">Employee since {formatDate(ME.hireDate, { month: 'short', year: 'numeric' })}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Personal info */}
        <Section title="Personal Information" icon={User}>
          {saved === 'personal' && (
            <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 px-4 py-2.5 rounded-xl mb-4">
              <CheckCircle2 className="w-4 h-4" /> Profile updated successfully
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="First Name"  value={personal.firstName}  disabled={editSection !== 'personal'} onChange={(v) => setPersonal({ ...personal, firstName: v })} />
            <Field label="Last Name"   value={personal.lastName}   disabled={editSection !== 'personal'} onChange={(v) => setPersonal({ ...personal, lastName: v })} />
            <Field label="Work Email"  value={personal.email}      disabled={editSection !== 'personal'} type="email" onChange={(v) => setPersonal({ ...personal, email: v })} />
            <Field label="Phone"       value={personal.phone}      disabled={editSection !== 'personal'} type="tel"   onChange={(v) => setPersonal({ ...personal, phone: v })} />
            <Field label="Location"    value={personal.location}   disabled={editSection !== 'personal'} onChange={(v) => setPersonal({ ...personal, location: v })} />
          </div>
          <div className="mt-4">
            <label className="text-xs font-medium text-muted-foreground block mb-1.5">Bio</label>
            <textarea
              disabled={editSection !== 'personal'}
              rows={3}
              value={personal.bio}
              onChange={(e) => setPersonal({ ...personal, bio: e.target.value })}
              className="w-full px-3 py-2.5 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:bg-muted/50 disabled:text-muted-foreground resize-none"
            />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            {editSection === 'personal' ? (
              <>
                <button onClick={() => setEditSection(null)} className="px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted/50 transition-colors">Cancel</button>
                <button onClick={() => saveSection('personal')} className="flex items-center gap-1.5 px-4 py-2 rounded-xl aqua-gradient text-white text-sm font-semibold hover:opacity-90 transition-opacity">
                  <Save className="w-3.5 h-3.5" /> Save Changes
                </button>
              </>
            ) : (
              <button onClick={() => setEditSection('personal')} className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted/50 transition-colors">
                <Edit2 className="w-3.5 h-3.5" /> Edit
              </button>
            )}
          </div>
        </Section>

        {/* Job info — read only */}
        <Section title="Job Information" icon={Briefcase}>
          <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 px-3 py-2 rounded-xl mb-4">
            <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
            To update job information, please contact your HR administrator.
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: 'Job Title',        value: jobInfo.position       },
              { label: 'Department',       value: jobInfo.department     },
              { label: 'Employment Type',  value: jobInfo.employmentType },
              { label: 'Hire Date',        value: jobInfo.hireDate       },
              { label: 'Reports To',       value: jobInfo.reportsTo      },
              { label: 'Work Location',    value: jobInfo.workLocation   },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-xs font-medium text-muted-foreground mb-1">{item.label}</p>
                <p className="text-sm font-semibold text-foreground capitalize px-3 py-2.5 bg-muted/40 rounded-xl border border-border">{item.value}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Emergency contact */}
        <Section title="Emergency Contact" icon={Phone}>
          {saved === 'emergency' && (
            <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 px-4 py-2.5 rounded-xl mb-4">
              <CheckCircle2 className="w-4 h-4" /> Emergency contact updated
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field
              label="Full Name" value={emergency.name}
              disabled={editSection !== 'emergency'}
              onChange={(v) => setEmergency({ ...emergency, name: v })}
            />
            <Field
              label="Relationship" value={emergency.relationship}
              disabled={editSection !== 'emergency'}
              options={['Spouse', 'Parent', 'Sibling', 'Friend', 'Partner', 'Other']}
              onChange={(v) => setEmergency({ ...emergency, relationship: v })}
            />
            <Field
              label="Phone" value={emergency.phone} type="tel"
              disabled={editSection !== 'emergency'}
              onChange={(v) => setEmergency({ ...emergency, phone: v })}
            />
            <Field
              label="Email" value={emergency.email} type="email"
              disabled={editSection !== 'emergency'}
              onChange={(v) => setEmergency({ ...emergency, email: v })}
            />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            {editSection === 'emergency' ? (
              <>
                <button onClick={() => setEditSection(null)} className="px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted/50 transition-colors">Cancel</button>
                <button onClick={() => saveSection('emergency')} className="flex items-center gap-1.5 px-4 py-2 rounded-xl aqua-gradient text-white text-sm font-semibold hover:opacity-90 transition-opacity">
                  <Save className="w-3.5 h-3.5" /> Save
                </button>
              </>
            ) : (
              <button onClick={() => setEditSection('emergency')} className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted/50 transition-colors">
                <Edit2 className="w-3.5 h-3.5" /> Edit
              </button>
            )}
          </div>
        </Section>

        {/* Password */}
        <Section title="Security" icon={Shield}>
          {saved === 'password' && (
            <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 px-4 py-2.5 rounded-xl mb-4">
              <CheckCircle2 className="w-4 h-4" /> Password changed successfully
            </div>
          )}
          {editSection === 'password' ? (
            <div className="max-w-md space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1.5">Current Password</label>
                <div className="relative">
                  <input
                    type={pwVisible ? 'text' : 'password'}
                    value={pw.current}
                    onChange={(e) => { setPw({ ...pw, current: e.target.value }); setPwError('') }}
                    className="w-full pr-10 px-3 py-2.5 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="Enter current password"
                  />
                  <button onClick={() => setPwVisible(!pwVisible)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {pwVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1.5">New Password</label>
                <div className="relative">
                  <input
                    type={pwConfVisible ? 'text' : 'password'}
                    value={pw.next}
                    onChange={(e) => { setPw({ ...pw, next: e.target.value }); setPwError('') }}
                    className="w-full pr-10 px-3 py-2.5 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="Min 8 characters"
                  />
                  <button onClick={() => setPwConfVisible(!pwConfVisible)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {pwConfVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {pw.next && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex gap-1">
                      {[1,2,3,4].map((i) => (
                        <div key={i} className={`h-1.5 w-8 rounded-full transition-colors ${i <= strength ? strengthColor : 'bg-muted'}`} />
                      ))}
                    </div>
                    <span className={`text-xs font-medium ${['','text-rose-500','text-amber-500','text-cyan-600','text-emerald-500'][strength]}`}>{strengthLabel}</span>
                  </div>
                )}
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1.5">Confirm New Password</label>
                <input
                  type="password"
                  value={pw.confirm}
                  onChange={(e) => { setPw({ ...pw, confirm: e.target.value }); setPwError('') }}
                  className={`w-full px-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                    pw.confirm && pw.confirm !== pw.next ? 'border-rose-300 bg-rose-50' : 'border-border'
                  }`}
                  placeholder="Repeat new password"
                />
                {pw.confirm && pw.confirm !== pw.next && (
                  <p className="text-xs text-rose-500 mt-1">Passwords do not match</p>
                )}
              </div>
              {pwError && (
                <p className="text-xs text-rose-500 flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5" /> {pwError}</p>
              )}
              <div className="flex gap-2 pt-1">
                <button onClick={() => { setEditSection(null); setPwError(''); setPw({ current: '', next: '', confirm: '' }) }} className="px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted/50 transition-colors">
                  Cancel
                </button>
                <button onClick={handlePwSave} className="flex items-center gap-1.5 px-4 py-2 rounded-xl aqua-gradient text-white text-sm font-semibold hover:opacity-90 transition-opacity">
                  <Save className="w-3.5 h-3.5" /> Update Password
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Password</p>
                <p className="text-xs text-muted-foreground mt-0.5">Last changed 3 months ago</p>
              </div>
              <button
                onClick={() => setEditSection('password')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted/50 transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" /> Change Password
              </button>
            </div>
          )}
        </Section>
      </div>
    </div>
  )
}
