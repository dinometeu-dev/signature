import { NextResponse } from 'next/server';

import { requireAdminRouteSession } from '@/lib/admin/guards';
import { uploadImage } from '@/lib/storage/upload-image';

export async function POST(request: Request) {
  const session = await requireAdminRouteSession();

  if (session instanceof NextResponse) {
    return session;
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: 'Image file is required.' },
        { status: 400 }
      );
    }

    const upload = await uploadImage({
      file,
      fallbackName: 'work-gallery',
      folder: 'work-gallery',
      width: 1920,
      height: 1280,
      fit: 'inside',
      quality: 84,
      withoutEnlargement: true,
    });

    return NextResponse.json({
      path: upload.path,
      width: upload.width,
      height: upload.height,
    });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to upload work gallery image: ${error}` },
      { status: 500 }
    );
  }
}
