import { db } from '@bullaris/db'
import { NextResponse } from 'next/server'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'

/**
 * Zoom webhook handler.
 * Listens for webinar participant events and marks employees as attended.
 * https://developers.zoom.us/docs/api/rest/webhook-reference/
 */
export async function POST(req: Request) {
  const secret = process.env.ZOOM_WEBHOOK_SECRET_TOKEN
  if (!secret) {
    console.error('ZOOM_WEBHOOK_SECRET_TOKEN not configured')
    return new NextResponse('Webhook secret not configured', { status: 500 })
  }

  const body = await req.json()

  // Zoom URL validation challenge (required during webhook setup)
  if (body.event === 'endpoint.url_validation') {
    const hashForValidate = crypto
      .createHmac('sha256', secret)
      .update(body.payload.plainToken)
      .digest('hex')

    return NextResponse.json({
      plainToken: body.payload.plainToken,
      encryptedToken: hashForValidate,
    })
  }

  // Verify signature
  const signature = req.headers.get('x-zm-signature')
  const timestamp = req.headers.get('x-zm-request-timestamp')
  if (!signature || !timestamp) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const message = `v0:${timestamp}:${JSON.stringify(body)}`
  const expectedSig =
    'v0=' +
    crypto
      .createHmac('sha256', secret)
      .update(message)
      .digest('hex')

  if (signature !== expectedSig) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  // Handle participant joined event
  if (body.event === 'webinar.participant_joined') {
    const { email } = body.payload?.object?.participant ?? {}
    const webinarId = body.payload?.object?.id as string | undefined

    if (email && webinarId) {
      // Resolve email → auth.users → employees (Prisma connects with service role, auth schema accessible)
      const authUsers = await db.$queryRaw<Array<{ id: string }>>`
        SELECT id FROM auth.users WHERE email = ${email} LIMIT 1
      `.catch(() => [] as Array<{ id: string }>)

      if (authUsers.length > 0) {
        const employee = await db.employee.findUnique({
          where: { supabaseUserId: authUsers[0].id },
          select: { id: true },
        })
        if (employee) {
          await db.webinarRegistration.updateMany({
            where: { employeeId: employee.id, webinarSanityId: webinarId },
            data: { attended: true },
          }).catch(() => {})
        }
      }
    }
  }

  return NextResponse.json({ received: true })
}
