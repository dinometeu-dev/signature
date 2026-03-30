import { NextResponse } from 'next/server';

import { requireAdminRouteSession } from '@/lib/admin/guards';
import { CACHE_TAGS } from '@/lib/cache-tags';
import { revalidatePortfolioContent } from '@/lib/content/revalidate';
import { prisma } from '@/lib/prisma';
import { deleteUploadedImage } from '@/lib/storage/delete-uploaded-image';

export async function POST(request: Request) {
  const session = await requireAdminRouteSession();

  if (session instanceof NextResponse) {
    return session;
  }

  try {
    const body = (await request.json()) as {
      workItemId?: number;
      imageUrl?: string;
      alt?: string;
      sortOrder?: number;
    };

    if (!body.workItemId || !body.imageUrl?.trim()) {
      return NextResponse.json(
        { error: 'workItemId and imageUrl are required.' },
        { status: 400 }
      );
    }

    const sortOrder =
      body.sortOrder ??
      (await prisma.workGalleryImage.count({
        where: {
          workItemId: body.workItemId,
        },
      }));

    const image = await prisma.workGalleryImage.create({
      data: {
        workItemId: body.workItemId,
        imageUrl: body.imageUrl.trim(),
        alt: body.alt?.trim() || '',
        sortOrder,
      },
    });

    revalidatePortfolioContent(CACHE_TAGS.works);

    return NextResponse.json(image, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to create gallery image: ${error}` },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  const session = await requireAdminRouteSession();

  if (session instanceof NextResponse) {
    return session;
  }

  try {
    const body = (await request.json()) as {
      id?: number;
      imageUrl?: string;
      alt?: string;
      sortOrder?: number;
    };

    if (!body.id) {
      return NextResponse.json({ error: 'ID is required.' }, { status: 400 });
    }

    const existingImage = await prisma.workGalleryImage.findUnique({
      where: { id: body.id },
      select: { imageUrl: true },
    });

    const image = await prisma.workGalleryImage.update({
      where: { id: body.id },
      data: {
        ...(body.imageUrl !== undefined && { imageUrl: body.imageUrl.trim() }),
        ...(body.alt !== undefined && { alt: body.alt.trim() }),
        ...(body.sortOrder !== undefined && { sortOrder: body.sortOrder }),
      },
    });

    if (
      body.imageUrl !== undefined &&
      existingImage?.imageUrl &&
      existingImage.imageUrl !== body.imageUrl.trim()
    ) {
      await deleteUploadedImage(existingImage.imageUrl);
    }

    revalidatePortfolioContent(CACHE_TAGS.works);

    return NextResponse.json(image);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to update gallery image: ${error}` },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const session = await requireAdminRouteSession();

  if (session instanceof NextResponse) {
    return session;
  }

  try {
    const body = (await request.json()) as {
      id?: number;
    };

    if (!body.id) {
      return NextResponse.json({ error: 'ID is required.' }, { status: 400 });
    }

    let imageUrlToDelete: string | null = null;

    await prisma.$transaction(async (tx) => {
      const existing = await tx.workGalleryImage.findUnique({
        where: { id: body.id },
        select: { workItemId: true, imageUrl: true },
      });

      if (!existing) {
        return;
      }

      imageUrlToDelete = existing.imageUrl;

      await tx.workGalleryImage.delete({
        where: { id: body.id },
      });

      const remaining = await tx.workGalleryImage.findMany({
        where: { workItemId: existing.workItemId },
        select: { id: true },
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
      });

      await Promise.all(
        remaining.map((image, index) =>
          tx.workGalleryImage.update({
            where: { id: image.id },
            data: { sortOrder: index },
          })
        )
      );
    });

    await deleteUploadedImage(imageUrlToDelete);

    revalidatePortfolioContent(CACHE_TAGS.works);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to delete gallery image: ${error}` },
      { status: 500 }
    );
  }
}
