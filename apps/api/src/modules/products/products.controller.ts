import type { Request, Response } from "express";
import * as productsService from "./products.service";
import { sendSuccess, sendError } from "../../utils/response.util";
import type { ProductFilterSchema, CreateProductSchema, UpdateProductSchema } from "./products.validation";

function mapErrorToStatus(message: string): number {
  switch (message) {
    case "PRODUCT_NOT_FOUND":
      return 404;
    case "SLUG_ALREADY_EXISTS":
      return 409;
    case "FORBIDDEN_NOT_PRODUCT_OWNER":
      return 403;
    default:
      return 500;
  }
}

export async function listHandler(req: Request, res: Response) {
  try {
    const query = req.query as unknown as ProductFilterSchema;
    const { products, meta } = await productsService.listProducts(query);
    return sendSuccess(res, products, "Products retrieved", 200, meta);
  } catch (err) {
    return sendError(res, (err as Error).message, 500);
  }
}

export async function getBySlugHandler(req: Request, res: Response) {
  try {
    const product = await productsService.getProductBySlug(req.params.slug);
    return sendSuccess(res, product, "Product retrieved");
  } catch (err) {
    const message = (err as Error).message;
    return sendError(res, message, mapErrorToStatus(message));
  }
}

export async function createHandler(req: Request, res: Response) {
  try {
    const body = req.body as CreateProductSchema;
    const product = await productsService.createProduct(body, req.user!);
    return sendSuccess(res, product, "Product created", 201);
  } catch (err) {
    const message = (err as Error).message;
    return sendError(res, message, mapErrorToStatus(message));
  }
}

export async function updateHandler(req: Request, res: Response) {
  try {
    const body = req.body as UpdateProductSchema;
    const product = await productsService.updateProduct(req.params.id, body, req.user!);
    return sendSuccess(res, product, "Product updated");
  } catch (err) {
    const message = (err as Error).message;
    return sendError(res, message, mapErrorToStatus(message));
  }
}

export async function deleteHandler(req: Request, res: Response) {
  try {
    await productsService.deleteProduct(req.params.id, req.user!);
    return sendSuccess(res, null, "Product deleted");
  } catch (err) {
    const message = (err as Error).message;
    return sendError(res, message, mapErrorToStatus(message));
  }
}