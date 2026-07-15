import { Router } from "express";
import * as productsController from "./products.controller";
import { validate } from "../../middleware/validate.middleware";
import { authenticate } from "../../middleware/auth.middleware";
import { sellerOrAdmin } from "../../middleware/rbac.middleware";
import {
  productFilterSchema,
  createProductSchema,
  updateProductSchema,
  productParamsSchema,
} from "./products.validation";

const router = Router();

// --- Public ---
router.get("/", validate(productFilterSchema), productsController.listHandler);
router.get("/slug/:slug", productsController.getBySlugHandler);

// --- Seller / Admin only ---
router.post(
  "/",
  authenticate,
  sellerOrAdmin,
  validate(createProductSchema),
  productsController.createHandler,
);
router.patch(
  "/:id",
  authenticate,
  sellerOrAdmin,
  validate(updateProductSchema),
  productsController.updateHandler,
);
router.delete(
  "/:id",
  authenticate,
  sellerOrAdmin,
  validate(productParamsSchema),
  productsController.deleteHandler,
);

export default router;