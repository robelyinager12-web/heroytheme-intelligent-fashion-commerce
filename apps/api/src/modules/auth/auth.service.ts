import bcrypt from "bcrypt";
import {
  findUserByEmail,
  findUserById,
  createUser,
  updateRefreshToken,
  updatePasswordHash,
} from "./auth.repository";
import { signAuthTokens, verifyRefreshToken } from "../../utils/jwt.util";
import { logger } from "../../config/logger";
import type {
  RegisterInput,
  LoginInput,
  AuthResult,
  AuthUser,
  ChangePasswordInput,
} from "./auth.types";
import type { User } from "@prisma/client";

const SALT_ROUNDS = 12;

function toAuthUser(user: User): AuthUser {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    avatarUrl: user.avatarUrl,
    isEmailVerified: user.isEmailVerified,
  };
}

export async function register(input: RegisterInput): Promise<AuthResult> {
  const existing = await findUserByEmail(input.email);
  if (existing) {
    throw new Error("EMAIL_ALREADY_EXISTS");
  }

  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

  const user = await createUser({
    email: input.email,
    passwordHash,
    firstName: input.firstName,
    lastName: input.lastName,
    phone: input.phone,
  });

  const tokens = signAuthTokens({ userId: user.id, role: user.role });
  await updateRefreshToken(user.id, tokens.refreshToken);

  logger.info(`Auth: new user registered (${user.email})`);
  return { user: toAuthUser(user), tokens };
}

export async function login(input: LoginInput): Promise<AuthResult> {
  const user = await findUserByEmail(input.email);
  if (!user) {
    throw new Error("INVALID_CREDENTIALS");
  }

  if (!user.isActive) {
    throw new Error("ACCOUNT_DISABLED");
  }

  const isValid = await bcrypt.compare(input.password, user.passwordHash);
  if (!isValid) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const tokens = signAuthTokens({ userId: user.id, role: user.role });
  await updateRefreshToken(user.id, tokens.refreshToken);

  logger.info(`Auth: user logged in (${user.email})`);
  return { user: toAuthUser(user), tokens };
}

export async function refresh(refreshToken: string): Promise<AuthResult> {
  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw new Error("INVALID_REFRESH_TOKEN");
  }

  const user = await findUserById(payload.userId);
  if (!user || user.refreshToken !== refreshToken) {
    throw new Error("INVALID_REFRESH_TOKEN");
  }

  const tokens = signAuthTokens({ userId: user.id, role: user.role });
  await updateRefreshToken(user.id, tokens.refreshToken);

  return { user: toAuthUser(user), tokens };
}

export async function logout(userId: string): Promise<void> {
  await updateRefreshToken(userId, null);
  logger.info(`Auth: user logged out (${userId})`);
}

export async function changePassword(input: ChangePasswordInput): Promise<void> {
  const user = await findUserById(input.userId);
  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  const isValid = await bcrypt.compare(input.currentPassword, user.passwordHash);
  if (!isValid) {
    throw new Error("INVALID_CURRENT_PASSWORD");
  }

  const newHash = await bcrypt.hash(input.newPassword, SALT_ROUNDS);
  await updatePasswordHash(user.id, newHash);
  logger.info(`Auth: password changed (${user.email})`);
}