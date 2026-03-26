import Anthropic from '@anthropic-ai/sdk'
import type { AuditAnswers, ScoredResult } from '@/components/audit/types'
import { localFallbackScore } from '@/lib/localScore'

const client = new Anthropic()

const SYSTEM_PROMPT = `You are a financial wellbeing analyst specialising in Danish SMEs. You score HR audit responses honestly and practically. Always respond with valid JSON only. No preamble, no markdown, no explanation.`

function buildUserPrompt(answers: AuditAnswers): string {
  return `Score this HR financial wellbeing audit for a Danish company. Return JSON with exactly these fields:

{
  "riskTier": "Low" | "Medium" | "High" | "Acute",
  "riskScore": number (1-10, one decimal),
  "stressEstimate": string (e.g. "58–72%"),
  "primaryMetricAffected": string (their Q5 metric in plain language, e.g. "employee retention"),
  "benchmarkNote": string (1 sentence comparing them to similar Danish companies in their sector),
  "plainReadout": string (2 sentences, warm and direct, what this score means in practice for their team),
  "oneAction": string (1 specific action they can take this week, no Bullaris required, 2–3 sentences),
  "costRangeLow": number (DKK, annual cost of financial stress at low estimate for their headcount),
  "costRangeHigh": number (DKK, annual cost at high estimate),
  "sectorName": string (human-readable sector name),
  "headcountMidpoint": number (midpoint of their selected size range, e.g. 125 for 50-199),
  "actions": [
    { "title": string, "description": string },
    { "title": string, "description": string },
    { "title": "Introduce Bullaris to your team", "description": string (framed as a natural next step, not a sales push) }
  ]
}

Answers:
- Company size: ${answers.size}
- Sector: ${answers.sector}
- Current financial benefits: ${answers.benefits}
- Frequency of financial stress signals: ${answers.stressFrequency}/4
- Primary HR metric focus: ${answers.priority}

Base cost estimates on Danish salary averages and productivity loss research. Be honest — do not inflate scores to create urgency. A company with genuine low risk should receive a Low tier.`
}

export async function scoreAudit(answers: AuditAnswers): Promise<ScoredResult> {
  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: buildUserPrompt(answers) }],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''
    const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()
    const parsed = JSON.parse(cleaned) as ScoredResult

    if (!parsed.riskTier || typeof parsed.riskScore !== 'number') {
      return localFallbackScore(answers)
    }

    if (!Array.isArray(parsed.actions) || parsed.actions.length < 3) {
      parsed.actions = localFallbackScore(answers).actions
    }

    return parsed
  } catch {
    return localFallbackScore(answers)
  }
}
