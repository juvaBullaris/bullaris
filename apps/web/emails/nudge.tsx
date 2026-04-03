type NudgeType = 'payslip_reminder' | 'goal_progress' | 'learning_suggestion' | 'tax_deduction_tip' | 'goal_milestone' | 'goal_complete'

interface NudgeEmailProps {
  employeeName: string
  nudgeType: NudgeType
  ctaUrl: string
  customMessage?: string
}

const NUDGE_CONTENT: Record<NudgeType, { subject: string; heading: string; body: string; cta: string }> = {
  payslip_reminder: {
    subject: 'Har du set din nye lønseddel?',
    heading: 'Din lønseddel er klar',
    body: 'Der er kommet ny løndata. Få et fuldt overblik over dit AM-bidrag, A-skat og hvad du får udbetalt.',
    cta: 'Se lønseddel',
  },
  goal_progress: {
    subject: 'Godt gået med dine finansielle mål!',
    heading: 'Du nærmer dig dit mål',
    body: 'Du har gjort fremskridt mod dine finansielle mål. Tjek din status og opdater dine tal.',
    cta: 'Se mine mål',
  },
  learning_suggestion: {
    subject: 'Ny artikel: Forstå din pensionsopsparing',
    heading: 'Vi har noget til dig',
    body: 'En ny guide om pension er klar i læringsbiblioteket. Det tager kun 5 minutter.',
    cta: 'Læs artiklen',
  },
  tax_deduction_tip: {
    subject: 'Du kan muligvis spare på din skat',
    heading: 'Har du husket dine fradrag?',
    body: 'Mange glemmer at registrere befordringsfradrag og fagforeningskontingent. Tjek om du går glip af fradrag.',
    cta: 'Beregn mine fradrag',
  },
  goal_milestone: {
    subject: 'Du er næsten i mål — 80% nået! 🚀',
    heading: 'Du er tæt på!',
    body: 'Et af dine finansielle mål er nu over 80 %. Du er i den bedste position til at gennemføre det helt. Giv det det sidste skub.',
    cta: 'Se dine mål',
  },
  goal_complete: {
    subject: 'Tillykke — du nåede dit mål! 🎉',
    heading: 'Mål nået!',
    body: 'Du har nået et af dine finansielle mål. Det er et rigtig stort skridt. Hvad er det næste mål du vil sætte?',
    cta: 'Sæt næste mål',
  },
}

export function nudgeEmailSubject(nudgeType: NudgeType): string {
  return NUDGE_CONTENT[nudgeType].subject
}

export function nudgeEmailHtml({ employeeName, nudgeType, ctaUrl, customMessage }: NudgeEmailProps): string {
  const content = NUDGE_CONTENT[nudgeType]
  const body = customMessage ?? content.body

  return `<!DOCTYPE html>
<html lang="da">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${content.subject}</title></head>
<body style="margin:0;padding:0;background:#f5f0e8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:12px;padding:40px;">
        <tr><td>
          <p style="font-size:14px;font-weight:700;color:#1A56DB;margin:0 0 24px;text-transform:uppercase;letter-spacing:0.1em;">Bullaris</p>
          <h1 style="font-size:22px;font-weight:700;color:#111827;margin:0 0 16px;">${content.heading}</h1>
          <p style="font-size:15px;line-height:1.6;color:#374151;margin:0 0 12px;">Hej ${employeeName},</p>
          <p style="font-size:15px;line-height:1.6;color:#374151;margin:0 0 12px;">${body}</p>
          <table cellpadding="0" cellspacing="0" style="margin:24px 0;">
            <tr><td>
              <a href="${ctaUrl}" style="background:#1A56DB;border-radius:8px;color:#ffffff;font-size:14px;font-weight:600;padding:11px 22px;text-decoration:none;display:inline-block;">
                ${content.cta}
              </a>
            </td></tr>
          </table>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;" />
          <p style="font-size:12px;color:#9ca3af;line-height:1.6;margin:0;">
            Du modtager denne besked fordi du bruger Bullaris.
            <a href="${ctaUrl}/settings/notifications" style="color:#1A56DB;">Afmeld notifikationer</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}
