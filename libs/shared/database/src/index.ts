import { PrismaClient } from "@prisma/client"

// Global Prisma client with connection pooling
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

// Graceful shutdown
process.on("beforeExit", async () => {
  await prisma.$disconnect()
})

export * from "@prisma/client"
export type { Prisma } from "@prisma/client"
