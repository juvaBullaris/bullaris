import { router, hrAdminProcedure } from '../trpc'
import { db } from '@bullaris/db'

/** Minimum group size before returning aggregate data (privacy threshold) */
const PRIVACY_THRESHOLD = 5

type MaskedValue = number | '< 5 medarbejdere'

/** Returns value only if group size meets privacy threshold, otherwise masks it */
function privacyGuard<T>(value: T, groupSize: number): T | '< 5 medarbejdere' {
  return groupSize >= PRIVACY_THRESHOLD ? value : '< 5 medarbejdere'
}

export const analyticsRouter = router({
  /**
   * Aggregated overview for the HR portal.
   * NEVER returns individual employee rows.
   * All results are server-side aggregates with min group size 5.
   */
  overview: hrAdminProcedure.query(async ({ ctx }) => {
    const employerId = ctx.employerId

    // Total employee count
    const totalEmployees = await db.employee.count({
      where: { employerId },
    })

    // Active users in last 30 days (based on learning progress or nudge events)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const activeUserIds = await db.learningProgress.findMany({
      where: {
        completedAt: { gte: thirtyDaysAgo },
        employee: { employerId },
      },
      select: { employeeId: true },
      distinct: ['employeeId'],
    })
    const activeUsersLast30Days: MaskedValue = privacyGuard(activeUserIds.length, totalEmployees)

    // Onboarded employees
    const onboardedCount = await db.employee.count({
      where: { employerId, onboardedAt: { not: null } },
    })
    const avgOnboardingRate: MaskedValue = privacyGuard(
      totalEmployees > 0 ? Math.round((onboardedCount / totalEmployees) * 100) : 0,
      totalEmployees
    )

    // Total goals created (aggregate only)
    const totalGoalsCreated: MaskedValue = privacyGuard(
      await db.goal.count({ where: { employee: { employerId } } }),
      totalEmployees
    )

    // Learning completions
    const learningCompletions: MaskedValue = privacyGuard(
      await db.learningProgress.count({ where: { employee: { employerId } } }),
      totalEmployees
    )

    // Goal type distribution — only if enough employees
    let goalTypeDistribution: Array<{ type: string; count: number; pct: number }> | null = null
    if (totalEmployees >= PRIVACY_THRESHOLD) {
      const rawGoals = await db.goal.groupBy({
        by: ['type'],
        where: { employee: { employerId } },
        _count: { _all: true },
        orderBy: { _count: { type: 'desc' } },
      })

      const total = rawGoals.reduce((s, g) => s + g._count._all, 0)
      if (total > 0) {
        goalTypeDistribution = rawGoals.map((g) => ({
          type: g.type,
          count: g._count._all,
          pct: Math.round((g._count._all / total) * 100),
        }))
      }
    }

    // Module adoption (% of employees who granted consent per module)
    let moduleAdoption: Record<string, number> | null = null
    if (totalEmployees >= PRIVACY_THRESHOLD) {
      const modules = ['payslip_module', 'tax_planner', 'ai_chat', 'spending_tracker'] as const

      const adoptionEntries = await Promise.all(
        modules.map(async (mod) => {
          const count = await db.consentEvent.findMany({
            where: {
              source: mod,
              action: 'grant',
              employee: { employerId },
            },
            select: { employeeId: true },
            distinct: ['employeeId'],
          })
          const pct = Math.round((count.length / totalEmployees) * 100)
          return [mod, pct] as const
        })
      )

      moduleAdoption = Object.fromEntries(adoptionEntries)
    }

    return {
      totalEmployees,
      activeUsersLast30Days,
      avgOnboardingRate,
      totalGoalsCreated,
      learningCompletions,
      goalTypeDistribution,
      moduleAdoption,
    }
  }),
})
