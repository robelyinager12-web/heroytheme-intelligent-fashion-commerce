import { prisma } from "../../config/database";
import type { Brand } from "@prisma/client";

export function findAllActive(): Promise<Brand[]> {
  return prisma.brand.findMany({ where: { isActive: true }, orderBy: { name: "asc" } });
}

export function findAllForAdmin(): Promise<Brand[]> {
  return prisma.brand.findMany({ orderBy: { createdAt: "desc" } });
}

export function findById(id: string): Promise<Brand | null> {
  return prisma.brand.findUnique({ where: { id } });
}

export function findBySlug(slug: string): Promise<Brand | null> {
  return prisma.brand.findUnique({ where: { slug } });
}

export interface CreateBrandData {
  name: string;
  slug: string;
  logoUrl?: string;
  description?: string;
}

export function createBrand(data: CreateBrandData): Promise<Brand> {
  return prisma.brand.create({ data });
}

export interface UpdateBrandData {
  name?: string;
  slug?: string;
  logoUrl?: string;
  description?: string;
  isActive?: boolean;
}

export function updateBrand(id: string, data: UpdateBrandData): Promise<Brand> {
  return prisma.brand.update({ where: { id }, data });
}

export function deleteBrand(id: string): Promise<Brand> {
  return prisma.brand.delete({ where: { id } });
}

export async function hasProducts(id: string): Promise<boolean> {
  const count = await prisma.product.count({ where: { brandId: id } });
  return count > 0;
}