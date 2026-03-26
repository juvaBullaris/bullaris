import { z } from 'zod'
import { router, protectedProcedure } from '../trpc'
import { calculateNet, getCommutingDeduction } from '@bullaris/danish-tax'
import { db } from '@bullaris/db'
import { RATES_2024 } from '@bullaris/danish-tax'

export const payslipRouter = router({
  /**
   * Calculate net pay from gross.
   * Tax calculations always run server-side — never client-side.
   * Stores gross_dkk and tax_card_type in DB — never net (recalculated on render).
   */
  calculate: protectedProcedure
    .input(
      z.object({
        gross_dkk: z.number().positive(),
        tax_card_type: z.enum(['A', 'B', 'frikort']).optional(),
        municipality_rate: z.number().optional(),
        year: z.number().int().optional(),
        frikort_limit_dkk: z.number().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      // Get profile for municipality and tax card defaults
      const profile = await db.profile.findUnique({
        where: { id: ctx.employee.id },
        select: { municipality: true, tax_card_type: true, frikort_limit_dkk: true },
      })

      const result = calculateNet({
        gross_dkk: input.gross_dkk,
        tax_card_type: (input.tax_card_type ?? profile?.tax_card_type ?? 'A') as 'A' | 'B' | 'frikort',
        municipality_rate: input.municipality_rate,
        year: input.year,
        frikort_limit_dkk: input.frikort_limit_dkk ?? (profile?.frikort_limit_dkk != null ? Number(profile.frikort_limit_dkk) : undefined),
      })

      return { success: true, data: result }
    }),

  /**
   * Save payslip input for the current period.
   * Stores only gross_dkk, tax_card_type, and period — never net.
   * Requires payslip_module consent (checked via consent_events).
   */
  savePayslipInput: protectedProcedure
    .input(
      z.object({
        gross_dkk: z.number().positive(),
        tax_card_type: z.enum(['A', 'B', 'frikort']),
        period: z.string().regex(/^\d{4}-\d{2}$/), // YYYY-MM
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify consent exists for payslip_module
      const consent = await db.consentEvent.findFirst({
        where: {
          employeeId: ctx.employee.id,
          source: 'payslip_module',
          action: 'grant',
        },
        orderBy: { createdAt: 'desc' },
      })

      if (!consent) {
        return {
          success: false,
          error: {
            code: 'CONSENT_REQUIRED',
            message: 'Payslip module consent required before saving data.',
          },
        }
      }

      const entry = await db.payslipInput.upsert({
        where: {
          employeeId_period: {
            employeeId: ctx.employee.id,
            period: input.period,
          },
        },
        create: {
          employeeId: ctx.employee.id,
          gross_dkk: input.gross_dkk,
          taxCardType: input.tax_card_type,
          period: input.period,
        },
        update: {
          gross_dkk: input.gross_dkk,
          taxCardType: input.tax_card_type,
        },
      })

      return { success: true, data: entry }
    }),

  /**
   * Get commuting and other deductions.
   */
  getDeductions: protectedProcedure
    .input(
      z.object({
        km_daily: z.number().min(0),
        working_days: z.number().int().min(0).max(366).default(220),
        union_contrib_dkk: z.number().min(0).default(0),
        akasse_dkk: z.number().min(0).default(0),
        craftsman_labour_dkk: z.number().min(0).default(0),
      })
    )
    .query(async ({ input }) => {
      const deductions: Array<{ label: string; amount_dkk: number; note?: string }> = []

      // Commuting deduction (befordringsfradrag)
      const commuting = getCommutingDeduction({
        km_daily: input.km_daily,
        working_days: input.working_days,
      })
      if (commuting > 0) {
        deductions.push({
          label: 'Befordringsfradrag',
          amount_dkk: commuting,
          note: `${input.km_daily} km/dag × ${input.working_days} dage`,
        })
      }

      // Union deduction (fagforeningskontingent)
      const unionDeduction = Math.min(
        input.union_contrib_dkk,
        RATES_2024.UNION_DEDUCTION_MAX
      )
      if (unionDeduction > 0) {
        deductions.push({
          label: 'Fagforeningskontingent',
          amount_dkk: unionDeduction,
          note: unionDeduction < input.union_contrib_dkk
            ? `Maks ${RATES_2024.UNION_DEDUCTION_MAX.toLocaleString('da-DK')} DKK/år`
            : undefined,
        })
      }

      // A-kasse (fully deductible)
      if (input.akasse_dkk > 0) {
        deductions.push({
          label: 'A-kasse',
          amount_dkk: input.akasse_dkk,
        })
      }

      // Craftsman deduction (håndværkerfradrag)
      if (input.craftsman_labour_dkk > 0) {
        const craftsmanDeduction = Math.min(
          input.craftsman_labour_dkk * RATES_2024.CRAFTSMAN_DEDUCTION_RATE,
          RATES_2024.CRAFTSMAN_DEDUCTION_MAX
        )
        deductions.push({
          label: 'Håndværkerfradrag',
          amount_dkk: craftsmanDeduction,
          note: `25% af arbejdsomkostninger, maks ${RATES_2024.CRAFTSMAN_DEDUCTION_MAX.toLocaleString('da-DK')} DKK`,
        })
      }

      return deductions
    }),

  /**
   * List historical payslip inputs for the current employee.
   */
  listHistory: protectedProcedure.query(async ({ ctx }) => {
    const inputs = await db.payslipInput.findMany({
      where: { employeeId: ctx.employee.id },
      orderBy: { period: 'desc' },
      take: 24, // 2 years
    })

    // Recalculate net for each entry — never stored
    const profile = await db.profile.findUnique({
      where: { id: ctx.employee.id },
      select: { municipality: true },
    })

    return inputs.map((input) => {
      const grossNum = Number(input.gross_dkk)
      const result = calculateNet({
        gross_dkk: grossNum,
        tax_card_type: input.taxCardType as 'A' | 'B' | 'frikort',
      })
      return {
        period: input.period,
        gross_dkk: grossNum,
        net_dkk: result.net_dkk,
        am_bidrag: result.am_bidrag,
        a_skat: result.a_skat,
      }
    })
  }),
})
