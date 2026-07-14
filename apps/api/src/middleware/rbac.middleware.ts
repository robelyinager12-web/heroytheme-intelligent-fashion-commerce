import type { Request, Response, NextFunction } from "express";
import type { UserRole } from "@prisma/client";
import { sendError } from "../utils/response.util";

export function authorize(...allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendError(res, "UNAUTHORIZED", 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      return sendError(res, "FORBIDDEN_INSUFFICIENT_ROLE", 403);
    }

    return next();
  };
}

/** Convenience shorthands for the three roles in the system */
export const adminOnly = authorize("ADMIN");
export const sellerOrAdmin = authorize("SELLER", "ADMIN");
export const anyAuthenticatedUser = authorize("CUSTOMER", "SELLER", "ADMIN");