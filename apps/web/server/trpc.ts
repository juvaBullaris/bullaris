import { initTRPC, TRPCError } from '@trpc/server'
import { type TRPCContext } from '@/lib/trpc-context'

const t = initTRPC.context<TRPCContext>().create()

export const router = t.router
export const publicProcedure = t.procedure

/**
 * Protected procedure — requires authenticated session.
 */
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user || !ctx.employee) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
  return next({
    ctx: {
      user: ctx.user,
      employee: ctx.employee,
      employerId: ctx.employerId!,
    },
  })
})

/**
 * HR admin procedure — requires hr_admin role.
 */
export const hrAdminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.employee.role !== 'hr_admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'HR admin access required' })
  }
  return next({ ctx })
})
