/**
 * @bullaris/danish-tax — Public API
 *
 * SERVER-SIDE ONLY. Never import in client components.
 * All functions that touch tax calculations must run server-side via tRPC.
 */

export { calculateNet } from './calculate'
export type { CalculateNetParams, CalculateNetResult } from './calculate'

export { getMunicipalityRate, MUNICIPALITY_RATES_2024 } from './municipalities'
export type { MunicipalityRate } from './municipalities'

export { RATES_2024 } from './rates/2024'
export type { Rates } from './rates/2024'

import { calculateCommutingDeduction } from './calculate'
import { RATES_2024 } from './rates/2024'

export interface DeductionResult {
  label: string
  amount_dkk: number
  note?: string
}

/**
 * Calculate commuting deduction (befordringsfradrag).
 * Public alias for the internal calculate function.
 */
export function getCommutingDeduction(params: {
  km_daily: number
  working_days?: number
}): number {
  return calculateCommutingDeduction(params)
}

/**
 * Get all standard deductions for a given employee situation.
 */
export function getDeductions(params: {
  km_daily?: number
  working_days?: number
  union_contrib_dkk?: number
  akasse_dkk?: number
  craftsman_labour_dkk?: number
}): DeductionResult[] {
  const {
    km_daily = 0,
    working_days = 220,
    union_contrib_dkk = 0,
    akasse_dkk = 0,
    craftsman_labour_dkk = 0,
  } = params

  const deductions: DeductionResult[] = []

  // Befordringsfradrag
  if (km_daily > 0) {
    const amount = calculateCommutingDeduction({ km_daily, working_days })
    if (amount > 0) {
      deductions.push({
        label: 'Befordringsfradrag',
        amount_dkk: amount,
        note: `${km_daily} km/dag × ${working_days} dage`,
      })
    }
  }

  // Fagforeningskontingent
  if (union_contrib_dkk > 0) {
    const capped = Math.min(union_contrib_dkk, RATES_2024.UNION_DEDUCTION_MAX)
    deductions.push({
      label: 'Fagforeningskontingent',
      amount_dkk: capped,
      note:
        capped < union_contrib_dkk
          ? `Maks ${RATES_2024.UNION_DEDUCTION_MAX.toLocaleString('da-DK')} DKK/år`
          : undefined,
    })
  }

  // A-kasse
  if (akasse_dkk > 0) {
    deductions.push({
      label: 'A-kasse',
      amount_dkk: akasse_dkk,
    })
  }

  // Håndværkerfradrag
  if (craftsman_labour_dkk > 0) {
    const amount = Math.min(
      craftsman_labour_dkk * RATES_2024.CRAFTSMAN_DEDUCTION_RATE,
      RATES_2024.CRAFTSMAN_DEDUCTION_MAX
    )
    deductions.push({
      label: 'Håndværkerfradrag',
      amount_dkk: amount,
      note: `25% af arbejdsomkostninger, maks ${RATES_2024.CRAFTSMAN_DEDUCTION_MAX.toLocaleString('da-DK')} DKK`,
    })
  }

  return deductions
}
