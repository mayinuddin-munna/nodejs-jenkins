import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { cloudinaryUpload } from './cloudinary.config';
import type { StorageEngine } from 'multer';

// CloudinaryStorage typings are not fully compatible with Multer's StorageEngine.
// We use a bounded type assertion to satisfy TypeScript without breaking runtime behavior.
const storage = new CloudinaryStorage({
  cloudinary: cloudinaryUpload,
}) as unknown as StorageEngine;

export const multerUpload = multer({ storage });
