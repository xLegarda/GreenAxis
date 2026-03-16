import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

// Turso (libsql) si está configurado; si no, SQLite local (DATABASE_URL)
const url = process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL || 'file:./db/custom.db'
const authToken = url.startsWith('libsql:') ? process.env.TURSO_AUTH_TOKEN : undefined

const adapter = new PrismaLibSql({ url, authToken })

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
