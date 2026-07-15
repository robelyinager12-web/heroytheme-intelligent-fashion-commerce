import { z } from "zod";

const slugRule = z
  .string()
  .min(1)
  .max(150)
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Slug must be lowercase letters, numbers, and hyphens only");

const variantSchema = z.object({
  size: z.string().max(20).optional(),
  color: z.string().max(30).optional(),
  stock: z.coerce.number().int().min(0),
  sku: z.string().min(1).max(50),
  priceOverride: z.coerce.number().positive().optional(),
});

export const productFilterSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    categorySlug: z.string().optional(),
    brandSlug: z.string().optional(),
    minPrice: z.coerce.number().min(0).optional(),
    maxPrice: z.coerce.number().min(0).optional(),
    search: z.string().max(150).optional(),
    sort: z.enum(["newest", "price_asc", "price_desc", "name_asc", "featured"]).default("newest"),
    featuredOnly: z.coerce.boolean().optional(),
  }),
});

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(200),
    slug: slugRule,
    description: z.string().min(1).max(5000),
    basePrice: z.coerce.number().positive(),
    compareAtPrice: z.coerce.number().positive().optional(),
    sku: z.string().min(1).max(50),
    categoryId: z.string().min(1),
    brandId: z.string().optional(),
    isFeatured: z.boolean().optional(),
    variants: z.array(variantSchema).min(1, "At least one variant is required"),
  }),
});

export const updateProductSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({
    name: z.string().min(1).max(200).optional(),
    slug: slugRule.optional(),
    description: z.string().min(1).max(5000).optional(),
    basePrice: z.coerce.number().positive().optional(),
    compareAtPrice: z.coerce.number().positive().optional(),
    categoryId: z.string().min(1).optional(),
    brandId: z.string().optional(),
    isFeatured: z.boolean().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const productParamsSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
});

export type ProductFilterSchema = z.infer<typeof productFilterSchema>["query"];
export type CreateProductSchema = z.infer<typeof createProductSchema>["body"];
export type UpdateProductSchema = z.infer<typeof updateProductSchema>["body"];