# Auth + Multi-tenancy — Bullaris

Supabase Auth. Three roles. One employer = one tenant. Employees belong to exactly one employer.

## Role Hierarchy

```
operator          You — full access, never shown in client UI
hr_admin          HR director at an employer — sees own employer data only
employee          End user — sees own financial data only
```

Role stored in `auth.users.raw_user_meta_data.role` and mirrored in `employees.role`.

## Auth Flow

**Employer signup:** operator creates employer record → generates invite link for hr_admin
**Employee invite:** hr_admin invites by email → Supabase magic link → employee onboards
**IMPORTANT:** Employees never self-register — always invited by hr_admin

## Route Protection Pattern

```typescript
// apps/web/middleware.ts — protect all (employee) and (employer) routes
const { data: { user } } = await supabase.auth.getUser()
if (!user) redirect('/login')

const role = user.user_metadata.role
if (pathname.startsWith('/dashboard') && role !== 'employee') redirect('/unauthorized')
if (pathname.startsWith('/portal') && role !== 'hr_admin') redirect('/unauthorized')
```

## tRPC Context — Tenant Injection

```typescript
// Every tRPC procedure gets employerId from session — never trust client input
export const createContext = async ({ req }) => {
  const user = await getUser(req)
  const employee = await db.employee.findUnique({ where: { supabaseUserId: user.id } })
  return { user, employee, employerId: employee?.employerId }
}
```

## IMPORTANT Isolation Rules

- Never accept `employerId` or `employeeId` as a query parameter — derive from session only
- HR admin queries must always filter by `employerId` from context, never from request body
- Aggregation queries for HR analytics: group and anonymise server-side before returning
- Minimum group size for any aggregate shown to HR: 5 employees (privacy threshold)
