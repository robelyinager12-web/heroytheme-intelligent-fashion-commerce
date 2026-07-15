import type { Request, Response } from "express";
import * as brandsService from "./brands.service";
import { sendSuccess, sendError } from "../../utils/response.util";
import type { CreateBrandSchema, UpdateBrandSchema } from "./brands.validation";

function mapErrorToStatus(message: string): number {
  switch (message) {
    case "BRAND_NOT_FOUND":
      return 404;
    case "SLUG_ALREADY_EXISTS":
    case "BRAND_HAS_PRODUCTS":
      return 409;
    default:
      return 500;
  }
}

export async function listActiveHandler(_req: Request, res: Response) {
  try {
    const brands = await brandsService.listActiveBrands();
    return sendSuccess(res, brands, "Brands retrieved");
  } catch (err) {
    return sendError(res, (err as Error).message, 500);
  }
}

export async function getBySlugHandler(req: Request, res: Response) {
  try {
    const brand = await brandsService.getBrandBySlug(req.params.slug);
    return sendSuccess(res, brand, "Brand retrieved");
  } catch (err) {
    const message = (err as Error).message;
    return sendError(res, message, mapErrorToStatus(message));
  }
}

export async function adminListHandler(_req: Request, res: Response) {
  try {
    const brands = await brandsService.listBrandsForAdmin();
    return sendSuccess(res, brands, "Brands retrieved");
  } catch (err) {
    return sendError(res, (err as Error).message, 500);
  }
}

export async function createHandler(req: Request, res: Response) {
  try {
    const body = req.body as CreateBrandSchema;
    const brand = await brandsService.createBrand(body);
    return sendSuccess(res, brand, "Brand created", 201);
  } catch (err) {
    const message = (err as Error).message;
    return sendError(res, message, mapErrorToStatus(message));
  }
}

export async function updateHandler(req: Request, res: Response) {
  try {
    const body = req.body as UpdateBrandSchema;
    const brand = await brandsService.updateBrand(req.params.id, body);
    return sendSuccess(res, brand, "Brand updated");
  } catch (err) {
    const message = (err as Error).message;
    return sendError(res, message, mapErrorToStatus(message));
  }
}

export async function deleteHandler(req: Request, res: Response) {
  try {
    await brandsService.deleteBrand(req.params.id);
    return sendSuccess(res, null, "Brand deleted");
  } catch (err) {
    const message = (err as Error).message;
    return sendError(res, message, mapErrorToStatus(message));
  }
}