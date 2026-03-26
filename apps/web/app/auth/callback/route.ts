import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { db } from '@bullaris/db'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(new URL('/login', requestUrl.origin))
  }

  const supabase = createRouteHandlerClient({ cookies })
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    return NextResponse.redirect(new URL('/login?error=auth', requestUrl.origin))
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(new URL('/login', requestUrl.origin))
  }

  // Look up employee record
  const employee = await db.employee.findUnique({
    where: { supabaseUserId: user.id },
    select: { id: true, role: true, onboardedAt: true, employerId: true },
  })

  // New invited user — create employee record from invite metadata
  if (!employee) {
    const role = user.user_metadata?.role as string | undefined
    const employerId = user.user_metadata?.employer_id as string | undefined

    if (employerId) {
      const newEmployee = await db.employee.create({
        data: {
          supabaseUserId: user.id,
          employerId,
          role: role ?? 'employee',
        },
      })
      // Send to onboarding to complete profile
      return NextResponse.redirect(
        new URL(`/onboarding?employee_id=${newEmployee.id}`, requestUrl.origin)
      )
    }

    // No employer context — this shouldn't happen in normal flow
    return NextResponse.redirect(new URL('/unauthorized', requestUrl.origin))
  }

  // Existing user — redirect based on role
  if (!employee.onboardedAt) {
    return NextResponse.redirect(
      new URL(`/onboarding?employee_id=${employee.id}`, requestUrl.origin)
    )
  }

  if (employee.role === 'hr_admin') {
    return NextResponse.redirect(new URL('/portal', requestUrl.origin))
  }

  return NextResponse.redirect(new URL('/dashboard', requestUrl.origin))
}
