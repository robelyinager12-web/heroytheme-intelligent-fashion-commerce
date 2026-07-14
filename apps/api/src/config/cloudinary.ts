import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";
import { env } from "./env";
import { logger } from "./logger";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true,
});

export type CloudinaryFolder =
  | "heroytheme/products"
  | "heroytheme/avatars"
  | "heroytheme/blog"
  | "heroytheme/brands";

export async function uploadImage(
  filePathOrBase64: string,
  folder: CloudinaryFolder,
): Promise<UploadApiResponse> {
  try {
    const result = await cloudinary.uploader.upload(filePathOrBase64, {
      folder,
      resource_type: "image",
      transformation: [{ quality: "auto", fetch_format: "auto" }],
    });
    logger.info(`Cloudinary: uploaded ${result.public_id}`);
    return result;
  } catch (err) {
    logger.error(`Cloudinary upload failed: ${(err as Error).message}`);
    throw err;
  }
}

export async function deleteImage(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId);
    logger.info(`Cloudinary: deleted ${publicId}`);
  } catch (err) {
    logger.error(`Cloudinary delete failed: ${(err as Error).message}`);
    throw err;
  }
}

export { cloudinary };