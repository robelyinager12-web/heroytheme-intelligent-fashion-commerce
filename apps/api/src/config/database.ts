import { PrismaClient } from "@prisma/client";
import { env } from "./env";
import { logger } from "./logger";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: [
      { emit: "event", level: "query" },
      { emit: "event", level: "error" },
      { emit: "event", level: "warn" },
    ],
  });

if (env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

prisma.$on("error" as never, (e: any) => {
  logger.error(`Prisma error: ${e.message}`);
});

prisma.$on("warn" as never, (e: any) => {
  logger.warn(`Prisma warning: ${e.message}`);
});

if (env.NODE_ENV === "development") {
  prisma.$on("query" as never, (e: any) => {
    logger.debug(`Query (${e.duration}ms): ${e.query}`);
  });
}

export async function disconnectDatabase(): Promise<void> {
  await prisma.$disconnect();
  logger.info("Database connection closed");
}

process.on("beforeExit", disconnectDatabase);