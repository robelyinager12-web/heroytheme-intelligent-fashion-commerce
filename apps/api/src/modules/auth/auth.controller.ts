import type { Request, Response } from "express";
import * as authService from "./auth.service";
import { sendSuccess, sendError } from "../../utils/response.util";
import type { RegisterSchema, LoginSchema } from "./auth.validation";

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/api/auth",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

function mapErrorToStatus(message: string): number {
  switch (message) {
    case "EMAIL_ALREADY_EXISTS":
      return 409;
    case "INVALID_CREDENTIALS":
    case "INVALID_REFRESH_TOKEN":
    case "INVALID_CURRENT_PASSWORD":
      return 401;
    case "ACCOUNT_DISABLED":
      return 403;
    case "USER_NOT_FOUND":
      return 404;
    default:
      return 500;
  }
}

export async function registerHandler(req: Request, res: Response) {
  try {
    const body = req.body as RegisterSchema;
    const { user, tokens } = await authService.register(body);
    res.cookie("refreshToken", tokens.refreshToken, REFRESH_COOKIE_OPTIONS);
    return sendSuccess(res, { user, accessToken: tokens.accessToken }, "Account created", 201);
  } catch (err) {
    const message = (err as Error).message;
    return sendError(res, message, mapErrorToStatus(message));
  }
}

export async function loginHandler(req: Request, res: Response) {
  try {
    const body = req.body as LoginSchema;
    const { user, tokens } = await authService.login(body);
    res.cookie("refreshToken", tokens.refreshToken, REFRESH_COOKIE_OPTIONS);
    return sendSuccess(res, { user, accessToken: tokens.accessToken }, "Login successful");
  } catch (err) {
    const message = (err as Error).message;
    return sendError(res, message, mapErrorToStatus(message));
  }
}

export async function refreshHandler(req: Request, res: Response) {
  try {
    const token = req.cookies?.refreshToken as string | undefined;
    if (!token) {
      return sendError(res, "NO_REFRESH_TOKEN", 401);
    }
    const { user, tokens } = await authService.refresh(token);
    res.cookie("refreshToken", tokens.refreshToken, REFRESH_COOKIE_OPTIONS);
    return sendSuccess(res, { user, accessToken: tokens.accessToken }, "Token refreshed");
  } catch (err) {
    const message = (err as Error).message;
    return sendError(res, message, mapErrorToStatus(message));
  }
}

export async function logoutHandler(req: Request, res: Response) {
  try {
    const userId = req.user?.userId;
    if (userId) {
      await authService.logout(userId);
    }
    res.clearCookie("refreshToken", { path: "/api/auth" });
    return sendSuccess(res, null, "Logged out");
  } catch (err) {
    return sendError(res, (err as Error).message, 500);
  }
}

export async function changePasswordHandler(req: Request, res: Response) {
  try {
    const userId = req.user!.userId;
    const { currentPassword, newPassword } = req.body;
    await authService.changePassword({ userId, currentPassword, newPassword });
    return sendSuccess(res, null, "Password changed successfully");
  } catch (err) {
    const message = (err as Error).message;
    return sendError(res, message, mapErrorToStatus(message));
  }
}