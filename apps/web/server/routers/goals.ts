import { z } from 'zod'
import { router, protectedProcedure } from '../trpc'
import { db } from '@bullaris/db'
import { TRPCError } from '@trpc/server'

export const goalsRouter = router({
  /**
   * List all goals for the current employee.
   */
  list: protectedProcedure.query(async ({ ctx }) => {
    const goals = await db.goal.findMany({
      where: { employeeId: ctx.employee.id },
      orderBy: { createdAt: 'desc' },
    })
    return goals
  }),

  /**
   * Create a new financial goal.
   */
  create: protectedProcedure
    .input(
      z.object({
        type: z.string().min(1),
        target_dkk: z.number().positive(),
        deadline: z.date().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const goal = await db.goal.create({
        data: {
          employeeId: ctx.employee.id,
          type: input.type,
          target_dkk: input.target_dkk,
          deadline: input.deadline ?? null,
          progress_dkk: 0,
        },
      })
      return { success: true, data: goal }
    }),

  /**
   * Update progress on an existing goal.
   */
  updateProgress: protectedProcedure
    .input(
      z.object({
        goal_id: z.string().uuid(),
        progress_dkk: z.number().min(0),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify the goal belongs to the current employee
      const goal = await db.goal.findUnique({
        where: { id: input.goal_id },
        select: { employeeId: true },
      })

      if (!goal || goal.employeeId !== ctx.employee.id) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Goal not found' })
      }

      const updated = await db.goal.update({
        where: { id: input.goal_id },
        data: { progress_dkk: input.progress_dkk },
      })

      return { success: true, data: updated }
    }),

  /**
   * Delete a goal.
   */
  delete: protectedProcedure
    .input(z.object({ goal_id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const goal = await db.goal.findUnique({
        where: { id: input.goal_id },
        select: { employeeId: true },
      })

      if (!goal || goal.employeeId !== ctx.employee.id) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Goal not found' })
      }

      await db.goal.delete({ where: { id: input.goal_id } })
      return { success: true }
    }),
})
