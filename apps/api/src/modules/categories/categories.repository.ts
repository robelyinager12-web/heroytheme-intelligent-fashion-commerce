import { prisma } from "../../config/database";
import type { Category } from "@prisma/client";

export function findAllActive(): Promise<Category[]> {
  return prisma.category.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });
}

export function findAllForAdmin(): Promise<Category[]> {
  return prisma.category.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export function findById(id: string): Promise<Category | null> {
  return prisma.category.findUnique({ where: { id } });
}

export function findBySlug(slug: string) {
  return prisma.category.findUnique({
    where: { slug },
    include: { children: { where: { isActive: true } } },
  });
}

export function findBySlugOnly(slug: string): Promise<Category | null> {
  return prisma.category.findUnique({ where: { slug } });
}

export interface CreateCategoryData {
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  parentId?: string;
}

export function createCategory(data: CreateCategoryData): Promise<Category> {
  return prisma.category.create({ data });
}

export interface UpdateCategoryData {
  name?: string;
  slug?: string;
  description?: string;
  imageUrl?: string;
  parentId?: string | null;
  isActive?: boolean;
}

export function updateCategory(id: string, data: UpdateCategoryData): Promise<Category> {
  return prisma.category.update({ where: { id }, data });
}

export function deleteCategory(id: string): Promise<Category> {
  return prisma.category.delete({ where: { id } });
}

export async function hasChildren(id: string): Promise<boolean> {
  const count = await prisma.category.count({ where: { parentId: id } });
  return count > 0;
}

export async function hasProducts(id: string): Promise<boolean> {
  const count = await prisma.product.count({ where: { categoryId: id } });
  return count > 0;
}