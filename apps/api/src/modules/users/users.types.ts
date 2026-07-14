import type { UserRole } from "@prisma/client";

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  avatarUrl: string | null;
  role: UserRole;
  isEmailVerified: boolean;
  createdAt: Date;
}

export interface UpdateProfileInput {
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export interface AdminUserListItem extends UserProfile {
  isActive: boolean;
  updatedAt: Date;
}

export interface AdminUserListQuery {
  page?: number;
  limit?: number;
  role?: UserRole;
  search?: string; // matches email/firstName/lastName
}

export interface AdminUpdateUserInput {
  role?: UserRole;
  isActive?: boolean;
}