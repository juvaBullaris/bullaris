import { z } from 'zod'
import { router, protectedProcedure } from '../trpc'
import { db } from '@bullaris/db'
import { TRPCError } from '@trpc/server'

export const budgetRouter = router({
  /**
   * List all budget categories for the current employee.
   */
  list: protectedProcedure.query(async ({ ctx }) => {
    const categories = await db.budgetCategory.findMany({
      where: { employeeId: ctx.employee.id },
    })
    return categories.map((c) => ({
      id: c.id,
      label: c.label,
      limit_dkk: Number(c.limit_dkk),
      period: c.period,
    }))
  }),

  /**
   * Create a budget category.
   */
  create: protectedProcedure
    .input(
      z.object({
        label: z.string().min(1).max(80),
        limit_dkk: z.number().positive(),
        period: z.enum(['monthly', 'annual']),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const category = await db.budgetCategory.create({
        data: {
          employeeId: ctx.employee.id,
          label: input.label,
          limit_dkk: input.limit_dkk,
          period: input.period,
        },
      })
      return { success: true, data: { ...category, limit_dkk: Number(category.limit_dkk) } }
    }),

  /**
   * Update a budget category.
   */
  update: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        label: z.string().min(1).max(80).optional(),
        limit_dkk: z.number().positive().optional(),
        period: z.enum(['monthly', 'annual']).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const category = await db.budgetCategory.findUnique({
        where: { id: input.id },
        select: { employeeId: true },
      })
      if (!category || category.employeeId !== ctx.employee.id) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }
      const { id, ...data } = input
      const updated = await db.budgetCategory.update({ where: { id }, data })
      return { success: true, data: { ...updated, limit_dkk: Number(updated.limit_dkk) } }
    }),

  /**
   * Delete a budget category.
   */
  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const category = await db.budgetCategory.findUnique({
        where: { id: input.id },
        select: { employeeId: true },
      })
      if (!category || category.employeeId !== ctx.employee.id) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }
      await db.budgetCategory.delete({ where: { id: input.id } })
      return { success: true }
    }),
})
