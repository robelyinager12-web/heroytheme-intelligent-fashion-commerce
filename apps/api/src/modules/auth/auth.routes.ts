import { Router } from "express";
import * as authController from "./auth.controller";
import { validate } from "../../middleware/validate.middleware";
import { authenticate } from "../../middleware/auth.middleware";
import { authRateLimiter } from "../../middleware/rate-limiter.middleware";
import {
  registerSchema,
  loginSchema,
  refreshSchema,
  changePasswordSchema,
} from "./auth.validation";

const router = Router();

// --- Public routes ---
router.post("/register", authRateLimiter, validate(registerSchema), authController.registerHandler);
router.post("/login", authRateLimiter, validate(loginSchema), authController.loginHandler);
router.post("/refresh", validate(refreshSchema), authController.refreshHandler);

// --- Protected routes (require a valid access token) ---
router.post("/logout", authenticate, authController.logoutHandler);
router.post(
  "/change-password",
  authenticate,
  validate(changePasswordSchema),
  authController.changePasswordHandler,
);

export default router;