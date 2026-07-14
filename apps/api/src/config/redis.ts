import { createClient, type RedisClientType } from "redis";
import { env } from "./env";
import { logger } from "./logger";

export const redisClient: RedisClientType = createClient({
  url: env.REDIS_URL,
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        logger.error("Redis: too many reconnect attempts, giving up");
        return new Error("Redis reconnect limit exceeded");
      }
      const delay = Math.min(retries * 100, 3000);
      logger.warn(`Redis: reconnecting in ${delay}ms (attempt ${retries})`);
      return delay;
    },
  },
});

redisClient.on("error", (err) => logger.error(`Redis error: ${err.message}`));
redisClient.on("connect", () => logger.info("Redis: connecting..."));
redisClient.on("ready", () => logger.info("Redis: connection ready"));
redisClient.on("reconnecting", () => logger.warn("Redis: reconnecting"));

export async function connectRedis(): Promise<void> {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
}

export async function disconnectRedis(): Promise<void> {
  if (redisClient.isOpen) {
    await redisClient.quit();
    logger.info("Redis connection closed");
  }
}