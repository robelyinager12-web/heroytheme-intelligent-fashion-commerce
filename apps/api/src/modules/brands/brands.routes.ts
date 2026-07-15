import { Router } from "express";
import * as brandsController from "./brands.controller";
import { validate } from "../../middleware/validate.middleware";
import { authenticate } from "../../middleware/auth.middleware";
import { adminOnly } from "../../middleware/rbac.middleware";
import { createBrandSchema, updateBrandSchema, brandParamsSchema } from "./brands.validation";

const router = Router();

// --- Public ---
router.get("/", brandsController.listActiveHandler);
router.get("/slug/:slug", brandsController.getBySlugHandler);

// --- Admin only ---
router.get("/admin", authenticate, adminOnly, brandsController.adminListHandler);
router.post(
  "/",
  authenticate,
  adminOnly,
  validate(createBrandSchema),
  brandsController.createHandler,
);
router.patch(
  "/:id",
  authenticate,
  adminOnly,
  validate(updateBrandSchema),
  brandsController.updateHandler,
);
router.delete(
  "/:id",
  authenticate,
  adminOnly,
  validate(brandParamsSchema),
  brandsController.deleteHandler,
);

export default router;