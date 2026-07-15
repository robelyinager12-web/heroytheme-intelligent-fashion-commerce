import * as categoriesRepository from "./categories.repository";
import { logger } from "../../config/logger";
import type {
  CategoryNode,
  CategoryTreeNode,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "./categories.types";
import type { Category } from "@prisma/client";

function toCategoryNode(category: Category): CategoryNode {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    imageUrl: category.imageUrl,
    parentId: category.parentId,
    isActive: category.isActive,
  };
}

function buildCategoryTree(categories: Category[]): CategoryTreeNode[] {
  const nodeMap = new Map<string, CategoryTreeNode>();
  const roots: CategoryTreeNode[] = [];

  for (const category of categories) {
    nodeMap.set(category.id, { ...toCategoryNode(category), children: [] });
  }

  for (const category of categories) {
    const node = nodeMap.get(category.id)!;
    if (category.parentId) {
      const parent = nodeMap.get(category.parentId);
      parent ? parent.children.push(node) : roots.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}

export async function getCategoryTree(): Promise<CategoryTreeNode[]> {
  const categories = await categoriesRepository.findAllActive();
  return buildCategoryTree(categories);
}

export async function listCategoriesForAdmin(): Promise<CategoryNode[]> {
  const categories = await categoriesRepository.findAllForAdmin();
  return categories.map(toCategoryNode);
}

export async function getCategoryBySlug(slug: string) {
  const category = await categoriesRepository.findBySlug(slug);
  if (!category) {
    throw new Error("CATEGORY_NOT_FOUND");
  }
  return category;
}

export async function createCategory(input: CreateCategoryInput): Promise<CategoryNode> {
  const existing = await categoriesRepository.findBySlugOnly(input.slug);
  if (existing) {
    throw new Error("SLUG_ALREADY_EXISTS");
  }
  const category = await categoriesRepository.createCategory(input);
  logger.info(`Categories: created "${category.name}" (${category.slug})`);
  return toCategoryNode(category);
}

export async function updateCategory(
  id: string,
  input: UpdateCategoryInput,
): Promise<CategoryNode> {
  const existing = await categoriesRepository.findById(id);
  if (!existing) {
    throw new Error("CATEGORY_NOT_FOUND");
  }

  if (input.slug && input.slug !== existing.slug) {
    const slugTaken =