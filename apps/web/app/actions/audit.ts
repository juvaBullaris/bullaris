'use server'

import { createClient } from '@supabase/supabase-js'
import { scoreAudit } from '@/lib/scoreAudit'
import { sendReport, type ReportData } from '@/lib/sendReport'
import type { AuditAnswers, ScoredResult } from '@/components/audit/types'

function getServiceSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// ─── Score ────────────────────────────────────────────────────────────────────

export async function scoreAuditAction(answers: AuditAnswers): Promise<ScoredResult> {
  return scoreAudit(answers)
}

// ─── Log completion (called after Q5, before result) ─────────────────────────

export async function logAuditCompletionAction(params: {
  sessionId: string
  answers: AuditAnswers
  result: ScoredResult
}): Promise<void> {
  try {
    const supabase = getServiceSupabase()
    await supabase.from('audit_completions').upsert(
      {
        session_id: params.sessionId,
        size: params.answers.size,
        sector: params.answers.sector,
        benefits: params.answers.benefits,
        stress_frequency: params.answers.stressFrequency,
        priority: params.answers.priority,
        risk_tier: params.result.riskTier,
        risk_score: params.result.riskScore,
        email_captured: false,
        report_sent: false,
        created_at: new Date().toISOString(),
      },
      { onConflict: 'session_id' }
    )
  } catch {
    // Never block user flow on logging failure
  }
}

// ─── Update path chosen ───────────────────────────────────────────────────────

export async function logPathChosenAction(params: {
  sessionId: string
  path: 'employee-audit' | 'meeting'
}): Promise<void> {
  try {
    const supabase = getServiceSupabase()
    await supabase
      .from('audit_completions')
      .update({ path_chosen: params.path })
      .eq('session_id', params.sessionId)
  } catch {
    // Best-effort
  }
}

// ─── Send report ──────────────────────────────────────────────────────────────

export async function sendReportAction(data: ReportData): Promise<void> {
  await sendReport(data)
}
