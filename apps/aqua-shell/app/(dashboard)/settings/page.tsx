'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Building2, Bell, Lock, Users, Globe, Palette,
  Mail, Save, ChevronRight, Shield, KeyRound, UserCog,
  Copy, Check, Plus, Trash2, AlertTriangle, CheckCircle2,
  RefreshCw, Eye, EyeOff, ExternalLink, Info, LogIn,
  LogOut as LogOutIcon, Settings2, FileKey, Network,
  ClipboardList, ChevronDown, Smartphone, Zap,
} from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────

type SsoProvider = 'none' | 'saml' | 'oidc'
type TwoFAMethod = 'totp' | 'sms' | 'email'
type TwoFAEnforce = 'all' | 'admins' | 'off'

interface IpRule {
  id: string
  label: string
  cidr: string
  addedAt: string
}

interface AuditEvent {
  id: string
  event: string
  user: string
  ip: string
  time: string
  status: 'success' | 'failed' | 'warning'
  detail: string
}

// ─── Constants ───────────────────────────────────────────────────────────────

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

// ─── Per-provider preset data ─────────────────────────────────────────────────

interface IdpPreset {
  name: string
  shortName: string
  tagline: string
  color: string          // active tab / badge styling
  accentBg: string       // info banner background
  accentBorder: string
  accentText: string
  logo: string           // emoji fallback
  docsUrl: string
  metadataUrl: string    // placeholder for the IdP metadata URL
  metadataNote: string   // helper text shown under the URL field
  /** Labels the IdP uses for the SP fields — so the admin knows exactly where to paste */
  spLabels: { entityId: string; acsUrl: string; nameIdFormat: string }
  setupSteps: string[]
  attrMap: { email: string; firstName: string; lastName: string; department: string; role: string }
  attrNote: string       // provider-specific attribute tip
}

