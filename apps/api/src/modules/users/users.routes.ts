import { Router } from "express";
import * as usersController from "./users.controller";
import { validate } from "../../middleware/validate.middleware";
import { authenticate } from "../../middleware/auth.middleware";
import { adminOnly } from "../../middleware/rbac.middleware";
import {
  updateProfileSchema,
  adminListUsersSchema,
  adminUpdateUserSchema,
} from "./users.validation";

const router = Router();

// --- Self-service profile routes ---
router.get("/me", authenticate, usersController.getProfileHandler);
router.patch(
  "/me",
  authenticate,
  validate(updateProfileSchema),
  usersController.updateProfileHandler,
);
router.post("/me/avatar", authenticate, usersController.uploadAvatarHandler);

// --- Admin-only user management ---
router.get(
  "/",
  authenticate,
  adminOnly,
  validate(adminListUsersSchema),
  usersController.adminListUsersHandler,
);
router.patch(
  "/:id",
  authenticate,
  adminOnly,
  validate(adminUpdateUserSchema),
  usersController.adminUpdateUserHandler,
);

export default router;