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
      name?: string;
      iconPath?: string;
      sortOrder?: number;
    };

    if (!body.name?.trim()) {
      return NextResponse.json(
        { error: 'Technology name is required.' },
        { status: 400 }
      );
    }

    if (!body.iconPath?.trim()) {
      return NextResponse.json(
        { error: 'Technology icon is required.' },
        { status: 400 }
      );
    }

    const lastTechnology = await prisma.technology.findFirst({
      orderBy: [{ sortOrder: 'desc' }, { id: 'desc' }],
      select: { sortOrder: true },
    });

    const technology = await prisma.technology.create({
      data: {
        name: body.name.trim(),
        iconPath: body.iconPath.trim(),
        sortOrder: body.sortOrder ?? (lastTechnology?.sortOrder ?? -1) + 1,
      },
    });

    revalidatePortfolioContent(CACHE_TAGS.profile);

    return NextResponse.json(technology, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to create technology: ${error}` },
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
      name?: string;
      iconPath?: string;
      sortOrder?: number;
      items?: Array<{
        id: number;
        sortOrder: number;
      }>;
    };

    if (body.items?.length) {
      await prisma.$transaction(
        body.items.map((item) =>
          prisma.technology.update({
            where: { id: item.id },
            data: { sortOrder: item.sortOrder },
          })
        )
      );

      revalidatePortfolioContent(CACHE_TAGS.profile);

      return NextResponse.json({ ok: true });
    }

    if (!body.id) {
      return NextResponse.json({ error: 'ID is required.' }, { status: 400 });
    }

    const existingTechnology = await prisma.technology.findUnique({
      where: { id: body.id },
      select: { iconPath: true },
    });

    const technology = await prisma.technology.update({
      where: { id: body.id },
      data: {
        ...(body.name !== undefined && { name: body.name.trim() }),
        ...(body.iconPath !== undefined && { iconPath: body.iconPath.trim() }),
        ...(body.sortOrder !== undefined && { sortOrder: body.sortOrder }),
      },
    });

    if (
      body.iconPath !== undefined &&
      existingTechnology?.iconPath &&
      existingTechnology.iconPath !== body.iconPath.trim()
    ) {
      await deleteUploadedImage(existingTechnology.iconPath);
    }

    revalidatePortfolioContent(CACHE_TAGS.profile);

    return NextResponse.json(technology);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to update technology: ${error}` },
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

    const existingTechnology = await prisma.technology.findUnique({
      where: { id: body.id },
      select: { iconPath: true },
    });

    await prisma.technology.delete({
      where: { id: body.id },
    });

    const technologies = await prisma.technology.findMany({
      orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
      select: { id: true },
    });

    if (technologies.length) {
      await prisma.$transaction(
        technologies.map((technology, index) =>
          prisma.technology.update({
            where: { id: technology.id },
            data: { sortOrder: index },
          })
        )
      );
    }

    await deleteUploadedImage(existingTechnology?.iconPath);

    revalidatePortfolioContent(CACHE_TAGS.profile);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to delete technology: ${error}` },
      { status: 500 }
    );
  }
}
