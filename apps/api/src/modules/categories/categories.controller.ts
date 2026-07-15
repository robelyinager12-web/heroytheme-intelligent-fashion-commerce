import type { Request, Response } from "express";
import * as categoriesService from "./categories.service";
import { sendSuccess, sendError } from "../../utils/response.util";
import type { CreateCategorySchema, UpdateCategorySchema } from "./categories.validation";

function mapErrorToStatus(message: string): number {
  switch (message) {
    case "CATEGORY_NOT_FOUND":
      return 404;
    case "SLUG_ALREADY_EXISTS":
      return 409;
    case "CATEGORY_HAS_SUBCATEGORIES":
    case "CATEGORY_HAS_PRODUCTS":
      return 409;
    default:
      return 500;
  }
}

export async function getTreeHandler(_req: Request, res: Response) {
  try {
    const tree = await categoriesService.getCategoryTree();
    return sendSuccess(res, tree, "Category tree retrieved");
  } catch (err) {
    return sendError(res, (err as Error).message, 500);
  }
}

export async function getBySlugHandler(req: Request, res: Response) {
  try {
    const category = await categoriesService.getCategoryBySlug(req.params.slug);
    return sendSuccess(res, category, "Category retrieved");
  } catch (err) {
    const message = (err as Error).message;
    return sendError(res, message, mapErrorToStatus(message));
  }
}

export async function adminListHandler(_req: Request, res: Response) {
  try {
    const categories = await categoriesService.listCategoriesForAdmin();
    return sendSuccess(res, categories, "Categories retrieved");
  } catch (err) {
    return sendError(res, (err as Error).message, 500);
  }
}

export async function createHandler(req: Request, res: Response) {
  try {
    const body = req.body as CreateCategorySchema;
    const category = await categoriesService.createCategory(body);
    return sendSuccess(res, category, "Category created", 201);
  } catch (err) {
    const message = (err as Error).message;
    return sendError(res, message, mapErrorToStatus(message));
  }
}

export async function updateHandler(req: Request, res: Response) {
  try {
    const body = req.body as UpdateCategorySchema;
    const category = await categoriesService.updateCategory(req.params.id, body);
    return sendSuccess(res, category, "Category updated");
  } catch (err) {
    const message = (err as Error).message;
    return sendError(res, message, mapErrorToStatus(message));
  }
}

export async function deleteHandler(req: Request, res: Response) {
  try {
    await categoriesService.deleteCategory(req.params.id);
    return sendSuccess(res, null, "Category deleted");
  } catch (err) {
    const message = (err as Error).message;
    return sendError(res, message, mapErrorToStatus(message));
  }
}