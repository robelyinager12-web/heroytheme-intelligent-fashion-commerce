import { z } from "zod";

const slugRule = z
  .string()
  .min(1)
  .max(100)
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Slug must be lowercase letters, numbers, and hyphens only");

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(1).max(100),
    slug: slugRule,
    description: z.string().max(500).optional(),
    imageUrl: z.string().url().optional(),
    parentId: z.string().optional(),
  }),
});

export const updateCategorySchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z.object({
    name: z.string().min(1).max(100).optional(),
    slug: slugRule.optional(),
    description: z.string().max(500).optional(),
    imageUrl: z.string().url().optional(),
    parentId: z.string().nullable().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const categoryParamsSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});

export type CreateCategorySchema = z.infer<typeof createCategorySchema>["body"];
export type UpdateCategorySchema = z.infer<typeof updateCategorySchema>["body"];