const IDP_PRESETS: Record<string, IdpPreset> = {
  okta: {
    name: 'Okta',
    shortName: 'Okta',
    tagline: 'Workforce Identity — most common enterprise IdP',
    color: 'bg-blue-50 border-blue-300 text-blue-700',
    accentBg: 'bg-blue-50',
    accentBorder: 'border-blue-200',
    accentText: 'text-blue-700',
    logo: '🔵',
    docsUrl: 'https://help.okta.com/en-us/content/topics/apps/apps_app_integration_wizard_saml.htm',
    metadataUrl: 'https://your-org.okta.com/app/<app_id>/sso/saml/metadata',
    metadataNote: 'Find this in Okta Admin → Applications → your app → Sign On tab → "Identity Provider metadata" link.',
    spLabels: {
      entityId: 'Audience URI (SP Entity ID)',
      acsUrl: 'Single Sign On URL',
      nameIdFormat: 'Name ID format',
    },
    setupSteps: [
      'Sign in to Okta Admin Console and go to Applications → Applications.',
      'Click Create App Integration and choose SAML 2.0, then click Next.',
      'Enter "AQUA HRMS" as the App name. Optionally upload a logo, then click Next.',
      'In Configure SAML → General: paste the Single Sign On URL (ACS URL) from below into the "Single sign on URL" field.',
      'Paste the SP Entity ID into the "Audience URI (SP Entity ID)" field. Set Name ID format to "EmailAddress".',
      'Under Attribute Statements, add the five attribute mappings shown in the Attribute Mapping section below.',
      'Complete the wizard, click Finish. On the Sign On tab click "View SAML setup instructions" to find your metadata URL.',
      'Copy the Identity Provider metadata URL and paste it into the IdP Metadata field below, then click Test Connection.',
    ],
    attrMap: {
      email: 'user.email',
      firstName: 'user.firstName',
      lastName: 'user.lastName',
      department: 'user.department',
      role: 'user.userType',
    },
    attrNote: 'Okta uses profile attribute expressions. Add group-based role claims via the Group Attribute Statements section if needed.',
  },
  azure: {
    name: 'Microsoft Entra ID',
    shortName: 'Azure AD',
    tagline: 'Microsoft Entra ID (formerly Azure Active Directory)',
    color: 'bg-sky-50 border-sky-300 text-sky-700',
    accentBg: 'bg-sky-50',
    accentBorder: 'border-sky-200',
    accentText: 'text-sky-700',
    logo: '🟦',
    docsUrl: 'https://learn.microsoft.com/en-us/entra/identity/enterprise-apps/add-application-portal-setup-sso',
    metadataUrl: 'https://login.microsoftonline.com/<tenant-id>/federationmetadata/2007-06/federationmetadata.xml',
    metadataNote: 'Replace <tenant-id> with your Azure tenant ID. Find it in Azure Portal → Microsoft Entra ID → Overview → Tenant ID.',
    spLabels: {
      entityId: 'Identifier (Entity ID)',
      acsUrl: 'Reply URL (Assertion Consumer Service URL)',
      nameIdFormat: 'Name identifier format',
    },
    setupSteps: [
      'Sign in to Azure Portal (portal.azure.com) and go to Microsoft Entra ID → Enterprise applications.',
      'Click New application → Create your own application. Name it "AQUA HRMS", choose "Non-gallery", click Create.',
      'Open the app → Single sign-on → SAML.',
      'In Basic SAML Configuration: set "Identifier (Entity ID)" to the SP Entity ID below and "Reply URL" to the ACS URL below. Click Save.',
      'In Attributes & Claims, add the claim mappings from the Attribute Mapping section below. The default NameID should be set to user.mail.',
      'Download the "Federation Metadata XML" from section 3, or copy the "App Federation Metadata URL".',
      'Assign users or groups to the application under Users and groups tab.',
      'Paste the metadata URL or XML into the IdP Metadata section below and click Test Connection.',
    ],
    attrMap: {
      email: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress',
      firstName: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname',
      lastName: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname',
      department: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/department',
      role: 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role',
    },
    attrNote: 'Azure uses long URN-style claim names. For role/group claims enable "Groups claim" in the Token configuration tab and map to the role attribute above.',
  },
  google: {
    name: 'Google Workspace',
    shortName: 'Google',
    tagline: 'Google Workspace (formerly G Suite) — SAML app',
    color: 'bg-red-50 border-red-300 text-red-700',
    accentBg: 'bg-red-50',
    accentBorder: 'border-red-200',
    accentText: 'text-red-700',
    logo: '🔴',
    docsUrl: 'https://support.google.com/a/answer/6087519',
    metadataUrl: '',
    metadataNote: 'Google does not expose a live metadata URL. Download the IdP metadata XML from the SAML app setup page (Step 3 below) and paste it in the XML tab.',
    spLabels: {
      entityId: 'Entity ID',
      acsUrl: 'ACS URL',
      nameIdFormat: 'Name ID format',
    },
    setupSteps: [
      'Sign in to Google Admin Console (admin.google.com) with a super-admin account.',
      'Go to Apps → Web and mobile apps → Add App → Add custom SAML app.',
      'Enter "AQUA HRMS" as the app name, upload an icon, then click Continue.',
      'On the "Google Identity Provider details" page: click Download Metadata to get the IdP XML file. Click Continue.',
      'In Service Provider details: paste the ACS URL and Entity ID from the SP Information section below. Set Name ID format to "EMAIL". Click Continue.',
      'In Attribute mapping: map the Google Directory attributes to the AQUA fields shown in the Attribute Mapping section below. Click Finish.',
      'Back in the app list, click the app and set User access to "On for everyone" (or specific OUs).',
      'Switch to the XML Paste tab below and paste the downloaded IdP metadata XML, then click Test Connection.',
    ],
    attrMap: {
      email: 'Primary Email',
      firstName: 'First Name',
      lastName: 'Last Name',
      department: 'Department',
      role: 'Job Title',
    },
    attrNote: 'Google uses plain display names for directory attributes. Custom schema attributes (e.g., custom:role) can be added in Admin Console → Directory → Custom attributes.',
  },
  auth0: {
    name: 'Auth0',
    shortName: 'Auth0',
    tagline: 'Auth0 by Okta — developer-friendly identity platform',
    color: 'bg-orange-50 border-orange-300 text-orange-700',
    accentBg: 'bg-orange-50',
    accentBorder: 'border-orange-200',
    accentText: 'text-orange-700',
    logo: '🟠',
    docsUrl: 'https://auth0.com/docs/authenticate/protocols/saml/saml-sso-integrations',
    metadataUrl: 'https://<your-domain>.auth0.com/samlp/metadata/<client-id>',
    metadataNote: 'Replace <your-domain> with your Auth0 tenant domain and <client-id> with the Application Client ID. Found in Auth0 Dashboard → Applications.',
    spLabels: {
      entityId: 'Audience',
      acsUrl: 'Application Callback URL',
      nameIdFormat: 'nameIdentifierFormat',
    },
    setupSteps: [
      'Sign in to Auth0 Dashboard (manage.auth0.com) and go to Applications → Applications.',
      'Click Create Application. Choose "Regular Web Applications" and click Create.',
      'Go to the Addons tab and enable SAML2 Web App.',
      'In the SAML2 Web App settings: set "Application Callback URL" to the ACS URL below, and set "audience" to the SP Entity ID below.',
      'In the Settings JSON, configure the attribute mappings shown in the Attribute Mapping section below (under "mappings" key).',
      'Set "nameIdentifierFormat" to "urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress".',
      'Click Save, then scroll down to "Usage" → copy the "Identity Provider Metadata" URL.',
      'Paste the metadata URL into the IdP Metadata field below and click Test Connection.',
    ],
    attrMap: {
      email: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress',
      firstName: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname',
      lastName: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname',
      department: 'department',
      role: 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role',
    },
    attrNote: 'In the Auth0 SAML2 addon JSON, define custom mappings like: "mappings": { "email": "http://schemas...emailaddress", "given_name": "http://schemas...givenname" }.',
  },
  onelogin: {
    name: 'OneLogin',
    shortName: 'OneLogin',
    tagline: 'OneLogin Workforce Identity — SAML custom connector',
    color: 'bg-rose-50 border-rose-300 text-rose-700',
    accentBg: 'bg-rose-50',
    accentBorder: 'border-rose-200',
    accentText: 'text-rose-700',
    logo: '🔶',
    docsUrl: 'https://developers.onelogin.com/saml',
    metadataUrl: 'https://app.onelogin.com/saml/metadata/<app-id>',
    metadataNote: 'Replace <app-id> with the OneLogin Application ID. Found in OneLogin Admin → Applications → your app → SSO tab → Issuer URL.',
    spLabels: {
      entityId: 'Audience (EntityID)',
      acsUrl: 'ACS (Consumer) URL',
      nameIdFormat: 'SAML nameID format',
    },
    setupSteps: [
      'Sign in to OneLogin Admin Console and go to Applications → Add App.',
      'Search for "SAML Custom Connector" and select SAML Custom Connector (Advanced). Click Save.',
      'In the Configuration tab: set "Audience (EntityID)" to the SP Entity ID below and "ACS (Consumer) URL" to the ACS URL below.',
      'Set "SAML nameID format" to "Email" and "NameID value" to "Email".',
      'In the Parameters tab: add field mappings for each attribute using the values in the Attribute Mapping section below.',
      'In the SSO tab: copy the "Issuer URL" (this is your metadata URL) or download the metadata XML.',
      'Go to Users → assign users or roles to the application.',
      'Paste the Issuer URL or XML into the IdP Metadata section below and click Test Connection.',
    ],
    attrMap: {
      email: 'User.Email',
      firstName: 'User.FirstName',
      lastName: 'User.LastName',
      department: 'User.Department',
      role: 'User.Role',
    },
    attrNote: 'OneLogin uses "User.*" macro syntax. For custom profile fields use "User.CustomAttribute.<name>". Role mapping can also be done via OneLogin Roles.',
  },
  jumpcloud: {
    name: 'JumpCloud',
    shortName: 'JumpCloud',
    tagline: 'JumpCloud Directory Platform — open directory SSO',
    color: 'bg-emerald-50 border-emerald-300 text-emerald-700',
    accentBg: 'bg-emerald-50',
    accentBorder: 'border-emerald-200',
    accentText: 'text-emerald-700',
    logo: '🟩',
    docsUrl: 'https://support.jumpcloud.com/s/article/Single-Sign-On-SSO-with-SAML',
    metadataUrl: '',
    metadataNote: 'JumpCloud does not provide a live metadata URL for custom SAML apps. Export the metadata XML from the SSO app settings page (Step 5 below) and paste it in the XML tab.',
    spLabels: {
      entityId: 'SP Entity ID',
      acsUrl: 'ACS URL',
      nameIdFormat: 'SAMLSubject NameID',
    },
    setupSteps: [
      'Sign in to JumpCloud Admin Console (console.jumpcloud.com) and go to SSO Applications.',
      'Click + Add New Application → Custom SAML App.',
      'Enter "AQUA HRMS" as the display label and optionally upload a logo.',
      'In the SSO tab: set "SP Entity ID" to the SP Entity ID below and "ACS URL" to the ACS URL below.',
      'Set "SAMLSubject NameID" to "email" and "SAMLSubject NameID Format" to "urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress".',
      'Add the attribute statements from the Attribute Mapping section below.',
      'Click Activate, then export the IdP metadata XML from the SSO app page.',
      'Switch to the XML Paste tab below, paste the exported XML, and click Test Connection.',
    ],
    attrMap: {
      email: 'email',
      firstName: 'firstname',
      lastName: 'lastname',
      department: 'department',
      role: 'userType',
    },
    attrNote: 'JumpCloud uses lowercase attribute names. Ensure these match what is configured in the JumpCloud SSO app attribute statements.',
  },
}

