import { z } from 'zod'
import { router, protectedProcedure, hrAdminProcedure } from '../trpc'
import { db } from '@bullaris/db'

const PRIVACY_THRESHOLD = 5

export const pulseRouter = router({
  /**
   * Get the current employee's response for the current YYYY-MM period.
   * Returns null if no response has been submitted this month.
   */
  myCurrentPeriod: protectedProcedure.query(async ({ ctx }) => {
    const period = new Date().toISOString().slice(0, 7) // YYYY-MM
    const response = await db.pulseSurveyResponse.findUnique({
      where: {
        employeeId_period: {
          employeeId: ctx.employee.id,
          period,
        },
      },
    })
    return response ?? null
  }),

  /**
   * Submit (or update) the current employee's pulse score for this month.
   */
  submit: protectedProcedure
    .input(z.object({ score: z.number().int().min(1).max(5) }))
    .mutation(async ({ ctx, input }) => {
      const period = new Date().toISOString().slice(0, 7)
      const response = await db.pulseSurveyResponse.upsert({
        where: {
          employeeId_period: {
            employeeId: ctx.employee.id,
            period,
          },
        },
        create: {
          employeeId: ctx.employee.id,
          score: input.score,
          period,
        },
        update: {
          score: input.score,
        },
      })
      return { success: true, data: response }
    }),

  /**
   * Aggregate pulse scores for the employer's organisation.
   * Only returns data if ≥5 responses exist per period (privacy threshold).
   * HR-admin only.
   */
  aggregateForEmployer: hrAdminProcedure.query(async ({ ctx }) => {
    // Get all employee IDs for this employer
    const employeeIds = await db.employee
      .findMany({
        where: { employerId: ctx.employerId },
        select: { id: true },
      })
      .then((rows) => rows.map((r) => r.id))

    // Get all responses from employees of this employer
    const responses = await db.pulseSurveyResponse.findMany({
      where: { employeeId: { in: employeeIds } },
      orderBy: { period: 'asc' },
    })

    // Group by period
    const byPeriod = new Map<string, number[]>()
    for (const r of responses) {
      const arr = byPeriod.get(r.period) ?? []
      arr.push(r.score)
      byPeriod.set(r.period, arr)
    }

    // Apply privacy threshold
    return Array.from(byPeriod.entries())
      .filter(([, scores]) => scores.length >= PRIVACY_THRESHOLD)
      .map(([period, scores]) => ({
        period,
        avgScore: scores.reduce((s, n) => s + n, 0) / scores.length,
        count: scores.length,
      }))
  }),
})
