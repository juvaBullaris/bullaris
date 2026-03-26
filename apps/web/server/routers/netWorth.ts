import { z } from 'zod'
import { router, protectedProcedure } from '../trpc'
import { db } from '@bullaris/db'
import { TRPCError } from '@trpc/server'

export const netWorthRouter = router({
  /**
   * List net worth entries for the current employee (newest first, max 24 months).
   */
  list: protectedProcedure.query(async ({ ctx }) => {
    const entries = await db.netWorthEntry.findMany({
      where: { employeeId: ctx.employee.id },
      orderBy: { recordedAt: 'desc' },
      take: 24,
    })
    return entries.map((e) => ({
      id: e.id,
      assets_dkk: Number(e.assets_dkk),
      liabilities_dkk: Number(e.liabilities_dkk),
      net_dkk: Number(e.assets_dkk) - Number(e.liabilities_dkk),
      recordedAt: e.recordedAt,
    }))
  }),

  /**
   * Add a net worth snapshot.
   * Stores totals only — never account numbers or institution names.
   */
  add: protectedProcedure
    .input(
      z.object({
        assets_dkk: z.number().min(0),
        liabilities_dkk: z.number().min(0),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const entry = await db.netWorthEntry.create({
        data: {
          employeeId: ctx.employee.id,
          assets_dkk: input.assets_dkk,
          liabilities_dkk: input.liabilities_dkk,
        },
      })
      return {
        success: true,
        data: {
          ...entry,
          assets_dkk: Number(entry.assets_dkk),
          liabilities_dkk: Number(entry.liabilities_dkk),
          net_dkk: Number(entry.assets_dkk) - Number(entry.liabilities_dkk),
        },
      }
    }),

  /**
   * Delete a net worth entry.
   */
  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const entry = await db.netWorthEntry.findUnique({
        where: { id: input.id },
        select: { employeeId: true },
      })
      if (!entry || entry.employeeId !== ctx.employee.id) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }
      await db.netWorthEntry.delete({ where: { id: input.id } })
      return { success: true }
    }),
})
