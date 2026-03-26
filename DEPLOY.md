# Deployment Guide

## Platform: Vercel (EU region)

### 1. Push database schema

Before deploying, push the Prisma schema to your Supabase database:

```bash
npm run db:push
```

This will create all tables including `audit_completions` (added for the HR audit flow).

### 2. Connect Vercel to your repo

1. Go to [vercel.com](https://vercel.com) → Add New Project → Import your Git repo
2. Vercel auto-detects `vercel.json` — no extra config needed
3. Set the root directory to the repo root (not `apps/web`) — `vercel.json` handles the build

### 3. Set environment variables in Vercel

Go to Project → Settings → Environment Variables and add all of these:

| Variable | Where to get it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API → anon public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API → service_role secret key |
| `DATABASE_URL` | Supabase → Project Settings → Database → Connection string (Session mode, port 5432) |
| `ANTHROPIC_API_KEY` | [console.anthropic.com](https://console.anthropic.com) → API Keys |
| `STRIPE_SECRET_KEY` | Stripe Dashboard → Developers → API Keys |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe Dashboard → Developers → API Keys |
| `RESEND_API_KEY` | [resend.com](https://resend.com) → API Keys |
| `SENTRY_DSN` | Sentry → Project → Settings → Client Keys |
| `NEXT_PUBLIC_SITE_URL` | Your production URL e.g. `https://bullaris.dk` |

### 4. Verify domain

Add `bullaris.dk` in Vercel → Project → Settings → Domains.
Update DNS: add CNAME `@` → `cname.vercel-dns.com`

### 5. First deploy

Push to `main` — Vercel auto-deploys. Check the build log for any errors.

---

## Schema migration notes

The `audit_completions` table was added to `packages/db/schema.prisma`.
Run `npm run db:push` to apply it to Supabase before first use of the `/audit` route.

The `employees.supabase_user_id` column now has a `UNIQUE` constraint — if you already have data, verify there are no duplicates before pushing.
