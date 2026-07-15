import { Router } from "express";
import * as categoriesController from "./categories.controller";
import { validate } from "../../middleware/validate.middleware";
import { authenticate } from "../../middleware/auth.middleware";
import { adminOnly } from "../../middleware/rbac.middleware";
import {
  createCategorySchema,
  updateCategorySchema,
  categoryParamsSchema,
} from "./categories.validation";

const router = Router();

// --- Public ---
router.get("/tree", categoriesController.getTreeHandler);
router.get("/slug/:slug", categoriesController.getBySlugHandler);

// --- Admin only ---
router.get("/", authenticate, adminOnly, categoriesController.adminListHandler);
router.post(
  "/",
  authenticate,
  adminOnly,
  validate(createCategorySchema),
  categoriesController.createHandler,
);
router.patch(
  "/:id",
  authenticate,
  adminOnly,
  validate(updateCategorySchema),
  categoriesController.updateHandler,
);
router.delete(
  "/:id",
  authenticate,
  adminOnly,
  validate(categoryParamsSchema),
  categoriesController.deleteHandler,
);

export default router;