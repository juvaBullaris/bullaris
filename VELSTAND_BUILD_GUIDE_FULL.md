# VELSTAND — Complete Build Guide

**Product:** Employee Financial Wellness Platform (B2B SaaS)  
**Markets:** Danish SMEs & startups (50–500 employees)  
**Version:** Phase 1 MVP  
**Last Updated:** 2025

---

## TABLE OF CONTENTS

1. [Project Overview](#1-project-overview)
2. [Tech Stack (Canonical)](#2-tech-stack--canonical-choices)
3. [Monorepo Setup](#3-monorepo-setup)
4. [Environment & Secrets](#4-environment--secrets)
5. [Data Models (Prisma Schema)](#5-data-models--prisma-schema)
6. [Database Migrations](#6-database-migrations)
7. [API Architecture](#7-api-architecture)
8. [API Routes & Implementation](#8-api-routes--detailed-implementation)
9. [Frontend Architecture](#9-frontend-architecture)
10. [Frontend Components](#10-key-frontend-components)
11. [Features Deep Dive](#11-features-deep-dive)
12. [Background Jobs](#12-background-jobs)
13. [Testing Strategy](#13-testing-strategy)
14. [Screenshot Workflow](#14-screenshot-workflow)
15. [Deployment & CI/CD](#15-deployment--cicd)
16. [Security & Compliance](#16-security--compliance)
17. [Phase 1 Definition of Done](#17-phase-1-definition-of-done)
18. [Seed Data](#18-seed-data)
19. [Launch Checklist](#19-launch-checklist)
20. [Future Phases (Deferred)](#20-future-phases-do-not-build-yet)

---

# 1. PROJECT OVERVIEW

## What is Velstand?

A two-sided B2B SaaS platform providing **employee financial wellness** to Danish employers.

### Employee-Facing App
- Financial wellness score (0–100, animated gauge)
- Personalized financial dashboard (emergency fund, pension, savings, debt)
- Curated content library (articles, videos, courses)
- Advisor booking system (1-on-1 sessions with certified financial advisors)
- Financial tools (pension optimiser, tax calculator, emergency fund planner)
- Goal tracker (SMART financial goals)
- Notifications & reminders

### Employer-Facing Dashboard
- Program management (feature flags by tier)
- Employee onboarding & management (invite, remove, bulk CSV)
- Anonymised workforce analytics (score distribution, engagement, ROI)
- Workshop scheduling
- Content customisation
- Billing & usage tracking
- GDPR data export

### Key Metrics
- **Primary market:** Denmark (GDPR-compliant, Danish financial regulations)
- **Target company size:** 50–500 employees
- **Supported languages:** Danish (primary), English
- **Pricing model:** SaaS subscriptions per employee per month (DKK 200–750/employee/month)

---

# 2. TECH STACK — CANONICAL CHOICES

**Do not deviate without documented reason.**

## Frontend

| Layer | Choice | Justification |
|---|---|---|
| Framework | Next.js 14+ (App Router) | SSR for analytics, RSC for performance, strong ecosystem |
| Styling | Tailwind CSS v3 | Utility-first, fast build, maintainable |
| Components | shadcn/ui | Unstyled, accessible, composable |
| State | Zustand | Lightweight, no boilerplate, RSC-compatible |
| Data fetching | TanStack Query (React Query) | Caching, background refetch, optimistic updates |
| Forms | React Hook Form + Zod | Type-safe validation, minimal re-renders |
| Charts | Recharts | Simple, composable, sufficient for v1 |
| Mobile (Phase 2) | React Native + Expo | Shared logic, fast OTA updates |

## Backend

| Layer | Choice | Justification |
|---|---|---|
| Runtime | Node.js 20 LTS | Large talent pool, strong fintech ecosystem |
| Framework | Fastify | 2x faster than Express, TypeScript-native, schema validation |
| Language | TypeScript (strict mode) | Type safety across entire codebase |
| ORM | Prisma | Type-safe queries, excellent migrations, PostgreSQL support |
| Database | PostgreSQL 16 | Relational for multi-tenancy, JSONB for flexibility |
| Cache | Redis (Upstash) | Sessions, rate limiting, job queues |
| Jobs | BullMQ | Background jobs with Redis persistence |
| Auth | Auth0 | SSO, MFA, social login, GDPR-ready, enterprise-ready |

## Infrastructure

| Layer | Choice |
|---|---|
| Frontend hosting | Vercel |
| Backend hosting | Railway or AWS ECS Fargate |
| Database | Supabase (managed PostgreSQL) or AWS RDS |
| File storage | AWS S3 (EU-West region) |
| Email | SendGrid |
| Push notifications | OneSignal |
| Payments | Stripe (subscription billing) |
| CMS | Sanity.io (content library) |
| Error tracking | Sentry |
| Analytics | PostHog (self-hostable, GDPR-safe) |
| CI/CD | GitHub Actions |

---

# 3. MONOREPO SETUP

## Directory Structure

```
velstand/
├── apps/
│   ├── web/                    # Next.js webapp (employee + employer)
│   │   ├── app/                # App Router pages
│   │   ├── components/         # React components
│   │   ├── hooks/              # Custom hooks
│   │   ├── lib/                # Utilities, API client, auth
│   │   ├── stores/             # Zustand stores
│   │   ├── __screenshots__/    # Puppeteer screenshot tests
│   │   ├── screenshots/        # Baseline & temporary PNGs
│   │   └── next.config.js
│   │
│   └── api/                    # Fastify REST API
│       ├── src/
│       │   ├── middleware/     # Auth, tenant isolation, validation
│       │   ├── routes/         # API endpoints (v1/*)
│       │   ├── services/       # Business logic
│       │   ├── queues/         # BullMQ job definitions
│       │   ├── jobs/           # Job handlers
│       │   └── main.ts         # Entry point
│       ├── __tests__/          # Jest + Supertest integration tests
│       └── Dockerfile
│
├── packages/
│   ├── db/                     # Prisma schema & migrations
│   │   ├── schema.prisma
│   │   └── migrations/
│   │
│   ├── types/                  # Shared TypeScript types
│   │   ├── api.ts              # Request/response types
│   │   ├── models.ts           # Prisma-derived types
│   │   └── index.ts
│   │
│   ├── ui/                     # Shared component library
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── ... (shadcn/ui exports)
│   │
│   ├── utils/                  # Shared utilities
│   │   ├── crypto.ts           # AES-256-GCM encryption
│   │   ├── validators.ts       # Zod schemas
│   │   ├── formatters.ts       # formatDKK(), formatDate()
│   │   └── index.ts
│   │
│   └── config/                 # Shared configuration
│       ├── eslint.config.js
│       ├── tailwind.config.ts
│       └── tsconfig.json
│
├── .github/
│   └── workflows/              # CI/CD pipelines
│       ├── ci.yml
│       ├── visual-regression.yml
│       └── deploy.yml
│
├── docker-compose.yml          # Local dev environment
├── turbo.json                  # Turborepo pipeline
├── pnpm-workspace.yaml
├── package.json
├── tsconfig.json
└── .gitignore
```

## Initialize Turborepo

```bash
# Create monorepo structure
npx create-turbo@latest velstand

# Use pnpm workspaces
cd velstand
pnpm install

# Verify monorepo
pnpm list --depth 0
```

---

# 4. ENVIRONMENT & SECRETS

## Prerequisites

```bash
node >= 20.0.0
pnpm >= 9.0.0
docker >= 24.0.0
```

## `.env` Files (Never commit)

### `apps/api/.env.local`

```env
# Database
DATABASE_URL="postgresql://velstand:password@localhost:5432/velstand_dev"
REDIS_URL="redis://localhost:6379"

# Auth0
AUTH0_DOMAIN="velstand.eu.auth0.com"
AUTH0_CLIENT_ID="YOUR_CLIENT_ID"
AUTH0_CLIENT_SECRET="YOUR_CLIENT_SECRET"
AUTH0_AUDIENCE="https://api.velstand.dk"
AUTH0_MANAGEMENT_API_TOKEN="YOUR_MANAGEMENT_TOKEN"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PRICE_STARTER="price_1234..."
STRIPE_PRICE_CORE="price_5678..."
STRIPE_PRICE_PARTNER="price_9012..."

# SendGrid
SENDGRID_API_KEY="SG...."
SENDGRID_FROM_EMAIL="hello@velstand.dk"

# AWS S3
AWS_REGION="eu-west-1"
AWS_ACCESS_KEY_ID="AKIA..."
AWS_SECRET_ACCESS_KEY="..."
S3_BUCKET_NAME="velstand-uploads"

# Sentry
SENTRY_DSN="https://..."

# Internal
NODE_ENV="development"
API_PORT=3001
JWT_SECRET="$(openssl rand -hex 32)"          # 256-bit random
ENCRYPTION_KEY="$(openssl rand -hex 32)"      # 256-bit AES key
LOG_LEVEL="debug"
```

### `apps/web/.env.local`

```env
NEXT_PUBLIC_API_URL="http://localhost:3001"
NEXT_PUBLIC_AUTH0_DOMAIN="velstand.eu.auth0.com"
NEXT_PUBLIC_AUTH0_CLIENT_ID="YOUR_CLIENT_ID"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
NEXT_PUBLIC_POSTHOG_KEY="phc_..."
NEXT_PUBLIC_POSTHOG_HOST="https://eu.posthog.com"
SANITY_PROJECT_ID="abc123xyz"
SANITY_DATASET="production"
SANITY_API_TOKEN="YOUR_SANITY_TOKEN"
```

## Generate Secure Keys

```bash
# 256-bit random hex strings
openssl rand -hex 32

# Store in 1Password or similar secret manager
# Reference via GitHub Secrets for CI/CD
```

---

# 5. DATA MODELS — PRISMA SCHEMA

## Complete Schema

Create `packages/db/schema.prisma`:

```prisma
// packages/db/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─── ORGANISATIONS (Employer clients) ───────────────────────────────────────

model Organisation {
  id             String   @id @default(cuid())
  name           String
  slug           String   @unique
  logoUrl        String?
  industry       String?
  employeeCount  Int?
  country        String   @default("DK")
  locale         String   @default("da")
  
  // Billing
  stripeCustomerId     String?  @unique
  stripeSubscriptionId String?  @unique
  subscriptionTier     SubscriptionTier @default(STARTER)
  subscriptionStatus   SubscriptionStatus @default(TRIAL)
  billingEmail         String?
  trialEndsAt          DateTime?
  
  // Settings
  brandColor       String?
  welcomeMessage   String?
  customDomain     String?  @unique
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relations
  users           User[]
  invitations     Invitation[]
  departments     Department[]
  programmeConfig ProgrammeConfig?
  advisorSlots    AdvisorSlot[]
  workshops       Workshop[]
  auditLogs       AuditLog[]
  
  @@index([slug])
  @@index([createdAt])
}

enum SubscriptionTier {
  STARTER    // DKK 150-250/employee/month
  CORE       // DKK 350-550/employee/month
  PARTNER    // DKK 600-900/employee/month
}

enum SubscriptionStatus {
  TRIAL
  ACTIVE
  PAST_DUE
  CANCELLED
  PAUSED
}

// ─── USERS ───────────────────────────────────────────────────────────────────

model User {
  id             String   @id @default(cuid())
  auth0Id        String   @unique
  email          String   @unique
  firstName      String?
  lastName       String?
  avatarUrl      String?
  role           UserRole @default(EMPLOYEE)
  locale         String   @default("da")
  
  // Organisation membership
  organisationId String
  organisation   Organisation @relation(fields: [organisationId], references: [id], onDelete: Cascade)
  departmentId   String?
  department     Department?  @relation(fields: [departmentId], references: [id])
  
  // Employment
  jobTitle       String?
  startDate      DateTime?
  salaryEncrypted String?    // Encrypted AES-256-GCM
  
  // Consent (GDPR)
  consentGiven        Boolean  @default(false)
  consentGivenAt      DateTime?
  consentVersion      String?
  dataSharingConsent  Boolean  @default(false)
  
  // Status
  onboardingComplete  Boolean  @default(false)
  isActive            Boolean  @default(true)
  lastActiveAt        DateTime?
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relations
  wellnessProfile     WellnessProfile?
  advisorBookings     AdvisorBooking[]
  contentProgress     ContentProgress[]
  goals               FinancialGoal[]
  notifications       Notification[]
  auditLogs           AuditLog[]
  
  @@unique([organisationId, auth0Id])
  @@index([organisationId])
  @@index([email])
}

enum UserRole {
  EMPLOYEE
  HR_MANAGER
  HR_ADMIN
  SUPER_ADMIN
}

model Department {
  id             String       @id @default(cuid())
  name           String
  organisationId String
  organisation   Organisation @relation(fields: [organisationId], references: [id], onDelete: Cascade)
  users          User[]
  createdAt      DateTime     @default(now())
  
  @@index([organisationId])
}

model Invitation {
  id             String       @id @default(cuid())
  email          String
  role           UserRole     @default(EMPLOYEE)
  token          String       @unique @default(cuid())
  organisationId String
  organisation   Organisation @relation(fields: [organisationId], references: [id], onDelete: Cascade)
  expiresAt      DateTime
  acceptedAt     DateTime?
  createdAt      DateTime     @default(now())
  
  @@index([token])
  @@index([organisationId])
}

// ─── WELLNESS PROFILE ────────────────────────────────────────────────────────

model WellnessProfile {
  id     String @id @default(cuid())
  userId String @unique
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  score           Int?
  scoreUpdatedAt  DateTime?
  
  assessmentData  Json?
  assessmentVersion String?
  
  emergencyFundMonths  Float?
  pensionContribPct    Float?
  debtToIncomeRatio    Float?
  investmentDiversification String?
  
  lifeStage  LifeStage?
  
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}

enum LifeStage {
  EARLY_CAREER
  BUILDING
  PEAK_EARNINGS
  PRE_RETIREMENT
}

// ─── FINANCIAL GOALS ─────────────────────────────────────────────────────────

model FinancialGoal {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  type        GoalType
  title       String
  targetAmount Int?
  currentAmount Int?   @default(0)
  targetDate  DateTime?
  isCompleted Boolean  @default(false)
  notes       String?
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([userId])
}

enum GoalType {
  EMERGENCY_FUND
  HOME_PURCHASE
  RETIREMENT
  DEBT_PAYOFF
  EDUCATION
  INVESTMENT
  OTHER
}

// ─── PROGRAMME CONFIGURATION ─────────────────────────────────────────────────

model ProgrammeConfig {
  id             String       @id @default(cuid())
  organisationId String       @unique
  organisation   Organisation @relation(fields: [organisationId], references: [id], onDelete: Cascade)
  
  hasAdvisorSessions    Boolean @default(false)
  hasGroupWorkshops     Boolean @default(false)
  hasTaxOptimisation    Boolean @default(false)
  hasPensionOptimiser   Boolean @default(false)
  hasGoalTracking       Boolean @default(true)
  hasOpenBanking        Boolean @default(false)
  
  advisorSessionsPerEmployee  Int  @default(0)
  advisorSessionDurationMins  Int  @default(45)
  
  contentModulesEnabled  String[]
  
  updatedAt  DateTime @updatedAt
}

// ─── ADVISOR SYSTEM ──────────────────────────────────────────────────────────

model Advisor {
  id          String  @id @default(cuid())
  name        String
  email       String  @unique
  avatarUrl   String?
  bio         String?
  credentials String[]
  languages   String[]  @default(["da", "en"])
  specialisms String[]
  isActive    Boolean @default(true)
  
  slots       AdvisorSlot[]
  bookings    AdvisorBooking[]
  
  createdAt   DateTime @default(now())
}

model AdvisorSlot {
  id             String       @id @default(cuid())
  advisorId      String
  advisor        Advisor      @relation(fields: [advisorId], references: [id], onDelete: Cascade)
  organisationId String?
  organisation   Organisation? @relation(fields: [organisationId], references: [id], onDelete: Cascade)
  
  startTime      DateTime
  endTime        DateTime
  isBooked       Boolean  @default(false)
  
  booking        AdvisorBooking?
  
  createdAt      DateTime @default(now())
  
  @@index([advisorId])
  @@index([organisationId])
  @@index([startTime])
}

model AdvisorBooking {
  id         String  @id @default(cuid())
  userId     String
  user       User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  advisorId  String
  advisor    Advisor @relation(fields: [advisorId], references: [id], onDelete: Cascade)
  slotId     String  @unique
  slot       AdvisorSlot @relation(fields: [slotId], references: [id], onDelete: Cascade)
  
  status     BookingStatus @default(CONFIRMED)
  topic      String?
  notes      String?
  meetingUrl String?
  
  completedAt  DateTime?
  employeeNps  Int?
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([userId])
  @@index([advisorId])
}

enum BookingStatus {
  CONFIRMED
  CANCELLED
  COMPLETED
  NO_SHOW
}

// ─── CONTENT SYSTEM ──────────────────────────────────────────────────────────

model ContentProgress {
  id          String  @id @default(cuid())
  userId      String
  user        User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  contentId   String
  contentType ContentType
  
  startedAt   DateTime @default(now())
  completedAt DateTime?
  progressPct Int      @default(0)
  
  @@unique([userId, contentId])
  @@index([userId])
}

enum ContentType {
  ARTICLE
  VIDEO
  COURSE
  QUIZ
  CALCULATOR
}

// ─── WORKSHOPS ───────────────────────────────────────────────────────────────

model Workshop {
  id             String       @id @default(cuid())
  organisationId String
  organisation   Organisation @relation(fields: [organisationId], references: [id], onDelete: Cascade)
  
  title          String
  description    String?
  topic          String
  format         WorkshopFormat
  scheduledAt    DateTime
  durationMins   Int          @default(60)
  maxAttendees   Int?
  meetingUrl     String?
  recordingUrl   String?
  
  createdAt      DateTime @default(now())
  
  @@index([organisationId])
  @@index([scheduledAt])
}

enum WorkshopFormat {
  LIVE_ONLINE
  IN_PERSON
  RECORDED
}

// ─── NOTIFICATIONS ────────────────────────────────────────────────────────────

model Notification {
  id        String  @id @default(cuid())
  userId    String
  user      User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  type      NotificationType
  title     String
  body      String
  data      Json?
  
  readAt    DateTime?
  sentAt    DateTime?
  
  createdAt DateTime @default(now())
  
  @@index([userId])
  @@index([createdAt])
}

enum NotificationType {
  BOOKING_CONFIRMED
  BOOKING_REMINDER
  BOOKING_CANCELLED
  SCORE_UPDATED
  GOAL_MILESTONE
  NEW_CONTENT
  WORKSHOP_REMINDER
  SYSTEM
}

// ─── AUDIT LOG (GDPR compliance) ─────────────────────────────────────────────

model AuditLog {
  id             String  @id @default(cuid())
  organisationId String
  organisation   Organisation @relation(fields: [organisationId], references: [id], onDelete: Cascade)
  userId         String?
  user           User?   @relation(fields: [userId], references: [id], onDelete: SetNull)
  
  action         String
  resource       String
  resourceId     String?
  ipAddress      String?
  userAgent      String?
  metadata       Json?
  
  createdAt      DateTime @default(now())
  
  @@index([organisationId, createdAt])
  @@index([userId, createdAt])
}
```

## Field-Level Encryption

Create `packages/utils/crypto.ts`:

```typescript
import crypto from 'crypto';

const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex'); // 32 bytes

export function encrypt(plaintext: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-gcm', ENCRYPTION_KEY, iv);
  
  let encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

export function decrypt(ciphertext: string): string {
  const [ivHex, authTagHex, encrypted] = ciphertext.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  
  const decipher = crypto.createDecipheriv('aes-256-gcm', ENCRYPTION_KEY, iv);
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}
```

---

# 6. DATABASE MIGRATIONS

## Initialize Prisma

```bash
cd packages/db

# Generate Prisma Client
pnpm prisma generate

# Create migration (idempotent)
pnpm prisma migrate dev --name init

# View DB Studio
pnpm prisma studio
```

## Migration Commands

```bash
# Create new migration
pnpm prisma migrate dev --name add_new_field

# Deploy to production
pnpm prisma migrate deploy

# Reset database (dev only!)
pnpm prisma migrate reset
```

## Migration Best Practices

- ✅ Always use `migrate dev` or `migrate deploy`
- ✅ Never modify schema and execute raw SQL
- ✅ Test migrations locally before deploying
- ✅ Migrations are idempotent — safe to re-run
- ❌ Never manually edit migration files (unless fixing a broken migration)

---

# 7. API ARCHITECTURE

## Core Principles

### Multi-Tenancy Model
- **Approach:** Shared database, tenant isolation via `organisationId`
- **Enforcement:** Middleware layer (never query-level alone)
- **Rule:** Every user data query includes `organisationId` filter

### Middleware Pipeline (In Order)

```typescript
// apps/api/src/middleware/pipeline.ts

1. requestId()              // Unique ID per request for tracing
2. cors()                   // Restrict to *.velstand.dk + localhost
3. helmet()                 // Security headers
4. rateLimit()              // Redis-backed: 100 req/min per IP
5. authenticate()           // Validate Auth0 JWT
6. resolveOrganisation()    // Attach org from JWT claims
7. enforceTenantIsolation() // Reject cross-tenant access
8. checkFeatureFlag()       // Verify tier has endpoint access
9. validateRequest()        // Zod schema validation
10. auditLog()              // Log to AuditLog table
```

### Tenant Isolation Rule (CRITICAL)

```typescript
// ✅ CORRECT
const user = await prisma.user.findUnique({
  where: { 
    id: userId,
    organisationId: req.organisation.id,  // ← REQUIRED
  },
});

// ❌ WRONG — Leaks cross-tenant data
const user = await prisma.user.findUnique({
  where: { id: userId }
});
```

---

# 8. API ROUTES — DETAILED IMPLEMENTATION

Base path: `/api/v1`

## Auth Routes

```
POST   /auth/callback         # Auth0 callback handler
POST   /auth/logout           # Logout + clear session
GET    /auth/me               # Current user + org context
```

**GET /auth/me Response:**
```json
{
  "user": {
    "id": "user_123",
    "email": "alice@example.com",
    "role": "EMPLOYEE",
    "firstName": "Alice",
    "lastName": "Andersen"
  },
  "organisation": {
    "id": "org_456",
    "name": "Nordstar Technologies",
    "slug": "nordstar",
    "subscriptionTier": "CORE"
  },
  "permissions": ["read_score", "book_advisor", "read_content"]
}
```

## Organisations Routes (HR_ADMIN only)

```
GET    /organisations/                    # Get current org
PATCH  /organisations/                    # Update org settings
GET    /organisations/analytics           # Workforce wellness (anonymised)
GET    /organisations/analytics/roi       # ROI report data
GET    /organisations/users               # List employees
POST   /organisations/users/invite        # Single invite
POST   /organisations/users/bulk-invite   # CSV upload
DELETE /organisations/users/:userId       # Remove employee
GET    /organisations/export              # GDPR data export (org + all users)
```

**POST /organisations/users/invite Request:**
```json
{
  "email": "bob@example.com",
  "role": "EMPLOYEE",
  "departmentId": "dept_123"
}
```

**Response:** Invitation sent, returns `Invitation` object with token.

**GET /organisations/analytics Response:**
```json
{
  "totalEmployees": 85,
  "employeesActive": 72,
  "engagementMetrics": {
    "percentCompletedAssessment": 78,
    "percentBookedAdvisor": 34,
    "workshopAttendanceRate": 52
  },
  "scoreDistribution": {
    "critical": 5,      // 0-39
    "building": 18,     // 40-59
    "good": 32,         // 60-79
    "strong": 17        // 80-100
  },
  "averageScore": 64,
  "scoreHistory": [
    { "date": "2025-01-01", "averageScore": 62 },
    { "date": "2025-02-01", "averageScore": 63 }
  ]
}
```

## Users Routes

```
GET    /users/me                       # Current user profile
PATCH  /users/me                       # Update profile
DELETE /users/me                       # GDPR right to erasure
GET    /users/me/export                # GDPR personal data export
POST   /users/me/consent               # Record consent
```

**POST /users/me/consent Request:**
```json
{
  "consentGiven": true,
  "consentVersion": "1.0.0",
  "dataSharingConsent": true
}
```

## Wellness Routes

```
GET    /wellness/profile               # Get wellness profile
POST   /wellness/assessment            # Submit assessment → calc score
GET    /wellness/score/history         # Score over time
```

**POST /wellness/assessment Request:**
```json
{
  "lifeStage": "BUILDING",
  "answers": [
    { "questionId": 1, "answerIndex": 2 },
    { "questionId": 2, "answerIndex": 1 }
    // ... 20 total answers
  ]
}
```

**Response:** Triggers `score.recalculate` job, returns updated `WellnessProfile`.

## Goals Routes

```
GET    /goals/                         # List goals
POST   /goals/                         # Create goal
PATCH  /goals/:goalId                  # Update goal
DELETE /goals/:goalId                  # Delete goal
```

**POST /goals/ Request:**
```json
{
  "type": "EMERGENCY_FUND",
  "title": "3 months expenses",
  "targetAmount": 150000,
  "targetDate": "2025-12-31"
}
```

## Content Routes

```
GET    /content/                       # List (filtered by tier + life stage)
GET    /content/:contentId             # Get single item
POST   /content/:contentId/progress    # Record progress
```

**POST /content/:contentId/progress Request:**
```json
{
  "progressPct": 50,
  "completed": false
}
```

## Advisors Routes

```
GET    /advisors/                      # List available advisors (this org)
GET    /advisors/:advisorId/slots      # Available slots (next 30 days)
POST   /advisors/bookings              # Book a slot
GET    /advisors/bookings              # List user's bookings
DELETE /advisors/bookings/:bookingId   # Cancel booking
```

**GET /advisors/:advisorId/slots Query Params:**
```
?startDate=2025-03-10&endDate=2025-04-10
```

**POST /advisors/bookings Request:**
```json
{
  "slotId": "slot_789",
  "topic": "Pension optimalisation",
  "notes": "I want to maximise my tax deduction"
}
```

## Workshops Routes

```
GET    /workshops/                     # List org workshops
POST   /workshops/:workshopId/register # Register attendance
```

## Notifications Routes

```
GET    /notifications/                 # List notifications
PATCH  /notifications/:notificationId/read  # Mark as read
```

## Billing Routes (HR_ADMIN only)

```
GET    /billing/subscription           # Current plan details
POST   /billing/portal                 # Stripe customer portal session
POST   /billing/webhooks               # Stripe webhook handler (public)
```

---

# 9. FRONTEND ARCHITECTURE

## App Router Structure

```
apps/web/app/
├── (auth)/
│   ├── login/
│   │   └── page.tsx                    # Auth0 login page
│   ├── onboarding/
│   │   ├── page.tsx                    # 5-step wizard
│   │   ├── layout.tsx                  # Onboarding shell
│   │   └── steps/
│   │       ├── consent.tsx
│   │       ├── life-stage.tsx
│   │       ├── snapshot.tsx
│   │       ├── goals.tsx
│   │       └── reveal.tsx
│   └── callback/
│       └── page.tsx                    # Auth0 callback
│
├── (employee)/
│   ├── layout.tsx                      # Sidebar nav + notifications
│   ├── dashboard/
│   │   └── page.tsx
│   ├── score/
│   │   └── page.tsx
│   ├── goals/
│   │   ├── page.tsx
│   │   └── [goalId]/edit.tsx
│   ├── learn/
│   │   ├── page.tsx
│   │   └── [contentId]/page.tsx
│   ├── advisors/
│   │   ├── page.tsx
│   │   └── bookings/
│   │       ├── page.tsx
│   │       └── [bookingId]/page.tsx
│   ├── workshops/
│   │   └── page.tsx
│   ├── tools/
│   │   ├── pension-optimiser.tsx
│   │   ├── tax-calculator.tsx
│   │   └── emergency-fund.tsx
│   └── settings/
│       ├── page.tsx
│       ├── profile/edit.tsx
│       └── data/export.tsx
│
├── (employer)/
│   ├── layout.tsx                      # Employer shell
│   ├── overview/
│   │   └── page.tsx
│   ├── employees/
│   │   ├── page.tsx
│   │   └── invite/page.tsx
│   ├── analytics/
│   │   ├── page.tsx
│   │   └── [period]/page.tsx
│   ├── workshops/
│   │   ├── page.tsx
│   │   └── [workshopId]/edit.tsx
│   ├── content/
│   │   └── page.tsx
│   └── billing/
│       └── page.tsx
│
├── api/
│   └── auth/
│       └── callback/route.ts           # Auth0 callback handler
│
└── layout.tsx                          # Root layout
```

## Component Library

```
apps/web/components/
├── ui/                                 # shadcn/ui base components
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   ├── modal.tsx
│   ├── select.tsx
│   ├── tabs.tsx
│   └── ...
│
├── layout/                             # Page layout
│   ├── sidebar.tsx
│   ├── header.tsx
│   ├── mobile-nav.tsx
│   └── footer.tsx
│
├── wellness/                           # Wellness-specific
│   ├── wellness-score-gauge.tsx       # Animated circular gauge
│   ├── score-band-badge.tsx           # Red/amber/green/gold
│   ├── pillar-card.tsx                # Emergency Fund, Pension, etc.
│   ├── score-history-chart.tsx        # Line chart over time
│   └── wellness-dashboard.tsx
│
├── goals/
│   ├── goal-card.tsx
│   ├── goal-progress-bar.tsx
│   └── goal-form.tsx
│
├── advisors/
│   ├── advisor-card.tsx
│   ├── advisor-booking-calendar.tsx
│   └── booking-confirmation-modal.tsx
│
├── employer/
│   ├── analytics-chart.tsx
│   ├── employee-table.tsx
│   ├── roi-report-card.tsx
│   └── score-distribution-histogram.tsx
│
├── content/
│   ├── content-card.tsx
│   └── content-library-grid.tsx
│
└── forms/
    ├── consent-form.tsx
    ├── invite-employee-form.tsx
    └── bulk-upload-form.tsx
```

## Design System

**Tailwind Config (tailwind.config.ts):**

```typescript
export default {
  theme: {
    extend: {
      colors: {
        velstand: {
          navy: '#0F2544',
          blue: '#1B3E6B',
          gold: '#C8A96E',
          'gold-light': '#F0E6D3',
          cream: '#F7F4EF',
          'off-white': '#FDFCFA',
        },
        score: {
          critical: '#DC2626',  // 0-39
          building: '#D97706',  // 40-59
          good: '#16A34A',      // 60-79
          strong: '#C8A96E',    // 80-100 (gold)
        },
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        sans: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
};
```

---

# 10. KEY FRONTEND COMPONENTS

## WellnessScoreGauge

Animated circular progress gauge (0–100), colour-coded by band.

```typescript
// apps/web/components/wellness/wellness-score-gauge.tsx

export function WellnessScoreGauge({
  score,
  isLoading,
}: {
  score: number | null;
  isLoading: boolean;
}) {
  const band = getScoreBand(score);
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score! / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <svg width={240} height={240} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={120}
          cy={120}
          r={radius}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={12}
        />
        {/* Progress circle */}
        <circle
          cx={120}
          cy={120}
          r={radius}
          fill="none"
          stroke={band.color}
          strokeWidth={12}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{
            transition: 'stroke-dashoffset 2s ease-out',
          }}
          strokeLinecap="round"
        />
      </svg>

      <div className="text-center">
        <div className="font-display text-5xl font-bold text-velstand-navy">
          {isLoading ? '...' : score}
        </div>
        <div className={`text-sm font-medium ${band.textClass}`}>
          {band.label}
        </div>
      </div>

      {/* Five pillars */}
      <div className="grid grid-cols-5 gap-2 mt-4">
        {pillars.map((pillar) => (
          <PillarCard key={pillar.id} pillar={pillar} />
        ))}
      </div>
    </div>
  );
}

function getScoreBand(score: number | null) {
  if (score === null) return { color: '#E5E7EB', label: 'Not assessed', textClass: 'text-gray-500' };
  if (score < 40) return { color: '#DC2626', label: 'Needs attention', textClass: 'text-red-600' };
  if (score < 60) return { color: '#D97706', label: 'Building', textClass: 'text-amber-600' };
  if (score < 80) return { color: '#16A34A', label: 'On track', textClass: 'text-green-600' };
  return { color: '#C8A96E', label: 'Strong', textClass: 'text-velstand-gold' };
}
```

## FinancialDashboard

Card grid showing key metrics.

```typescript
// apps/web/components/wellness/financial-dashboard.tsx

export function FinancialDashboard({ profile }: { profile: WellnessProfile }) {
  const cards = [
    {
      title: 'Emergency Fund',
      value: profile.emergencyFundMonths,
      unit: 'months',
      target: 6,
      recommendation: 'Aim for 6+ months',
    },
    {
      title: 'Pension Contribution',
      value: profile.pensionContribPct,
      unit: '%',
      target: 15,
      recommendation: 'Max out your DKK 63,100 annual deduction',
    },
    // ... more cards
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {cards.map((card) => (
        <Card key={card.title} className="p-6">
          <h3 className="font-semibold text-velstand-navy">{card.title}</h3>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-display text-3xl">{card.value ?? '—'}</span>
            <span className="text-sm text-gray-600">{card.unit}</span>
          </div>
          <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-velstand-gold"
              style={{
                width: `${Math.min((card.value! / card.target) * 100, 100)}%`,
              }}
            />
          </div>
          <p className="mt-2 text-xs text-gray-600">{card.recommendation}</p>
        </Card>
      ))}
    </div>
  );
}
```

## AdvisorBookingCalendar

Interactive week-view calendar with advisor cards.

```typescript
// apps/web/components/advisors/advisor-booking-calendar.tsx

export function AdvisorBookingCalendar({
  advisorId,
  onBook,
}: {
  advisorId: string;
  onBook: (slotId: string) => void;
}) {
  const { data: slots, isLoading } = useQuery({
    queryKey: ['advisor', advisorId, 'slots'],
    queryFn: () => api.get(`/advisors/${advisorId}/slots`),
  });

  const weeks = groupSlotsByWeek(slots || []);

  return (
    <div className="space-y-6">
      {weeks.map((week, i) => (
        <div key={i} className="space-y-2">
          <h3 className="font-semibold text-sm text-gray-600">
            {format(week[0].startTime, 'MMM d – ', { locale: da })}
            {format(week[week.length - 1].startTime, 'MMM d', { locale: da })}
          </h3>
          <div className="grid grid-cols-7 gap-2">
            {week.map((slot) => (
              <button
                key={slot.id}
                onClick={() => onBook(slot.id)}
                className="p-2 border-2 border-gray-200 rounded hover:border-velstand-gold hover:bg-velstand-gold-light"
              >
                <div className="text-xs font-semibold">
                  {format(slot.startTime, 'HH:mm')}
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
```

## OnboardingFlow

5-step wizard with consent gating.

```typescript
// apps/web/app/(auth)/onboarding/page.tsx

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    consentGiven: false,
    lifeStage: null,
    emergencyFund: null,
    goals: [],
  });

  // Step 1: GDPR Consent (cannot proceed without)
  if (step === 1) {
    return (
      <ConsentStep
        onNext={() => {
          if (!formData.consentGiven) return;
          setStep(2);
        }}
        onChange={(consentGiven) =>
          setFormData({ ...formData, consentGiven })
        }
      />
    );
  }

  // Steps 2-5: Remaining onboarding (skippable)
  return <RemainingSteps step={step} onNext={() => setStep(step + 1)} />;
}
```

---

# 11. FEATURES DEEP DIVE

## Financial Wellness Assessment

20-question quiz (5 sections).

**Scoring formula:**
```
Score = (pillar1 * 0.25) + (pillar2 * 0.25) + ... + (pillar5 * 0.10)

Pillar weights:
  Emergency Fund:        25%
  Pension Contribution:  25%
  Debt Management:       20%
  Savings Rate:          20%
  Financial Knowledge:   10%

Bands:
  0–39:   Needs Attention (red)
  40–59:  Building (amber)
  60–79:  On Track (green)
  80–100: Strong (gold)
```

**Questions (20 total):**

| Section | # | Question | Options |
|---|---|---|---|
| Emergency | 1 | Months saved? | <1 / 1-2 / 3-5 / 6+ |
| Emergency | 2 | Job loss duration? | <1 / 1-3 / 3-6 / 6+ |
| Emergency | 3 | Dedicated account? | Yes funded / Yes empty / No |
| Emergency | 4 | Confidence (1-5)? | Scale |
| Pension | 5 | % to pension? | Don't know / <10 / 10-12 / 12-15 / >15 |
| Pension | 6 | Estimated payout? | Yes / Rough / No |
| Pension | 7 | PensionsInfo.dk? | Yes / No / Don't know |
| Pension | 8 | Voluntary top-up? | Yes / No / Considering |
| Pension | 9 | Know DKK 63k limit? | Yes optimize / Yes don't act / No |
| Debt | 10 | Debt-to-income? | None / <30% / 30-80% / >80% |
| Debt | 11 | High-interest debt? | No / Small / Significant |
| Debt | 12 | Repayment plan? | Yes on track / Yes struggling / No |
| Debt | 13 | Know total debt? | Exactly / Approx / No |
| Savings | 14 | Save % income? | 0 / 1-5 / 5-10 / 10-15 / >15 |
| Savings | 15 | Automated transfer? | Yes / No |
| Savings | 16 | Investments? | Yes diversified / Yes one type / No |
| Savings | 17 | Aktiesparekonto? | Yes use / Yes don't / No |
| Knowledge | 18 | Folkepension age 2030? | 67 / 68 / 69 / 70 *(answer: 69)* |
| Knowledge | 19 | Ratepension limit 2025? | 45k / 63.1k / 80k / None *(answer: 63.1k)* |
| Knowledge | 20 | Unlimited pension? | Ratepension / Livrente / Aldersopsparing / Kapitalpension *(answer: Livrente)* |

## Stripe Billing

**Subscription tiers:**
```
STARTER   DKK 200/employee/month   → Has goal tracking
CORE      DKK 450/employee/month   → + advisor sessions + workshops
PARTNER   DKK 750/employee/month   → + tax optimiser + pension optimiser
```

**Webhook events to handle:**
```
customer.subscription.created    → org.subscriptionStatus = ACTIVE
customer.subscription.updated    → update tier, status
customer.subscription.deleted    → status = CANCELLED, restrict
invoice.payment_succeeded        → send receipt email
invoice.payment_failed           → status = PAST_DUE
customer.subscription.trial_will_end → send warning (3 days prior)
```

**Metered billing:**
- Cron job (1st of month): Count active employees → report to Stripe
- Triggers: `stripe.subscriptionItems.createUsageRecord()`

## GDPR Consent Flow

**Step 1: Display consent modal (blocks app access)**
- List 5 data categories (core, analytics, marketing, cookies, third parties)
- Separate checkboxes for each
- Core data = required (cannot uncheck)
- Record: `consentGiven`, `consentGivenAt`, `consentVersion`, IP, User-Agent
- Link to Privacy Policy + Terms
- Cannot skip

**Step 2: Store in DB**
```typescript
await prisma.user.update({
  where: { id: user.id },
  data: {
    consentGiven: true,
    consentGivenAt: new Date(),
    consentVersion: '1.0.0',
    dataSharingConsent: true, // User selected
  },
});
```

**Step 3: Audit log**
```
action: "consent.given"
resource: "User"
metadata: { version: "1.0.0", categories: [...] }
```

## Danish Financial Tools

### Pension Optimiser
```
Input: gross salary, employer %, employee %
Output:
  - Current yearly contribution
  - Max deductible (DKK 63,100 for ratepension 2025)
  - Recommended top-up to max
  - Estimated tax saving at ~52% marginal rate
  - Projected pension pot at 4.5% annual return
```

### Tax Calculator
```
Input: gross salary, municipality, marital status, deductions
Output:
  - Estimated annual tax
  - Effective tax rate
  - Top 3 legal optimisations + savings estimates
Disclaimer: "This is a calculation tool and does not constitute financial advice."
```

### Emergency Fund Calculator
```
Input: monthly fixed expenses, variable expenses, employment type
Output:
  - Recommended fund size (3–6 months)
  - Current shortfall
  - Monthly saving needed to reach target in X months
  - Recommended account type
```

---

# 12. BACKGROUND JOBS

Use **BullMQ** + Redis for all async work.

| Job | Trigger | Description |
|---|---|---|
| `score.recalculate` | After assessment | Recalc score, notify if band changes |
| `report.roi` | Manual or monthly | Generate PDF ROI report, store S3, email |
| `billing.usage` | Cron: 1st month | Count active employees, report to Stripe |
| `email.booking-reminder` | Scheduled 24h before | Send reminder + meeting link |
| `email.trial-ending` | Cron: daily | Send warning 7 days & 3 days before expiry |
| `notification.dispatch` | On Notification create | Send push via OneSignal |
| `analytics.aggregate` | Cron: nightly 02:00 | Pre-aggregate org analytics |
| `audit.cleanup` | Cron: monthly | Delete AuditLog > 2 years |

**Example: score.recalculate**

```typescript
// apps/api/src/jobs/score-recalculate.ts

export const scoreRecalculateQueue = new Queue('score.recalculate', {
  connection: redis,
});

scoreRecalculateQueue.process(async (job) => {
  const { userId } = job.data;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const profile = await prisma.wellnessProfile.findUnique({
    where: { userId },
  });

  const newScore = calculateWellnessScore(profile.assessmentData);
  const oldBand = getScoreBand(profile.score);
  const newBand = getScoreBand(newScore);

  await prisma.wellnessProfile.update({
    where: { userId },
    data: { score: newScore, scoreUpdatedAt: new Date() },
  });

  // Notify if band changed
  if (oldBand.label !== newBand.label) {
    await prisma.notification.create({
      data: {
        userId,
        type: 'SCORE_UPDATED',
        title: `Your wellness score improved to ${newBand.label}`,
        body: `You're now in the ${newBand.label} category.`,
      },
    });
  }
});
```

---

# 13. TESTING STRATEGY

## Unit Tests (Jest)

```bash
pnpm test:unit

# Coverage: 100% for:
# - Score calculation algorithm
# - Anonymisation functions
# - All utilities in packages/utils
```

**Example: Score calculation test**

```typescript
// apps/api/__tests__/services/wellness/score.test.ts

describe('calculateWellnessScore', () => {
  it('should return 0 for all minimum values', () => {
    const answers = createMinimalAnswers();
    const score = calculateWellnessScore(answers);
    expect(score).toBe(0);
  });

  it('should return 100 for all maximum values', () => {
    const answers = createMaximalAnswers();
    const score = calculateWellnessScore(answers);
    expect(score).toBe(100);
  });

  it('should handle edge case: missing data', () => {
    const answers = {};
    const score = calculateWellnessScore(answers);
    expect(score).toBeNull();
  });
});
```

## Integration Tests (Jest + Supertest)

```bash
pnpm test:integration

# Test all API endpoints:
# - Happy path (200)
# - Auth failure (401)
# - Tenant isolation failure (403)
```

**Example: Tenant isolation test**

```typescript
// apps/api/__tests__/security/tenant-isolation.test.ts

describe('Tenant Isolation', () => {
  it('user from Org A cannot access data from Org B', async () => {
    const userA = createTestUser('orgA');
    const userB = createTestUser('orgB');
    const goalB = createTestGoal(userB);

    const response = await request(app)
      .get(`/api/v1/goals/${goalB.id}`)
      .set('Authorization', `Bearer ${userA.token}`);

    expect(response.status).toBe(403);
    expect(response.body.error).toBe('Access denied');
  });

  it('forged organisationId in body is rejected', async () => {
    const userA = createTestUser('orgA');

    const response = await request(app)
      .post(`/api/v1/organisations/orgB/users`) // Forged org
      .set('Authorization', `Bearer ${userA.token}`)
      .send({ email: 'alice@example.com' });

    expect(response.status).toBe(403);
  });
});
```

## E2E Tests (Playwright)

```bash
pnpm test:e2e

# Scenarios:
# - Employee onboarding (consent to score reveal)
# - Advisor booking (search → confirm → cancel)
# - HR admin invite employee → employee accepts → visible in dashboard
# - Billing: upgrade → downgrade → cancel
```

**Example: Onboarding E2E**

```typescript
// apps/web/__tests__/e2e/onboarding.test.ts

test('Employee completes onboarding flow', async ({ page }) => {
  await page.goto('http://localhost:3000/login');
  await page.fill('[data-testid=email]', 'alice@example.com');
  await page.click('[data-testid=continue]');

  // Step 1: Consent
  expect(page.locator('text=GDPR Consent')).toBeVisible();
  await page.check('[data-testid=consent-core]');
  await page.check('[data-testid=consent-analytics]');
  await page.click('[data-testid=next]');

  // Step 2: Life stage
  await page.select('[data-testid=life-stage]', 'BUILDING');
  await page.click('[data-testid=next]');

  // ... more steps

  // Score reveal
  await expect(page.locator('[data-testid=score-gauge]')).toBeVisible();
  const scoreText = await page.textContent('[data-testid=score-value]');
  expect(parseInt(scoreText)).toBeGreaterThanOrEqual(0);
  expect(parseInt(scoreText)).toBeLessThanOrEqual(100);
});
```

---

# 14. SCREENSHOT WORKFLOW

## Setup

```bash
pnpm add -D puppeteer jest-puppeteer @types/jest-puppeteer
```

## File Structure

```
apps/web/
├── __screenshots__/
│   ├── employee-dashboard.test.ts
│   ├── wellness-score.test.ts
│   └── ...
├── screenshots/
│   ├── baseline/               # Committed to Git
│   └── temporary/              # .gitignored
└── scripts/
    └── compare-screenshots.js
```

## Capture Screenshots

```bash
# Capture new screenshots
pnpm screenshots:test

# Update baseline (commit as source of truth)
pnpm screenshots:update

# Compare vs baseline (for CI)
pnpm screenshots:compare
```

## Verification Checklist

Before approving a screenshot:
- [ ] Spacing/padding matches design tokens (8, 16, 24, 32px)
- [ ] Font size & weight correct
- [ ] Colors exact (use hex checker)
- [ ] Button states (hover, active, disabled)
- [ ] Icons aligned & sized
- [ ] No unexpected whitespace or cutoffs

---

# 15. DEPLOYMENT & CI/CD

## GitHub Actions Pipeline

```yaml
# .github/workflows/ci.yml

name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm db:generate
      - run: pnpm test:unit
      - run: pnpm test:integration
      - run: pnpm lint
      - run: pnpm typecheck

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pnpm install --frozen-lockfile
      - run: pnpm build

  deploy-staging:
    needs: build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Vercel (staging)
        run: vercel --token=${{ secrets.VERCEL_TOKEN }} --prod=false
      - name: Deploy API to Railway (staging)
        run: railway deploy --environment staging

  deploy-production:
    needs: deploy-staging
    if: github.ref == 'refs/heads/main'
    environment: production
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Vercel (production)
        run: vercel --token=${{ secrets.VERCEL_TOKEN }} --prod
      - name: Deploy API to Railway (production)
        run: railway deploy --environment production
```

## Environments

| Environment | Purpose | Database |
|---|---|---|
| `local` | Dev machine | Docker Postgres |
| `staging` | Pre-production test | Supabase staging project |
| `production` | Live product | Supabase/RDS production |

---

# 16. SECURITY & COMPLIANCE

## GDPR Requirements

- [ ] Explicit consent (not pre-ticked) recorded with timestamp + IP
- [ ] Privacy Policy & Terms publicly available
- [ ] Data Processing Agreement (DPA) template ready
- [ ] GDPR data export endpoint working (`GET /users/me/export`)
- [ ] GDPR right to erasure (`DELETE /users/me`)
- [ ] Audit logging for all data access
- [ ] 2-year retention policy for AuditLog (auto-cleanup job)
- [ ] All data in EU region (AWS eu-west-1)

## Tenant Isolation Checklist

- [ ] Every user query includes `organisationId` filter
- [ ] JWT claims verified (aud, iss, sub, org)
- [ ] Cross-org access tests passing (see Testing section)
- [ ] Forged org IDs rejected (403)
- [ ] Rate limiting per IP + per authenticated user
- [ ] No secrets in Git history (`git log -S "sk_live" --all`)

## Encryption

- [ ] Salary & financial fields encrypted at rest (AES-256-GCM)
- [ ] HTTPS enforced (TLS 1.3+)
- [ ] CSP headers set (helmet.js)
- [ ] CORS restricted to velstand.dk
- [ ] No PII in logs or error messages

---

# 17. PHASE 1 DEFINITION OF DONE

MVP complete when all of these are true:

### Authentication & Onboarding
- [ ] Employee signup (email/password, Google SSO)
- [ ] GDPR consent flow (gated, explicit, stored)
- [ ] 5-step onboarding wizard (skippable after consent)
- [ ] Wellness score calculated & displayed (animated gauge)

### Employee App
- [ ] Dashboard: score gauge, 5 pillar cards, top 3 recommendations
- [ ] Content library: 10+ articles/videos (seeded from Sanity)
- [ ] Advisor listing: search, filter, view credentials
- [ ] Advisor booking: calendar view, book/cancel
- [ ] Financial tools: pension optimiser + emergency fund calc (client-side)
- [ ] Notification centre: in-app notifications
- [ ] Settings: profile edit, consent withdrawal, data export

### Employer Dashboard
- [ ] Employee invitation (email + bulk CSV)
- [ ] Employee management table (list, search, remove)
- [ ] Workforce analytics: avg score, distribution, engagement rates
- [ ] Analytics anonymisation: min cohort size, no individual data
- [ ] Billing page: current plan, next invoice, Stripe portal link

### Infrastructure & Security
- [ ] All data in EU (aws eu-west-1)
- [ ] Auth: Auth0 integration working
- [ ] API: all endpoints require auth (except webhooks)
- [ ] Tenant isolation: tests passing
- [ ] Billing: Stripe subscription active, metered usage working
- [ ] Error tracking: Sentry live
- [ ] Monitoring: basic uptime checks

### Tests
- [ ] Unit tests: 100% coverage (score, crypto, validators)
- [ ] Integration tests: all API endpoints (happy path + auth + tenant isolation)
- [ ] E2E tests: onboarding, advisor booking, HR invite flow
- [ ] Visual regression: baseline screenshots approved

---

# 18. SEED DATA

Populate dev database with realistic Danish data.

```typescript
// packages/db/seed.ts

// 2 test organisations:
// 1. Nordstar Technologies (85 employees, CORE tier)
// 2. Bright Consulting ApS (32 employees, STARTER tier, trial)

// Per org:
// - 1 HR_ADMIN (hradmin@org.velstand.test)
// - 1 HR_MANAGER
// - 10 employees (varied wellness profiles: 2 critical, 3 building, 3 good, 2 strong)

// 3 test advisors:
// - Maria Lindqvist (pension, retirement)
// - Anders Holm (tax, investment)
// - Sofie Kjær (budgeting, early career)

// Advisor slots: 5 per advisor, next 2 weeks

// 5 workshops for Nordstar

// Content progress: 60% of employees started >= 1 content
```

---

# 19. LAUNCH CHECKLIST

Before inviting real employer clients:

### Legal
- [ ] Privacy Policy (da + en) at velstand.dk/privacy
- [ ] Terms of Service at velstand.dk/terms
- [ ] Data Processing Agreement (DPA) template
- [ ] Cookie consent banner implemented
- [ ] Lawyer confirms: broker model ≠ MiFID II license required

### Security
- [ ] Penetration test or security audit completed
- [ ] `pnpm audit` — no critical vulnerabilities
- [ ] SSL/TLS certificates valid
- [ ] Security headers verified (helmet.js)
- [ ] No secrets in Git history

### Operations
- [ ] Daily automated DB backups configured + tested
- [ ] On-call process defined
- [ ] Status page created (statuspage.io)
- [ ] GDPR breach notification process documented (72-hour rule)

---

# 20. FUTURE PHASES (DO NOT BUILD YET)

Record here to prevent premature implementation:

- **Phase 2:** React Native mobile app (shared logic)
- **Phase 2:** Open Banking (PSD2) integration
- **Phase 2:** Danish tax authority (SKAT) integration
- **Phase 2:** Payroll integrations (Lessor, Dataløn)
- **Phase 2:** AI-powered personalised insights
- **Phase 1.5:** Employer ROI PDF report
- **Phase 3:** Swedish/Norwegian localisation
- **Phase 3:** White-label (Velstand for Brokers)
- **Phase 3:** Enterprise HR integrations (Workday, SAP)

---

## QUICK START

```bash
# 1. Initialize monorepo
npx create-turbo@latest velstand
cd velstand
pnpm install

# 2. Setup Prisma + database
cd packages/db
pnpm prisma generate
pnpm prisma migrate dev --name init

# 3. Start dev environment
docker-compose up -d  # Postgres + Redis locally
pnpm dev

# 4. Run tests
pnpm test:unit
pnpm test:integration

# 5. Build for production
pnpm build
```

---

**Last Updated:** March 2025  
**Status:** Phase 1 MVP ready for implementation  
**Next:** Begin Phase 0 (monorepo setup) → Phase 1 (core features)
