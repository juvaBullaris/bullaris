'use client'

import { createTRPCReact } from '@trpc/react-query'
import type { AppRouter } from '@/server/root'

/**
 * tRPC client for use in Client Components.
 * All internal data fetching must go through tRPC — no raw fetch to internal routes.
 */
export const trpc = createTRPCReact<AppRouter>()
