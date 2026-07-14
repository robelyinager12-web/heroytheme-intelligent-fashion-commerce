import express, { type Application } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { env } from "./config/env";
import { logger } from "./config/logger";
import { apiRateLimiter } from "./middleware/rate-limiter.middleware";
import { errorHandler } from "./middleware/error-handler.middleware";
import { sendError } from "./utils/response.util";

import authRoutes from "./modules/auth/auth.routes";

export function createApp(): Application {
  const app = express();

  // --- Security & parsing ---
  app.use(helmet());
  app.use(
    cors({
      origin: env.NEXT_PUBLIC_API_URL ? true : env.NODE_ENV !== "production",
      credentials: true,
    }),
  );
  app.use(express.json({ limit: "2mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // --- Request logging, piped through winston ---
  app.use(
    morgan(env.NODE_ENV === "production" ? "combined" : "dev", {
      stream: { write: (msg) => logger.info(msg.trim()) },
    }),
  );

  // --- Baseline rate limiting on all routes ---
  app.use("/api", apiRateLimiter);

  // --- Health check (no auth, used by Docker/load balancer) ---
  app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // --- Module routes ---
  app.use("/api/auth", authRoutes);
  // Additional modules (users, products, orders, ai, admin, ...) mount here as they're built

  // --- 404 for unmatched routes ---
  app.use((req, res) => {
    sendError(res, `Route not found: ${req.method} ${req.originalUrl}`, 404);
  });

  // --- Global error handler (must be last) ---
  app.use(errorHandler);

  return app;
}