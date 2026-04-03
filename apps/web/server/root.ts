import { router } from './trpc'
import { employeeRouter } from './routers/employee'
import { employerRouter } from './routers/employer'
import { payslipRouter } from './routers/payslip'
import { goalsRouter } from './routers/goals'
import { learningRouter } from './routers/learning'
import { analyticsRouter } from './routers/analytics'
import { netWorthRouter } from './routers/netWorth'
import { debtRouter } from './routers/debt'
import { budgetRouter } from './routers/budget'
import { webinarsRouter } from './routers/webinars'
import { ebooksRouter } from './routers/ebooks'
import { pulseRouter } from './routers/pulse'
import { campaignsRouter } from './routers/campaigns'

export { router, publicProcedure, protectedProcedure, hrAdminProcedure } from './trpc'

export const appRouter = router({
  employee: employeeRouter,
  employer: employerRouter,
  payslip: payslipRouter,
  goals: goalsRouter,
  learning: learningRouter,
  analytics: analyticsRouter,
  netWorth: netWorthRouter,
  debt: debtRouter,
  budget: budgetRouter,
  webinars: webinarsRouter,
  ebooks: ebooksRouter,
  pulse: pulseRouter,
  campaigns: campaignsRouter,
})

export type AppRouter = typeof appRouter
