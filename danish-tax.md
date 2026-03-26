# Danish Tax Logic — Bullaris

All calculation functions live in `packages/danish-tax/`. Run `npm run test:tax` after any change.

## Payslip Calculation — Gross to Net

```
gross_dkk
  - AM-bidrag          8% of gross (always, no exceptions)
  = AM-grundlag
  - A-skat             (AM-grundlag - personfradrag_monthly) × tax_rate
  = net_dkk
```

## Key Variables (2024 rates — update annually)

| Variable | Value | Note |
|---|---|---|
| AM-bidrag rate | 8% | Fixed, no threshold |
| Personfradrag (annual) | 49,700 DKK | Monthly: 4,142 DKK |
| Bottom tax (bundskat) | 12.01% | On AM-grundlag above personfradrag |
| Municipality average | 25.018% | Use as default; user can override |
| Top tax threshold | 568,900 DKK | AM-grundlag above this: +15% |
| ATP employee | 99 DKK/mo | Full-time; 66 DKK part-time |

## Tax Card Types

- **Hovedkort (A-card):** Standard — apply personfradrag here
- **Bikort (B-card):** No personfradrag — tax full AM-grundlag
- **Frikort:** Employee has a tax-free allowance — use `frikort_limit_dkk` from profile

## Common Fradrag (deductions) to surface in UI

- Befordringsfradrag (commute): `max(0, (km_daily × 2 - 24) × working_days × rate_per_km)`
- Fagforeningskontingent (union): deductible up to 7,000 DKK/year
- A-kasse: fully deductible
- Håndværkerfradrag: 25% of eligible labour costs, max 12,900 DKK/year

## IMPORTANT Implementation Rules

- **Never** calculate tax client-side — always call `packages/danish-tax/calculate` server-side
- Store only `gross_dkk` and `tax_card_type` in DB — recalculate net on render
- Rates are hardcoded constants in `packages/danish-tax/rates/[year].ts` — one file per year
- Municipality tax: store user's municipality and look up from `packages/danish-tax/municipalities.ts`
- Always show calculation breakdown in UI (AM-bidrag → A-skat → net) — not just net figure
