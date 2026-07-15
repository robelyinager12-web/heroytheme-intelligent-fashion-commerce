import * as productsRepository from "./products.repository";
import { logger } from "../../config/logger";
import type {
  ProductListItem,
  ProductDetail,
  ProductFilterQuery,
  CreateProductInput,
  UpdateProductInput,
} from "./products.types";
import type { PaginationMeta } from "../../utils/response.util";
import { buildPaginationMeta } from "../../utils/response.util";

// Prisma's inferred include-shape isn't imported here to keep this file decoupled
// from repository internals — these mappers accept "anything with these fields".
function toProductListItem(product: any): ProductListItem {
  const totalStock = product.variants?.reduce((sum: number, v: any) => sum + v.stock, 0) ?? 0;
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    basePrice: Number(product.basePrice),
    compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
    thumbnailUrl: product.images?.[0]?.url ?? null,
    categoryName: product.category?.name ?? "",
    brandName: product.brand?.name ?? null,
    isFeatured: product.isFeatured,
    inStock: totalStock > 0,
  };
}

function toProductDetail(product: any): ProductDetail {
  return {
    ...toProductListItem(product),
    description: product.description,
    sku: product.sku,
    sellerId: product.sellerId,
    images: product.images.map((img: any) => ({
      id: img.id,
      url: img.url,
      altText: img.altText,
      position: img.position,
    })),
    variants: product.variants.map((v: any) => ({
      id: v.id,
      size: v.size,
      color: v.color,
      stock: v.stock,
      sku: v.sku,
      priceOverride: v.priceOverride ? Number(v.priceOverride) : null,
    })),
  };
}

export async function listProducts(
  filters: ProductFilterQuery,
): Promise<{ products: ProductListItem[]; meta: PaginationMeta }> {
  const page = filters.page ?? 1;
  const limit = filters.limit ?? 20;

  const { products, total } = await productsRepository.findManyFiltered(filters);

  return {
    products: products.map(toProductListItem),
    meta: buildPaginationMeta(page, limit, total),
  };
}

export async function getProductBySlug(slug: string): Promise<ProductDetail> {
  const product = await productsRepository.findDetailBySlug(slug);
  if (!product) {
    throw new Error("PRODUCT_NOT_FOUND");
  }
  return toProductDetail(product);
}

interface RequestingUser {
  userId: string;
  role: "CUSTOMER" | "SELLER" | "ADMIN";
}

export async function createProduct(
  input: CreateProductInput,
  seller: RequestingUser,
): Promise<ProductDetail> {
  const slugTaken = await productsRepository.findBySlugOnly(input.slug);
  if (slugTaken) {
    throw new Error("SLUG_ALREADY_EXISTS");
  }

  const product = await productsRepository.createProductWithVariants({
    ...input,
    sellerId: seller.userId,
  });

  logger.info(`Products: created "${product.name}" by seller ${seller.userId}`);
  return toProductDetail(product);
}

async function assertCanModify(productId: string, requester: RequestingUser): Promise<void> {
  if (requester.role === "ADMIN") return;

  const owns = await productsRepository.isOwnedBySeller(productId, requester.userId);
  if (!owns) {
    throw new Error("FORBIDDEN_NOT_PRODUCT_OWNER");
  }
}

export async function updateProduct(
  id: string,
  input: UpdateProductInput,
  requester: RequestingUser,
): Promise<ProductDetail> {
  const existing = await productsRepository.findById(id);
  if (!existing) {
    throw new Error("PRODUCT_NOT_FOUND");
  }

  await assertCanModify(id, requester);

  if (input.slug && input.slug !== existing.slug) {
    const slugTaken = await productsRepository.findBySlugOnly(input.slug);
    if (slugTaken) {
      throw new Error("SLUG_ALREADY_EXISTS");
    }
  }

  const product = await productsRepository.updateProduct(id, input);
  logger.info(`Products: updated "${product.name}"`);
  return toProductDetail(product);
}

export async function deleteProduct(id: string, requester: RequestingUser): Promise<void> {
  const existing = await productsRepository.findById(id);
  if (!existing) {
    throw new Error("PRODUCT_NOT_FOUND");
  }

  await assertCanModify(id, requester);

  await productsRepository.deleteProduct(id);
  logger.info(`Products: deleted "${existing.name}"`);
}