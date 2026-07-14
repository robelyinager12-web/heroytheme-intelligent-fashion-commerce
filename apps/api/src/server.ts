import { createApp } from "./app";
import { env } from "./config/env";
import { logger } from "./config/logger";
import { prisma, disconnectDatabase } from "./config/database";
import { connectRedis, disconnectRedis } from "./config/redis";

async function bootstrap() {
  try {
    // Verify DB connectivity before accepting traffic
    await prisma.$connect();
    logger.info("Database connected");

    await connectRedis();

    const app = createApp();

    const server = app.listen(env.PORT, () => {
      logger.info(`HeroyTheme API running on port ${env.PORT} [${env.NODE_ENV}]`);
    });

    const shutdown = async (signal: string) => {
      logger.info(`${signal} received — shutting down gracefully`);
      server.close(async () => {
        await disconnectDatabase();
        await disconnectRedis();
        logger.info("Shutdown complete");
        process.exit(0);
      });

      // Force exit if shutdown hangs for more than 10s
      setTimeout(() => {
        logger.error("Forced shutdown after timeout");
        process.exit(1);
      }, 10_000).unref();
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
  } catch (err) {
    logger.error(`Failed to start server: ${(err as Error).message}`);
    process.exit(1);
  }
}

process.on("unhandledRejection", (reason) => {
  logger.error(`Unhandled rejection: ${reason}`);
});

process.on("uncaughtException", (err) => {
  logger.error(`Uncaught exception: ${err.message}`);
  process.exit(1);
});

bootstrap();