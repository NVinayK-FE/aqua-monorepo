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
  Search, Pencil, Ban, X, MapPin, Server,
} from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────

type SsoProvider = 'none' | 'saml' | 'oidc'
type TwoFAMethod = 'totp' | 'sms' | 'email'
type TwoFAEnforce = 'all' | 'admins' | 'off'

interface IpRule {
  id: string
  label: string
  cidr: string
  note: string
  addedAt: string
  addedBy: string
  active: boolean
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
  { id: 'ip1', label: 'HQ Office — San Francisco', cidr: '203.0.113.0/24',    note: 'Main office floor 3–5',        addedAt: '2025-01-15', addedBy: 'james.o@acme.com', active: true },
  { id: 'ip2', label: 'Corporate VPN Gateway',    cidr: '198.51.100.42/32',   note: 'GlobalProtect VPN endpoint',  addedAt: '2025-02-03', addedBy: 'james.o@acme.com', active: true },
  { id: 'ip3', label: 'NY Remote Office',          cidr: '192.0.2.0/24',       note: 'New York co-working space',   addedAt: '2025-02-20', addedBy: 'sarah.c@acme.com', active: true },
  { id: 'ip4', label: 'AWS NAT Gateway',           cidr: '54.239.28.85/32',    note: 'CI/CD pipeline outbound IP',  addedAt: '2025-03-01', addedBy: 'tom.a@acme.com',   active: false },
  { id: 'ip5', label: 'Office IPv6 Block',         cidr: '2001:db8::/32',      note: 'HQ IPv6 prefix',              addedAt: '2025-03-10', addedBy: 'james.o@acme.com', active: true },
]

interface BlockedAttempt {
  id: string
  ip: string
  user: string
  attempts: number
  lastSeen: string
  country: string
}

const BLOCKED_ATTEMPTS: BlockedAttempt[] = [
  { id: 'b1', ip: '185.220.101.34', user: 'sarah.chen@acme.com',   attempts: 7,  lastSeen: '2025-04-02 08:47', country: 'RU' },
  { id: 'b2', ip: '45.33.32.156',   user: 'marcus.j@acme.com',     attempts: 3,  lastSeen: '2025-04-01 23:12', country: 'CN' },
  { id: 'b3', ip: '167.71.89.240',  user: 'aisha.w@acme.com',      attempts: 12, lastSeen: '2025-04-01 16:05', country: 'NG' },
  { id: 'b4', ip: '193.32.127.54',  user: 'unknown',               attempts: 2,  lastSeen: '2025-03-31 11:43', country: 'DE' },
  { id: 'b5', ip: '103.21.244.0',   user: 'priya.s@acme.com',      attempts: 1,  lastSeen: '2025-03-30 07:30', country: 'IN' },
]

// Simulated "current browser IP" for the "add my IP" convenience feature
const DETECTED_IP = '203.0.113.5'

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

// ─── QR Code Preview (decorative — real QR generated per user during enrollment) ─

function QrCodePreview({ issuer, account }: { issuer: string; account: string }) {
  // Build a deterministic fake QR grid from issuer+account string
  const seed = (issuer + account).split('').reduce((a, c) => (a * 31 + c.charCodeAt(0)) & 0xffff, 0)
  const SIZE = 21
  const lcg = (n: number) => ((n * 1664525 + 1013904223) & 0xffffffff) >>> 0

  const cells: boolean[][] = Array.from({ length: SIZE }, (_, r) =>
    Array.from({ length: SIZE }, (_, c) => {
      // Top-left finder 7×7
      if (r < 7 && c < 7) {
        if (r === 0 || r === 6 || c === 0 || c === 6) return true
        if (r >= 2 && r <= 4 && c >= 2 && c <= 4) return true
        return false
      }
      // Top-right finder
      if (r < 7 && c >= SIZE - 7) {
        const cc = c - (SIZE - 7)
        if (r === 0 || r === 6 || cc === 0 || cc === 6) return true
        if (r >= 2 && r <= 4 && cc >= 2 && cc <= 4) return true
        return false
      }
      // Bottom-left finder
      if (r >= SIZE - 7 && c < 7) {
        const rr = r - (SIZE - 7)
        if (rr === 0 || rr === 6 || c === 0 || c === 6) return true
        if (rr >= 2 && rr <= 4 && c >= 2 && c <= 4) return true
        return false
      }
      // Timing strips
      if (r === 6 || c === 6) return (r + c) % 2 === 0
      // Quiet zone separators
      if (r === 7 || c === 7) return false
      if (r === SIZE - 8 && c < 8) return false
      if (c === SIZE - 8 && r < 8) return false
      // Small alignment pattern near bottom-right
      if (r >= SIZE - 9 && r <= SIZE - 5 && c >= SIZE - 9 && c <= SIZE - 5) {
        const dr = r - (SIZE - 7), dc = c - (SIZE - 7)
        if (dr === 0 || dr === 4 || dc === 0 || dc === 4) return true  // no‐op: outer ring already handled
        if (dr === 2 && dc === 2) return true
        return Math.abs(dr) <= 1 && Math.abs(dc) <= 1 ? (dr === 0 && dc === 0) : false
      }
      // Data modules — deterministic pseudo-random
      const idx = r * SIZE + c
      const v = lcg(seed ^ (idx * 1234567)) % 100
      return v < 52
    })
  )

  return (
    <div className="p-3 bg-white rounded-xl border border-border inline-block shadow-sm">
      <svg
        width={120}
        height={120}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        shapeRendering="crispEdges"
        style={{ display: 'block' }}
      >
        <rect width={SIZE} height={SIZE} fill="white" />
        {cells.flatMap((row, r) =>
          row.map((filled, c) =>
            filled ? (
              <rect key={`${r}-${c}`} x={c} y={r} width={1} height={1} fill="#111827" />
            ) : null,
          ),
        )}
      </svg>
    </div>
  )
}

// ─── TOTP Configuration Panel (shown when TOTP method is enabled) ─────────────

