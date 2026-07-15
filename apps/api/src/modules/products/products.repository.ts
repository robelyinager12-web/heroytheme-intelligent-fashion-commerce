import { prisma } from "../../config/database";
import type { Prisma, Product } from "@prisma/client";
import type { ProductFilterQuery } from "./products.types";

const PRODUCT_LIST_INCLUDE = {
  images: { orderBy: { position: "asc" as const }, take: 1 },
  category: { select: { name: true } },
  brand: { select: { name: true } },
  variants: { select: { stock: true } },
};

const PRODUCT_DETAIL_INCLUDE = {
  images: { orderBy: { position: "asc" as const } },
  variants: true,
  category: { select: { name: true } },
  brand: { select: { name: true } },
};

function buildWhereClause(filters: ProductFilterQuery): Prisma.ProductWhereInput {
  return {
    isActive: true,
    ...(filters.categorySlug ? { category: { slug: filters.categorySlug } } : {}),
    ...(filters.brandSlug ? { brand: { slug: filters.brandSlug } } : {}),
    ...(filters.featuredOnly ? { isFeatured: true } : {}),
    ...(filters.minPrice !== undefined || filters.maxPrice !== undefined
      ? {
          basePrice: {
            ...(filters.minPrice !== undefined ? { gte: filters.minPrice } : {}),
            ...(filters.maxPrice !== undefined ? { lte: filters.maxPrice } : {}),
          },
        }
      : {}),
    ...(filters.search
      ? {
          OR: [
            { name: { contains: filters.search, mode: "insensitive" as const } },
            { description: { contains: filters.search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };
}

function buildOrderBy(sort: ProductFilterQuery["sort"]): Prisma.ProductOrderByWithRelationInput {
  switch (sort) {
    case "price_asc":
      return { basePrice: "asc" };
    case "price_desc":
      return { basePrice: "desc" };
    case "name_asc":
      return { name: "asc" };
    case "featured":
      return { isFeatured: "desc" };
    case "newest":
    default:
      return { createdAt: "desc" };
  }
}

export async function findManyFiltered(filters: ProductFilterQuery) {
  const where = buildWhereClause(filters);
  const page = filters.page ?? 1;
  const limit = filters.limit ?? 20;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: PRODUCT_LIST_INCLUDE,
      orderBy: buildOrderBy(filters.sort),
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return { products, total };
}

export function findDetailBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: PRODUCT_DETAIL_INCLUDE,
  });
}

export function findById(id: string): Promise<Product | null> {
  return prisma.product.findUnique({ where: { id } });
}

export function findBySlugOnly(slug: string): Promise<Product | null> {
  return prisma.product.findUnique({ where: { slug } });
}

export interface CreateProductData {
  name: string;
  slug: string;
  description: string;
  basePrice: number;
  compareAtPrice?: number;
  sku: string;
  sellerId: string;
  categoryId: string;
  brandId?: string;
  isFeatured?: boolean;
  variants: {
    size?: string;
    color?: string;
    stock: number;
    sku: string;
    priceOverride?: number;
  }[];
}

export function createProductWithVariants(data: CreateProductData) {
  const { variants, ...productData } = data;
  return prisma.product.create({
    data: {
      ...productData,
      variants: { create: variants },
    },
    include: PRODUCT_DETAIL_INCLUDE,
  });
}

export interface UpdateProductData {
  name?: string;
  slug?: string;
  description?: string;
  basePrice?: number;
  compareAtPrice?: number;
  categoryId?: string;
  brandId?: string;
  isFeatured?: boolean;
  isActive?: boolean;
}

export function updateProduct(id: string, data: UpdateProductData) {
  return prisma.product.update({
    where: { id },
    data,
    include: PRODUCT_DETAIL_INCLUDE,
  });
}

export function deleteProduct(id: string): Promise<Product> {
  return prisma.product.delete({ where: { id } });
}

export function isOwnedBySeller(productId: string, sellerId: string): Promise<boolean> {
  return prisma.product
    .count({ where: { id: productId, sellerId } })
    .then((count) => count > 0);
}