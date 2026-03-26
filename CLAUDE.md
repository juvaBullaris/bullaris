# Bullaris

B2B SaaS employee financial wellness platform for Danish SMEs. Sold to HR departments, used by employees. Next.js monorepo — three surfaces: marketing site, employee app, employer portal.

## Commands

```bash
npm run dev          # Start dev server (port 3000)
npm run build        # Production build
npm run test         # Jest + Playwright tests
npm run lint         # ESLint + Prettier
npm run db:push      # Push Prisma schema to Supabase
npm run db:studio    # Open Prisma Studio
npm run db:seed      # Seed demo data (Danish personas)
```

## Project Structure

```
bullaris/
  apps/
    web/             # Next.js App Router — all three surfaces
      app/
        (marketing)/ # Public landing page, blog, demo
        (employee)/  # Employee dashboard modules
        (employer)/  # HR portal, analytics, seat mgmt
      components/    # Shared UI components
  packages/
    db/              # Prisma schema + migrations
    danish-tax/      # DK payslip + tax calculation logic
    nudge-engine/    # Rule-based email nudge scheduler
  docs/              # Reference documents (@imported below)
```

## Conventions

- **IMPORTANT:** All financial calculations live in `packages/danish-tax/` — never inline tax logic in components
- **IMPORTANT:** Employer can never see individual employee data — only aggregated, anonymised metrics
- **IMPORTANT:** Every data collection point must log a consent event to `consent_events` table
- tRPC for all client-server data fetching — no raw fetch calls to internal routes
- Supabase RLS enforces tenant isolation — always test with a second employer account
- DKK is the native currency — convert to EUR only for display, never store EUR
- `packages/danish-tax/` has its own test suite — run `npm run test:tax` before any payslip changes
- Error shape: `{ success: boolean, data?: T, error?: { code, message } }`
- Danish copy goes in `locales/da.json` — never hardcode Danish strings in components

## Tech Stack

| Layer | Tool | Note |
|---|---|---|
| Frontend | Next.js 14 App Router | Tailwind + shadcn/ui |
| API | tRPC | Type-safe, no REST |
| Database | Supabase (Postgres) | Frankfurt EU region |
| ORM | Prisma | Schema in packages/db/ |
| Auth | Supabase Auth | Role: employee, hr_admin, operator |
| Email | Resend | Templates in apps/web/emails/ |
| Video | Mux | Embed only — no custom player |
| CMS | Sanity | Learning hub content only |
| AI chat | Anthropic claude-sonnet-4-6 | See docs/ai-chat.md |
| Payments | Stripe | Seat-based subscriptions |
| Hosting | Vercel | EU region, auto-deploy on main |
| Monitoring | Sentry | DSN in SENTRY_DSN env var |

## Environment Variables

Required in `.env.local` — never commit:
`NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL`,
`ANTHROPIC_API_KEY`, `STRIPE_SECRET_KEY`, `RESEND_API_KEY`, `SENTRY_DSN`

## Reference Documents

### Database schema — `@docs/schema.md`
**Read when:** Adding tables, writing queries, designing new modules
Covers all tables, RLS policies, consent_events pattern, tenant isolation rules

### Danish tax logic — `@docs/danish-tax.md`
**Read when:** Working on payslip explainer, tax planner, or any DKK calculation
Covers AM-bidrag, A-skat, personfradrag, fradrag rules, edge cases

### Auth + multi-tenancy — `@docs/auth-tenancy.md`
**Read when:** Adding any route, middleware, or data query
Covers role hierarchy, RLS setup, employer/employee isolation

### AI chat integration — `@docs/ai-chat.md`
**Read when:** Working on the employee AI finance chat feature
Covers Claude API setup, streaming, system prompt, token budget, cost controls

### Compliance layer — `@docs/compliance.md`
**Read when:** Adding any new data collection, user flow, or employer-facing feature
Covers GDPR consent logging, data minimisation rules, DPA obligations
