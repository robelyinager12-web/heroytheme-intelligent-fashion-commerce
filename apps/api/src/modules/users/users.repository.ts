import { prisma } from "../../config/database";
import type { Prisma, User, UserRole } from "@prisma/client";

export function findUserById(id: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { id } });
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export function updateProfile(id: string, data: UpdateProfileData): Promise<User> {
  return prisma.user.update({ where: { id }, data });
}

export function updateAvatar(id: string, avatarUrl: string): Promise<User> {
  return prisma.user.update({ where: { id }, data: { avatarUrl } });
}

export interface FindManyForAdminParams {
  page: number;
  limit: number;
  role?: UserRole;
  search?: string;
}

export async function findManyForAdmin(
  params: FindManyForAdminParams,
): Promise<{ users: User[]; total: number }> {
  const { page, limit, role, search } = params;

  const where: Prisma.UserWhereInput = {
    ...(role ? { role } : {}),
    ...(search
      ? {
          OR: [
            { email: { contains: search, mode: "insensitive" } },
            { firstName: { contains: search, mode: "insensitive" } },
            { lastName: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.count({ where }),
  ]);

  return { users, total };
}

export interface AdminUpdateUserData {
  role?: UserRole;
  isActive?: boolean;
}

export function adminUpdateUser(id: string, data: AdminUpdateUserData): Promise<User> {
  return prisma.user.update({ where: { id }, data });
}