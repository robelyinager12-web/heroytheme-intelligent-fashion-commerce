import * as brandsRepository from "./brands.repository";
import { logger } from "../../config/logger";
import type { BrandNode, CreateBrandInput, UpdateBrandInput } from "./brands.types";
import type { Brand } from "@prisma/client";

function toBrandNode(brand: Brand): BrandNode {
  return {
    id: brand.id,
    name: brand.name,
    slug: brand.slug,
    logoUrl: brand.logoUrl,
    description: brand.description,
    isActive: brand.isActive,
  };
}

export async function listActiveBrands(): Promise<BrandNode[]> {
  const brands = await brandsRepository.findAllActive();
  return brands.map(toBrandNode);
}

export async function listBrandsForAdmin(): Promise<BrandNode[]> {
  const brands = await brandsRepository.findAllForAdmin();
  return brands.map(toBrandNode);
}

export async function getBrandBySlug(slug: string): Promise<BrandNode> {
  const brand = await brandsRepository.findBySlug(slug);
  if (!brand) {
    throw new Error("BRAND_NOT_FOUND");
  }
  return toBrandNode(brand);
}

export async function createBrand(input: CreateBrandInput): Promise<BrandNode> {
  const existing = await brandsRepository.findBySlug(input.slug);
  if (existing) {
    throw new Error("SLUG_ALREADY_EXISTS");
  }
  const brand = await brandsRepository.createBrand(input);
  logger.info(`Brands: created "${brand.name}" (${brand.slug})`);
  return toBrandNode(brand);
}

export async function updateBrand(id: string, input: UpdateBrandInput): Promise<BrandNode> {
  const existing = await brandsRepository.findById(id);
  if (!existing) {
    throw new Error("BRAND_NOT_FOUND");
  }

  if (input.slug && input.slug !== existing.slug) {
    const slugTaken = await brandsRepository.findBySlug(input.slug);
    if (slugTaken) {
      throw new Error("SLUG_ALREADY_EXISTS");
    }
  }

  const brand = await brandsRepository.updateBrand(id, input);
  logger.info(`Brands: updated "${brand.name}"`);
  return toBrandNode(brand);
}

export async function deleteBrand(id: string): Promise<void> {
  const existing = await brandsRepository.findById(id);
  if (!existing) {
    throw new Error("BRAND_NOT_FOUND");
  }
  if (await brandsRepository.hasProducts(id)) {
    throw new Error("BRAND_HAS_PRODUCTS");
  }
  await brandsRepository.deleteBrand(id);
  logger.info(`Brands: deleted "${existing.name}"`);
}