import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { db } from '@bullaris/db'

export type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>

/**
 * Creates tRPC context for each request.
 * Injects authenticated user and derived tenant (employerId) from session.
 * NEVER trusts employerId from request body — always derived server-side.
 */
export async function createTRPCContext({ req }: { req: Request }) {
  const supabase = createRouteHandlerClient({ cookies })
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { user: null, employee: null, employerId: null }
  }

  const employee = await db.employee.findUnique({
    where: { supabaseUserId: user.id },
    select: {
      id: true,
      employerId: true,
      role: true,
    },
  })

  return {
    user,
    employee,
    employerId: employee?.employerId ?? null,
  }
}
