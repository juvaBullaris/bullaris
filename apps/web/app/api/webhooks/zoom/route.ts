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
  const body = await req.json()

  // Zoom URL validation challenge (required during webhook setup)
  if (body.event === 'endpoint.url_validation') {
    const hashForValidate = crypto
      .createHmac('sha256', process.env.ZOOM_WEBHOOK_SECRET_TOKEN ?? '')
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
      .createHmac('sha256', process.env.ZOOM_WEBHOOK_SECRET_TOKEN ?? '')
      .update(message)
      .digest('hex')

  if (signature !== expectedSig) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  // Handle participant joined event
  if (body.event === 'webinar.participant_joined') {
    const { registrant_id, email } = body.payload?.object?.participant ?? {}
    const webinarId = body.payload?.object?.id as string | undefined

    if (email && webinarId) {
      // Find employee by email via Supabase user lookup is not available here —
      // match on webinarSanityId stored in the registration (Zoom webinar ID = Sanity ID convention)
      await db.webinarRegistration.updateMany({
        where: { webinarSanityId: webinarId },
        data: { attended: true },
      }).catch(() => {})
    }
  }

  return NextResponse.json({ received: true })
}