const IDP_PRESET_ORDER = ['okta', 'azure', 'google', 'auth0', 'onelogin', 'jumpcloud']

const INITIAL_IP_RULES: IpRule[] = [
  { id: 'ip1', label: 'HQ Office', cidr: '203.0.113.0/24', addedAt: '2025-01-15' },
  { id: 'ip2', label: 'VPN Gateway', cidr: '198.51.100.42/32', addedAt: '2025-02-03' },
]

const AUDIT_EVENTS: AuditEvent[] = [
  { id: 'a1', event: 'SSO Login', user: 'sarah.chen@acme.com', ip: '203.0.113.5', time: '2025-04-02 09:14:22', status: 'success', detail: 'Authenticated via Okta SAML' },
  { id: 'a2', event: 'Failed Login', user: 'unknown@acme.com', ip: '185.220.101.34', time: '2025-04-02 08:47:11', status: 'failed', detail: 'Invalid credentials — 3rd attempt' },
  { id: 'a3', event: 'Password Changed', user: 'marcus.j@acme.com', ip: '203.0.113.10', time: '2025-04-01 17:32:00', status: 'success', detail: 'Password updated by user' },
  { id: 'a4', event: '2FA Enrolled', user: 'priya.s@acme.com', ip: '198.51.100.42', time: '2025-04-01 14:05:44', status: 'success', detail: 'TOTP authenticator app configured' },
  { id: 'a5', event: 'IP Whitelist Update', user: 'james.o@acme.com', ip: '203.0.113.5', time: '2025-03-31 11:20:18', status: 'warning', detail: 'New CIDR 198.51.100.42/32 added' },
  { id: 'a6', event: 'Session Revoked', user: 'tom.a@acme.com', ip: '203.0.113.5', time: '2025-03-30 16:44:09', status: 'success', detail: 'All sessions invalidated by admin' },
  { id: 'a7', event: 'SSO Config Changed', user: 'james.o@acme.com', ip: '203.0.113.5', time: '2025-03-29 10:12:33', status: 'warning', detail: 'SAML metadata URL updated' },
  { id: 'a8', event: 'Failed Login', user: 'aisha.w@acme.com', ip: '185.220.101.99', time: '2025-03-28 23:01:55', status: 'failed', detail: 'IP not in whitelist' },
]

// ─── Reusable Toggle ──────────────────────────────────────────────────────────

