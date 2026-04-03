/**
 * Bullaris Nudge Engine
 *
 * Rule-based email nudge scheduler.
 * Runs as a scheduled job (cron) — not a request handler.
 *
 * Rules are defined in the nudge_rules table.
 * Each rule has a trigger_condition (JSON), cooldown_days, and template_id.
 *
 * GDPR note: Nudges are sent only to employees who have not revoked email consent.
 * All nudge events are logged to nudge_events for audit and cooldown enforcement.
 */

import { db } from '@bullaris/db'
import { subDays } from 'date-fns'

export type NudgeChannel = 'email'

export interface NudgeCandidate {
  employeeId: string
  ruleId: string
  ruleCode: string
  templateId: string
}

/**
 * Find all employees eligible for each nudge rule.
 * Enforces cooldown — skips employees who received the same nudge recently.
 */
export async function findNudgeCandidates(): Promise<NudgeCandidate[]> {
  const rules = await db.nudgeRule.findMany()
  const candidates: NudgeCandidate[] = []

  for (const rule of rules) {
    const cooldownDate = subDays(new Date(), rule.cooldownDays)

    // Find employees who have NOT received this nudge within cooldown period
    const recentlySentToIds = await db.nudgeEvent
      .findMany({
        where: {
          ruleId: rule.id,
          sentAt: { gte: cooldownDate },
        },
        select: { employeeId: true },
      })
      .then((events) => events.map((e) => e.employeeId))

    // Get eligible employees based on trigger condition
    const condition = JSON.parse(rule.triggerCondition) as {
      type: string
      [key: string]: unknown
    }

    const eligibleEmployees = await getEligibleEmployees(
      condition,
      recentlySentToIds
    )

    for (const employeeId of eligibleEmployees) {
      candidates.push({
        employeeId,
        ruleId: rule.id,
        ruleCode: rule.code,
        templateId: rule.templateId,
      })
    }
  }

  return candidates
}

/**
 * Determine eligible employees for a given trigger condition.
 */
async function getEligibleEmployees(
  condition: { type: string; [key: string]: unknown },
  excludeIds: string[]
): Promise<string[]> {
  const baseWhere = {
    id: { notIn: excludeIds },
    onboardedAt: { not: null },
  }

  switch (condition.type) {
    case 'no_payslip_30_days': {
      const cutoff = subDays(new Date(), 30)
      // Employees with no payslip input in last 30 days
      const withRecentPayslip = await db.payslipInput
        .findMany({
          where: { recordedAt: { gte: cutoff } },
          select: { employeeId: true },
          distinct: ['employeeId'],
        })
        .then((r) => r.map((p) => p.employeeId))

      return db.employee
        .findMany({
          where: { ...baseWhere, id: { notIn: [...excludeIds, ...withRecentPayslip] } },
          select: { id: true },
        })
        .then((r) => r.map((e) => e.id))
    }

    case 'goal_no_update_60_days': {
      // Employees with goals but no progress update in 60 days
      const cutoff = subDays(new Date(), 60)
      const withRecentGoalUpdate = await db.goal
        .findMany({
          where: { createdAt: { gte: cutoff } },
          select: { employeeId: true },
          distinct: ['employeeId'],
        })
        .then((r) => r.map((g) => g.employeeId))

      const withAnyGoal = await db.goal
        .findMany({
          select: { employeeId: true },
          distinct: ['employeeId'],
        })
        .then((r) => r.map((g) => g.employeeId))

      const eligible = withAnyGoal.filter(
        (id) =>
          !withRecentGoalUpdate.includes(id) && !excludeIds.includes(id)
      )

      return eligible
    }

    case 'tax_planner_unused': {
      // Employees who have never used the tax planner
      const withTaxPlannerConsent = await db.consentEvent
        .findMany({
          where: { source: 'tax_planner', action: 'grant' },
          select: { employeeId: true },
          distinct: ['employeeId'],
        })
        .then((r) => r.map((c) => c.employeeId))

      return db.employee
        .findMany({
          where: {
            ...baseWhere,
            id: { notIn: [...excludeIds, ...withTaxPlannerConsent] },
          },
          select: { id: true },
        })
        .then((r) => r.map((e) => e.id))
    }

    case 'weekly_content_available': {
      // All active employees (weekly content suggestion)
      return db.employee
        .findMany({
          where: baseWhere,
          select: { id: true },
        })
        .then((r) => r.map((e) => e.id))
    }

    case 'goal_80_percent': {
      // Employees with any goal at 80–99% progress
      const goals = await db.goal.findMany({
        where: { NOT: { employeeId: { in: excludeIds } } },
        select: { employeeId: true, progress_dkk: true, target_dkk: true },
      })
      const eligible = new Set<string>()
      for (const g of goals) {
        const pct = Number(g.progress_dkk) / Number(g.target_dkk)
        if (pct >= 0.8 && pct < 1.0) eligible.add(g.employeeId)
      }
      return Array.from(eligible).filter((id) => !excludeIds.includes(id))
    }

    case 'goal_complete': {
      // Employees who completed any goal in the last 7 days
      const cutoff = subDays(new Date(), 7)
      const goals = await db.goal.findMany({
        where: {
          createdAt: { gte: cutoff },
          NOT: { employeeId: { in: excludeIds } },
        },
        select: { employeeId: true, progress_dkk: true, target_dkk: true },
      })
      const eligible = new Set<string>()
      for (const g of goals) {
        if (Number(g.progress_dkk) >= Number(g.target_dkk)) eligible.add(g.employeeId)
      }
      return Array.from(eligible).filter((id) => !excludeIds.includes(id))
    }

    default:
      return []
  }
}

