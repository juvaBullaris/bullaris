# Database Schema — Bullaris

Supabase (Postgres), Frankfurt EU. ORM: Prisma. Schema in `packages/db/schema.prisma`.

## Core Tables

```
employers          id, name, slug, stripe_customer_id, seats_purchased, created_at
employees          id, employer_id (FK), supabase_user_id, role, invited_at, onboarded_at
profiles           id (= employee.id), display_name, age, employment_type
consent_events     id, employee_id, source, version, action (grant|revoke), created_at
```

## Financial Data Tables (employee-owned, RLS-protected)

```
net_worth_entries  id, employee_id, assets_dkk, liabilities_dkk, recorded_at
goals              id, employee_id, type, target_dkk, deadline, progress_dkk
debts              id, employee_id, label, balance_dkk, interest_rate, strategy
budget_categories  id, employee_id, label, limit_dkk, period (monthly|annual)
payslip_inputs     id, employee_id, gross_dkk, period, tax_card_type, recorded_at
```

## Learning Tables

```
learning_content   id, sanity_id, type (article|video), module, published_at
learning_progress  id, employee_id, content_id, completed_at
```

## Nudge Tables

```
nudge_rules        id, code, trigger_condition, template_id, cooldown_days
nudge_events       id, employee_id, rule_id, sent_at, channel (email)
```

## RLS Rules — IMPORTANT

- `employees`: `employer_id = auth.jwt() -> employer_id` — employees see only own employer's records
- All financial tables: `employee_id = auth.uid()` — employees see only own rows
- Employer HR admin sees `employees` where `employer_id` matches — never financial tables directly
- Aggregation queries for HR analytics must go through server-side tRPC — never client-side

## Consent Pattern — IMPORTANT

**Every** time a user grants or revokes data permission, insert to `consent_events`:
```typescript
await db.consentEvent.create({
  data: { employeeId, source: 'payslip_module', version: '1.0', action: 'grant' }
})
```
Sources: `profile`, `payslip_module`, `tax_planner`, `ai_chat`, `spending_tracker`