function Toggle({ checked, onChange, size = 'md' }: { checked: boolean; onChange: (v: boolean) => void; size?: 'sm' | 'md' }) {
  const sm = size === 'sm'
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex items-center rounded-full transition-colors flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-primary/50 ${
        checked ? 'bg-primary' : 'bg-muted'
      } ${sm ? 'w-8 h-4' : 'w-11 h-6'}`}
    >
      <span
        className={`inline-block rounded-full bg-white shadow transition-transform ${
          sm
            ? `w-3 h-3 ${checked ? 'translate-x-4' : 'translate-x-0.5'}`
            : `w-5 h-5 ${checked ? 'translate-x-5' : 'translate-x-0.5'}`
        }`}
      />
    </button>
  )
}

// ─── Copy Button ──────────────────────────────────────────────────────────────

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={copy}
      className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
      title="Copy to clipboard"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  )
}

// ─── Read-only Field with Copy ────────────────────────────────────────────────

function ReadonlyField({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div>
      <label className="block text-xs font-medium text-foreground mb-1.5">{label}</label>
      <div className="flex items-center gap-1 border border-input rounded-lg bg-muted/40 px-3 py-2">
        <span className="flex-1 text-sm font-mono text-foreground truncate">{value}</span>
        <CopyButton value={value} />
      </div>
      {hint && <p className="text-[11px] text-muted-foreground mt-1">{hint}</p>}
    </div>
  )
}

// ─── Section Header inside a card panel ──────────────────────────────────────

function PanelSection({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-semibold text-foreground">{title}</p>
        {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
      </div>
      {children}
    </div>
  )
}

// ─── Security Settings Sub-tab ────────────────────────────────────────────────

function SecuritySettingsPanel() {
  const [twoFAEnforce, setTwoFAEnforce] = useState<TwoFAEnforce>('admins')
  const [twoFAMethods, setTwoFAMethods] = useState<Record<TwoFAMethod, boolean>>({ totp: true, sms: false, email: true })
  const [sessionTimeout, setSessionTimeout] = useState(true)
  const [sessionMinutes, setSessionMinutes] = useState('30')
  const [maxSessions, setMaxSessions] = useState('3')
  const [rememberMe, setRememberMe] = useState(true)
  const [passwordPolicy, setPasswordPolicy] = useState({
    minLength: '10',
    requireUpper: true,
    requireNumber: true,
    requireSymbol: true,
    expiryDays: '90',
    preventReuse: '5',
  })
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const toggleMethod = (m: TwoFAMethod) => setTwoFAMethods((p) => ({ ...p, [m]: !p[m] }))

  return (
    <div className="space-y-5">
      {/* ── 2FA ── */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-violet-100 flex items-center justify-center flex-shrink-0">
              <Smartphone className="w-4 h-4 text-violet-600" />
            </div>
            <div>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>Add an extra layer of security to all accounts</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Enforcement scope */}
          <PanelSection title="Enforcement Policy" description="Choose who must use 2FA">
            <div className="space-y-2">
              {([
                { val: 'all', label: 'Require for all users', desc: 'Every employee must enroll 2FA on next login' },
                { val: 'admins', label: 'Require for admins & managers only', desc: 'HR Admins, Managers, and Super Admins must use 2FA' },
                { val: 'off', label: 'Optional (user decides)', desc: 'Users can optionally enable 2FA from their profile' },
              ] as { val: TwoFAEnforce; label: string; desc: string }[]).map((opt) => (
                <label key={opt.val}
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                    twoFAEnforce === opt.val ? 'border-primary/50 bg-primary/5' : 'border-border hover:bg-muted/40'
                  }`}>
                  <input
                    type="radio"
                    name="twofa-enforce"
                    value={opt.val}
                    checked={twoFAEnforce === opt.val}
                    onChange={() => setTwoFAEnforce(opt.val)}
                    className="mt-0.5 accent-primary"
                  />
                  <div>
                    <p className="text-sm font-medium text-foreground">{opt.label}</p>
                    <p className="text-xs text-muted-foreground">{opt.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </PanelSection>

          {/* Allowed methods */}
          <PanelSection title="Allowed 2FA Methods" description="Users can choose any enabled method">
            <div className="space-y-2">
              {([
                { key: 'totp', label: 'Authenticator App (TOTP)', desc: 'Google Authenticator, Authy, Microsoft Authenticator', icon: '📱', recommended: true },
                { key: 'sms', label: 'SMS One-Time Password', desc: 'Code sent to employee\'s registered phone number', icon: '💬', recommended: false },
                { key: 'email', label: 'Email One-Time Password', desc: 'Code sent to employee\'s work email', icon: '✉️', recommended: false },
              ] as { key: TwoFAMethod; label: string; desc: string; icon: string; recommended: boolean }[]).map((m) => (
                <div key={m.key}
                  className="flex items-center gap-4 p-3 rounded-xl border border-border hover:bg-muted/20 transition-colors">
                  <span className="text-lg flex-shrink-0">{m.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground">{m.label}</p>
                      {m.recommended && <Badge variant="success" className="text-[10px] py-0">Recommended</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground">{m.desc}</p>
                  </div>
                  <Toggle checked={twoFAMethods[m.key]} onChange={() => toggleMethod(m.key)} />
                </div>
              ))}
            </div>
          </PanelSection>

          {twoFAEnforce !== 'off' && (
            <div className="flex items-start gap-2.5 px-3 py-2.5 rounded-xl bg-amber-50 border border-amber-200">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700">
                <span className="font-semibold">Enforcement grace period:</span> Users will have 7 days after their next login to enroll before being locked out.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Password Policy ── */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-100 flex items-center justify-center flex-shrink-0">
              <KeyRound className="w-4 h-4 text-cyan-600" />
            </div>
            <div>
              <CardTitle>Password Policy</CardTitle>
              <CardDescription>Define complexity and rotation rules for passwords</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Minimum Length (characters)</label>
              <input
                type="number" min="6" max="64"
                value={passwordPolicy.minLength}
                onChange={(e) => setPasswordPolicy((p) => ({ ...p, minLength: e.target.value }))}
                className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Password Expiry (days, 0 = never)</label>
              <input
                type="number" min="0" max="365"
                value={passwordPolicy.expiryDays}
                onChange={(e) => setPasswordPolicy((p) => ({ ...p, expiryDays: e.target.value }))}
                className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Prevent Password Reuse (last N)</label>
              <input
                type="number" min="0" max="24"
                value={passwordPolicy.preventReuse}
                onChange={(e) => setPasswordPolicy((p) => ({ ...p, preventReuse: e.target.value }))}
                className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>

          <div className="space-y-2 pt-1">
            <p className="text-xs font-medium text-foreground">Complexity Requirements</p>
            {([
              { key: 'requireUpper', label: 'Require uppercase letter (A–Z)' },
              { key: 'requireNumber', label: 'Require at least one number (0–9)' },
              { key: 'requireSymbol', label: 'Require at least one symbol (!@#$…)' },
            ] as { key: keyof typeof passwordPolicy; label: string }[]).map((r) => (
              <label key={r.key} className="flex items-center gap-3 cursor-pointer py-1">
                <input
                  type="checkbox"
                  checked={passwordPolicy[r.key] as boolean}
                  onChange={(e) => setPasswordPolicy((p) => ({ ...p, [r.key]: e.target.checked }))}
                  className="w-4 h-4 rounded accent-primary"
                />
                <span className="text-sm text-foreground">{r.label}</span>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── Session Management ── */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
              <Settings2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <CardTitle>Session Management</CardTitle>
              <CardDescription>Control how long users stay logged in</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 p-3 rounded-xl border border-border">
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Auto Session Timeout</p>
              <p className="text-xs text-muted-foreground">Automatically sign out inactive users</p>
            </div>
            <Toggle checked={sessionTimeout} onChange={setSessionTimeout} />
          </div>

          {sessionTimeout && (
            <div className="grid grid-cols-2 gap-4 pl-2">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Timeout After (minutes)</label>
                <select
                  value={sessionMinutes}
                  onChange={(e) => setSessionMinutes(e.target.value)}
                  className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  {['15', '30', '60', '120', '240', '480'].map((v) => (
                    <option key={v} value={v}>{v} minutes</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Max Concurrent Sessions</label>
                <select
                  value={maxSessions}
                  onChange={(e) => setMaxSessions(e.target.value)}
                  className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  {['1', '2', '3', '5', '10'].map((v) => (
                    <option key={v} value={v}>{v} session{v !== '1' ? 's' : ''}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div className="flex items-center gap-4 p-3 rounded-xl border border-border">
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Allow "Remember Me"</p>
              <p className="text-xs text-muted-foreground">Let users stay logged in for 30 days on trusted devices</p>
            </div>
            <Toggle checked={rememberMe} onChange={setRememberMe} />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button size="sm" onClick={handleSave}>
          {saved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
          {saved ? 'Saved!' : 'Save Security Settings'}
        </Button>
      </div>
    </div>
  )
}

// ─── SAML Advanced Options (extracted to avoid hook-in-map) ──────────────────

const SAML_ADVANCED_OPTS = [
  { key: 'signRequests', label: 'Sign Authentication Requests', desc: 'AQUA will sign outbound SAML requests with its private key', defaultOn: false },
  { key: 'requireSignedAssertions', label: 'Require Signed Assertions', desc: 'Reject assertions that are not signed by the IdP', defaultOn: true },
  { key: 'idpInitiated', label: 'Allow IdP-Initiated SSO', desc: 'Users can log in directly from the IdP dashboard without visiting AQUA first', defaultOn: false },
  { key: 'autoprovision', label: 'Auto-provision New Users', desc: 'Create AQUA accounts automatically on first SSO login if user does not exist', defaultOn: true },
  { key: 'syncProfile', label: 'Sync Profile on Every Login', desc: 'Update name, department, and role from SAML attributes on each login', defaultOn: false },
]

function SamlAdvancedOptions() {
  const [opts, setOpts] = useState<Record<string, boolean>>(
    Object.fromEntries(SAML_ADVANCED_OPTS.map((o) => [o.key, o.defaultOn]))
  )
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Advanced Options</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {SAML_ADVANCED_OPTS.map((opt) => (
          <div key={opt.key} className="flex items-center gap-4 p-3 rounded-xl border border-border hover:bg-muted/20 transition-colors">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{opt.label}</p>
              <p className="text-xs text-muted-foreground">{opt.desc}</p>
            </div>
            <Toggle checked={opts[opt.key]} onChange={(v) => setOpts((p) => ({ ...p, [opt.key]: v }))} />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

// ─── SSO Configuration Sub-tab ────────────────────────────────────────────────

// ─── Per-provider SAML config panel ──────────────────────────────────────────

function IdpPresetPanel({
  presetKey,
  SP_ENTITY_ID,
  ACS_URL,
}: {
  presetKey: string
  SP_ENTITY_ID: string
  ACS_URL: string
}) {
  const preset = IDP_PRESETS[presetKey]
  const [metadataMode, setMetadataMode] = useState<'url' | 'xml'>(preset.metadataUrl ? 'url' : 'xml')
  const [metadataUrl, setMetadataUrl] = useState(preset.metadataUrl)
  const [metadataXml, setMetadataXml] = useState('')
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'ok' | 'fail'>('idle')
  const [attrMap, setAttrMap] = useState({ ...preset.attrMap })
  const [guideOpen, setGuideOpen] = useState(true)

  // Reset state when preset changes
  const stableKey = presetKey
  // (re-render via key prop on parent is cleaner — handled below)

  const testConnection = () => {
    setTestStatus('testing')
    setTimeout(() => setTestStatus(Math.random() > 0.2 ? 'ok' : 'fail'), 2000)
  }

  const ATTR_FIELDS: { key: keyof typeof attrMap; label: string; required: boolean }[] = [
    { key: 'email', label: 'Email Address', required: true },
    { key: 'firstName', label: 'First Name', required: true },
    { key: 'lastName', label: 'Last Name', required: true },
    { key: 'department', label: 'Department', required: false },
    { key: 'role', label: 'Role / Group Claim', required: false },
  ]

  return (
    <div className="space-y-5">

      {/* ── Provider Header Banner ── */}
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${preset.accentBg} ${preset.accentBorder}`}>
        <span className="text-2xl flex-shrink-0">{preset.logo}</span>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-semibold ${preset.accentText}`}>{preset.name}</p>
          <p className={`text-xs ${preset.accentText} opacity-80`}>{preset.tagline}</p>
        </div>
        <a
          href={preset.docsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center gap-1.5 text-xs font-medium ${preset.accentText} hover:underline flex-shrink-0`}
        >
          <ExternalLink className="w-3 h-3" />
          Official Docs
        </a>
      </div>

      {/* ── Step-by-step Setup Guide ── */}
      <Card>
        <button
          onClick={() => setGuideOpen((v) => !v)}
          className="w-full flex items-center justify-between px-6 py-4 text-left"
        >
          <div>
            <p className="text-sm font-semibold text-foreground">Step-by-Step Setup Guide</p>
            <p className="text-xs text-muted-foreground mt-0.5">How to configure {preset.shortName} to work with AQUA HRMS</p>
          </div>
          <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${guideOpen ? 'rotate-180' : ''}`} />
        </button>
        {guideOpen && (
          <CardContent className="pt-0 pb-5">
            <ol className="space-y-3">
              {preset.setupSteps.map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary text-[11px] font-bold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-sm text-foreground leading-relaxed">{step}</p>
                </li>
              ))}
            </ol>
          </CardContent>
        )}
      </Card>

      {/* ── SP Endpoints — with IdP-specific label names ── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Service Provider (SP) Information</CardTitle>
          <CardDescription>
            Copy these values into <span className="font-medium text-foreground">{preset.shortName}</span> using the exact field names shown
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <ReadonlyField
            label={`${preset.spLabels.entityId} (SP Entity ID)`}
            value={SP_ENTITY_ID}
            hint={`In ${preset.shortName}, this field is called "${preset.spLabels.entityId}"`}
          />
          <ReadonlyField
            label={`${preset.spLabels.acsUrl} (ACS URL)`}
            value={ACS_URL}
            hint={`In ${preset.shortName}, this field is called "${preset.spLabels.acsUrl}"`}
          />
          <div className="grid grid-cols-2 gap-3">
            <ReadonlyField
              label="NameID Format"
              value="urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress"
              hint={`${preset.shortName} field: "${preset.spLabels.nameIdFormat}"`}
            />
            <ReadonlyField
              label="Binding"
              value="HTTP POST"
              hint="Use HTTP POST for both SSO and SLO"
            />
          </div>
          <div className={`flex items-start gap-2.5 px-3 py-2.5 rounded-xl border ${preset.accentBg} ${preset.accentBorder}`}>
            <Info className={`w-4 h-4 flex-shrink-0 mt-0.5 ${preset.accentText}`} />
            <p className={`text-xs ${preset.accentText}`}>
              Enter these values in {preset.shortName} <span className="font-semibold">before</span> testing the connection. The metadata URL/XML below becomes available only after creating the app in {preset.shortName}.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ── IdP Metadata ── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Identity Provider Metadata</CardTitle>
          <CardDescription>
            Paste the metadata from {preset.shortName} to complete the SAML trust
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Mode tabs */}
          <div className="flex gap-1 p-1 rounded-lg bg-muted w-fit">
            {(['url', 'xml'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMetadataMode(m)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  metadataMode === m
                    ? 'bg-white shadow-sm text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {m === 'url' ? 'Metadata URL' : 'XML Paste'}
              </button>
            ))}
            {!preset.metadataUrl && (
              <span className="px-2 py-1.5 text-[10px] text-amber-600 font-medium flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> URL not available for {preset.shortName} — use XML
              </span>
            )}
          </div>

          {metadataMode === 'url' ? (
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                {preset.shortName} Metadata URL
              </label>
              <input
                type="url"
                value={metadataUrl}
                onChange={(e) => setMetadataUrl(e.target.value)}
                placeholder={preset.metadataUrl || 'Metadata URL not available — use XML tab'}
                disabled={!preset.metadataUrl}
                className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-white font-mono focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:bg-muted disabled:text-muted-foreground"
              />
              <p className="text-[11px] text-muted-foreground mt-1">{preset.metadataNote}</p>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                {preset.shortName} IdP Metadata XML
              </label>
              <textarea
                value={metadataXml}
                onChange={(e) => setMetadataXml(e.target.value)}
                placeholder={'<?xml version="1.0"?>\n<EntityDescriptor xmlns="urn:oasis:names:tc:SAML:2.0:metadata"\n  entityID="https://your-idp.com/metadata">\n  …\n</EntityDescriptor>'}
                rows={8}
                className="w-full border border-input rounded-lg px-3 py-2 text-xs bg-white font-mono focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y"
              />
              <p className="text-[11px] text-muted-foreground mt-1">{preset.metadataNote}</p>
            </div>
          )}

          {/* Test connection */}
          <div className="flex items-center gap-3 pt-1">
            <Button variant="outline" size="sm" onClick={testConnection} disabled={testStatus === 'testing'}>
              {testStatus === 'testing' ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
              {testStatus === 'testing' ? 'Testing…' : 'Test Connection'}
            </Button>
            {testStatus === 'ok' && (
              <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-medium">
                <CheckCircle2 className="w-4 h-4" />
                Connected — metadata parsed successfully
              </div>
            )}
            {testStatus === 'fail' && (
              <div className="flex items-center gap-1.5 text-red-600 text-xs font-medium">
                <AlertTriangle className="w-4 h-4" />
                Connection failed — check the URL/XML and SP configuration
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ── Attribute Mapping ── */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle className="text-sm">Attribute Mapping</CardTitle>
              <CardDescription>
                Pre-filled with {preset.shortName}&apos;s default attribute names — edit if you customized them
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAttrMap({ ...preset.attrMap })}
              title="Reset to provider defaults"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset to {preset.shortName} Defaults
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="grid grid-cols-[130px_1fr] gap-3 pb-1 border-b border-border">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">AQUA Field</span>
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                {preset.shortName} Attribute Name
              </span>
            </div>
            {ATTR_FIELDS.map((field) => (
              <div key={field.key} className="grid grid-cols-[130px_1fr] items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-medium text-foreground">{field.label}</span>
                  {field.required && <span className="text-red-500 text-[10px] font-bold">*</span>}
                </div>
                <input
                  type="text"
                  value={attrMap[field.key]}
                  onChange={(e) => setAttrMap((p) => ({ ...p, [field.key]: e.target.value }))}
                  className="w-full border border-input rounded-lg px-3 py-1.5 text-xs bg-white font-mono focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            ))}
          </div>

          <div className={`flex items-start gap-2.5 px-3 py-2.5 rounded-xl border ${preset.accentBg} ${preset.accentBorder}`}>
            <Info className={`w-4 h-4 flex-shrink-0 mt-0.5 ${preset.accentText}`} />
            <p className={`text-xs ${preset.accentText}`}>{preset.attrNote}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ─── SSO Configuration Sub-tab ────────────────────────────────────────────────

function SsoConfigPanel() {
  const [protocol, setProtocol] = useState<SsoProvider>('saml')
  const [ssoEnabled, setSsoEnabled] = useState(true)
  const [selectedIdp, setSelectedIdp] = useState<string>('okta')

  // OIDC fields
  const [showSecret, setShowSecret] = useState(false)
  const [oidcClientId, setOidcClientId] = useState('')
  const [oidcClientSecret, setOidcClientSecret] = useState('')
  const [oidcDiscovery, setOidcDiscovery] = useState('')
  const [oidcTestStatus, setOidcTestStatus] = useState<'idle' | 'testing' | 'ok' | 'fail'>('idle')

  const [saved, setSaved] = useState(false)

  const SP_ENTITY_ID = 'https://acme.aqua-shell.io/saml/metadata'
  const ACS_URL = 'https://acme.aqua-shell.io/saml/acs'
  const OIDC_REDIRECT = 'https://acme.aqua-shell.io/auth/callback'

  const testOidc = () => {
    setOidcTestStatus('testing')
    setTimeout(() => setOidcTestStatus(Math.random() > 0.2 ? 'ok' : 'fail'), 2000)
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="space-y-5">
      {/* ── Enable + Protocol card ── */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
              <FileKey className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="flex-1">
              <CardTitle>Single Sign-On (SSO)</CardTitle>
              <CardDescription>Allow employees to authenticate using your corporate identity provider</CardDescription>
            </div>
            <Toggle checked={ssoEnabled} onChange={setSsoEnabled} />
          </div>
        </CardHeader>

        {ssoEnabled && (
          <CardContent className="space-y-4 pt-0">
            <div className="pt-3 border-t border-border">
              <p className="text-xs font-medium text-foreground mb-2">Authentication Protocol</p>
              <div className="flex gap-3">
                {([
                  { val: 'saml', label: 'SAML 2.0', badge: 'Enterprise Standard', desc: 'Okta, Azure AD, Google Workspace, OneLogin, JumpCloud' },
                  { val: 'oidc', label: 'OpenID Connect', badge: 'Modern OAuth2', desc: 'Auth0, Keycloak, AWS Cognito, custom OAuth2 providers' },
                ] as { val: SsoProvider; label: string; badge: string; desc: string }[]).map((p) => (
                  <label key={p.val}
                    className={`flex-1 flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                      protocol === p.val ? 'border-primary/50 bg-primary/5' : 'border-border hover:bg-muted/40'
                    }`}>
                    <input
                      type="radio" name="sso-protocol" value={p.val}
                      checked={protocol === p.val}
                      onChange={() => setProtocol(p.val)}
                      className="mt-0.5 accent-primary"
                    />
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-semibold text-foreground">{p.label}</p>
                        <Badge variant="muted" className="text-[10px] py-0">{p.badge}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{p.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* ── SAML: IdP Selector + per-provider content ── */}
      {ssoEnabled && protocol === 'saml' && (
        <>
          {/* Provider Tab Bar */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Identity Provider</CardTitle>
              <CardDescription>Select your IdP to get a tailored setup guide, SP field labels, and pre-filled attribute mappings</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              {/* Tab pills */}
              <div className="flex flex-wrap gap-2">
                {IDP_PRESET_ORDER.map((key) => {
                  const p = IDP_PRESETS[key]
                  const isActive = selectedIdp === key
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedIdp(key)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium transition-all ${
                        isActive
                          ? `${p.color} border-2 shadow-sm`
                          : 'border-border hover:bg-muted/50 text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <span className="text-base leading-none">{p.logo}</span>
                      <span>{p.shortName}</span>
                      {isActive && <Check className="w-3.5 h-3.5" />}
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Per-provider config — key forces full remount on provider switch */}
          <IdpPresetPanel
            key={selectedIdp}
            presetKey={selectedIdp}
            SP_ENTITY_ID={SP_ENTITY_ID}
            ACS_URL={ACS_URL}
          />

          {/* Advanced Options (shared across all providers) */}
          <SamlAdvancedOptions />
        </>
      )}

      {/* ── OIDC Config ── */}
      {ssoEnabled && protocol === 'oidc' && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">OpenID Connect Configuration</CardTitle>
            <CardDescription>Configure your OAuth 2.0 / OIDC identity provider</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ReadonlyField
              label="Redirect URI (Callback URL)"
              value={OIDC_REDIRECT}
              hint="Register this exact URL in your OIDC provider's allowed redirect URIs"
            />

            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                Discovery / Well-Known URL
              </label>
              <input
                type="url"
                value={oidcDiscovery}
                onChange={(e) => setOidcDiscovery(e.target.value)}
                placeholder="https://your-idp.com/.well-known/openid-configuration"
                className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-white font-mono focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <p className="text-[11px] text-muted-foreground mt-1">
                The OIDC discovery document URL — ends in <code className="font-mono bg-muted px-1 rounded">/.well-known/openid-configuration</code>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Client ID</label>
                <input
                  type="text"
                  value={oidcClientId}
                  onChange={(e) => setOidcClientId(e.target.value)}
                  placeholder="0oa1a2b3c4d5..."
                  className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-white font-mono focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Client Secret</label>
                <div className="relative">
                  <input
                    type={showSecret ? 'text' : 'password'}
                    value={oidcClientSecret}
                    onChange={(e) => setOidcClientSecret(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full border border-input rounded-lg px-3 py-2 pr-9 text-sm bg-white font-mono focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  <button
                    onClick={() => setShowSecret((s) => !s)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Scopes (space-separated)</label>
              <input
                type="text"
                defaultValue="openid profile email"
                className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-white font-mono focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <p className="text-[11px] text-muted-foreground mt-1">Standard scopes: <code className="font-mono bg-muted px-1 rounded">openid profile email</code>. Add <code className="font-mono bg-muted px-1 rounded">groups</code> if your IdP supports it.</p>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={testOidc} disabled={oidcTestStatus === 'testing'}>
                {oidcTestStatus === 'testing' ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
                {oidcTestStatus === 'testing' ? 'Fetching…' : 'Test OIDC Discovery'}
              </Button>
              {oidcTestStatus === 'ok' && (
                <p className="text-xs text-emerald-600 font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Discovery document fetched — endpoints look good
                </p>
              )}
              {oidcTestStatus === 'fail' && (
                <p className="text-xs text-red-600 font-medium flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" /> Could not fetch discovery document — check the URL
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {ssoEnabled && (
        <div className="flex justify-end">
          <Button size="sm" onClick={handleSave}>
            {saved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
            {saved ? 'Saved!' : 'Save SSO Configuration'}
          </Button>
        </div>
      )}
    </div>
  )
}

// ─── IP Whitelist Sub-tab ─────────────────────────────────────────────────────

function IpWhitelistPanel() {
  const [enabled, setEnabled] = useState(false)
  const [rules, setRules] = useState<IpRule[]>(INITIAL_IP_RULES)
  const [newLabel, setNewLabel] = useState('')
  const [newCidr, setNewCidr] = useState('')
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  const cidrRegex = /^(\d{1,3}\.){3}\d{1,3}(\/\d{1,2})?$/

  const addRule = () => {
    if (!newCidr.trim()) { setError('CIDR / IP is required'); return }
    if (!cidrRegex.test(newCidr.trim())) { setError('Invalid IP or CIDR notation (e.g. 203.0.113.0/24)'); return }
    setError('')
    setRules((p) => [...p, {
      id: `ip${Date.now()}`,
      label: newLabel.trim() || 'Untitled Range',
      cidr: newCidr.trim(),
      addedAt: new Date().toISOString().slice(0, 10),
    }])
    setNewLabel('')
    setNewCidr('')
  }

  const removeRule = (id: string) => setRules((p) => p.filter((r) => r.id !== id))

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
              <Network className="w-4 h-4 text-amber-600" />
            </div>
            <div className="flex-1">
              <CardTitle>IP Whitelist</CardTitle>
              <CardDescription>Restrict access to AQUA from specific IP addresses or CIDR ranges only</CardDescription>
            </div>
            <Toggle checked={enabled} onChange={setEnabled} />
          </div>
        </CardHeader>

        {enabled && (
          <CardContent className="space-y-4">
            <div className="flex items-start gap-2.5 px-3 py-2.5 rounded-xl bg-amber-50 border border-amber-200">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700">
                <span className="font-semibold">Warning:</span> Once enabled, logins from IPs not on this list will be blocked — including your own if not added. Ensure your current IP is included before saving.
              </p>
            </div>

            {/* Existing rules */}
            <div className="space-y-2">
              {rules.length === 0 && (
                <div className="text-center py-6 text-sm text-muted-foreground">No IP rules added yet. Add one below.</div>
              )}
              {rules.map((rule) => (
                <div key={rule.id}
                  className="flex items-center gap-3 p-3 rounded-xl border border-border bg-white">
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    <Network className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{rule.label}</p>
                    <p className="text-xs font-mono text-muted-foreground">{rule.cidr} · Added {rule.addedAt}</p>
                  </div>
                  <button
                    onClick={() => removeRule(rule.id)}
                    className="p-1.5 rounded-md text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Remove rule"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add new rule */}
            <div className="pt-2 border-t border-border space-y-3">
              <p className="text-xs font-semibold text-foreground">Add IP Rule</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="Label (e.g. Office)"
                  className="w-36 border border-input rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <input
                  type="text"
                  value={newCidr}
                  onChange={(e) => { setNewCidr(e.target.value); setError('') }}
                  placeholder="203.0.113.0/24"
                  className="flex-1 border border-input rounded-lg px-3 py-2 text-sm bg-white font-mono focus:outline-none focus:ring-2 focus:ring-primary/30"
                  onKeyDown={(e) => e.key === 'Enter' && addRule()}
                />
                <Button size="sm" onClick={addRule}>
                  <Plus className="w-3.5 h-3.5" />
                  Add
                </Button>
              </div>
              {error && <p className="text-xs text-red-600">{error}</p>}
              <p className="text-[11px] text-muted-foreground">
                Accepts single IPs (e.g. <code className="font-mono">192.168.1.1</code>) or CIDR blocks (e.g. <code className="font-mono">10.0.0.0/8</code>)
              </p>
            </div>
          </CardContent>
        )}

        {!enabled && (
          <CardContent>
            <div className="text-center py-6">
              <Network className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">IP Whitelist is currently disabled. Enable the toggle above to restrict access by IP.</p>
            </div>
          </CardContent>
        )}
      </Card>

      <div className="flex justify-end">
        <Button size="sm" onClick={handleSave}>
          {saved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
          {saved ? 'Saved!' : 'Save IP Whitelist'}
        </Button>
      </div>
    </div>
  )
}

// ─── Audit Log Sub-tab ────────────────────────────────────────────────────────

function AuditLogPanel() {
  const [filter, setFilter] = useState<'all' | 'success' | 'failed' | 'warning'>('all')
  const [search, setSearch] = useState('')

  const filtered = AUDIT_EVENTS.filter((e) => {
    const matchesFilter = filter === 'all' || e.status === filter
    const matchesSearch = !search ||
      e.user.toLowerCase().includes(search.toLowerCase()) ||
      e.event.toLowerCase().includes(search.toLowerCase()) ||
      e.ip.includes(search)
    return matchesFilter && matchesSearch
  })

  const eventIcon = (event: string) => {
    if (event.includes('Login') || event.includes('SSO')) return <LogIn className="w-3.5 h-3.5" />
    if (event.includes('Logout')) return <LogOutIcon className="w-3.5 h-3.5" />
    if (event.includes('Password')) return <KeyRound className="w-3.5 h-3.5" />
    if (event.includes('2FA') || event.includes('Enroll')) return <Smartphone className="w-3.5 h-3.5" />
    if (event.includes('Session')) return <Settings2 className="w-3.5 h-3.5" />
    return <Shield className="w-3.5 h-3.5" />
  }

  const statusStyle: Record<string, string> = {
    success: 'bg-emerald-100 text-emerald-700',
    failed: 'bg-red-100 text-red-700',
    warning: 'bg-amber-100 text-amber-700',
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                <ClipboardList className="w-4 h-4 text-slate-600" />
              </div>
              <div>
                <CardTitle>Security Audit Log</CardTitle>
                <CardDescription>Recent authentication and configuration events</CardDescription>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <ExternalLink className="w-3.5 h-3.5" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by user, event, or IP…"
              className="flex-1 min-w-[180px] border border-input rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <div className="flex gap-1 p-1 rounded-lg bg-muted">
              {(['all', 'success', 'failed', 'warning'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-all capitalize ${
                    filter === f ? 'bg-white shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Event list */}
          <div className="space-y-1.5">
            {filtered.length === 0 && (
              <div className="text-center py-8 text-sm text-muted-foreground">No events match your filter.</div>
            )}
            {filtered.map((evt) => (
              <div key={evt.id}
                className="flex items-start gap-3 p-3 rounded-xl border border-border hover:bg-muted/20 transition-colors">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${statusStyle[evt.status]}`}>
                  {eventIcon(evt.event)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-foreground">{evt.event}</p>
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${statusStyle[evt.status]}`}>
                      {evt.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{evt.detail}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[11px] text-muted-foreground">{evt.user}</span>
                    <span className="text-[11px] font-mono text-muted-foreground">{evt.ip}</span>
                  </div>
                </div>
                <span className="text-[11px] text-muted-foreground whitespace-nowrap flex-shrink-0">{evt.time}</span>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-muted-foreground text-center pt-1">
            Showing last 30 days · Audit logs are retained for 12 months
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

// ─── Security & SSO Root ──────────────────────────────────────────────────────

const SECURITY_TABS = [
  { id: 'settings', label: 'Security Settings', icon: Shield },
  { id: 'sso', label: 'SSO Configuration', icon: FileKey },
  { id: 'ip', label: 'IP Whitelist', icon: Network },
  { id: 'audit', label: 'Audit Log', icon: ClipboardList },
]

function SecuritySection() {
  const [tab, setTab] = useState('settings')

  return (
    <div className="space-y-4">
      {/* Sub-tab bar */}
      <div className="flex gap-1 p-1 rounded-xl bg-muted w-full overflow-x-auto">
        {SECURITY_TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex-1 justify-center ${
              tab === t.id
                ? 'bg-white shadow-sm text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <t.icon className="w-3.5 h-3.5" />
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'settings' && <SecuritySettingsPanel />}
      {tab === 'sso' && <SsoConfigPanel />}
      {tab === 'ip' && <IpWhitelistPanel />}
      {tab === 'audit' && <AuditLogPanel />}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('security')
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
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    activeSection === s.id
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

            {/* ── Organization ── */}
            {activeSection === 'organization' && (
              <Card>
                <CardHeader>
                  <CardTitle>Organization Profile</CardTitle>
                  <CardDescription>Basic information about your company</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 pb-4 border-b border-border">
                    <div className="w-16 h-16 rounded-2xl bg-cyan-100 flex items-center justify-center text-2xl flex-shrink-0">🏢</div>
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
                            {field.options?.map((o) => <option key={o} selected={o === field.value}>{o}</option>)}
                          </select>
                        ) : (
                          <input type="text" defaultValue={field.value} className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-ring" />
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end pt-2">
                    <Button size="sm"><Save className="w-3.5 h-3.5" />Save Changes</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* ── Users & Roles ── */}
            {activeSection === 'users' && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Roles & Permissions</CardTitle>
                      <CardDescription>Manage access control for your organization</CardDescription>
                    </div>
                    <Button size="sm"><UserCog className="w-3.5 h-3.5" />Create Role</Button>
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
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${role.color}`}>{role.users} users</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{role.description}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* ── Security & SSO ── */}
            {activeSection === 'security' && <SecuritySection />}

            {/* ── Notifications ── */}
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
                    <Button size="sm"><Save className="w-3.5 h-3.5" />Save Preferences</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* ── Appearance / Integrations ── */}
            {(activeSection === 'appearance' || activeSection === 'integrations') && (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="w-12 h-12 rounded-xl bg-muted mx-auto flex items-center justify-center mb-4">
                    {activeSection === 'appearance' ? <Palette className="w-6 h-6 text-muted-foreground" /> : <Globe className="w-6 h-6 text-muted-foreground" />}
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
