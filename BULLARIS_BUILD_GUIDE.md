# BULLARIS — Build Guide

**Product:** Employee Financial Wellness Platform (B2B SaaS)  
**Markets:** Danish SMEs (50–500 employees)  
**Stack:** Next.js 14 monorepo — marketing site, employee app, employer portal  
**Last Updated:** April 2026

---

## TABLE OF CONTENTS

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Monorepo Structure](#3-monorepo-structure)
4. [Environment Variables](#4-environment-variables)
5. [Data Models (Prisma Schema)](#5-data-models)
6. [API Architecture (tRPC)](#6-api-architecture-trpc)
7. [Frontend Architecture](#7-frontend-architecture)
8. [Key Features](#8-key-features)
9. [Email & Nudge Engine](#9-email--nudge-engine)
10. [AI Chat Integration](#10-ai-chat-integration)
11. [Testing Strategy](#11-testing-strategy)
12. [Deployment & CI/CD](#12-deployment--cicd)
13. [Security & Compliance](#13-security--compliance)
14. [Seed Data](#14-seed-data)
15. [Launch Checklist](#15-launch-checklist)
16. [Future Phases (Deferred)](#16-future-phases-do-not-build-yet)

---

# 1. PROJECT OVERVIEW

Two-sided B2B SaaS: sold to HR departments, used by employees.

### Employee App
- Financial dashboard (net worth tracker, goals, debt planner, budget)
- Payslip explainer (Danish tax breakdown — AM-bidrag, A-skat, personfradrag)
- Tax planner (deductions optimiser)
- Learning hub (articles, videos, courses — content from Sanity CMS)
- Webinar registration (Mux-hosted live/recorded sessions)
- AI finance chat (Claude, streamed)
- Pulse survey (monthly financial confidence check-in)

### Employer Portal
- Employee seat management (invite, remove, bulk CSV)
- Workforce analytics (aggregated only — employer never sees individual data)
- Custom nudge campaigns (one-off email to all employees)
- HR audit funnel (unauthenticated lead-gen flow)

### Key Numbers
- **Currency:** DKK native, EUR display only
- **Auth roles:** `employee` | `hr_admin` | `operator`
- **Pricing model:** seat-based subscription via Stripe (DKK/employee/month)
- **Compliance:** GDPR, data in EU (Supabase Frankfurt)

---

# 2. TECH STACK

| Layer | Choice | Note |
|---|---|---|
| Framework | Next.js 14 App Router | SSR + RSC |
| Styling | Tailwind CSS v3 + shadcn/ui | |
| Animation | Framer Motion | |
| Charts | Recharts | |
| API | tRPC v11 | All data fetching — no raw fetch to internal routes |
| Data fetching | TanStack Query v5 | Via tRPC React client |
| Forms | Zod | Validation only; forms are uncontrolled |
| Database | Supabase (Postgres) | Frankfurt EU region |
| ORM | Prisma 5 | Schema in `packages/db/` |
| Auth | Supabase Auth | `@supabase/auth-helpers-nextjs` |
| Email | Resend | Templates in `apps/web/emails/` |
| Video | Mux | `@mux/mux-player-react` — embed only |
| CMS | Sanity | Learning hub content only |
| AI chat | Anthropic `claude-sonnet-4-6` | Streamed via `/api/chat` |
| Payments | Stripe | Seat-based subscriptions |
| Nudge engine | `packages/nudge-engine` | Rule-based email scheduler |
| Tax calc | `packages/danish-tax` | All DK financial logic lives here |
| Hosting | Vercel | EU region |
| Monitoring | Sentry | |
| Package manager | npm workspaces + Turborepo | |

---

# 3. MONOREPO STRUCTURE

```
bullaris/
├── apps/
│   └── web/                        # Next.js App Router — all three surfaces
│       ├── app/
│       │   ├── (auth)/             # Login, onboarding, unauthorized
│       │   ├── (employee)/         # Employee dashboard modules
│       │   ├── (employer)/         # HR portal
│       │   ├── (marketing)/        # Public landing page + HR audit funnel
│       │   ├── api/
│       │   │   ├── chat/route.ts   # Anthropic streaming endpoint
│       │   │   ├── trpc/[trpc]/route.ts
│       │   │   └── webhooks/zoom/route.ts
│       │   └── auth/callback/route.ts
│       ├── components/             # Shared UI components
│       ├── emails/                 # Resend email templates (React Email)
│       ├── lib/                    # supabase.ts, trpc.ts, providers, utils
│       ├── locales/                # da.json, en.json — all copy here
│       ├── server/
│       │   ├── trpc.ts             # tRPC init + procedures
│       │   ├── root.ts             # appRouter
│       │   └── routers/            # One file per domain
│       ├── middleware.ts           # Supabase auth middleware
│       └── tailwind.config.ts
│
├── packages/
│   ├── db/                         # Prisma schema + seed
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── danish-tax/                 # DK payslip + tax calculation logic
│   │   ├── calculate.ts
│   │   ├── municipalities.ts
│   │   ├── rates/2024.ts
│   │   └── __tests__/
│   └── nudge-engine/               # Rule-based email nudge scheduler
│       └── index.ts
│
├── docs/                           # Reference documents
│   ├── schema.md
│   ├── danish-tax.md
│   ├── auth-tenancy.md
│   ├── ai-chat.md
│   └── compliance.md
│
├── turbo.json
├── package.json                    # npm workspaces root
├── CLAUDE.md
└── .gitignore
```

## Initialize

```bash
# Clone and install
git clone <repo>
npm install

# Setup Prisma
cd packages/db
npx prisma generate
npx prisma db push          # or: npm run db:push from root

# Seed demo data
npm run db:seed

# Start dev
npm run dev                 # port 3000
```

---

# 4. ENVIRONMENT VARIABLES

Required in `apps/web/.env.local` — never commit:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Database
DATABASE_URL=postgresql://...

# Anthropic
ANTHROPIC_API_KEY=sk-ant-...

# Stripe
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...

# Resend
RESEND_API_KEY=re_...

# Sentry
SENTRY_DSN=https://...

# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=abc123
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=sk...

# Mux
MUX_TOKEN_ID=...
MUX_TOKEN_SECRET=...
```

Root `.env.local` (for Turborepo):
```env
TURBO_TOKEN=...
TURBO_TEAM=...
```

---

# 5. DATA MODELS

Schema lives in `packages/db/schema.prisma`. All tables use snake_case column names via `@map`.

## Core

```
Employer          — one per company; owns seats, has employees
Employee          — one per user; supabase_user_id links to Supabase Auth
Profile           — optional extended info (age, municipality, gross_dkk)
ConsentEvent      — one row per consent action per module (5-year retention)
```

## Financial (employee-owned, RLS-protected)

```
NetWorthEntry     — assets_dkk + liabilities_dkk snapshot
Goal              — target_dkk + deadline + progress_dkk
Debt              — balance_dkk + interestRate + strategy (avalanche|snowball)
BudgetCategory    — limit_dkk per label per period
PayslipInput      — gross_dkk + period + taxCardType (13-month rolling retention)
```

**Rule:** Employer can NEVER query these tables directly. HR analytics are aggregated server-side.

## Learning

```
LearningContent   — synced from Sanity; type: article|video
LearningProgress  — (employeeId, contentId) completion record
Course            — ordered content collection (from Sanity)
CourseEnrollment  — (employeeId, courseId) + completedAt
```

## Other

```
WebinarRegistration  — (employeeId, webinarSanityId)
NudgeRule            — trigger condition + Resend template + cooldownDays
NudgeEvent           — sent nudge record (prevents re-sending in cooldown)
AuditCompletion      — unauthenticated HR audit session result (no PII)
AiChatSession        — session_id + token counts only (no message content, 30-day retention)
PulseSurveyResponse  — score 1–5 per month per employee (aggregated only for HR)
CustomNudgeCampaign  — HR-created one-off email blast
```

## Migration commands

```bash
npm run db:push         # Push schema to Supabase (dev)
npx prisma migrate dev --name <name>    # Create migration
npx prisma migrate deploy               # Deploy to production
npm run db:studio       # Open Prisma Studio
```

---

# 6. API ARCHITECTURE (tRPC)

All data fetching goes through tRPC. **No raw fetch calls to internal routes.**

## Procedures

```typescript
// server/trpc.ts
publicProcedure      // unauthenticated
protectedProcedure   // requires ctx.user + ctx.employee
hrAdminProcedure     // requires employee.role === 'hr_admin'
```

## Router map

```
appRouter
├── employee      — profile, onboarding, consent
├── employer      — seat management, org settings
├── payslip       — submit gross, retrieve breakdown (calls danish-tax)
├── goals         — CRUD goals + progress updates
├── learning      — content list, progress tracking, course enrollment
├── analytics     — aggregated workforce metrics (hrAdminProcedure only)
├── netWorth      — entries CRUD
├── debt          — debts CRUD
├── budget        — budget categories CRUD
├── webinars      — registration, attended tracking
├── ebooks        — download tracking
├── pulse         — submit monthly survey, aggregate for HR
└── campaigns     — HR custom nudge campaigns
```

## Context (lib/trpc-context.ts)

```typescript
type TRPCContext = {
  user: SupabaseUser | null
  employee: Employee | null
  employerId: string | null
}
```

Context is built in `app/api/trpc/[trpc]/route.ts` from the Supabase session cookie.

## Tenant isolation rule (CRITICAL)

Every query that touches employee financial data must filter by `employeeId` from context — never trust an ID from the request body.

```typescript
// ✅ CORRECT
const goals = await prisma.goal.findMany({
  where: { employeeId: ctx.employee.id },  // from verified context
})

// ❌ WRONG — trusts client-supplied ID
const goals = await prisma.goal.findMany({
  where: { employeeId: input.employeeId },
})
```

---

# 7. FRONTEND ARCHITECTURE

## App Router structure

```
app/
├── (auth)/
│   ├── layout.tsx
│   ├── login/page.tsx              — Supabase magic link / OAuth
│   ├── onboarding/page.tsx         — Post-login profile + consent setup
│   └── unauthorized/page.tsx
│
├── (employee)/
│   ├── layout.tsx                  — Sidebar nav, language switcher
│   ├── dashboard/page.tsx          — Overview: net worth, goals summary, pulse
│   ├── finance/page.tsx            — Net worth chart + breakdown
│   ├── goals/page.tsx              — Goal tracker (SMART goals)
│   ├── payslip/page.tsx            — Payslip explainer
│   ├── tax-planner/page.tsx        — Tax deductions optimiser
│   ├── chat/page.tsx               — AI finance chat (streamed)
│   └── learning/
│       ├── page.tsx                — Hub with level tabs + goal matching
│       ├── payslip-guide/page.tsx
│       ├── tax-basics/page.tsx
│       ├── tax-return/page.tsx
│       └── goal-setting/page.tsx
│
├── (employer)/
│   ├── layout.tsx
│   ├── portal/page.tsx             — Employer overview dashboard
│   ├── employees/page.tsx          — Employee table (invite, remove)
│   ├── seats/page.tsx              — Seat billing management
│   ├── analytics/page.tsx          — Aggregated workforce wellness
│   └── nudges/page.tsx             — Custom nudge campaigns
│
└── (marketing)/
    ├── layout.tsx
    ├── page.tsx                    — Landing page
    └── audit/page.tsx              — HR audit funnel (unauthenticated lead-gen)
```

## Component structure

```
components/
├── ui/                             — shadcn/ui base (button, card, modal)
├── audit/                          — HR audit multi-step flow components
│   ├── HRAuditFlow.tsx
│   ├── AuditQuestion.tsx
│   ├── AuditResult.tsx
│   ├── BridgePage.tsx
│   └── EmailCapture.tsx
├── consent-modal.tsx
├── goal-recommendations.tsx
├── language-switcher.tsx
├── learn-banner.tsx
├── net-worth-chart.tsx
├── payslip-breakdown.tsx
└── pulse-survey-card.tsx
```

## Design tokens (tailwind.config.ts)

```typescript
colors: {
  velstand: {
    navy: '#0F2544',
    blue: '#1B3E6B',
    gold: '#C8A96E',
    'gold-light': '#F0E6D3',
    cream: '#F7F4EF',
    'off-white': '#FDFCFA',
  },
}
fonts: {
  display: ['Playfair Display', 'serif'],
  sans: ['DM Sans', 'sans-serif'],
}
```

## Localisation

All Danish copy lives in `locales/da.json`. English in `locales/en.json`.  
Language context is provided by `lib/language-context.tsx`.  
**Never hardcode Danish strings in components.**

---

# 8. KEY FEATURES

## Payslip Explainer

- Employee enters gross salary + tax card type (A/B/frikort)
- Server calls `packages/danish-tax` to compute breakdown
- Displays: AM-bidrag (8%), A-skat (progressive), personfradrag, net pay
- 13-month rolling history stored in `PayslipInput`

**All tax calculation logic lives in `packages/danish-tax/` — never inline in components.**

## Financial Goal Tracker

Goal types:
- Short: `emergency_fund | debt_payoff | vacation | car | education`
- Medium: `house_deposit | home_renovation | children_savings | investment | side_income`
- Long: `pension_boost | financial_independence | passive_income | early_retirement | generational_wealth`
- `other`

## Net Worth Tracker

Stores totals only: `assets_dkk` + `liabilities_dkk`. Never account numbers or institution names.

## Debt Planner

Strategies: `avalanche` (highest interest first) or `snowball` (smallest balance first). Calculations are client-side — no financial data leaves the browser for debt ordering.

## Learning Hub

Content sourced from Sanity CMS. Modules: `tax_basics | pension | budgeting | investing | payslip`. Progress tracked per content item and per course.

## Pulse Survey

Monthly 1–5 confidence check-in. HR sees aggregated data only — minimum 5 responses before org-level data is shown.

## HR Audit Funnel (`/audit`)

Unauthenticated multi-step form for HR leads. Captures company size, sector, benefits, stress frequency, priority. Outputs a risk tier. Email captured via Resend for follow-up. Session stored in `AuditCompletion` (no PII in that table).

---

# 9. EMAIL & NUDGE ENGINE

## Resend

Templates in `apps/web/emails/` (React Email components):
- `invite.tsx` — employee invitation
- `nudge.tsx` — nudge trigger emails

Sending is done server-side only (never from client components).

## Nudge Engine (`packages/nudge-engine`)

Rule-based scheduler. Each `NudgeRule` has:
- `triggerCondition` — JSON expression evaluated against employee context
- `templateId` — Resend template reference
- `cooldownDays` — prevents re-sending

`NudgeEvent` records each sent nudge. Engine checks cooldown before firing.

**Custom nudge campaigns** (`CustomNudgeCampaign`) are HR-created one-off blasts via the employer portal.

---

# 10. AI CHAT INTEGRATION

Endpoint: `POST /api/chat` (Next.js Route Handler, streamed)

- Model: `claude-sonnet-4-6`
- Streaming: Anthropic SDK with `stream: true`
- System prompt: injects employee's financial context (gross salary from profile, current goals count, etc.)
- **Never** include raw financial data in the system prompt — use summaries only
- Session stored in `AiChatSession` with token counts only. Message content is never persisted.
- 30-day rolling session retention
- Rate limit: per authenticated user

See `docs/ai-chat.md` for full system prompt and cost controls.

---

# 11. TESTING STRATEGY

## Tax package (critical — 100% coverage)

```bash
npm run test:tax
# runs: jest --testPathPattern=packages/danish-tax
```

Tests in `packages/danish-tax/__tests__/calculate.test.ts`.  
Run before any payslip or tax planner changes.

## Unit tests

```bash
npm run test
```

Priority coverage:
- `packages/danish-tax/` — score/calculation functions
- `packages/nudge-engine/` — rule evaluation logic
- `lib/localScore.ts` — client-side score calculations

## E2E (Playwright)

Key flows to cover:
- Employee onboarding (consent → profile → dashboard)
- Goal creation and progress update
- Payslip submission and breakdown display
- HR invite → employee accepts → visible in portal
- HR audit funnel (question flow → result → email capture)

---

# 12. DEPLOYMENT & CI/CD

## Environments

| Env | Branch | DB |
|---|---|---|
| Local | any | Supabase dev project |
| Production | `main` | Supabase production (Frankfurt) |

## Vercel

Auto-deploy on push to `main`. Project config in `apps/web/vercel.json`.  
Framework: Next.js. Root directory: `apps/web`.

## GitHub Actions (`.github/workflows/`)

Recommended pipeline:

```yaml
on: [push, pull_request]
jobs:
  ci:
    steps:
      - npm ci
      - npx prisma generate
      - npm run test:tax
      - npm run lint
      - npm run build
```

## Commands

```bash
npm run dev          # Start dev server (port 3000)
npm run build        # Production build
npm run test         # Jest + Playwright
npm run test:tax     # Danish tax package tests only
npm run lint         # ESLint + Prettier
npm run db:push      # Push Prisma schema to Supabase
npm run db:studio    # Open Prisma Studio
npm run db:seed      # Seed demo data (Danish personas)
```

---

# 13. SECURITY & COMPLIANCE

## GDPR

- [ ] Consent captured per module per action in `ConsentEvent` (source + version + action)
- [ ] `ConsentEvent` retention: 5 years
- [ ] `AiChatSession` retention: 30 days rolling (no message content stored)
- [ ] `PayslipInput` retention: 13-month rolling
- [ ] All data in EU (Supabase Frankfurt)
- [ ] Employee can request data export and deletion
- [ ] Privacy Policy + Terms at velstand.dk/privacy and /terms
- [ ] DPA template ready for employer sign-off

## Tenant isolation

- [ ] Every employee financial query filters by `employeeId: ctx.employee.id` (from context, not input)
- [ ] HR analytics queries aggregate only — no row-level employee data returned
- [ ] Supabase RLS policies enforced — test with a second employer account
- [ ] `hrAdminProcedure` gates all employer-facing analytics routes

## Encryption & transport

- [ ] HTTPS enforced (Vercel)
- [ ] `gross_dkk` and salary fields stored as `Decimal` — not as strings with PII
- [ ] No PII in logs or error messages
- [ ] `SUPABASE_SERVICE_ROLE_KEY` and `ANTHROPIC_API_KEY` never exposed to client

## Secrets hygiene

```bash
# Audit git history for secrets
git log -S "sk_live" --all
git log -S "sk-ant" --all
```

Files that must never be committed (enforced in `.gitignore`):
- `.env`, `.env.local`, `.env.vercel`
- `fix-demo-passwords.mjs`, `demo-seed.sql`, `supabase-migration.sql`

---

# 14. SEED DATA

`packages/db/seed.ts` seeds:

- 2 employers: Nordstar Technologies (CORE tier), Bright Consulting ApS (trial)
- Per employer: 1 hr_admin, 1 hr_manager, 8 employees (varied profiles)
- Employee data: goals, net worth entries, payslip inputs, learning progress
- Nudge rules (emergency fund, pension, debt)
- Pulse survey responses (last 3 months)

Demo credentials seeded per employer:
- `hradmin@nordstar.bullaris.test` / password in `fix-demo-passwords.mjs` (never commit)

---

# 15. LAUNCH CHECKLIST

### Legal
- [ ] Privacy Policy (da + en) live at velstand.dk/privacy
- [ ] Terms of Service at velstand.dk/terms
- [ ] DPA template ready
- [ ] Cookie banner implemented
- [ ] Legal review: product does not constitute financial advice (disclaimers on all tools)

### Security
- [ ] Penetration test or security audit completed
- [ ] `npm audit` — no critical vulnerabilities
- [ ] Security headers set (next.config.js)
- [ ] No secrets in Git history

### Operations
- [ ] Daily automated DB backups configured + tested (Supabase)
- [ ] Sentry DSN live and catching errors
- [ ] On-call process defined
- [ ] GDPR breach notification process documented (72-hour rule)
- [ ] Status page created

### Product
- [ ] All consent flows gated (cannot access module without consent event)
- [ ] HR analytics minimum cohort size enforced (min 5 responses for pulse)
- [ ] Employer cannot see any individual employee financial data (test with fresh account)

---

# 16. FUTURE PHASES (DO NOT BUILD YET)

- **Phase 2:** React Native mobile app
- **Phase 2:** Open Banking (PSD2) integration
- **Phase 2:** Danish tax authority (SKAT) API integration
- **Phase 2:** Payroll integrations (Lessor, Dataløn)
- **Phase 2:** Advisor booking system (1-on-1 sessions with certified advisors)
- **Phase 3:** Swedish/Norwegian localisation
- **Phase 3:** White-label
- **Phase 3:** Enterprise HR integrations (Workday, SAP)

---

**Last Updated:** April 2026  
**Status:** Phase 1 MVP — deployed to Vercel, accepting pilot customers  
**Next:** Phase 2 planning
