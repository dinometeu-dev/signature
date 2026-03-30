import { unlink } from 'node:fs/promises';
import path from 'node:path';

import { del } from '@vercel/blob';

const MANAGED_LOCAL_PREFIXES = [
  '/uploads/experience-logos/',
  '/uploads/technology-icons/',
  '/uploads/work-gallery/',
] as const;

const MANAGED_BLOB_PATH_PARTS = [
  '/experience-logos/',
  '/technology-icons/',
  '/work-gallery/',
] as const;

function isManagedLocalUpload(value: string) {
  return MANAGED_LOCAL_PREFIXES.some((prefix) => value.startsWith(prefix));
}

function isManagedBlobUpload(value: string) {
  try {
    const url = new URL(value);

    return (
      (url.hostname.endsWith('.public.blob.vercel-storage.com') ||
        url.hostname.endsWith('.blob.vercel-storage.com')) &&
      MANAGED_BLOB_PATH_PARTS.some((part) => url.pathname.includes(part))
    );
  } catch {
    return false;
  }
}

export async function deleteUploadedImage(value: string | null | undefined) {
  if (!value) {
    return;
  }

  if (isManagedBlobUpload(value)) {
    try {
      await del(value);
    } catch {
      return;
    }

    return;
  }

  if (isManagedLocalUpload(value)) {
    try {
      await unlink(path.join(process.cwd(), 'public', value));
    } catch {
      return;
    }
  }
}