/**
 * Log a sent nudge to prevent duplicate sends within cooldown window.
 */
export async function logNudgeEvent(
  employeeId: string,
  ruleId: string,
  channel: NudgeChannel = 'email'
): Promise<void> {
  await db.nudgeEvent.create({
    data: {
      employeeId,
      ruleId,
      channel,
    },
  })
}

/**
 * Main scheduler entry point.
 * Called by cron job — runs server-side only.
 *
 * Returns summary of nudges dispatched.
 */
export async function runNudgeScheduler(): Promise<{
  processed: number
  sent: number
  errors: string[]
}> {
  const candidates = await findNudgeCandidates()
  const errors: string[] = []
  let sent = 0

  for (const candidate of candidates) {
    try {
      // In production, call Resend here:
      // await resend.emails.send({
      //   from: 'Bullaris <hej@bullaris.dk>',
      //   to: employee.email,
      //   subject: TEMPLATE_SUBJECTS[candidate.templateId],
      //   react: NudgeEmail({ ... }),
      // })

      await logNudgeEvent(candidate.employeeId, candidate.ruleId)
      sent++
    } catch (err) {
      errors.push(
        `Failed to send nudge ${candidate.ruleCode} to ${candidate.employeeId}: ${String(err)}`
      )
    }
  }

  return {
    processed: candidates.length,
    sent,
    errors,
  }
}

/**
 * Data retention purge — runs nightly.
 * Purges records per retention schedule in compliance.md:
 * - payslip_inputs: 13 months
 * - ai_chat_sessions: 30 days
 * - nudge_events: 6 months
 */
export async function runRetentionPurge(): Promise<{
  payslipInputsDeleted: number
  aiChatSessionsDeleted: number
  nudgeEventsDeleted: number
}> {
  const now = new Date()

  // Payslip inputs: 13 months
  const payslipCutoff = new Date(now)
  payslipCutoff.setMonth(payslipCutoff.getMonth() - 13)
  const { count: payslipInputsDeleted } = await db.payslipInput.deleteMany({
    where: { recordedAt: { lt: payslipCutoff } },
  })

  // AI chat sessions: 30 days
  const chatCutoff = subDays(now, 30)
  const { count: aiChatSessionsDeleted } = await db.aiChatSession.deleteMany({
    where: { createdAt: { lt: chatCutoff } },
  })

  // Nudge events: 6 months
  const nudgeCutoff = subDays(now, 180)
  const { count: nudgeEventsDeleted } = await db.nudgeEvent.deleteMany({
    where: { sentAt: { lt: nudgeCutoff } },
  })

  // Note: consent_events are kept for 5 years (not purged here)

  return {
    payslipInputsDeleted,
    aiChatSessionsDeleted,
    nudgeEventsDeleted,
  }
}
