export interface ProductImageDTO {
  id: string;
  url: string;
  altText: string | null;
  position: number;
}

export interface ProductVariantDTO {
  id: string;
  size: string | null;
  color: string | null;
  stock: number;
  sku: string;
  priceOverride: number | null;
}

export interface ProductListItem {
  id: string;
  name: string;
  slug: string;
  basePrice: number;
  compareAtPrice: number | null;
  thumbnailUrl: string | null;
  categoryName: string;
  brandName: string | null;
  isFeatured: boolean;
  inStock: boolean;
}

export interface ProductDetail extends ProductListItem {
  description: string;
  sku: string;
  images: ProductImageDTO[];
  variants: ProductVariantDTO[];
  sellerId: string;
}

export type ProductSortOption =
  | "newest"
  | "price_asc"
  | "price_desc"
  | "name_asc"
  | "featured";

export interface ProductFilterQuery {
  page?: number;
  limit?: number;
  categorySlug?: string;
  brandSlug?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sort?: ProductSortOption;
  featuredOnly?: boolean;
}

export interface CreateProductVariantInput {
  size?: string;
  color?: string;
  stock: number;
  sku: string;
  priceOverride?: number;
}

export interface CreateProductInput {
  name: string;
  slug: string;
  description: string;
  basePrice: number;
  compareAtPrice?: number;
  sku: string;
  categoryId: string;
  brandId?: string;
  isFeatured?: boolean;
  variants: CreateProductVariantInput[];
}

export interface UpdateProductInput {
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