/**
 * Danish tax constants for fiscal year 2024.
 * Source: Skatteministeriet / SKAT 2024
 * Update annually — create a new rates/[year].ts file for each year.
 */
export const RATES_2024 = {
  /** AM-bidrag (arbejdsmarkedsbidrag) — always 8%, no threshold */
  AM_BIDRAG: 0.08,

  /** Personfradrag (personal allowance) — annual */
  PERSONFRADRAG_ANNUAL: 49_700,

  /** Personfradrag — monthly (49700 / 12, rounded) */
  PERSONFRADRAG_MONTHLY: 4_142,

  /** Bundskat (bottom tax) rate — applied to AM-grundlag above personfradrag */
  BOTTOM_TAX: 0.1201,

  /** Default municipality tax rate (landsgennemsnit) */
  MUNICIPALITY_DEFAULT: 0.25018,

  /** Top tax threshold — annual AM-grundlag above this triggers topskat */
  TOP_TAX_THRESHOLD: 568_900,

  /** Monthly equivalent of top tax threshold */
  TOP_TAX_THRESHOLD_MONTHLY: 47_408,

  /** Topskat rate — applied to AM-grundlag above threshold */
  TOP_TAX_RATE: 0.15,

  /** ATP employee contribution — full-time (monthly) */
  ATP_FULL_TIME: 99,

  /** ATP employee contribution — part-time (monthly) */
  ATP_PART_TIME: 66,

  /** Max deductible union fees (fagforeningskontingent) per year */
  UNION_DEDUCTION_MAX: 7_000,

  /** Craftsman deduction rate (håndværkerfradrag — labour costs only) */
  CRAFTSMAN_DEDUCTION_RATE: 0.25,

  /** Max craftsman deduction per year */
  CRAFTSMAN_DEDUCTION_MAX: 12_900,

  /** Commuting deduction free km (both ways) — first 24 km not deductible */
  COMMUTING_FREE_KM: 24,

  /** Commuting rate per km (zone 1: up to 120 km one-way) */
  COMMUTING_RATE_STANDARD: 2.19,

  /** Commuting rate per km (zone 2: above 120 km one-way) */
  COMMUTING_RATE_HIGH: 1.10,

  /** Commuting zone threshold (one-way km) */
  COMMUTING_ZONE_KM: 120,
} as const

export type Rates = typeof RATES_2024
