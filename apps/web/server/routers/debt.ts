import { z } from 'zod'
import { router, protectedProcedure } from '../trpc'
import { db } from '@bullaris/db'
import { TRPCError } from '@trpc/server'

export const debtRouter = router({
  /**
   * List all debts for the current employee.
   */
  list: protectedProcedure.query(async ({ ctx }) => {
    const debts = await db.debt.findMany({
      where: { employeeId: ctx.employee.id },
    })
    return debts.map((d) => ({
      id: d.id,
      label: d.label,
      balance_dkk: Number(d.balance_dkk),
      interestRate: Number(d.interestRate),
      strategy: d.strategy,
    }))
  }),

  /**
   * Create a debt entry.
   * Label is user-defined (e.g. "Boliglån") — never store bank/institution names.
   */
  create: protectedProcedure
    .input(
      z.object({
        label: z.string().min(1).max(80),
        balance_dkk: z.number().positive(),
        interestRate: z.number().min(0).max(1),
        strategy: z.enum(['avalanche', 'snowball']).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const debt = await db.debt.create({
        data: {
          employeeId: ctx.employee.id,
          label: input.label,
          balance_dkk: input.balance_dkk,
          interestRate: input.interestRate,
          strategy: input.strategy ?? null,
        },
      })
      return { success: true, data: { ...debt, balance_dkk: Number(debt.balance_dkk), interestRate: Number(debt.interestRate) } }
    }),

  /**
   * Update balance and/or strategy.
   */
  update: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        balance_dkk: z.number().positive().optional(),
        interestRate: z.number().min(0).max(1).optional(),
        strategy: z.enum(['avalanche', 'snowball']).nullable().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const debt = await db.debt.findUnique({
        where: { id: input.id },
        select: { employeeId: true },
      })
      if (!debt || debt.employeeId !== ctx.employee.id) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }
      const { id, ...data } = input
      const updated = await db.debt.update({ where: { id }, data })
      return { success: true, data: { ...updated, balance_dkk: Number(updated.balance_dkk), interestRate: Number(updated.interestRate) } }
    }),

  /**
   * Delete a debt entry.
   */
  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const debt = await db.debt.findUnique({
        where: { id: input.id },
        select: { employeeId: true },
      })
      if (!debt || debt.employeeId !== ctx.employee.id) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }
      await db.debt.delete({ where: { id: input.id } })
      return { success: true }
    }),
})
