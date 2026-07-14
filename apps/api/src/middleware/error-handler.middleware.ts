import type { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import { logger } from "../config/logger";
import { sendError } from "../utils/response.util";
import { env } from "../config/env";

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
) {
  const path = `${req.method} ${req.originalUrl}`;

  // --- Prisma known request errors (e.g. unique constraint, record not found) ---
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    logger.error(`[${path}] Prisma error ${err.code}: ${err.message}`);

    if (err.code === "P2002") {
      const field = (err.meta?.target as string[])?.join(", ") ?? "field";
      return sendError(res, `A record with this ${field} already exists`, 409);
    }
    if (err.code === "P2025") {
      return sendError(res, "Record not found", 404);
    }
    return sendError(res, "Database error", 400);
  }

  // --- Zod validation errors that slipped past validate.middleware ---
  if (err instanceof ZodError) {
    const errors: Record<string, string[]> = {};
    for (const issue of err.issues) {
      const key = issue.path.join(".") || "root";
      errors[key] = [...(errors[key] ?? []), issue.message];
    }
    logger.error(`[${path}] Validation error: ${JSON.stringify(errors)}`);
    return sendError(res, "Validation failed", 400, errors);
  }

  // --- Everything else ---
  const error = err instanceof Error ? err : new Error("Unknown error");
  logger.error(`[${path}] ${error.message}\n${error.stack}`);

  return sendError(
    res,
    env.NODE_ENV === "production" ? "Internal server error" : error.message,
    500,
  );
}