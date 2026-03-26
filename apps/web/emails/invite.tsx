interface InviteEmailProps {
  inviteUrl: string
  employerName: string
  invitedByName?: string
}

export function inviteEmailHtml({ inviteUrl, employerName, invitedByName }: InviteEmailProps): string {
  const sender = invitedByName ? `${invitedByName} fra ${employerName}` : employerName

  return `<!DOCTYPE html>
<html lang="da">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Invitation til Bullaris</title></head>
<body style="margin:0;padding:0;background:#f5f0e8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:12px;padding:40px;">
        <tr><td>
          <h1 style="font-size:24px;font-weight:700;color:#1A56DB;margin:0 0 24px;">Velkommen til Bullaris</h1>
          <p style="font-size:15px;line-height:1.6;color:#374151;margin:0 0 16px;">
            ${sender} har inviteret dig til at bruge Bullaris — en platform der hjælper dig med at forstå din løn, skat og personlige økonomi.
          </p>
          <table cellpadding="0" cellspacing="0" style="margin:24px 0;">
            <tr><td>
              <a href="${inviteUrl}" style="background:#1A56DB;border-radius:8px;color:#ffffff;font-size:15px;font-weight:600;padding:12px 24px;text-decoration:none;display:inline-block;">
                Accepter invitation
              </a>
            </td></tr>
          </table>
          <p style="font-size:15px;line-height:1.6;color:#374151;margin:0 0 16px;">
            Linket er gyldigt i 7 dage. Dine finansielle data tilhører altid dig og er aldrig synlige for din arbejdsgiver.
          </p>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;" />
          <p style="font-size:12px;color:#9ca3af;line-height:1.6;margin:0;">
            Bullaris ApS · Gammel Mønt 4 · 1117 København K<br/>
            Dette er en automatisk besked. Svar venligst ikke på denne email.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}
