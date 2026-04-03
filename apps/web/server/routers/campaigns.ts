import { z } from 'zod'
import { router, hrAdminProcedure } from '../trpc'
import { db } from '@bullaris/db'

export const campaignsRouter = router({
  /**
   * List all campaigns for the current employer, newest first.
   */
  list: hrAdminProcedure.query(async ({ ctx }) => {
    return db.customNudgeCampaign.findMany({
      where: { employerId: ctx.employerId },
      orderBy: { createdAt: 'desc' },
    })
  }),

  /**
   * Create a new scheduled nudge campaign.
   * scheduledAt must be in the future.
   */
  create: hrAdminProcedure
    .input(
      z.object({
        subject: z.string().min(1).max(200),
        body: z.string().min(1).max(500),
        scheduledAt: z.coerce.date(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (input.scheduledAt <= new Date()) {
        throw new Error('scheduledAt must be in the future')
      }
      return db.customNudgeCampaign.create({
        data: {
          employerId: ctx.employerId,
          subject: input.subject,
          body: input.body,
          scheduledAt: input.scheduledAt,
        },
      })
    }),

  /**
   * Cancel (delete) a campaign that has not yet been sent.
   */
  cancel: hrAdminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const campaign = await db.customNudgeCampaign.findFirst({
        where: { id: input.id, employerId: ctx.employerId },
      })
      if (!campaign) throw new Error('Campaign not found')
      if (campaign.sentAt !== null) throw new Error('Campaign already sent — cannot cancel')
      await db.customNudgeCampaign.delete({ where: { id: input.id } })
      return { success: true }
    }),
})
