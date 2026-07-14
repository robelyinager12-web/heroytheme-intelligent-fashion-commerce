import type { Request, Response, NextFunction } from "express";
import { redisClient } from "../config/redis";
import { sendError } from "../utils/response.util";
import { logger } from "../config/logger";

interface RateLimiterOptions {
  windowSeconds: number;
  maxRequests: number;
  keyPrefix: string;
}

export function createRateLimiter(options: RateLimiterOptions) {
  const { windowSeconds, maxRequests, keyPrefix } = options;

  return async (req: Request, res: Response, next: NextFunction) => {
    const identifier = req.user?.userId ?? req.ip ?? "unknown";
    const key = `ratelimit:${keyPrefix}:${identifier}`;

    try {
      const current = await redisClient.incr(key);

      if (current === 1) {
        await redisClient.expire(key, windowSeconds);
      }

      if (current > maxRequests) {
        const ttl = await redisClient.ttl(key);
        res.setHeader("Retry-After", ttl > 0 ? ttl : windowSeconds);
        return sendError(res, "TOO_MANY_REQUESTS", 429);
      }

      res.setHeader("X-RateLimit-Limit", maxRequests);
      res.setHeader("X-RateLimit-Remaining", Math.max(maxRequests - current, 0));

      return next();
    } catch (err) {
      // Fail open: if Redis is down, don't block legitimate traffic
      logger.error(`Rate limiter error (${keyPrefix}): ${(err as Error).message}`);
      return next();
    }
  };
}

/** Strict limiter for login/register — 5 attempts per 10 minutes per IP */
export const authRateLimiter = createRateLimiter({
  windowSeconds: 600,
  maxRequests: 5,
  keyPrefix: "auth",
});

/** General API limiter — 100 requests per minute per user/IP */
export const apiRateLimiter = createRateLimiter({
  windowSeconds: 60,
  maxRequests: 100,
  keyPrefix: "api",
});

/** Looser limiter for AI endpoints, which are more expensive — 20 requests per minute */
export const aiRateLimiter = createRateLimiter({
  windowSeconds: 60,
  maxRequests: 20,
  keyPrefix: "ai",
});