/**
 * Danish gross-to-net salary calculation.
 *
 * IMPORTANT: This module is SERVER-SIDE ONLY.
 * Never import this in client components or expose via client-side routes.
 * All calculations must go through tRPC procedures.
 *
 * Logic follows Skatteministeriet rules for 2024.
 */

import { RATES_2024 } from './rates/2024'
import { getMunicipalityRate } from './municipalities'

export interface CalculateNetParams {
  /** Monthly gross salary in DKK */
  gross_dkk: number
  /** Tax card type */
  tax_card_type: 'A' | 'B' | 'frikort'
  /** Override municipality name for tax rate lookup */
  municipality?: string
  /** Override municipality rate directly (takes precedence over municipality name) */
  municipality_rate?: number
  /** Tax year — defaults to 2024 */
  year?: number
  /** Frikort annual limit in DKK — required when tax_card_type = 'frikort' */
  frikort_limit_dkk?: number
  /** Employment type for ATP calculation */
  employment_type?: 'full_time' | 'part_time'
}

export interface CalculateNetResult {
  gross_dkk: number
  am_bidrag: number
  am_grundlag: number
  a_skat: number
  atp: number
  net_dkk: number
  /** Human-readable breakdown notes for UI display */
  breakdown: string[]
  /** Effective total tax rate (percentage of gross) */
  effective_rate: number
}

/**
 * Calculate monthly net pay from gross.
 *
 * Formula:
 *   AM-bidrag = gross × 8%
 *   AM-grundlag = gross − AM-bidrag
 *   A-skat = (AM-grundlag − personfradrag) × (bundskat + kommuneskat) [+ topskat if applicable]
 *   Net = AM-grundlag − A-skat − ATP
 *
 * Tax card differences:
 *   A-card (Hovedkort): full personfradrag applied monthly
 *   B-card (Bikort): no personfradrag — full AM-grundlag taxed
 *   Frikort: monthly share of frikort_limit is tax-free; remainder taxed like A-card
 */
