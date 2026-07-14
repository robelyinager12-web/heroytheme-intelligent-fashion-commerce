import * as usersRepository from "./users.repository";
import { uploadImage } from "../../config/cloudinary";
import { buildPaginationMeta, type PaginationMeta } from "../../utils/response.util";
import { logger } from "../../config/logger";
import type {
  UserProfile,
  UpdateProfileInput,
  AdminUserListItem,
  AdminUserListQuery,
  AdminUpdateUserInput,
} from "./users.types";
import type { User } from "@prisma/client";

function toUserProfile(user: User): UserProfile {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
    avatarUrl: user.avatarUrl,
    role: user.role,
    isEmailVerified: user.isEmailVerified,
    createdAt: user.createdAt,
  };
}

function toAdminUserListItem(user: User): AdminUserListItem {
  return {
    ...toUserProfile(user),
    isActive: user.isActive,
    updatedAt: user.updatedAt,
  };
}

export async function getProfile(userId: string): Promise<UserProfile> {
  const user = await usersRepository.findUserById(userId);
  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }
  return toUserProfile(user);
}

export async function updateProfile(
  userId: string,
  input: UpdateProfileInput,
): Promise<UserProfile> {
  const user = await usersRepository.updateProfile(userId, input);
  logger.info(`Users: profile updated (${user.email})`);
  return toUserProfile(user);
}

export async function uploadAvatar(userId: string, fileBase64OrPath: string): Promise<UserProfile> {
  const result = await uploadImage(fileBase64OrPath, "heroytheme/avatars");
  const user = await usersRepository.updateAvatar(userId, result.secure_url);
  logger.info(`Users: avatar updated (${user.email})`);
  return toUserProfile(user);
}

export async function listUsersForAdmin(
  query: AdminUserListQuery,
): Promise<{ users: AdminUserListItem[]; meta: PaginationMeta }> {
  const page = query.page ?? 1;
  const limit = query.limit ?? 20;

  const { users, total } = await usersRepository.findManyForAdmin({
    page,
    limit,
    role: query.role,
    search: query.search,
  });

  return {
    users: users.map(toAdminUserListItem),
    meta: buildPaginationMeta(page, limit, total),
  };
}

export async function adminUpdateUser(
  targetUserId: string,
  input: AdminUpdateUserInput,
): Promise<AdminUserListItem> {
  const user = await usersRepository.adminUpdateUser(targetUserId, input);
  logger.info(`Users: admin updated user ${user.email} (${JSON.stringify(input)})`);
  // TODO: once the audit-logs module exists, call logAudit() here with the change
  return toAdminUserListItem(user);
}