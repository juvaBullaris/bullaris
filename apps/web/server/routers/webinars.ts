import { z } from 'zod'
import { router, protectedProcedure } from '../trpc'
import { db } from '@bullaris/db'
import { TRPCError } from '@trpc/server'
import { Resend } from 'resend'

function getResend() {
  return new Resend(process.env.RESEND_API_KEY)
}

// Webinar content is managed in Sanity — these types reflect the Sanity document shape.
export type SanityWebinar = {
  _id: string
  title: string
  description: string
  scheduledAt: string // ISO date string
  durationMinutes: number
  zoomJoinUrl: string
  recordingUrl?: string
  topics: string[]
}

export const webinarsRouter = router({
  /**
   * Get registrations for the current employee.
   */
  myRegistrations: protectedProcedure.query(async ({ ctx }) => {
    const registrations = await db.webinarRegistration.findMany({
      where: { employeeId: ctx.employee.id },
      orderBy: { registeredAt: 'desc' },
    })
    return registrations
  }),

  /**
   * Register for a webinar.
   * Sends a calendar invite email via Resend.
   * webinarSanityId is the Sanity document _id.
   */
  register: protectedProcedure
    .input(
      z.object({
        webinarSanityId: z.string().min(1),
        webinarTitle: z.string().min(1),
        webinarDate: z.string(), // ISO date
        zoomJoinUrl: z.string().url(),
        userEmail: z.string().email(),
        userFirstName: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Idempotent — ignore if already registered
      const existing = await db.webinarRegistration.findUnique({
        where: {
          employeeId_webinarSanityId: {
            employeeId: ctx.employee.id,
            webinarSanityId: input.webinarSanityId,
          },
        },
      })

      if (existing) {
        return { success: true, data: existing, alreadyRegistered: true }
      }

      const registration = await db.webinarRegistration.create({
        data: {
          employeeId: ctx.employee.id,
          webinarSanityId: input.webinarSanityId,
        },
      })

      // Send confirmation email
      const formattedDate = new Date(input.webinarDate).toLocaleDateString('da-DK', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })

      await getResend().emails.send({
        from: 'Bullaris <hello@bullaris.dk>',
        to: input.userEmail,
        subject: `Du er tilmeldt: ${input.webinarTitle}`,
        html: `
          <div style="font-family: DM Sans, system-ui, sans-serif; max-width: 560px; margin: 0 auto; color: #1E0F00;">
            <div style="background: #1A56DB; padding: 24px 32px;">
              <span style="color: white; font-size: 20px; font-weight: 700;">Bullaris</span>
            </div>
            <div style="padding: 32px;">
              <p style="margin: 0 0 8px;">Hej${input.userFirstName ? ` ${input.userFirstName}` : ''},</p>
              <p style="margin: 0 0 24px;">Du er nu tilmeldt webinaret <strong>${input.webinarTitle}</strong>.</p>
              <div style="background: #F5F0E8; border-radius: 12px; padding: 20px 24px; margin-bottom: 24px;">
                <p style="margin: 0 0 8px; font-size: 14px; color: #6B6059;">Dato og tid</p>
                <p style="margin: 0 0 16px; font-weight: 600;">${formattedDate}</p>
                <a href="${input.zoomJoinUrl}" style="display: inline-block; background: #1A56DB; color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
                  Tilslut via Zoom
                </a>
              </div>
              <p style="font-size: 13px; color: #6B6059; margin: 0;">
                Linket er personligt og må ikke deles. Log ind på <a href="https://bullaris.dk/learning" style="color: #1A56DB;">bullaris.dk</a> for at se alle kommende webinarer.
              </p>
            </div>
          </div>
        `,
      }).catch(() => {
        // Email failure should not block registration
      })

      return { success: true, data: registration, alreadyRegistered: false }
    }),

  /**
   * Zoom webhook handler — mark employee as attended.
   * Called by /api/webhooks/zoom, not directly by clients.
   */
  markAttended: protectedProcedure
    .input(
      z.object({
        employeeId: z.string().uuid(),
        webinarSanityId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      await db.webinarRegistration.updateMany({
        where: {
          employeeId: input.employeeId,
          webinarSanityId: input.webinarSanityId,
        },
        data: { attended: true },
      })
      return { success: true }
    }),

  /**
   * Cancel a webinar registration.
   */
  cancel: protectedProcedure
    .input(z.object({ webinarSanityId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const registration = await db.webinarRegistration.findUnique({
        where: {
          employeeId_webinarSanityId: {
            employeeId: ctx.employee.id,
            webinarSanityId: input.webinarSanityId,
          },
        },
      })

      if (!registration) throw new TRPCError({ code: 'NOT_FOUND' })

      await db.webinarRegistration.delete({ where: { id: registration.id } })
      return { success: true }
    }),
})
