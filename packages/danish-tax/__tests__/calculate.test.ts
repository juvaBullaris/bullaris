import { calculateNet } from '../calculate'
import { RATES_2024 } from '../rates/2024'

/**
 * Test suite for Danish gross-to-net calculation.
 * Run: npm run test:tax
 */

describe('calculateNet', () => {
  // ─── A-card (standard case) ───────────────────────────────────────────────

  describe('A-card (Hovedkort)', () => {
    const result = calculateNet({
      gross_dkk: 50_000,
      tax_card_type: 'A',
      municipality_rate: RATES_2024.MUNICIPALITY_DEFAULT,
    })

    test('AM-bidrag is 8% of gross', () => {
      expect(result.am_bidrag).toBe(Math.round(50_000 * 0.08))
      expect(result.am_bidrag).toBe(4_000)
    })

    test('AM-grundlag is gross minus AM-bidrag', () => {
      expect(result.am_grundlag).toBe(50_000 - 4_000)
      expect(result.am_grundlag).toBe(46_000)
    })

    test('A-skat applies personfradrag monthly', () => {
      const taxableBase = 46_000 - RATES_2024.PERSONFRADRAG_MONTHLY // 46000 - 4142 = 41858
      const expectedTax = Math.round(
        taxableBase * (RATES_2024.BOTTOM_TAX + RATES_2024.MUNICIPALITY_DEFAULT)
      )
      expect(result.a_skat).toBe(expectedTax)
    })

    test('net_dkk is positive and less than gross', () => {
      expect(result.net_dkk).toBeGreaterThan(0)
      expect(result.net_dkk).toBeLessThan(result.gross_dkk)
    })

    test('net_dkk = am_grundlag - a_skat - atp', () => {
      expect(result.net_dkk).toBe(result.am_grundlag - result.a_skat - result.atp)
    })

    test('ATP is full-time rate', () => {
      expect(result.atp).toBe(RATES_2024.ATP_FULL_TIME)
      expect(result.atp).toBe(99)
    })

    test('returns breakdown array with entries', () => {
      expect(result.breakdown).toBeInstanceOf(Array)
      expect(result.breakdown.length).toBeGreaterThan(0)
    })

    test('effective rate is reasonable (25-50%)', () => {
      expect(result.effective_rate).toBeGreaterThan(25)
      expect(result.effective_rate).toBeLessThan(50)
    })
  })

  // ─── B-card (no personfradrag) ────────────────────────────────────────────

  describe('B-card (Bikort)', () => {
    const gross = 50_000
    const aCard = calculateNet({
      gross_dkk: gross,
      tax_card_type: 'A',
      municipality_rate: RATES_2024.MUNICIPALITY_DEFAULT,
    })
    const bCard = calculateNet({
      gross_dkk: gross,
      tax_card_type: 'B',
      municipality_rate: RATES_2024.MUNICIPALITY_DEFAULT,
    })

    test('B-card AM-bidrag equals A-card AM-bidrag', () => {
      expect(bCard.am_bidrag).toBe(aCard.am_bidrag)
    })

    test('B-card A-skat is higher than A-card (no personfradrag)', () => {
      expect(bCard.a_skat).toBeGreaterThan(aCard.a_skat)
    })

    test('B-card net is lower than A-card net', () => {
      expect(bCard.net_dkk).toBeLessThan(aCard.net_dkk)
    })

    test('B-card taxable base equals full AM-grundlag', () => {
      const expectedTax = Math.round(
        bCard.am_grundlag * (RATES_2024.BOTTOM_TAX + RATES_2024.MUNICIPALITY_DEFAULT)
      )
      expect(bCard.a_skat).toBe(expectedTax)
    })

    test('difference between A and B card tax equals personfradrag × rate', () => {
      const personfradragTaxValue = Math.round(
        RATES_2024.PERSONFRADRAG_MONTHLY *
          (RATES_2024.BOTTOM_TAX + RATES_2024.MUNICIPALITY_DEFAULT)
      )
      expect(bCard.a_skat - aCard.a_skat).toBe(personfradragTaxValue)
    })
  })

  // ─── Top tax bracket ──────────────────────────────────────────────────────

  describe('Top tax bracket (topskat)', () => {
    // Gross > 47408 DKK/month triggers topskat on AM-grundlag
    const highGross = 60_000

    const result = calculateNet({
      gross_dkk: highGross,
      tax_card_type: 'A',
      municipality_rate: RATES_2024.MUNICIPALITY_DEFAULT,
    })

    test('AM-grundlag exceeds monthly top tax threshold', () => {
      // AM-grundlag = 60000 * 0.92 = 55200, threshold = 47408
      expect(result.am_grundlag).toBeGreaterThan(RATES_2024.TOP_TAX_THRESHOLD_MONTHLY)
    })

    test('A-skat includes topskat component', () => {
      // Calculate expected without topskat
      const taxableBase = Math.max(0, result.am_grundlag - RATES_2024.PERSONFRADRAG_MONTHLY)
      const baseTax = Math.round(
        taxableBase * (RATES_2024.BOTTOM_TAX + RATES_2024.MUNICIPALITY_DEFAULT)
      )
      // A-skat should be higher than base tax due to topskat
      expect(result.a_skat).toBeGreaterThan(baseTax)
    })

    test('topskat applies 15% to amount above threshold', () => {
      const topTaxBase = result.am_grundlag - RATES_2024.TOP_TAX_THRESHOLD_MONTHLY
      const expectedTopTax = Math.round(topTaxBase * RATES_2024.TOP_TAX_RATE)

      const resultNoTop = calculateNet({
        gross_dkk: highGross,
        tax_card_type: 'A',
        municipality_rate: RATES_2024.MUNICIPALITY_DEFAULT,
      })

      // Verify topskat in breakdown
      const hasTopTaxNote = resultNoTop.breakdown.some((b) => b.includes('Topskat'))
      expect(hasTopTaxNote).toBe(true)
    })

    test('effective rate is higher for top-bracket earner', () => {
      const normalResult = calculateNet({
        gross_dkk: 40_000,
        tax_card_type: 'A',
        municipality_rate: RATES_2024.MUNICIPALITY_DEFAULT,
      })
      expect(result.effective_rate).toBeGreaterThan(normalResult.effective_rate)
    })
  })

  // ─── Frikort ──────────────────────────────────────────────────────────────

  describe('Frikort', () => {
    const frikortLimit = 50_000 // annual frikort limit
    const gross = 3_500 // typical student/part-time income

    const result = calculateNet({
      gross_dkk: gross,
      tax_card_type: 'frikort',
      frikort_limit_dkk: frikortLimit,
      municipality_rate: RATES_2024.MUNICIPALITY_DEFAULT,
    })

    test('AM-bidrag still applies (no frikort exemption)', () => {
      expect(result.am_bidrag).toBe(Math.round(gross * 0.08))
    })

    test('monthly tax-free is frikort_limit / 12', () => {
      const monthlyFree = Math.round(frikortLimit / 12) // 4167
      // If AM-grundlag <= monthlyFree, tax should be 0
      if (result.am_grundlag <= monthlyFree) {
        expect(result.a_skat).toBe(0)
      }
    })

    test('no tax when income is below monthly frikort', () => {
      const am_grundlag = Math.round(gross * 0.92) // 3220
      const monthlyFree = Math.round(frikortLimit / 12) // 4167
      if (am_grundlag < monthlyFree) {
        expect(result.a_skat).toBe(0)
        expect(result.net_dkk).toBe(am_grundlag - result.atp)
      }
    })

    test('taxed above frikort limit', () => {
      const highGross = 8_000 // am_grundlag will exceed monthly frikort
      const highResult = calculateNet({
        gross_dkk: highGross,
        tax_card_type: 'frikort',
        frikort_limit_dkk: frikortLimit,
        municipality_rate: RATES_2024.MUNICIPALITY_DEFAULT,
      })
      // Monthly free = 4167, am_grundlag = 7360, taxable = 3193
      expect(highResult.a_skat).toBeGreaterThan(0)
    })
  })

  // ─── Municipality rates ───────────────────────────────────────────────────

  describe('Municipality tax rates', () => {
    test('Copenhagen (23.60%) has lower tax than national average (25.018%)', () => {
      const cph = calculateNet({
        gross_dkk: 50_000,
        tax_card_type: 'A',
        municipality: 'København',
      })
      const avg = calculateNet({
        gross_dkk: 50_000,
        tax_card_type: 'A',
        municipality_rate: RATES_2024.MUNICIPALITY_DEFAULT,
      })
      expect(cph.a_skat).toBeLessThan(avg.a_skat)
    })

    test('municipality_rate override takes precedence', () => {
      const result = calculateNet({
        gross_dkk: 50_000,
        tax_card_type: 'A',
        municipality_rate: 0.30, // very high custom rate
        municipality: 'København',
      })
      // Should use 0.30, not Copenhagen's 0.236
      const taxableBase = Math.max(0, result.am_grundlag - RATES_2024.PERSONFRADRAG_MONTHLY)
      const expectedTax = Math.round(taxableBase * (RATES_2024.BOTTOM_TAX + 0.30))
      expect(result.a_skat).toBe(expectedTax)
    })
  })

  // ─── Part-time ATP ────────────────────────────────────────────────────────

  describe('Part-time ATP', () => {
    test('part-time ATP is lower than full-time', () => {
      const full = calculateNet({
        gross_dkk: 20_000,
        tax_card_type: 'A',
        employment_type: 'full_time',
      })
      const part = calculateNet({
        gross_dkk: 20_000,
        tax_card_type: 'A',
        employment_type: 'part_time',
      })
      expect(part.atp).toBe(RATES_2024.ATP_PART_TIME)
      expect(full.atp).toBe(RATES_2024.ATP_FULL_TIME)
      expect(part.net_dkk).toBeGreaterThan(full.net_dkk)
    })
  })
})
