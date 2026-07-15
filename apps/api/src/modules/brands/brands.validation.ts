import { z } from "zod";

const slugRule = z
  .string()
  .min(1)
  .max(100)
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Slug must be lowercase letters, numbers, and hyphens only");

export const createBrandSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(100),
    slug: slugRule,
    logoUrl: z.string().url().optional(),
    description: z.string().max(500).optional(),
  }),
});

export const updateBrandSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({
    name: z.string().min(1).max(100).optional(),
    slug: slugRule.optional(),
    logoUrl: z.string().url().optional(),
    description: z.string().max(500).optional(),
    isActive: z.boolean().optional(),
  }),
});

export const brandParamsSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
});

export type CreateBrandSchema = z.infer<typeof createBrandSchema>["body"];
export type UpdateBrandSchema = z.infer<typeof updateBrandSchema>["body"];