const TOTP_APPS = [
  { name: 'Google Authenticator', icon: '🔵', platforms: 'iOS · Android', notes: 'Most widely used. Simple, no cloud backup.', docsUrl: 'https://support.google.com/accounts/answer/1066447' },
  { name: 'Microsoft Authenticator', icon: '🟦', platforms: 'iOS · Android', notes: 'Enterprise-friendly. Supports Microsoft accounts natively.', docsUrl: 'https://support.microsoft.com/en-us/account-billing/download-and-install-the-microsoft-authenticator-app' },
  { name: 'Authy', icon: '🔴', platforms: 'iOS · Android · Desktop', notes: 'Multi-device sync. Best for users who switch phones often.', docsUrl: 'https://authy.com/download/' },
  { name: '1Password', icon: '🟠', platforms: 'iOS · Android · Desktop', notes: 'Built-in TOTP in password manager vault.', docsUrl: 'https://support.1password.com/one-time-passwords/' },
  { name: 'Bitwarden', icon: '🟩', platforms: 'iOS · Android · Desktop', notes: 'Free open-source option with TOTP support (Premium plan).', docsUrl: 'https://bitwarden.com/help/authenticator-keys/' },
  { name: 'Apple Passwords', icon: '⬜', platforms: 'iOS 17+ · macOS Sonoma+', notes: 'Built into iPhone/Mac. No separate app needed for Apple users.', docsUrl: 'https://support.apple.com/guide/iphone/use-built-in-two-factor-authentication-iph6d1d1665/ios' },
]

// Fake mock enrollment stats
const TOTP_ENROLLMENT = { enrolled: 48, pending: 12, notEnrolled: 116, total: 176 }

