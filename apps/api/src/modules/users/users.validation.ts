import { z } from "zod";

export const updateProfileSchema = z.object({
  body: z.object({
    firstName: z.string().min(1).max(50).optional(),
    lastName: z.string().min(1).max(50).optional(),
    phone: z.string().min(7).max(20).optional(),
  }),
});

export const adminListUsersSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    role: z.enum(["CUSTOMER", "SELLER", "ADMIN"]).optional(),
    search: z.string().max(100).optional(),
  }),
});

export const adminUpdateUserSchema = z.object({
  params: z.object({
    id: z.string().min(1, "User id is required"),
  }),
  body: z.object({
    role: z.enum(["CUSTOMER", "SELLER", "ADMIN"]).optional(),
    isActive: z.boolean().optional(),
  }),
});

export type UpdateProfileSchema = z.infer<typeof updateProfileSchema>["body"];
export type AdminListUsersSchema = z.infer<typeof adminListUsersSchema>["query"];
export type AdminUpdateUserSchema = z.infer<typeof adminUpdateUserSchema>["body"];