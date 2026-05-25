# Bullaris System Architecture

**Overview**: B2B SaaS platform for employee financial wellness built with Next.js, Supabase, and tRPC.

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Vercel (EU Region)                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Next.js 14 App Router (React + Server Components)  │  │
│  │  • Marketing site (/)                               │  │
│  │  • Employee app (/dashboard, /learning, /chat)      │  │
│  │  • Employer portal (/portal, /analytics)            │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  API Routes + tRPC                                   │  │
│  │  • Type-safe RPC for all client-server data         │  │
│  │  • Webhooks (Zoom attendance, Stripe billing)       │  │
│  │  • AI chat endpoint (Claude API)                     │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│         Supabase (PostgreSQL, Frankfurt EU)                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Authentication (Supabase Auth)                      │  │
│  │  • Magic links + OAuth                              │  │
│  │  • JWT tokens in httpOnly cookies                   │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Database (PostgreSQL 14)                            │  │
│  │  • 15+ tables (employees, profiles, goals, etc.)    │  │
│  │  • Row-Level Security (RLS) for tenant isolation    │  │
│  │  • Encrypted at rest, TLS in transit                │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│            External Services (Integration Layer)             │
│  • Mux: Video/podcast delivery                             │
│  • Anthropic: AI financial assistant (Claude)              │
│  • Resend: Transactional email                             │
│  • Stripe: Payment processing & subscriptions              │
│  • Sanity CMS: Learning content management                 │
│  • Zoom: Webinar participant tracking                      │
│  • Sentry: Error tracking & monitoring                     │
└─────────────────────────────────────────────────────────────┘
```

---

## Core Layers

### Frontend Layer (React/Next.js)
- **Framework**: Next.js 14 with App Router
- **UI Framework**: Tailwind CSS + shadcn/ui
- **State Management**: React hooks + Supabase real-time subscriptions
- **Type Safety**: Full TypeScript
- **Styling**: Utility-first CSS (Tailwind)

**Three Surfaces**:
1. **Marketing Site** (`/(marketing)`) — Public landing, blog
2. **Employee App** (`/(employee)/*`) — Personal financial tools, learning
3. **Employer Portal** (`/(employer)/*`) — HR analytics, seat management

### API Layer (tRPC)
- **Type-Safe RPC**: Full TypeScript inference client ↔ server
- **Router Structure**: Modular routers by domain (employee, employer, learning, etc.)
- **Procedures**:
  - `publicProcedure`: No auth required
  - `protectedProcedure`: Authenticated user required
  - `hrAdminProcedure`: HR admin role required
- **Input Validation**: Zod schemas on all mutations
- **Error Handling**: Structured `TRPCError` responses

**Example Flow**:
```typescript
// Client
const { data } = trpc.employee.updateProfile.useMutation();

// Server
export const employeeRouter = router({
  updateProfile: protectedProcedure
    .input(profileSchema)
    .mutation(async ({ ctx, input }) => {
      // ctx.employee is authenticated user
      // input is validated
      return await db.profile.update({ ... })
    })
})
```

### Database Layer (Supabase + Prisma)
- **ORM**: Prisma (type-safe, migration-based)
- **Database**: PostgreSQL (Frankfurt EU region)
- **Authentication**: Supabase Auth (JWT, magic links)
- **Row-Level Security**: Fine-grained access control per tenant
- **Backups**: Automated daily, 30-day retention

**Key Tables**:
- `employee` — User accounts, roles, onboarding status
- `profile` — Personal financial data (salary, tax, demographics)
- `goal` — Financial goals with targets & deadlines
- `learning_progress` — Course completion tracking
- `ai_chat_session` — AI chat history & usage tracking
- `consent_event` — GDPR audit trail (grants/revokes)

**Isolation Model**:
- Every query filtered by `employerId` (via RLS)
- HR admin can only see own company's employees
- Employees can only see own data
- No cross-company data leakage possible

### Business Logic Layer
- **Danish Tax Logic** (`packages/danish-tax/`)
  - Payslip calculations (AM-bidrag, bundskat, topskat)
  - Tax deduction rules
  - Tested annually for law changes
- **Nudge Engine** (`packages/nudge-engine/`)
  - Rule-based email scheduler
  - Triggers based on user milestones
- **Learning Platform**
  - Video hosting via Mux (signed URLs)
  - Quiz scoring & progress tracking
  - Podcast streaming

---

## Data Flow Example: Update Profile

```
User Input (Browser)
        ↓
React Component
        ↓
tRPC Mutation Call (encrypted TLS)
        ↓
Next.js API Route
        ↓
Supabase Auth Verification (JWT token)
        ↓
Zod Input Validation
        ↓
tRPC Procedure (protectedProcedure)
        ↓
Authorization Check (is this the user's own profile?)
        ↓
Prisma Update (database-level RLS applies)
        ↓
Database Response
        ↓
Sentry Monitoring (errors logged)
        ↓
Client-side update (React state + cache invalidation)
        ↓
UI Re-render
```

---

## Key Design Patterns

### 1. Tenant Isolation (Multi-Tenancy)
- Every employee belongs to exactly one employer
- Every query filtered by `employerId`
- RLS policy prevents unauthorized access
- No shared tenant data

### 2. Type Safety Throughout
- TypeScript from frontend to database
- Prisma generates types from schema
- tRPC generates client types from server procedures
- Zod validates at API boundary

### 3. Progressive Enhancement
- Server Components for data fetching
- Client Components for interactivity
- Middleware for route protection
- Graceful error handling at every layer

### 4. Privacy by Design
- Minimum data collection (salary, age, municipality only)
- Automatic deletion on consent revocation
- No PII in logs (Sentry filters)
- Aggregated analytics only (n≥5 minimum group size)

---

## Authentication & Authorization

### Authentication Flow
1. **Magic Link** sent to email via Supabase
2. **JWT Token** issued after email verification
3. **httpOnly Cookie** stores token (secure, can't be accessed by JS)
4. **Middleware** verifies token on every request
5. **Context** provides authenticated user to tRPC procedures

### Authorization Levels
```typescript
// Public: No auth required
publicProcedure
  .query(() => { /* Anyone can access */ })

