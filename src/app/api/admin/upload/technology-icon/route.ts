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
      fallbackName: 'technology-icon',
      folder: 'technology-icons',
      width: 160,
      height: 160,
      fit: 'contain',
      quality: 84,
      background: {
        r: 255,
        g: 255,
        b: 255,
        alpha: 0,
      },
    });

    return NextResponse.json({
      path: upload.path,
      width: upload.width,
      height: upload.height,
    });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to upload icon: ${error}` },
      { status: 500 }
    );
  }
}
