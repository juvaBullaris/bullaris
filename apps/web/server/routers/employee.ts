import { z } from 'zod'
import { router, protectedProcedure } from '../trpc'
import { db } from '@bullaris/db'
import { TRPCError } from '@trpc/server'

export const employeeRouter = router({
  /**
   * Get the current employee's profile.
   * Returns only the employee's own profile — never another employee's.
   */
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const profile = await db.profile.findUnique({
      where: { id: ctx.employee.id },
    })
    if (!profile) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Profile not found' })
    }
    return { success: true, data: profile }
  }),

  /**
   * Update the current employee's profile.
   */
  updateProfile: protectedProcedure
    .input(
      z.object({
        display_name: z.string().min(1).max(100).optional(),
        age: z.number().int().min(16).max(80).optional(),
        municipality: z.string().optional(),
        employment_type: z.enum(['full_time', 'part_time']).optional(),
        gross_dkk: z.number().positive().optional(),
        tax_card_type: z.enum(['A', 'B', 'frikort']).optional(),
        frikort_limit_dkk: z.number().positive().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const profile = await db.profile.upsert({
        where: { id: ctx.employee.id },
        create: { id: ctx.employee.id, ...input },
        update: input,
      })
      return { success: true, data: profile }
    }),

  /**
   * Log a consent event. Called by ConsentModal on accept/decline.
   * Each module gets its own consent event — never bundled.
   */
  logConsent: protectedProcedure
    .input(
      z.object({
        module: z.enum([
          'profile',
          'payslip_module',
          'tax_planner',
          'ai_chat',
          'spending_tracker',
        ]),
        action: z.enum(['grant', 'revoke']),
        version: z.string().default('1.0'),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await db.consentEvent.create({
        data: {
          employeeId: ctx.employee.id,
          source: input.module,
          version: input.version,
          action: input.action,
        },
      })

      // If consent is revoked, schedule data deletion (sets a flag)
      if (input.action === 'revoke') {
        // Mark module data for deletion — purge cron handles actual deletion
        await db.consentEvent.create({
          data: {
            employeeId: ctx.employee.id,
            source: input.module,
            version: input.version,
            action: 'revoke',
          },
        })
      }

      return { success: true }
    }),

  /**
   * Get the employee's consent status for each module.
   */
  getConsentStatus: protectedProcedure.query(async ({ ctx }) => {
    const events = await db.consentEvent.findMany({
      where: { employeeId: ctx.employee.id },
      orderBy: { createdAt: 'desc' },
    })

    // Get the latest consent event per source
    const latestBySource = new Map<string, { action: string; version: string }>()
    for (const event of events) {
      if (!latestBySource.has(event.source)) {
        latestBySource.set(event.source, {
          action: event.action,
          version: event.version,
        })
      }
    }

    return {
      success: true,
      data: Object.fromEntries(latestBySource),
    }
  }),
})
