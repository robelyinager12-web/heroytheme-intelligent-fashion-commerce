import { prisma } from "../../config/database";
import type { User, UserRole } from "@prisma/client";

export function findUserByEmail(email: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { email } });
}

export function findUserById(id: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { id } });
}

export interface CreateUserData {
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role?: UserRole;
}

export function createUser(data: CreateUserData): Promise<User> {
  return prisma.user.create({ data });
}

export function updateRefreshToken(userId: string, refreshToken: string | null): Promise<User> {
  return prisma.user.update({
    where: { id: userId },
    data: { refreshToken },
  });
}

export function updatePasswordHash(userId: string, passwordHash: string): Promise<User> {
  return prisma.user.update({
    where: { id: userId },
    data: { passwordHash, refreshToken: null }, // force re-login on other devices
  });
}

export function markEmailVerified(userId: string): Promise<User> {
  return prisma.user.update({
    where: { id: userId },
    data: { isEmailVerified: true },
  });
}