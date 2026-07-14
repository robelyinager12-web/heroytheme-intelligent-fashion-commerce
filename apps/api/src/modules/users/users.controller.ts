import type { Request, Response } from "express";
import * as usersService from "./users.service";
import { sendSuccess, sendError } from "../../utils/response.util";
import type {
  UpdateProfileSchema,
  AdminListUsersSchema,
  AdminUpdateUserSchema,
} from "./users.validation";

function mapErrorToStatus(message: string): number {
  switch (message) {
    case "USER_NOT_FOUND":
      return 404;
    default:
      return 500;
  }
}

export async function getProfileHandler(req: Request, res: Response) {
  try {
    const profile = await usersService.getProfile(req.user!.userId);
    return sendSuccess(res, profile, "Profile retrieved");
  } catch (err) {
    const message = (err as Error).message;
    return sendError(res, message, mapErrorToStatus(message));
  }
}

export async function updateProfileHandler(req: Request, res: Response) {
  try {
    const body = req.body as UpdateProfileSchema;
    const profile = await usersService.updateProfile(req.user!.userId, body);
    return sendSuccess(res, profile, "Profile updated");
  } catch (err) {
    const message = (err as Error).message;
    return sendError(res, message, mapErrorToStatus(message));
  }
}

export async function uploadAvatarHandler(req: Request, res: Response) {
  try {
    const { image } = req.body as { image?: string };
    if (!image) {
      return sendError(res, "IMAGE_REQUIRED", 400);
    }
    const profile = await usersService.uploadAvatar(req.user!.userId, image);
    return sendSuccess(res, profile, "Avatar updated");
  } catch (err) {
    return sendError(res, (err as Error).message, 500);
  }
}

export async function adminListUsersHandler(req: Request, res: Response) {
  try {
    const query = req.query as unknown as AdminListUsersSchema;
    const { users, meta } = await usersService.listUsersForAdmin(query);
    return sendSuccess(res, users, "Users retrieved", 200, meta);
  } catch (err) {
    return sendError(res, (err as Error).message, 500);
  }
}

export async function adminUpdateUserHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const body = req.body as AdminUpdateUserSchema;
    const user = await usersService.adminUpdateUser(id, body);
    return sendSuccess(res, user, "User updated");
  } catch (err) {
    const message = (err as Error).message;
    return sendError(res, message, mapErrorToStatus(message));
  }
}