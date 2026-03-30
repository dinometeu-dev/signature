import { NextResponse } from 'next/server';

import { requireAdminRouteSession } from '@/lib/admin/guards';
import { CACHE_TAGS } from '@/lib/cache-tags';
import { getWorkItemsDto } from '@/lib/content/public';
import { revalidatePortfolioContent } from '@/lib/content/revalidate';
import { prisma } from '@/lib/prisma';
import { deleteUploadedImage } from '@/lib/storage/delete-uploaded-image';

async function getWorksMenuId() {
  const menu = await prisma.menu.findFirst({
    where: {
      link: {
        equals: 'works',
        mode: 'insensitive',
      },
    },
    orderBy: {
      id: 'asc',
    },
  });

  if (menu) {
    return menu.id;
  }

  const createdMenu = await prisma.menu.create({
    data: {
      title: 'Works',
      link: 'works',
    },
  });

  return createdMenu.id;
}

export async function GET() {
  const session = await requireAdminRouteSession();

  if (session instanceof NextResponse) {
    return session;
  }

  return NextResponse.json(await getWorkItemsDto());
}

export async function POST(request: Request) {
  const session = await requireAdminRouteSession();

  if (session instanceof NextResponse) {
    return session;
  }

  try {
    const body = (await request.json()) as {
      title?: string;
      overview?: string;
      problem?: string;
      impact?: string;
      menuId?: number;
      sortOrder?: number;
      isArchived?: boolean;
    };

    if (!body.title?.trim()) {
      return NextResponse.json(
        { error: 'Work title is required.' },
        { status: 400 }
      );
    }

    const sortOrder =
      body.sortOrder ??
      (await prisma.workItem.count());

    const workItem = await prisma.workItem.create({
      data: {
        title: body.title.trim(),
        overview: body.overview?.trim() || '',
        problem: body.problem?.trim() || '',
        impact: body.impact?.trim() || '',
        isArchived: body.isArchived ?? false,
        iconPath: '',
        menuId: body.menuId ?? (await getWorksMenuId()),
        sortOrder,
      },
      include: {
        galleryImages: true,
        links: true,
      },
    });

    revalidatePortfolioContent(CACHE_TAGS.works);

    return NextResponse.json(workItem, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to create work item: ${error}` },
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
      items?: Array<{
        id: number;
        sortOrder: number;
      }>;
      title?: string;
      overview?: string;
      problem?: string;
      impact?: string;
      menuId?: number;
      sortOrder?: number;
      isArchived?: boolean;
    };

    if (body.items?.length) {
      await prisma.$transaction(
        body.items.map((item) =>
          prisma.workItem.update({
            where: { id: item.id },
            data: { sortOrder: item.sortOrder },
          })
        )
      );

      revalidatePortfolioContent(CACHE_TAGS.works);

      return NextResponse.json({ ok: true });
    }

    if (!body.id) {
      return NextResponse.json({ error: 'ID is required.' }, { status: 400 });
    }

    const workItem = await prisma.workItem.update({
      where: { id: body.id },
      data: {
        ...(body.title !== undefined && { title: body.title.trim() }),
        ...(body.overview !== undefined && { overview: body.overview.trim() }),
        ...(body.problem !== undefined && { problem: body.problem.trim() }),
        ...(body.impact !== undefined && { impact: body.impact.trim() }),
        ...(body.menuId !== undefined && { menuId: body.menuId }),
        ...(body.sortOrder !== undefined && { sortOrder: body.sortOrder }),
        ...(body.isArchived !== undefined && { isArchived: body.isArchived }),
      },
      include: {
        galleryImages: true,
        links: true,
      },
    });

    revalidatePortfolioContent(CACHE_TAGS.works);

    return NextResponse.json(workItem);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to update work item: ${error}` },
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

    const existingItem = await prisma.workItem.findUnique({
      where: { id: body.id },
      select: {
        galleryImages: {
          select: {
            imageUrl: true,
          },
        },
      },
    });

    await prisma.$transaction(async (tx) => {
      await tx.workItemLink.deleteMany({
        where: { workItemId: body.id },
      });
      await tx.workItem.delete({
        where: { id: body.id },
      });

      const remaining = await tx.workItem.findMany({
        select: { id: true },
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
      });

      await Promise.all(
        remaining.map((item, index) =>
          tx.workItem.update({
            where: { id: item.id },
            data: { sortOrder: index },
          })
        )
      );
    });

    await Promise.all(
      (existingItem?.galleryImages ?? []).map((image) =>
        deleteUploadedImage(image.imageUrl)
      )
    );

    revalidatePortfolioContent(CACHE_TAGS.works);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to delete work item: ${error}` },
      { status: 500 }
    );
  }
}
