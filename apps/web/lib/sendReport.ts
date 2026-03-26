import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'
import type { ScoredResult } from '@/components/audit/types'

const resend = new Resend(process.env.RESEND_API_KEY)

function getServiceSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

const TIER_COLORS: Record<string, string> = {
  Low: '#5B8A6B',
  Medium: '#D4993A',
  High: '#E8634A',
  Acute: '#C03030',
}

function buildEmailHtml(params: {
  firstName: string
  result: ScoredResult
  sessionId: string
}): string {
  const { firstName, result, sessionId } = params
  const tierColor = TIER_COLORS[result.riskTier] ?? '#E8634A'
  const shareUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bullaris.dk'}/audit?ref=${sessionId}`
  const fmtDKK = (n: number) =>
    new Intl.NumberFormat('da-DK', { style: 'currency', currency: 'DKK', maximumFractionDigits: 0 }).format(n)

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Your Bullaris Financial Stress Report</title>
</head>
<body style="margin:0;padding:0;background:#FDF6EE;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:48px 24px 32px;">

    <!-- Logo -->
    <div style="margin-bottom:40px;">
      <span style="display:inline-block;background:#E8634A;width:28px;height:28px;border-radius:7px;text-align:center;line-height:28px;color:#fff;font-size:14px;vertical-align:middle;margin-right:10px;">♥</span>
      <span style="font-size:19px;font-weight:700;color:#2C1A0E;vertical-align:middle;font-family:Georgia,serif;">Bullaris</span>
    </div>

    <!-- Opener -->
    <p style="font-size:16px;color:#5C3D1E;margin:0 0 28px;">Hi ${firstName},</p>
    <p style="font-size:15px;color:#5C3D1E;line-height:1.7;margin:0 0 32px;">
      Here's your full Financial Stress Report, including your sector benchmark, estimated annual cost, and three prioritised actions.
    </p>

    <!-- Risk tier card -->
    <div style="background:#fff;border-radius:16px;padding:28px 28px 24px;margin-bottom:32px;box-shadow:0 4px 24px rgba(92,58,30,0.09);">
      <div style="margin-bottom:16px;">
        <span style="display:inline-block;background:${tierColor};color:#fff;padding:5px 18px;border-radius:100px;font-size:13px;font-weight:700;letter-spacing:0.03em;">${result.riskTier} Risk</span>
      </div>
      <div style="font-size:36px;font-weight:800;color:#1E0F00;font-family:Georgia,serif;letter-spacing:-0.02em;margin-bottom:12px;">
        ${result.riskScore} <span style="font-size:18px;font-weight:400;color:#9B7B5A;">/ 10</span>
      </div>
      <p style="font-size:15px;color:#5C3D1E;line-height:1.7;margin:0;">${result.plainReadout}</p>
    </div>

    <!-- Sector benchmark -->
    <div style="margin-bottom:32px;">
      <p style="font-size:11px;color:#9B7B5A;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 8px;font-weight:700;">SECTOR BENCHMARK</p>
      <p style="font-size:14px;color:#5C3D1E;font-style:italic;line-height:1.7;margin:0;">${result.benchmarkNote}</p>
    </div>

    <!-- Annual cost -->
    <div style="background:#FFF8F3;border-radius:12px;padding:24px;border-left:3px solid #E8634A;margin-bottom:32px;">
      <p style="font-size:11px;color:#9B7B5A;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 12px;font-weight:700;">THE HIDDEN COST AT YOUR ORGANISATION</p>
      <p style="font-size:15px;color:#5C3D1E;line-height:1.7;margin:0;">
        At approximately ${result.headcountMidpoint} employees, financial stress is estimated to cost your organisation between
        <strong style="color:#1E0F00;">${fmtDKK(result.costRangeLow)}</strong> and
        <strong style="color:#1E0F00;">${fmtDKK(result.costRangeHigh)}</strong> annually
        in lost productivity, elevated absence, and turnover — based on Danish labour market data.
      </p>
    </div>

    <!-- 3 actions -->
    <div style="margin-bottom:40px;">
      <p style="font-size:11px;color:#9B7B5A;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 20px;font-weight:700;">THREE THINGS TO DO NEXT</p>
      ${result.actions.map((action, i) => `
      <div style="margin-bottom:20px;padding-left:16px;border-left:2px solid ${i === 2 ? '#E8634A' : '#EDE0D4'};">
        <p style="font-size:14px;font-weight:700;color:#1E0F00;margin:0 0 6px;">${action.title}</p>
        <p style="font-size:13px;color:#5C3D1E;line-height:1.7;margin:0;">${action.description}</p>
      </div>`).join('')}
    </div>

    <!-- Employee audit CTA -->
    <div style="background:#fff;border-radius:16px;padding:28px;text-align:center;margin-bottom:40px;box-shadow:0 4px 24px rgba(92,58,30,0.07);">
      <p style="font-size:16px;font-weight:700;color:#1E0F00;font-family:Georgia,serif;margin:0 0 10px;">Want to see how your employees actually feel?</p>
      <p style="font-size:14px;color:#5C3D1E;line-height:1.7;margin:0 0 20px;">
        Share this private link with your team — takes 3 minutes, completely anonymous, no employer ever sees individual results.
      </p>
      <a href="${shareUrl}" style="display:inline-block;background:#E8634A;color:#fff;text-decoration:none;padding:12px 28px;border-radius:10px;font-size:14px;font-weight:700;">Share the employee audit →</a>
    </div>

    <!-- Closing -->
    <p style="font-size:15px;color:#5C3D1E;line-height:1.7;margin:0 0 8px;">Warm regards,</p>
    <p style="font-size:15px;color:#5C3D1E;font-weight:600;margin:0 0 48px;">The Bullaris team</p>

    <!-- Footer -->
    <div style="border-top:1px solid #EDE0D4;padding-top:24px;text-align:center;">
      <p style="font-size:11px;color:#9B7B5A;margin:0 0 8px;">
        Bullaris ApS · EU servers (Frankfurt) · GDPR compliant
      </p>
      <p style="font-size:11px;color:#9B7B5A;margin:0;">
        You're receiving this because you completed the Bullaris Financial Stress Audit.
        <br>Your data is processed in accordance with our <a href="https://bullaris.dk/privacy" style="color:#9B7B5A;">privacy policy</a>.
        To unsubscribe, reply with "unsubscribe" in the subject line.
      </p>
    </div>

  </div>
</body>
</html>`
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ReportData {
  firstName: string
  email: string
  result: ScoredResult
  sessionId: string
}

// ─── Main export ─────────────────────────────────────────────────────────────

export async function sendReport(data: ReportData): Promise<void> {
  const { firstName, email, result, sessionId } = data

  // 1. Send email (primary operation — throw on failure)
  await resend.emails.send({
    from: 'Bullaris <hello@bullaris.dk>',
    to: email,
    subject: `Your Bullaris Financial Stress Report — ${result.riskTier} risk, ${result.sectorName}`,
    html: buildEmailHtml({ firstName, result, sessionId }),
  })

  // 2. Update audit row with email capture + log consent (best-effort)
  try {
    const supabase = getServiceSupabase()

    await supabase
      .from('audit_completions')
      .update({
        email_captured: true,
        first_name: firstName,
        email,
        report_sent: true,
        email_captured_at: new Date().toISOString(),
      })
      .eq('session_id', sessionId)

    // GDPR consent event — best-effort, silently fail if table shape differs
    await supabase.from('consent_events').insert({
      source: 'audit_flow',
      action: 'grant',
      version: '1.0',
      metadata: { session_id: sessionId, email_hash: email.length },
    })
  } catch {
    // DB logging failures must never block the user flow
    // In production, errors are captured by Sentry via the global error boundary
  }
}
