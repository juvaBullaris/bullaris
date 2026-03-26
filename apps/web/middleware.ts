import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const EMPLOYEE_ROUTES = ['/dashboard', '/payslip', '/tax-planner', '/goals', '/chat', '/learning', '/onboarding']
const EMPLOYER_ROUTES = ['/portal', '/analytics', '/employees']

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = req.nextUrl.pathname

  const isEmployeeRoute = EMPLOYEE_ROUTES.some((r) => pathname.startsWith(r))
  const isEmployerRoute = EMPLOYER_ROUTES.some((r) => pathname.startsWith(r))

  if (!isEmployeeRoute && !isEmployerRoute) return res

  // Not logged in — send to login, preserve destination
  if (!user) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }

  const role = user.user_metadata?.role as string | undefined

  // Employer routes — hr_admin only
  if (isEmployerRoute && role !== 'hr_admin') {
    if (role === 'employee') return NextResponse.redirect(new URL('/dashboard', req.url))
    return NextResponse.redirect(new URL('/unauthorized', req.url))
  }

  // Employee routes — employee or hr_admin (hr_admin can preview)
  if (isEmployeeRoute && role !== 'employee' && role !== 'hr_admin') {
    return NextResponse.redirect(new URL('/unauthorized', req.url))
  }

  return res
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/payslip/:path*',
    '/tax-planner/:path*',
    '/goals/:path*',
    '/chat/:path*',
    '/learning/:path*',
    '/onboarding/:path*',
    '/portal/:path*',
    '/analytics/:path*',
    '/employees/:path*',
  ],
}
