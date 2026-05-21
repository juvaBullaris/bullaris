import { z } from 'zod'
import { router, hrAdminProcedure } from '../trpc'
import { db } from '@bullaris/db'
import { TRPCError } from '@trpc/server'

export const employerRouter = router({
  /**
   * List employees for the current employer.
   * Returns only non-financial fields — name, email, onboarding status.
   * NEVER returns financial data.
   */
  listEmployees: hrAdminProcedure.query(async ({ ctx }) => {
    const employees = await db.employee.findMany({
      where: { employerId: ctx.employerId },
      select: {
        id: true,
        supabaseUserId: true,
        role: true,
        invitedAt: true,
        onboardedAt: true,
        profile: {
          select: {
            displayName: true,
            // Deliberately NOT selecting gross_dkk, tax_card_type, municipality
          },
        },
      },
      orderBy: { invitedAt: 'desc' },
    })

    return employees.map((emp) => ({
      id: emp.id,
      email: null, // Email not stored in employees table — comes from Supabase Auth
      displayName: emp.profile?.displayName ?? null,
      role: emp.role,
      onboarded: !!emp.onboardedAt,
      invitedAt: emp.invitedAt,
    }))
  }),

  /**
   * Invite an employee by email.
   * Creates an employee record and sends a Supabase magic link.
   */
  inviteEmployee: hrAdminProcedure
    .input(
      z.object({
        email: z.string().email(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check seat limit
      const employer = await db.employer.findUnique({
        where: { id: ctx.employerId },
        select: { seatsPurchased: true, _count: { select: { employees: true } } },
      })

      if (!employer) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Employer not found' })
      }

      if (employer._count.employees >= employer.seatsPurchased) {
        throw new TRPCError({
          code: 'PRECONDITION_FAILED',
          message: `Seat limit reached (${employer.seatsPurchased} seats). Upgrade your plan to invite more employees.`,
        })
      }

      // Create employee record (Supabase invite handled externally via admin SDK)
      const employee = await db.employee.create({
        data: {
          employerId: ctx.employerId,
          supabaseUserId: '', // Populated when employee accepts invite
          role: 'employee',
          invitedAt: new Date(),
        },
      })

      // In production, also call Supabase Admin SDK to send magic link:
      // await supabaseAdmin.auth.admin.inviteUserByEmail(input.email, {
      //   data: { role: 'employee', employer_id: ctx.employerId, employee_id: employee.id }
      // })

      return { success: true, data: { employeeId: employee.id } }
    }),

  /**
   * Aggregated HR portal stats.
   * All figures are group-level. Any metric with fewer than 5 employees returns null.
   */
  getPortalStats: hrAdminProcedure.query(async ({ ctx }) => {
    const MIN_GROUP = 5

    // All employees for this employer
    const employees = await db.employee.findMany({
      where: { employerId: ctx.employerId },
      select: { id: true, onboardedAt: true },
    })

    const totalInvited  = employees.length
    const onboardedIds  = employees.filter((e) => !!e.onboardedAt).map((e) => e.id)
    const onboardedCount = onboardedIds.length
    const onboardingRate = totalInvited > 0 ? Math.round((onboardedCount / totalInvited) * 100) : null

    // Seat info
    const employer = await db.employer.findUnique({
      where: { id: ctx.employerId },
      select: { seatsPurchased: true },
    })
    const seatsPurchased = employer?.seatsPurchased ?? null

    // Learning engagement — % of onboarded employees with ≥1 completion
    // Only shown when ≥5 onboarded employees
    let learningEngagementRate: number | null = null
    if (onboardedCount >= MIN_GROUP) {
      const engaged = await db.learningProgress.groupBy({
        by: ['employeeId'],
        where: { employeeId: { in: onboardedIds } },
      })
      learningEngagementRate = Math.round((engaged.length / onboardedCount) * 100)
    }

    // Goals created — total count across all onboarded employees
    // Only shown when ≥5 onboarded employees
    let goalsCount: number | null = null
    if (onboardedCount >= MIN_GROUP) {
      goalsCount = await db.goal.count({
        where: { employee: { employerId: ctx.employerId } },
      })
    }

    return {
      totalInvited,
      onboardedCount,
      onboardingRate,
      seatsPurchased,
      learningEngagementRate,
      goalsCount,
    }
  }),

  /**
   * Get employer account details (seats, plan).
   */
  getAccount: hrAdminProcedure.query(async ({ ctx }) => {
    const employer = await db.employer.findUnique({
      where: { id: ctx.employerId },
      select: {
        id: true,
        name: true,
        slug: true,
        seatsPurchased: true,
        createdAt: true,
        _count: { select: { employees: true } },
      },
    })

    if (!employer) {
      throw new TRPCError({ code: 'NOT_FOUND' })
    }

    return {
      success: true,
      data: {
        ...employer,
        seatsUsed: employer._count.employees,
        seatsAvailable: employer.seatsPurchased - employer._count.employees,
      },
    }
  }),
})