// Protected: Authenticated user only
protectedProcedure
  .query(({ ctx }) => {
    // ctx.user = authenticated Supabase user
    // ctx.employee = linked employee record
  })

// HR Admin: Role-based
hrAdminProcedure
  .query(({ ctx }) => {
    // Verified: ctx.employee.role === 'hr_admin'
    // Can see aggregated employer analytics
  })
```

---

## Deployment Architecture

### Environments
| Environment | URL | Database | Branch |
|---|---|---|---|
| **Production** | bullaris.dk | Supabase prod | `master` |
| **Staging** | staging.bullaris.dk | Supabase staging | `staging` |
| **Development** | localhost:3000 | Local/personal | feature branches |

### Deployment Pipeline
1. **Push to GitHub** (any branch)
2. **Vercel CI** runs: linting, type checking, tests
3. **If `staging` branch**: Deploy to staging.bullaris.dk
4. **If `master` branch**: Deploy to bullaris.dk
5. **Post-deploy**: Sentry release created, monitoring activated

### Database Migrations
```bash
# Development
npm run db:push          # Apply to dev database

# Staging/Production
npm run db:deploy        # Idempotent, tracked migrations
```

**Key**: Migrations are NOT automatic. Deploy code first, then apply migrations.

---

## Monitoring & Observability

### Error Tracking (Sentry)
- Captures JavaScript errors (frontend)
- Captures API exceptions (tRPC)
- Captures performance metrics (slow requests)
- Sensitive data filtered (no salary, no passwords)

### Performance Monitoring
- **Vercel Analytics**: Core Web Vitals (LCP, FID, CLS)
- **Database Queries**: Supabase query logs (slow query logging)
- **API Response Times**: Sentry transaction tracking

### Logging
- **Application Logs**: Sentry, browser console
- **Database Logs**: Supabase query audit trail
- **Auth Logs**: Supabase Auth events (logins, failures)
- **Error Logs**: Structured errors with context

---

## Security Architecture

### Secrets Management
- **Never commit** `.env` files or credentials
- **Environment variables** stored in Vercel settings
- **Service keys** (Supabase, Stripe) only on server
- **Public keys** (Supabase anon key) can be in client

### Encryption
- **In Transit**: TLS 1.2+ (Vercel enforces HTTPS)
- **At Rest**: Supabase encryption (AES-256)
- **Authentication**: Supabase manages JWT signing
- **API Keys**: Environment variables (Vercel manages)

### Access Control
- **Frontend**: UI-level role checks (for UX)
- **API**: tRPC procedure middleware (authorization)
- **Database**: RLS policies (enforcement)
- **Infrastructure**: Vercel deployment (code review required)

---

## Performance Optimizations

### Frontend
- **Code Splitting**: Automatic via Next.js
- **Image Optimization**: `next/image` with responsive sizing
- **CSS**: Tailwind for minimal bundle
- **Client-Side Caching**: React Query / Supabase real-time

### Backend
- **Database Indexing**: Indexed on frequently queried columns
- **Query Optimization**: Prisma select() to fetch only needed fields
- **Rate Limiting**: Daily limit on AI chat (prevent abuse)
- **Caching**: Vercel edge caching for static content

### Infrastructure
- **CDN**: Vercel edge network (global distribution)
- **Database**: Supabase multi-zone HA (99.95% uptime)
- **Load Balancing**: Vercel automatic scaling

---

## Technology Decisions

| Choice | Alternative | Why |
|---|---|---|
| **Next.js 14** | SvelteKit, Remix | Full-stack framework, best DX, React ecosystem |
| **Supabase** | Firebase, AWS Cognito | Open-source, PostgreSQL, built-in RLS |
| **Prisma** | TypeORM, SQLAlchemy | Type-safe, migrations, excellent DX |
| **tRPC** | GraphQL, REST | Type inference without code generation |
| **Tailwind** | Material UI, Ant Design | Utility-first, lightweight, customizable |
| **Vercel** | AWS, Google Cloud | Next.js native, easy deployments, edge functions |

---

## Scaling Considerations

### Current Scale
- ~100-500 companies (customers)
- ~10k-50k employees (data subjects)
- ~2% monthly database growth

### Future Scaling
- **Database**: Supabase can handle 1M+ rows comfortably
- **API**: Vercel auto-scales serverless functions
- **Storage**: Mux handles video at any scale
- **Email**: Resend can handle 1M+ emails/day

### Optimization Path
1. Add caching layer (Redis) if API latency > 200ms
2. Add vector database if AI chat usage > 10k queries/day
3. Implement full-text search if learning content > 10k modules
4. Shard database if single database > 10GB

---

## Development Workflow

### Local Setup
```bash
cd Tech
npm install
cp .env.example .env.local  # Fill with staging credentials
npm run dev                 # Start dev server + Supabase local
```

### Testing
```bash
npm run test               # Jest (unit + integration)
npm run test:watch        # Watch mode
npm run lint              # ESLint + Prettier
npx tsc --noEmit          # Type checking
```

### Deployment
```bash
git checkout -b feature/my-feature
# Make changes
npm run lint && npm run test && npm run build  # Local verification
git push -u origin feature/my-feature
# Open PR, get review
# Merge to master
# Vercel auto-deploys
```

---

## Learning Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Supabase Docs**: https://supabase.com/docs
- **Prisma Docs**: https://www.prisma.io/docs/
- **tRPC Docs**: https://trpc.io/docs/
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/

---

**Document Owner**: CTO  
**Last Updated**: 2026-05-25  
**Next Review**: 2026-09-25
