import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken, type AccessTokenPayload } from "../utils/jwt.util";
import { sendError } from "../utils/response.util";

declare global {
  namespace Express {
    interface Request {
      user?: AccessTokenPayload;
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return sendError(res, "UNAUTHORIZED", 401);
  }

  const token = header.slice("Bearer ".length);

  try {
    const payload = verifyAccessToken(token);
    req.user = payload;
    return next();
  } catch {
    return sendError(res, "INVALID_OR_EXPIRED_TOKEN", 401);
  }
}

/** Use on routes that work for both guests and logged-in users (e.g. optional personalization) */
export function optionalAuthenticate(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (header?.startsWith("Bearer ")) {
    try {
      req.user = verifyAccessToken(header.slice("Bearer ".length));
    } catch {
      // ignore invalid token, treat as guest
    }
  }
  return next();
}