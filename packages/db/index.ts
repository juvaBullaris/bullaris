import { PrismaClient } from '@prisma/client'

declare global {
  // Allow global `var` declarations in dev to prevent multiple instances
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

/**
 * Singleton Prisma client.
 * In development, re-use across hot reloads to avoid exhausting connection pool.
 */
export const db: PrismaClient =
  globalThis.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = db
}