function TotpConfigPanel() {
  const [issuerName, setIssuerName] = useState('AQUA HRMS')
  const [algorithm, setAlgorithm] = useState<'SHA1' | 'SHA256' | 'SHA512'>('SHA1')
  const [digits, setDigits] = useState<'6' | '8'>('6')
  const [timeStep, setTimeStep] = useState<'30' | '60'>('30')
  const [clockSkew, setClockSkew] = useState('1')
  const [backupCodesEnabled, setBackupCodesEnabled] = useState(true)
  const [backupCodeCount, setBackupCodeCount] = useState('10')
  const [backupSingleUse, setBackupSingleUse] = useState(true)
  const [allowSelfRegenerate, setAllowSelfRegenerate] = useState(true)
  const [showOtpauthUri, setShowOtpauthUri] = useState(false)
  const [resetUser, setResetUser] = useState('')
  const [resetDone, setResetDone] = useState(false)
  const [appsSectionOpen, setAppsSectionOpen] = useState(false)

  const previewAccount = 'sarah.chen@acme.com'
  const previewSecret = 'JBSWY3DPEHPK3PXPJBSWY3DPEHPK3PX'
  const otpauthUri = `otpauth://totp/${encodeURIComponent(issuerName)}:${encodeURIComponent(previewAccount)}?secret=${previewSecret}&issuer=${encodeURIComponent(issuerName)}&algorithm=${algorithm}&digits=${digits}&period=${timeStep}`

  const enrolledPct = Math.round((TOTP_ENROLLMENT.enrolled / TOTP_ENROLLMENT.total) * 100)

  const handleReset = () => {
    if (!resetUser.trim()) return
    setResetDone(true)
    setTimeout(() => { setResetDone(false); setResetUser('') }, 3000)
  }

  return (
    <div className="mt-3 ml-1 space-y-4 animate-in fade-in duration-200">

      {/* ── TOTP Settings ── */}
      <div className="rounded-xl border border-violet-200 bg-violet-50/40 overflow-hidden">
        <div className="px-4 py-3 border-b border-violet-200 bg-violet-50">
          <p className="text-xs font-semibold text-violet-800">TOTP Configuration</p>
          <p className="text-[11px] text-violet-600 mt-0.5">Settings applied when users enroll their authenticator app</p>
        </div>
        <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Issuer / App Name</label>
            <input
              type="text"
              value={issuerName}
              onChange={(e) => setIssuerName(e.target.value)}
              placeholder="AQUA HRMS"
              className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-300"
            />
            <p className="text-[11px] text-muted-foreground mt-1">Shown inside the authenticator app next to the code</p>
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">OTP Digits</label>
            <select
              value={digits}
              onChange={(e) => setDigits(e.target.value as '6' | '8')}
              className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-300"
            >
              <option value="6">6 digits (standard)</option>
              <option value="8">8 digits (higher security)</option>
            </select>
            <p className="text-[11px] text-muted-foreground mt-1">6 digits is compatible with all apps</p>
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Time Step</label>
            <select
              value={timeStep}
              onChange={(e) => setTimeStep(e.target.value as '30' | '60')}
              className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-300"
            >
              <option value="30">30 seconds (standard)</option>
              <option value="60">60 seconds (relaxed)</option>
            </select>
            <p className="text-[11px] text-muted-foreground mt-1">How long each OTP code is valid</p>
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Clock Skew Tolerance</label>
            <select
              value={clockSkew}
              onChange={(e) => setClockSkew(e.target.value)}
              className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-300"
            >
              <option value="1">±1 window (recommended)</option>
              <option value="2">±2 windows</option>
              <option value="3">±3 windows</option>
            </select>
            <p className="text-[11px] text-muted-foreground mt-1">Accepts codes from adjacent time windows to handle clock drift</p>
          </div>
        </div>
        <div className="px-4 pb-4">
          <label className="block text-xs font-medium text-foreground mb-1.5">Algorithm</label>
          <div className="flex gap-2">
            {(['SHA1', 'SHA256', 'SHA512'] as const).map((alg) => (
              <label
                key={alg}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer text-xs font-medium transition-colors ${
                  algorithm === alg
                    ? 'border-violet-400 bg-violet-100 text-violet-800'
                    : 'border-border hover:bg-muted/50 text-muted-foreground'
                }`}
              >
                <input
                  type="radio"
                  name="totp-algo"
                  value={alg}
                  checked={algorithm === alg}
                  onChange={() => setAlgorithm(alg)}
                  className="accent-violet-600 sr-only"
                />
                {alg}
                {alg === 'SHA1' && <Badge variant="muted" className="text-[9px] py-0 px-1">Most Compatible</Badge>}
                {alg === 'SHA256' && <Badge variant="muted" className="text-[9px] py-0 px-1">Balanced</Badge>}
                {alg === 'SHA512' && <Badge variant="muted" className="text-[9px] py-0 px-1">Max Security</Badge>}
              </label>
            ))}
          </div>
          {algorithm !== 'SHA1' && (
            <div className="flex items-start gap-2 mt-2 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-amber-700">
                <span className="font-semibold">{algorithm}</span> is not supported by Google Authenticator or Apple Passwords. Recommend SHA1 for maximum app compatibility.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Enrollment Preview ── */}
      <div className="rounded-xl border border-border bg-white overflow-hidden">
        <div className="px-4 py-3 border-b border-border bg-muted/30">
          <p className="text-xs font-semibold text-foreground">User Enrollment Preview</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">This is what your employees will see when setting up their authenticator app</p>
        </div>
        <div className="p-4">
          {/* Enrollment steps */}
          <div className="flex items-start gap-0 mb-5 overflow-x-auto pb-1">
            {[
              { n: 1, title: 'Install an app', desc: 'Download any TOTP-compatible authenticator', icon: '📲' },
              { n: 2, title: 'Scan QR code', desc: `Open the app and scan the code below`, icon: '📷' },
              { n: 3, title: 'Enter 6-digit code', desc: 'Type the code shown in your app to verify', icon: '🔢' },
              { n: 4, title: 'Save backup codes', desc: 'Store emergency codes in a safe place', icon: '🔐' },
            ].map((step, i, arr) => (
              <div key={step.n} className="flex items-start min-w-0">
                <div className="flex flex-col items-center min-w-[120px] px-2">
                  <div className="w-8 h-8 rounded-full bg-violet-100 border-2 border-violet-300 flex items-center justify-center text-sm mb-1.5 flex-shrink-0">
                    {step.icon}
                  </div>
                  <p className="text-[11px] font-semibold text-foreground text-center">{step.title}</p>
                  <p className="text-[10px] text-muted-foreground text-center mt-0.5">{step.desc}</p>
                </div>
                {i < arr.length - 1 && (
                  <div className="mt-3.5 flex-1 min-w-[20px] h-px bg-violet-200 mx-1" />
                )}
              </div>
            ))}
          </div>

          {/* QR code + details */}
          <div className="flex flex-wrap gap-5 items-start">
            <div className="flex flex-col items-center gap-2">
              <QrCodePreview issuer={issuerName} account={previewAccount} />
              <p className="text-[10px] text-muted-foreground">Sample QR (preview only)</p>
            </div>
            <div className="flex-1 min-w-[200px] space-y-3">
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">What users see in their app</p>
                <div className="rounded-xl border border-border p-3 bg-muted/20 space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-muted-foreground">Issuer / App Name</span>
                    <span className="text-xs font-semibold text-foreground font-mono">{issuerName || 'AQUA HRMS'}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-muted-foreground">Account</span>
                    <span className="text-xs font-mono text-foreground">{previewAccount}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-muted-foreground">Code length</span>
                    <span className="text-xs font-mono text-foreground">{digits} digits</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-muted-foreground">Refresh interval</span>
                    <span className="text-xs font-mono text-foreground">every {timeStep}s</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-muted-foreground">Algorithm</span>
                    <span className="text-xs font-mono text-foreground">{algorithm}</span>
                  </div>
                </div>
              </div>

              {/* Manual entry key */}
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">Manual Entry Key (if camera unavailable)</p>
                <div className="flex items-center gap-1 border border-input rounded-lg bg-white px-3 py-2">
                  <span className="flex-1 text-xs font-mono text-foreground tracking-widest">
                    {previewSecret.match(/.{1,4}/g)?.join(' ')}
                  </span>
                  <CopyButton value={previewSecret} />
                </div>
              </div>

              {/* otpauth URI toggle */}
              <div>
                <button
                  onClick={() => setShowOtpauthUri((v) => !v)}
                  className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ChevronDown className={`w-3 h-3 transition-transform ${showOtpauthUri ? 'rotate-180' : ''}`} />
                  View otpauth:// URI
                </button>
                {showOtpauthUri && (
                  <div className="mt-1.5 flex items-start gap-1 border border-input rounded-lg bg-muted/30 px-3 py-2">
                    <span className="flex-1 text-[10px] font-mono text-muted-foreground break-all">{otpauthUri}</span>
                    <CopyButton value={otpauthUri} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Backup Codes ── */}
      <div className="rounded-xl border border-border bg-white overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
          <div>
            <p className="text-xs font-semibold text-foreground">Backup / Recovery Codes</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">One-time codes users can use if they lose access to their authenticator app</p>
          </div>
          <Toggle checked={backupCodesEnabled} onChange={setBackupCodesEnabled} size="sm" />
        </div>

        {backupCodesEnabled && (
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Number of codes</label>
                <select
                  value={backupCodeCount}
                  onChange={(e) => setBackupCodeCount(e.target.value)}
                  className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  {['6', '8', '10', '12'].map((v) => <option key={v} value={v}>{v} codes</option>)}
                </select>
              </div>
              <div className="col-span-2 space-y-2 pt-1">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={backupSingleUse}
                    onChange={(e) => setBackupSingleUse(e.target.checked)}
                    className="w-4 h-4 rounded accent-primary"
                  />
                  <div>
                    <span className="text-sm text-foreground">Single-use codes (recommended)</span>
                    <p className="text-[11px] text-muted-foreground">Each backup code can only be used once — prevents replay attacks</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allowSelfRegenerate}
                    onChange={(e) => setAllowSelfRegenerate(e.target.checked)}
                    className="w-4 h-4 rounded accent-primary"
                  />
                  <div>
                    <span className="text-sm text-foreground">Allow users to regenerate their own codes</span>
                    <p className="text-[11px] text-muted-foreground">If disabled, only admins can regenerate backup codes</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Sample backup codes preview */}
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">Sample backup codes (preview)</p>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {['7K2M-9NXP', 'Q4RT-WV8H', 'B6YC-3FDJ', 'H9PL-2MSK', 'X1NE-7QAZ',
                  'R5TG-4WBV', 'P3JU-6CNX', 'M8KD-1YHF', 'W2AE-5QTL', 'V7SB-0PRG',
                ].slice(0, parseInt(backupCodeCount)).map((code) => (
                  <div key={code} className="px-3 py-1.5 rounded-lg bg-muted/60 border border-border text-center font-mono text-xs text-foreground">
                    {code}
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-muted-foreground mt-2">Actual codes are randomly generated per user during enrollment.</p>
            </div>
          </div>
        )}

        {!backupCodesEnabled && (
          <div className="px-4 py-3">
            <div className="flex items-start gap-2.5 px-3 py-2.5 rounded-xl bg-amber-50 border border-amber-200">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700">
                <span className="font-semibold">Warning:</span> Without backup codes, users who lose their authenticator device will be completely locked out. An admin must manually reset their 2FA.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── Compatible Apps ── */}
      <div className="rounded-xl border border-border bg-white overflow-hidden">
        <button
          onClick={() => setAppsSectionOpen((v) => !v)}
          className="w-full flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30 text-left"
        >
          <div>
            <p className="text-xs font-semibold text-foreground">Compatible Authenticator Apps</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">These apps are tested and recommended for your employees</p>
          </div>
          <ChevronDown className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform ${appsSectionOpen ? 'rotate-180' : ''}`} />
        </button>

        {appsSectionOpen && (
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            {TOTP_APPS.map((app) => (
              <div key={app.name} className="flex items-start gap-3 p-3 rounded-xl border border-border hover:bg-muted/20 transition-colors">
                <span className="text-xl flex-shrink-0 mt-0.5">{app.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-foreground">{app.name}</p>
                    <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">{app.platforms}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{app.notes}</p>
                </div>
                <a
                  href={app.docsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors flex-shrink-0 mt-0.5"
                  title="View documentation"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Enrollment Status + Admin Reset ── */}
      <div className="rounded-xl border border-border bg-white overflow-hidden">
        <div className="px-4 py-3 border-b border-border bg-muted/30">
          <p className="text-xs font-semibold text-foreground">Enrollment Status</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Current TOTP adoption across {TOTP_ENROLLMENT.total} employees</p>
        </div>
        <div className="p-4 space-y-4">
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Enrolled', count: TOTP_ENROLLMENT.enrolled, color: 'bg-emerald-100 text-emerald-700', bar: 'bg-emerald-500' },
              { label: 'Pending enrollment', count: TOTP_ENROLLMENT.pending, color: 'bg-amber-100 text-amber-700', bar: 'bg-amber-400' },
              { label: 'Not enrolled', count: TOTP_ENROLLMENT.notEnrolled, color: 'bg-slate-100 text-slate-600', bar: 'bg-slate-300' },
            ].map((s) => (
              <div key={s.label} className={`rounded-xl px-3 py-2.5 ${s.color}`}>
                <p className="text-lg font-bold">{s.count}</p>
                <p className="text-[11px] font-medium">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <p className="text-[11px] text-muted-foreground">Overall adoption</p>
              <p className="text-[11px] font-semibold text-foreground">{enrolledPct}%</p>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all"
                style={{ width: `${enrolledPct}%` }}
              />
            </div>
          </div>

          {/* Admin reset */}
          <div className="border-t border-border pt-4 space-y-2">
            <p className="text-xs font-semibold text-foreground">Reset TOTP for a User</p>
            <p className="text-[11px] text-muted-foreground">Revokes the user's current TOTP secret. They will be prompted to re-enroll on next login.</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={resetUser}
                onChange={(e) => setResetUser(e.target.value)}
                placeholder="Enter employee email address…"
                className="flex-1 border border-input rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
                onKeyDown={(e) => e.key === 'Enter' && handleReset()}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                disabled={!resetUser.trim() || resetDone}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                {resetDone ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <RefreshCw className="w-3.5 h-3.5" />}
                {resetDone ? 'Reset!' : 'Reset TOTP'}
              </Button>
            </div>
            {resetDone && (
              <p className="text-xs text-emerald-600 font-medium flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                TOTP reset for {resetUser} — they will re-enroll on next login.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Security Settings Panel ──────────────────────────────────────────────────

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
                <div key={m.key}>
                  <div
                    className={`flex items-center gap-4 p-3 rounded-xl border transition-colors ${
                      m.key === 'totp' && twoFAMethods.totp
                        ? 'border-violet-300 bg-violet-50/60'
                        : 'border-border hover:bg-muted/20'
                    }`}
                  >
                    <span className="text-lg flex-shrink-0">{m.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-foreground">{m.label}</p>
                        {m.recommended && <Badge variant="success" className="text-[10px] py-0">Recommended</Badge>}
                        {m.key === 'totp' && twoFAMethods.totp && (
                          <Badge variant="default" className="text-[10px] py-0">Configured ↓</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{m.desc}</p>
                    </div>
                    <Toggle checked={twoFAMethods[m.key]} onChange={() => toggleMethod(m.key)} />
                  </div>
                  {/* TOTP config panel — expands in-place when TOTP is enabled */}
                  {m.key === 'totp' && twoFAMethods.totp && <TotpConfigPanel />}
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

// ─── IP Whitelist helpers ──────────────────────────────────────────────────────

function cidrSize(cidr: string): { count: string; label: string } {
  const isIPv6 = cidr.includes(':')
  const parts = cidr.split('/')
  const prefix = parts[1] ? parseInt(parts[1]) : (isIPv6 ? 128 : 32)
  const bits   = isIPv6 ? 128 : 32
  const hosts  = Math.pow(2, bits - prefix)
  if (hosts === 1)            return { count: '1',                              label: 'Single IP' }
  if (hosts < 1000)           return { count: String(hosts),                    label: `/${prefix} Range` }
  if (hosts < 1_000_000)      return { count: `${(hosts / 1024).toFixed(0)}K`,  label: `/${prefix} Block` }
  return                             { count: `${(hosts / 1_048_576).toFixed(0)}M`, label: `/${prefix} Block` }
}

function isValidCidr(v: string): boolean {
  const ipv4 = /^(\d{1,3}\.){3}\d{1,3}(\/([0-9]|[1-2]\d|3[0-2]))?$/
  const ipv6  = /^[0-9a-fA-F:]+(:\/([0-9]|[1-9]\d|1[0-1]\d|12[0-8]))?$/
  return ipv4.test(v) || ipv6.test(v)
}

function ruleMatchesIp(rule: IpRule, ip: string): boolean {
  // Exact match or prefix match (simplified for UI demo)
  if (rule.cidr === ip) return true
  const [base, prefix] = rule.cidr.split('/')
  if (!prefix) return rule.cidr === ip
  // For /32 or no mask → exact
  const bits = parseInt(prefix)
  if (bits === 32) return base === ip
  // Simple prefix check: compare first N octets based on prefix length
  const ipParts   = ip.split('.').map(Number)
  const baseParts = base.split('.').map(Number)
  const fullOctets = Math.floor(bits / 8)
  for (let i = 0; i < fullOctets; i++) {
    if (ipParts[i] !== baseParts[i]) return false
  }
  return true
}

// ─── IP Whitelist Sub-tab ─────────────────────────────────────────────────────

function IpWhitelistPanel() {
  // ── Master enable ──
  const [enabled, setEnabled]           = useState(true)

  // ── Enforcement policy ──
  const [scope, setScope]               = useState<'all' | 'admins' | 'custom'>('all')
  const [action, setAction]             = useState<'block' | 'alert'>('block')
  const [bypassSuperAdmin, setBypassSuperAdmin] = useState(true)

  // ── Rules list ──
  const [rules, setRules]               = useState<IpRule[]>(INITIAL_IP_RULES)
  const [search, setSearch]             = useState('')
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all')
  const [selected, setSelected]         = useState<Set<string>>(new Set())
  const [editingId, setEditingId]       = useState<string | null>(null)
  const [editBuf, setEditBuf]           = useState<Partial<IpRule>>({})

  // ── Add rule form ──
  const [addLabel, setAddLabel]         = useState('')
  const [addCidr, setAddCidr]           = useState('')
  const [addNote, setAddNote]           = useState('')
  const [addError, setAddError]         = useState('')
  const [addFormOpen, setAddFormOpen]   = useState(false)
  const [myIpAdded, setMyIpAdded]       = useState(false)

  // ── Test IP tool ──
  const [testIp, setTestIp]             = useState('')
  const [testResult, setTestResult]     = useState<null | { allowed: boolean; rule?: IpRule }>(null)

  // ── Save ──
  const [saved, setSaved]               = useState(false)

  // ─ derived ─
  const filtered = rules.filter((r) => {
    const matchSearch = !search ||
      r.label.toLowerCase().includes(search.toLowerCase()) ||
      r.cidr.includes(search) ||
      r.note.toLowerCase().includes(search.toLowerCase())
    const matchActive =
      filterActive === 'all' ||
      (filterActive === 'active'   && r.active) ||
      (filterActive === 'inactive' && !r.active)
    return matchSearch && matchActive
  })

  const activeCount   = rules.filter((r) => r.active).length
  const inactiveCount = rules.length - activeCount

  // ─ helpers ─
  const toggleSelect = (id: string) =>
    setSelected((prev) => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s })

  const selectAll = () =>
    setSelected(filtered.length === selected.size ? new Set() : new Set(filtered.map((r) => r.id)))

  const bulkSetActive = (active: boolean) => {
    setRules((p) => p.map((r) => selected.has(r.id) ? { ...r, active } : r))
    setSelected(new Set())
  }

  const bulkDelete = () => {
    setRules((p) => p.filter((r) => !selected.has(r.id)))
    setSelected(new Set())
  }

  const toggleActive = (id: string) =>
    setRules((p) => p.map((r) => r.id === id ? { ...r, active: !r.active } : r))

  const deleteRule = (id: string) =>
    setRules((p) => p.filter((r) => r.id !== id))

  const startEdit = (rule: IpRule) => {
    setEditingId(rule.id)
    setEditBuf({ label: rule.label, cidr: rule.cidr, note: rule.note })
  }

  const saveEdit = () => {
    if (!editBuf.cidr?.trim() || !isValidCidr(editBuf.cidr.trim())) return
    setRules((p) => p.map((r) => r.id === editingId ? { ...r, ...editBuf } : r))
    setEditingId(null)
  }

  const addRule = () => {
    if (!addCidr.trim())                { setAddError('IP / CIDR is required'); return }
    if (!isValidCidr(addCidr.trim()))   { setAddError('Invalid format. Use IPv4 (e.g. 10.0.0.0/8), /32 for single, or IPv6.'); return }
    setAddError('')
    setRules((p) => [...p, {
      id:       `ip${Date.now()}`,
      label:    addLabel.trim() || 'Untitled',
      cidr:     addCidr.trim(),
      note:     addNote.trim(),
      addedAt:  new Date().toISOString().slice(0, 10),
      addedBy:  'james.o@acme.com',
      active:   true,
    }])
    setAddLabel(''); setAddCidr(''); setAddNote(''); setAddFormOpen(false)
  }

  const addMyIp = () => {
    if (rules.some((r) => r.cidr === DETECTED_IP || r.cidr === `${DETECTED_IP}/32`)) {
      setMyIpAdded(true); setTimeout(() => setMyIpAdded(false), 2500); return
    }
    setRules((p) => [...p, {
      id: `ip${Date.now()}`,
      label: 'My Current IP',
      cidr: `${DETECTED_IP}/32`,
      note: 'Added via "Add My IP" button',
      addedAt: new Date().toISOString().slice(0, 10),
      addedBy: 'james.o@acme.com',
      active: true,
    }])
    setMyIpAdded(true); setTimeout(() => setMyIpAdded(false), 2500)
  }

  const runTest = () => {
    if (!testIp.trim()) return
    const match = rules.find((r) => r.active && ruleMatchesIp(r, testIp.trim()))
    setTestResult({ allowed: !!match, rule: match })
  }

  const addBlockedToWhitelist = (attempt: BlockedAttempt) => {
    if (rules.some((r) => r.cidr === attempt.ip || r.cidr === `${attempt.ip}/32`)) return
    setRules((p) => [...p, {
      id: `ip${Date.now()}`,
      label: `Allow ${attempt.ip}`,
      cidr: `${attempt.ip}/32`,
      note: `Added from blocked attempts log`,
      addedAt: new Date().toISOString().slice(0, 10),
      addedBy: 'james.o@acme.com',
      active: true,
    }])
  }

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2500) }

  const INPUT_CLS = 'w-full border border-input rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-300'
  const MONO_INPUT = `${INPUT_CLS} font-mono`

  return (
    <div className="space-y-5">

      {/* ══ 1. MASTER ENABLE ══════════════════════════════════════════════════ */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
              <Network className="w-4 h-4 text-amber-600" />
            </div>
            <div className="flex-1">
              <CardTitle>IP Whitelist</CardTitle>
              <CardDescription>Restrict AQUA access to specific IP addresses or CIDR ranges</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {enabled
                ? <Badge variant="success">Active</Badge>
                : <Badge variant="muted">Disabled</Badge>}
              <Toggle checked={enabled} onChange={setEnabled} />
            </div>
          </div>
        </CardHeader>

        {/* stats strip */}
        <CardContent className="pt-0">
          <div className="grid grid-cols-3 divide-x divide-border border border-border rounded-xl overflow-hidden">
            {[
              { label: 'Total Rules',    value: rules.length,  color: 'text-foreground' },
              { label: 'Active',         value: activeCount,   color: 'text-emerald-600' },
              { label: 'Inactive',       value: inactiveCount, color: 'text-muted-foreground' },
            ].map((s) => (
              <div key={s.label} className="flex flex-col items-center py-3 px-4 bg-muted/20">
                <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-[11px] text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>

          {!enabled && (
            <div className="mt-4 flex items-start gap-2.5 px-3 py-2.5 rounded-xl bg-muted/40 border border-border">
              <Info className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground">
                IP Whitelist is <span className="font-semibold">disabled</span>. All IPs can access AQUA. Enable the toggle to enforce the rules below.
              </p>
            </div>
          )}
          {enabled && (
            <div className="mt-4 flex items-start gap-2.5 px-3 py-2.5 rounded-xl bg-amber-50 border border-amber-200">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700">
                <span className="font-semibold">Active — </span>
                Only IPs matching an active rule below are allowed. Your detected IP is{' '}
                <code className="font-mono bg-amber-100 px-1 rounded">{DETECTED_IP}</code>{' '}
                — make sure it is in the list before saving.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ══ 2. ENFORCEMENT POLICY ════════════════════════════════════════════ */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Enforcement Policy</CardTitle>
          <CardDescription>Who is subject to IP restrictions and what happens on violation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">

          {/* scope */}
          <div>
            <p className="text-xs font-medium text-foreground mb-2">Apply IP Restriction To</p>
            <div className="space-y-2">
              {([
                { val: 'all',    label: 'All users',               desc: 'Every employee must connect from an allowed IP' },
                { val: 'admins', label: 'Admins & Managers only',  desc: 'HR Admins, Managers, and Super Admins only — employees are unrestricted' },
                { val: 'custom', label: 'Custom role selection',   desc: 'Choose which roles are subject to IP enforcement' },
              ] as { val: typeof scope; label: string; desc: string }[]).map((opt) => (
                <label key={opt.val} className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                  scope === opt.val ? 'border-amber-300 bg-amber-50' : 'border-border hover:bg-muted/40'
                }`}>
                  <input type="radio" name="ip-scope" value={opt.val} checked={scope === opt.val}
                    onChange={() => setScope(opt.val)} className="mt-0.5 accent-amber-500" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{opt.label}</p>
                    <p className="text-xs text-muted-foreground">{opt.desc}</p>
                  </div>
                </label>
              ))}
            </div>
            {scope === 'custom' && (
              <div className="mt-3 flex flex-wrap gap-2 p-3 rounded-xl border border-border bg-muted/20">
                {['Super Admin', 'HR Admin', 'Manager', 'Employee'].map((role) => {
                  const defaultOn = role !== 'Employee'
                  return (
                    <label key={role} className="flex items-center gap-2 cursor-pointer text-xs font-medium text-foreground">
                      <input type="checkbox" defaultChecked={defaultOn} className="rounded accent-amber-500 w-3.5 h-3.5" />
                      {role}
                    </label>
                  )
                })}
              </div>
            )}
          </div>

          {/* action on violation */}
          <div>
            <p className="text-xs font-medium text-foreground mb-2">Action on Blocked IP</p>
            <div className="flex gap-3">
              {([
                { val: 'block', label: 'Block access',  desc: 'Return 403 — deny login entirely', icon: <Ban className="w-3.5 h-3.5" /> },
                { val: 'alert', label: 'Alert only',    desc: 'Allow login but log and send admin alert', icon: <AlertTriangle className="w-3.5 h-3.5" /> },
              ] as { val: typeof action; label: string; desc: string; icon: React.ReactNode }[]).map((opt) => (
                <label key={opt.val} className={`flex-1 flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                  action === opt.val ? 'border-amber-300 bg-amber-50' : 'border-border hover:bg-muted/40'
                }`}>
                  <input type="radio" name="ip-action" value={opt.val} checked={action === opt.val}
                    onChange={() => setAction(opt.val)} className="mt-0.5 accent-amber-500" />
                  <div>
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className={action === opt.val ? 'text-amber-700' : 'text-muted-foreground'}>{opt.icon}</span>
                      <p className="text-sm font-medium text-foreground">{opt.label}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">{opt.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* bypass super admin */}
          <div className="flex items-center gap-4 p-3 rounded-xl border border-border">
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Always allow Super Admins</p>
              <p className="text-xs text-muted-foreground">Super Admins are never blocked, even if their IP is not on the list — prevents complete lockout</p>
            </div>
            <Toggle checked={bypassSuperAdmin} onChange={setBypassSuperAdmin} />
          </div>
        </CardContent>
      </Card>

      {/* ══ 3. RULES LIST ════════════════════════════════════════════════════ */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <CardTitle className="text-sm">Allowed IP Rules</CardTitle>
              <CardDescription>Add individual IPs or CIDR blocks that are permitted to access AQUA</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={addMyIp}>
                {myIpAdded ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <MapPin className="w-3.5 h-3.5" />}
                {myIpAdded ? 'Added!' : `Add My IP  (${DETECTED_IP})`}
              </Button>
              <Button size="sm" onClick={() => setAddFormOpen((v) => !v)}>
                <Plus className="w-3.5 h-3.5" />
                Add Rule
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">

          {/* ── Add rule inline form ── */}
          {addFormOpen && (
            <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 space-y-3">
              <p className="text-xs font-semibold text-amber-800">New IP Rule</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Label</label>
                  <input value={addLabel} onChange={(e) => setAddLabel(e.target.value)}
                    placeholder="e.g. London Office" className={INPUT_CLS} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    IP Address / CIDR <span className="text-red-500">*</span>
                  </label>
                  <input value={addCidr} onChange={(e) => { setAddCidr(e.target.value); setAddError('') }}
                    placeholder="203.0.113.0/24  or  10.1.2.3"
                    onKeyDown={(e) => e.key === 'Enter' && addRule()}
                    className={`${MONO_INPUT} ${addError ? 'border-red-400 focus:ring-red-300' : ''}`} />
                  {addCidr && isValidCidr(addCidr) && (
                    <p className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      {cidrSize(addCidr).count} IP{cidrSize(addCidr).count !== '1' ? 's' : ''} — {cidrSize(addCidr).label}
                    </p>
                  )}
                  {addError && <p className="text-[11px] text-red-600 mt-1">{addError}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Note (optional)</label>
                  <input value={addNote} onChange={(e) => setAddNote(e.target.value)}
                    placeholder="Purpose or location" className={INPUT_CLS} />
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" size="sm" onClick={() => { setAddFormOpen(false); setAddError('') }}>
                  <X className="w-3.5 h-3.5" /> Cancel
                </Button>
                <Button size="sm" onClick={addRule}>
                  <Check className="w-3.5 h-3.5" /> Save Rule
                </Button>
              </div>
            </div>
          )}

          {/* ── Search & filter bar ── */}
          <div className="flex flex-wrap gap-2 items-center">
            <div className="relative flex-1 min-w-[180px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by label, IP, or note…"
                className="w-full border border-input rounded-lg pl-9 pr-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-300" />
            </div>
            <div className="flex gap-1 p-1 rounded-lg bg-muted">
              {(['all', 'active', 'inactive'] as const).map((f) => (
                <button key={f} onClick={() => setFilterActive(f)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-all capitalize ${
                    filterActive === f ? 'bg-white shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
                  }`}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* ── Bulk actions bar ── */}
          {selected.size > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-50 border border-amber-200">
              <span className="text-xs font-medium text-amber-800 flex-1">{selected.size} rule{selected.size > 1 ? 's' : ''} selected</span>
              <Button variant="outline" size="sm" onClick={() => bulkSetActive(true)}  className="text-emerald-700 border-emerald-200 hover:bg-emerald-50 text-xs">Enable</Button>
              <Button variant="outline" size="sm" onClick={() => bulkSetActive(false)} className="text-slate-600 border-slate-200 hover:bg-slate-50 text-xs">Disable</Button>
              <Button variant="outline" size="sm" onClick={bulkDelete}                 className="text-red-600 border-red-200 hover:bg-red-50 text-xs">
                <Trash2 className="w-3 h-3" /> Delete
              </Button>
              <button onClick={() => setSelected(new Set())} className="text-muted-foreground hover:text-foreground ml-1">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ── Rules list ── */}
          {filtered.length === 0 && (
            <div className="text-center py-10 text-sm text-muted-foreground">
              <Network className="w-8 h-8 mx-auto mb-2 text-muted-foreground/30" />
              {rules.length === 0 ? 'No rules yet — add one above.' : 'No rules match your search.'}
            </div>
          )}

          {filtered.length > 0 && (
            <div className="rounded-xl border border-border overflow-hidden">
              {/* Column header */}
              <div className="grid grid-cols-[20px_1fr_160px_80px_80px_72px] items-center gap-3 px-4 py-2 bg-muted/40 border-b border-border">
                <input type="checkbox"
                  checked={selected.size === filtered.length && filtered.length > 0}
                  onChange={selectAll}
                  className="w-3.5 h-3.5 rounded accent-amber-500" />
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Label / Note</span>
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">IP / CIDR</span>
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Size</span>
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Status</span>
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide text-right">Actions</span>
              </div>

              {filtered.map((rule, idx) => (
                <div key={rule.id}
                  className={`border-b border-border last:border-0 transition-colors ${
                    selected.has(rule.id) ? 'bg-amber-50' : idx % 2 === 0 ? 'bg-white' : 'bg-muted/10'
                  }`}>
                  {/* ── view row ── */}
                  {editingId !== rule.id ? (
                    <div className="grid grid-cols-[20px_1fr_160px_80px_80px_72px] items-center gap-3 px-4 py-3">
                      <input type="checkbox" checked={selected.has(rule.id)} onChange={() => toggleSelect(rule.id)}
                        className="w-3.5 h-3.5 rounded accent-amber-500" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{rule.label}</p>
                        {rule.note && <p className="text-[11px] text-muted-foreground truncate">{rule.note}</p>}
                        <p className="text-[11px] text-muted-foreground">by {rule.addedBy} · {rule.addedAt}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {rule.cidr.includes(':')
                          ? <Server className="w-3.5 h-3.5 text-sky-500 flex-shrink-0" />
                          : <Network className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />}
                        <span className="text-xs font-mono text-foreground truncate">{rule.cidr}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full whitespace-nowrap">
                          {cidrSize(rule.cidr).label}
                        </span>
                      </div>
                      <div>
                        <Toggle checked={rule.active} onChange={() => toggleActive(rule.id)} size="sm" />
                      </div>
                      <div className="flex items-center gap-1 justify-end">
                        <button onClick={() => startEdit(rule)}
                          className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" title="Edit">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => deleteRule(rule.id)}
                          className="p-1.5 rounded-md text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors" title="Delete">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* ── inline edit row ── */
                    <div className="px-4 py-3 space-y-3 bg-amber-50/60">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[10px] font-semibold text-muted-foreground uppercase mb-1">Label</label>
                          <input value={editBuf.label ?? ''} onChange={(e) => setEditBuf((p) => ({ ...p, label: e.target.value }))}
                            className={INPUT_CLS} />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-muted-foreground uppercase mb-1">IP / CIDR</label>
                          <input value={editBuf.cidr ?? ''} onChange={(e) => setEditBuf((p) => ({ ...p, cidr: e.target.value }))}
                            className={MONO_INPUT} />
                          {editBuf.cidr && isValidCidr(editBuf.cidr) && (
                            <p className="text-[11px] text-emerald-600 mt-1">{cidrSize(editBuf.cidr).count} IP(s) — {cidrSize(editBuf.cidr).label}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-muted-foreground uppercase mb-1">Note</label>
                          <input value={editBuf.note ?? ''} onChange={(e) => setEditBuf((p) => ({ ...p, note: e.target.value }))}
                            className={INPUT_CLS} />
                        </div>
                      </div>
                      <div className="flex gap-2 justify-end">
                        <Button variant="outline" size="sm" onClick={() => setEditingId(null)}>
                          <X className="w-3.5 h-3.5" /> Cancel
                        </Button>
                        <Button size="sm" onClick={saveEdit}>
                          <Check className="w-3.5 h-3.5" /> Save
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <p className="text-[11px] text-muted-foreground">
            Accepts IPv4 (e.g. <code className="font-mono bg-muted px-1 rounded">10.0.0.1</code>, <code className="font-mono bg-muted px-1 rounded">10.0.0.0/8</code>) and
            IPv6 (e.g. <code className="font-mono bg-muted px-1 rounded">2001:db8::/32</code>) addresses.
          </p>
        </CardContent>
      </Card>

      {/* ══ 4. TEST IP TOOL ══════════════════════════════════════════════════ */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Test IP Address</CardTitle>
          <CardDescription>Check whether a given IP would be allowed or blocked by the current rules</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <input value={testIp} onChange={(e) => { setTestIp(e.target.value); setTestResult(null) }}
              placeholder="Enter any IP to test  (e.g. 203.0.113.5)"
              onKeyDown={(e) => e.key === 'Enter' && runTest()}
              className={`flex-1 ${MONO_INPUT}`} />
            <Button variant="outline" size="sm" onClick={runTest} disabled={!testIp.trim()}>
              <Zap className="w-3.5 h-3.5" /> Test
            </Button>
            <Button variant="ghost" size="sm" onClick={() => { setTestIp(DETECTED_IP); setTestResult(null) }}
              title="Use my detected IP" className="text-xs text-muted-foreground">
              Use My IP
            </Button>
          </div>

          {testResult !== null && (
            <div className={`flex items-start gap-3 p-4 rounded-xl border ${
              testResult.allowed ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'
            }`}>
              {testResult.allowed
                ? <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                : <Ban className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />}
              <div>
                <p className={`text-sm font-semibold ${testResult.allowed ? 'text-emerald-800' : 'text-red-800'}`}>
                  {testResult.allowed ? `✓ Allowed — matched rule` : '✗ Blocked — no matching active rule'}
                </p>
                {testResult.rule && (
                  <div className="mt-1.5 space-y-0.5">
                    <p className="text-xs text-emerald-700">
                      <span className="font-medium">Rule:</span> {testResult.rule.label}
                    </p>
                    <p className="text-xs font-mono text-emerald-700">
                      <span className="font-sans font-medium">CIDR:</span> {testResult.rule.cidr}  ({cidrSize(testResult.rule.cidr).label})
                    </p>
                    {testResult.rule.note && (
                      <p className="text-xs text-emerald-600">{testResult.rule.note}</p>
                    )}
                  </div>
                )}
                {!testResult.allowed && (
                  <p className="text-xs text-red-700 mt-1">
                    {!enabled
                      ? 'IP Whitelist is currently disabled — no rules are enforced.'
                      : 'This IP does not match any active rule. Access would be denied.'}
                  </p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ══ 5. BLOCKED ATTEMPTS LOG ══════════════════════════════════════════ */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle className="text-sm">Recent Blocked Attempts</CardTitle>
              <CardDescription>IPs that were denied access in the last 30 days</CardDescription>
            </div>
            <Badge variant="error" className="text-xs">{BLOCKED_ATTEMPTS.length} blocked IPs</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-border overflow-hidden">
            <div className="grid grid-cols-[1fr_1fr_60px_90px_100px] items-center gap-3 px-4 py-2 bg-muted/40 border-b border-border">
              {['Blocked IP', 'Login Attempted By', 'Count', 'Last Seen', 'Action'].map((h) => (
                <span key={h} className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">{h}</span>
              ))}
            </div>
            {BLOCKED_ATTEMPTS.map((attempt, idx) => {
              const alreadyAdded = rules.some((r) => r.cidr === attempt.ip || r.cidr === `${attempt.ip}/32`)
              return (
                <div key={attempt.id}
                  className={`grid grid-cols-[1fr_1fr_60px_90px_100px] items-center gap-3 px-4 py-3 border-b border-border last:border-0 ${
                    idx % 2 === 0 ? 'bg-white' : 'bg-muted/10'
                  }`}>
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-6 h-6 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                      <Ban className="w-3 h-3 text-red-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-mono font-medium text-foreground">{attempt.ip}</p>
                      <p className="text-[10px] text-muted-foreground">{attempt.country}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{attempt.user}</p>
                  <div>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      attempt.attempts >= 5 ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {attempt.attempts}×
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">{attempt.lastSeen}</p>
                  <div>
                    {alreadyAdded ? (
                      <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                        <Check className="w-3 h-3" /> Added
                      </span>
                    ) : (
                      <Button variant="outline" size="sm"
                        onClick={() => addBlockedToWhitelist(attempt)}
                        className="text-xs h-7 px-2 border-amber-200 text-amber-700 hover:bg-amber-50">
                        <Plus className="w-3 h-3" /> Allow
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
          <p className="text-[11px] text-muted-foreground mt-3">
            Showing last 30 days. Click <span className="font-medium">Allow</span> to add a blocked IP directly to the whitelist.
          </p>
        </CardContent>
      </Card>

      {/* ══ SAVE ══════════════════════════════════════════════════════════════ */}
      <div className="flex items-center justify-between">
        <p className="text-[11px] text-muted-foreground">
          {rules.filter((r) => r.active).length} active rule{rules.filter((r) => r.active).length !== 1 ? 's' : ''} · changes take effect immediately on save
        </p>
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
