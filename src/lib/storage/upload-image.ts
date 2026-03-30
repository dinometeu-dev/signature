import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { put } from '@vercel/blob';
import sharp from 'sharp';

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

type UploadImageOptions = {
  file: File;
  fallbackName: string;
  folder: string;
  width: number;
  height: number;
  fit: keyof sharp.FitEnum;
  quality: number;
  background?: {
    r: number;
    g: number;
    b: number;
    alpha: number;
  };
  withoutEnlargement?: boolean;
};

export async function uploadImage({
  file,
  fallbackName,
  folder,
  width,
  height,
  fit,
  quality,
  background,
  withoutEnlargement = false,
}: UploadImageOptions) {
  const arrayBuffer = await file.arrayBuffer();
  const sourceBuffer = Buffer.from(arrayBuffer);
  const fileName = `${slugify(path.parse(file.name).name) || fallbackName}-${Date.now()}.webp`;

  const { data, info } = await sharp(sourceBuffer)
    .resize(width, height, {
      fit,
      ...(background ? { background } : null),
      ...(withoutEnlargement ? { withoutEnlargement: true } : null),
    })
    .webp({ quality })
    .toBuffer({ resolveWithObject: true });

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`${folder}/${fileName}`, data, {
      access: 'public',
      addRandomSuffix: false,
      contentType: 'image/webp',
    });

    return {
      path: blob.url,
      width: info.width ?? null,
      height: info.height ?? null,
      storage: 'blob' as const,
    };
  }

  if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
    throw new Error(
      'BLOB_READ_WRITE_TOKEN is required in production to store uploaded images.'
    );
  }

  const relativePath = `/uploads/${folder}/${fileName}`;
  const absoluteDirectory = path.join(process.cwd(), 'public', 'uploads', folder);
  const absolutePath = path.join(absoluteDirectory, fileName);

  await mkdir(absoluteDirectory, { recursive: true });
  await writeFile(absolutePath, data);

  return {
    path: relativePath,
    width: info.width ?? null,
    height: info.height ?? null,
    storage: 'local' as const,
  };
}