export function calculateNet(params: CalculateNetParams): CalculateNetResult {
  const {
    gross_dkk,
    tax_card_type,
    municipality,
    municipality_rate: overrideRate,
    year: _year = 2024,
    frikort_limit_dkk,
    employment_type = 'full_time',
  } = params

  const rates = RATES_2024 // Future: load rates by year

  const breakdown: string[] = []

  // ── Step 1: AM-bidrag ───────────────────────────────────────────────────
  const am_bidrag = roundDKK(gross_dkk * rates.AM_BIDRAG)
  breakdown.push(
    `AM-bidrag: ${gross_dkk.toLocaleString('da-DK')} × 8% = ${am_bidrag.toLocaleString('da-DK')} DKK`
  )

  // ── Step 2: AM-grundlag ─────────────────────────────────────────────────
  const am_grundlag = roundDKK(gross_dkk - am_bidrag)
  breakdown.push(
    `AM-grundlag: ${gross_dkk.toLocaleString('da-DK')} − ${am_bidrag.toLocaleString('da-DK')} = ${am_grundlag.toLocaleString('da-DK')} DKK`
  )

  // ── Step 3: Determine taxable base based on tax card type ───────────────
  const communeRate =
    overrideRate ??
    (municipality ? getMunicipalityRate(municipality) : rates.MUNICIPALITY_DEFAULT)

  const combinedTaxRate = rates.BOTTOM_TAX + communeRate

  let taxable_base: number
  let personfradrag_used: number

  switch (tax_card_type) {
    case 'A':
      // Hovedkort: apply monthly personfradrag
      personfradrag_used = rates.PERSONFRADRAG_MONTHLY
      taxable_base = Math.max(0, am_grundlag - personfradrag_used)
      breakdown.push(
        `Personfradrag (A-kort): ${personfradrag_used.toLocaleString('da-DK')} DKK/md`
      )
      break

    case 'B':
      // Bikort: no personfradrag
      personfradrag_used = 0
      taxable_base = am_grundlag
      breakdown.push(`Bikort: intet personfradrag — fuld AM-grundlag beskattes`)
      break

    case 'frikort': {
      // Frikort: monthly tax-free allowance = frikort_limit / 12
      const monthlyFree = frikort_limit_dkk
        ? roundDKK(frikort_limit_dkk / 12)
        : rates.PERSONFRADRAG_MONTHLY
      personfradrag_used = monthlyFree
      taxable_base = Math.max(0, am_grundlag - monthlyFree)
      breakdown.push(
        `Frikort: ${monthlyFree.toLocaleString('da-DK')} DKK/md skattefrit`
      )
      break
    }
  }

  // ── Step 4: A-skat ──────────────────────────────────────────────────────
  // Base income tax (bundskat + kommuneskat)
  let a_skat = roundDKK(taxable_base * combinedTaxRate)
  breakdown.push(
    `A-skat (bundskat ${(rates.BOTTOM_TAX * 100).toFixed(2)}% + kommune ${(communeRate * 100).toFixed(3)}%): ${taxable_base.toLocaleString('da-DK')} × ${(combinedTaxRate * 100).toFixed(3)}% = ${a_skat.toLocaleString('da-DK')} DKK`
  )

  // Topskat: if AM-grundlag exceeds monthly threshold
  if (am_grundlag > rates.TOP_TAX_THRESHOLD_MONTHLY) {
    const topTaxBase = am_grundlag - rates.TOP_TAX_THRESHOLD_MONTHLY
    const topTax = roundDKK(topTaxBase * rates.TOP_TAX_RATE)
    a_skat += topTax
    breakdown.push(
      `Topskat (15%): ${topTaxBase.toLocaleString('da-DK')} × 15% = ${topTax.toLocaleString('da-DK')} DKK`
    )
  }

  // ── Step 5: ATP ─────────────────────────────────────────────────────────
  const atp =
    employment_type === 'full_time' ? rates.ATP_FULL_TIME : rates.ATP_PART_TIME
  breakdown.push(
    `ATP (${employment_type === 'full_time' ? 'fuldtid' : 'deltid'}): ${atp} DKK/md`
  )

  // ── Step 6: Net ─────────────────────────────────────────────────────────
  const net_dkk = roundDKK(am_grundlag - a_skat - atp)
  const effective_rate = Number(((1 - net_dkk / gross_dkk) * 100).toFixed(1))

  breakdown.push(
    `Nettoløn: ${am_grundlag.toLocaleString('da-DK')} − ${a_skat.toLocaleString('da-DK')} − ${atp} = ${net_dkk.toLocaleString('da-DK')} DKK`
  )
  breakdown.push(`Effektiv skatteprocent: ${effective_rate}%`)

  return {
    gross_dkk: roundDKK(gross_dkk),
    am_bidrag,
    am_grundlag,
    a_skat,
    atp,
    net_dkk,
    breakdown,
    effective_rate,
  }
}

/**
 * Calculate commuting deduction (befordringsfradrag).
 * Formula: max(0, (km_daily × 2 - 24) × working_days × rate_per_km)
 * Zone split: ≤120 km one-way at standard rate, above at reduced rate.
 */
export function calculateCommutingDeduction(params: {
  km_daily: number
  working_days?: number
}): number {
  const { km_daily, working_days = 220 } = params
  const rates = RATES_2024

  if (km_daily <= 0) return 0

  const roundTrip = km_daily * 2
  const deductibleKm = Math.max(0, roundTrip - rates.COMMUTING_FREE_KM)

  if (deductibleKm <= 0) return 0

  // Zone calculation for one-way trips > 120 km
  let deduction: number

  if (km_daily <= rates.COMMUTING_ZONE_KM) {
    // All km at standard rate
    deduction = deductibleKm * working_days * rates.COMMUTING_RATE_STANDARD
  } else {
    // First zone: 0–24 km free, then standard rate up to (120×2 − 24) km
    const standardKmPerDay = rates.COMMUTING_ZONE_KM * 2 - rates.COMMUTING_FREE_KM
    const highKmPerDay = (km_daily - rates.COMMUTING_ZONE_KM) * 2
    deduction =
      standardKmPerDay * working_days * rates.COMMUTING_RATE_STANDARD +
      highKmPerDay * working_days * rates.COMMUTING_RATE_HIGH
  }

  return roundDKK(deduction)
}

/** Round to nearest DKK (no øre in payroll) */
function roundDKK(value: number): number {
  return Math.round(value)
}
