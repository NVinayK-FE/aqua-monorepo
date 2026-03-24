# AQUA HRMS — Next.js Multi-Tenant HR Management System

A modern, full-featured Human Resource Management System built with **Next.js 14**, **Tailwind CSS**, and **shadcn/ui** component patterns.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000) — you'll be redirected to the login page.

**Demo credentials:** Any email + password on the login screen.

---

## 🏗️ Project Structure

```
aqua-shell/
├── app/
│   ├── (auth)/                  # Auth pages (no sidebar)
│   │   ├── login/page.tsx       # Multi-tenant login
│   │   └── layout.tsx           # Split-screen auth layout
│   ├── (dashboard)/             # Protected dashboard pages
│   │   ├── layout.tsx           # Sidebar + main wrapper
│   │   ├── dashboard/page.tsx   # Analytics overview
│   │   ├── employees/page.tsx   # Employee management
│   │   ├── payroll/page.tsx     # Payroll & compensation
│   │   ├── leave/page.tsx       # Leave & attendance
│   │   ├── performance/page.tsx # Performance & appraisals
│   │   ├── licensing/page.tsx   # Subscription & billing
│   │   └── settings/page.tsx    # Org settings
│   ├── globals.css              # Global styles + CSS vars
│   └── layout.tsx               # Root HTML layout
├── components/
│   ├── layout/
│   │   ├── sidebar.tsx          # Main navigation sidebar
│   │   └── header.tsx           # Page header with search
│   ├── charts/
│   │   └── chart-table-toggle.tsx  # Switch between chart / table views
│   └── ui/                      # Reusable UI components
│       ├── button.tsx
│       ├── card.tsx
│       ├── badge.tsx
│       ├── progress.tsx
│       └── sonner.tsx
├── lib/
│   ├── utils.ts                 # Helpers, formatters, colors
│   └── mock-data.ts             # Seed data (replace with API calls)
├── types/
│   └── index.ts                 # TypeScript interfaces
├── tailwind.config.ts
└── package.json
```

---

## ✨ Features

### 🔐 Multi-Tenant Authentication

- Tenant/organization selector at login
- Custom domain support per tenant
- Google SSO button (ready to wire up)
- "Remember me" session handling

### 📊 Dashboard

- KPI cards: headcount, payroll, leave, performance
- 6-month headcount trend (Area chart)
- Payroll gross vs. net (Bar chart)
- Department breakdown (Pie chart)
- Leave distribution by type
- Monthly attendance rates
- Performance distribution with progress bars
- **Chart ↔ Table toggle** on every data visualization

### 👥 Employee Management

- Full employee list with search & multi-filter
- Department and employment-type charts
- Performance score indicators
- Status badges (Active / On Leave / Inactive)
- Pagination

### 💰 Payroll & Compensation

- Monthly payroll run history
- Gross vs. net area chart
- Salary band distribution
- Deduction breakdown (pie chart)
- Draft payroll alert banner
- One-click "Run Payroll" flow

### 🗓️ Leave & Attendance

- Leave request table with approve/reject actions
- Monthly leave trend chart
- Leave-by-type distribution
- Status filter tabs (All / Pending / Approved / Rejected)
- Attendance rate chart

### ⭐ Performance & Appraisals

- Performance reviews list
- Star ratings with labels
- Radar chart: competency breakdown
- Goal progress tracker with progress bars
- Review status workflow

### 💳 Licensing & Billing

- Current plan summary with seat usage
- Monthly ↔ Annual billing toggle (20% discount)
- Plan comparison (Starter / Pro / Enterprise)
- Billing history with invoice downloads
- Security & compliance badges

### ⚙️ Settings

- Organization profile
- Roles & permissions (RBAC)
- Security (2FA, SSO, IP whitelist)
- Notification preferences

---

## 🎨 Design System

- **Primary color:** Aqua/Teal `#00bcd4`
- **Font:** Inter (Google Fonts)
- **Radius:** 10px (rounded-xl pattern)
- **Charts:** Recharts with custom tooltips
- **Icons:** Lucide React

---

## 🔌 Integrations (Production Checklist)

- [ ] Replace `lib/mock-data.ts` with API calls (REST or GraphQL)
- [ ] Add NextAuth.js for real authentication
- [ ] Set up middleware for tenant routing (subdomain-based)
- [ ] Connect Stripe for billing
- [ ] Add Prisma + PostgreSQL for database
- [ ] Configure S3/Cloudflare R2 for file uploads

---

## 📦 Dependencies

| Package        | Purpose                  |
| -------------- | ------------------------ |
| `next` 14      | App Router, SSR, RSC     |
| `tailwindcss`  | Utility-first styling    |
| `recharts`     | Data visualization       |
| `lucide-react` | Icon library             |
| `@radix-ui/*`  | Accessible UI primitives |
| `sonner`       | Toast notifications      |
| `zustand`      | Client state management  |
| `date-fns`     | Date formatting          |

---

## 🏢 Multi-Tenancy Architecture

Each tenant is identified by:

1. **Subdomain** — `acme.aqua-shell.io`
2. **Tenant ID** — stored in session/JWT
3. **Row-level isolation** — all DB queries scoped by `tenantId`

In production, middleware intercepts the subdomain and injects the tenant context into every request.
