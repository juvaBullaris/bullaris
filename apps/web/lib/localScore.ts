/**
 * Client-safe deterministic scoring fallback.
 * No server-only imports. Used in HRAuditFlow.tsx if the server action fails at
 * the network level, and in scoreAudit.ts if the Claude API call fails.
 */
import type { AuditAnswers, ScoredResult } from '@/components/audit/types'

const SECTOR_NAMES: Record<string, string> = {
  retail: 'retail & e-commerce',
  tech: 'tech & software',
  construction: 'construction & trades',
  healthcare: 'healthcare & social',
  other: 'your sector',
}

const PRIORITY_LABELS: Record<string, string> = {
  retention: 'employee retention',
  enps: 'eNPS and engagement',
  absenteeism: 'absenteeism reduction',
  benefits: 'benefits competitiveness',
}

const HEADCOUNT_MIDPOINTS: Record<string, number> = {
  '10-49': 30,
  '50-199': 125,
  '200-499': 350,
  '500+': 750,
}

export function localFallbackScore(answers: AuditAnswers): ScoredResult {
  const freq = answers.stressFrequency ?? 2
  const benefits = answers.benefits ?? 'unsure'

  let rawScore = freq * 2.1
  if (benefits === 'yes') rawScore -= 1.5
  else if (benefits === 'partial') rawScore -= 0.5
  else if (benefits === 'no') rawScore += 1.2
  else rawScore += 0.6

  const riskScore = Math.round(Math.max(1, Math.min(10, rawScore)) * 10) / 10

  let riskTier: ScoredResult['riskTier']
  if (riskScore <= 3) riskTier = 'Low'
  else if (riskScore <= 5.5) riskTier = 'Medium'
  else if (riskScore <= 7.5) riskTier = 'High'
  else riskTier = 'Acute'

  const headcountMidpoint = HEADCOUNT_MIDPOINTS[answers.size ?? '50-199'] ?? 125
  const sectorName = SECTOR_NAMES[answers.sector ?? 'other'] ?? 'your sector'
  const primaryMetricAffected = PRIORITY_LABELS[answers.priority ?? 'retention'] ?? 'employee retention'

  const stressedFraction = 0.35 + freq * 0.09
  const costPerEmployee = 500_000 * 0.07 * (freq / 4)
  const base = headcountMidpoint * costPerEmployee * stressedFraction
  const costRangeLow = Math.round((base * 0.8) / 10_000) * 10_000
  const costRangeHigh = Math.round((base * 1.4) / 10_000) * 10_000

  const stressPct = Math.round((0.40 + freq * 0.08) * 100)
  const stressEstimate = `${stressPct - 8}–${stressPct + 8}%`
  const noSupport = benefits === 'no' || benefits === 'unsure'

  return {
    riskTier,
    riskScore,
    stressEstimate,
    primaryMetricAffected,
    sectorName,
    headcountMidpoint,
    costRangeLow,
    costRangeHigh,
    benchmarkNote: `Companies in ${sectorName} with ${freq >= 3 ? 'frequent' : 'occasional'} financial stress signals typically see ${freq >= 3 ? 'above-average' : 'moderate'} impact on ${primaryMetricAffected} compared to their Danish sector peers.`,
    plainReadout: `Your responses indicate ${riskTier.toLowerCase()} financial stress exposure across your organisation. ${noSupport ? 'With no structured financial wellbeing support currently in place, there is a clear opportunity to reduce the hidden productivity and retention cost.' : 'Strengthening the support you already offer could have a measurable impact on your key HR metrics.'}`,
    oneAction: `This week, invite 5–10 employees to a 15-minute informal conversation about their financial confidence — framed as listening, not problem-solving. The patterns that emerge will help you build an evidence-based case for improving ${primaryMetricAffected} next quarter.`,
    actions: [
      {
        title: 'Run an anonymous financial confidence pulse survey',
        description: `Send a simple 3-question anonymous survey to measure how financial stress is affecting your team's ${primaryMetricAffected}. Even basic data significantly strengthens your internal business case.`,
      },
      {
        title: 'Audit your current benefits for financial wellbeing gaps',
        description: `Review what financial support you currently offer — pension transparency, pay gap communications, access to financial advice. Compare against what Danish employers in ${sectorName} typically provide. There are often quick wins.`,
      },
      {
        title: 'Introduce Bullaris to your team',
        description: `A structured financial wellness platform addresses the root cause systematically. Bullaris is built for Danish SMEs, takes one afternoon to set up, and gives employees a private space to understand their finances — without any individual data being visible to HR.`,
      },
    ],
  }
}
