import { NextResponse } from 'next/server';

import { requireAdminRouteSession } from '@/lib/admin/guards';
import { CACHE_TAGS } from '@/lib/cache-tags';
import { revalidatePortfolioContent } from '@/lib/content/revalidate';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  const session = await requireAdminRouteSession();

  if (session instanceof NextResponse) {
    return session;
  }

  try {
    const body = (await request.json()) as {
      experienceBlockId?: number;
      position?: string;
      startDate?: string;
      endDate?: string | null;
      sortOrder?: number;
    };

    if (!body.experienceBlockId || !body.position?.trim() || !body.startDate) {
      return NextResponse.json(
        { error: 'experienceBlockId, position, and startDate are required.' },
        { status: 400 }
      );
    }

    const period = await prisma.experiencePeriod.create({
      data: {
        experienceBlockId: body.experienceBlockId,
        position: body.position.trim(),
        startDate: new Date(body.startDate),
        endDate: body.endDate ? new Date(body.endDate) : null,
        sortOrder: body.sortOrder ?? 0,
      },
    });

    revalidatePortfolioContent(CACHE_TAGS.profile);

    return NextResponse.json(period, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to create experience period: ${error}` },
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
      position?: string;
      startDate?: string;
      endDate?: string | null;
      sortOrder?: number;
    };

    if (!body.id) {
      return NextResponse.json({ error: 'ID is required.' }, { status: 400 });
    }

    const period = await prisma.experiencePeriod.update({
      where: { id: body.id },
      data: {
        ...(body.position !== undefined && { position: body.position.trim() }),
        ...(body.startDate !== undefined && {
          startDate: new Date(body.startDate),
        }),
        ...(body.endDate !== undefined && {
          endDate: body.endDate ? new Date(body.endDate) : null,
        }),
        ...(body.sortOrder !== undefined && { sortOrder: body.sortOrder }),
      },
    });

    revalidatePortfolioContent(CACHE_TAGS.profile);

    return NextResponse.json(period);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to update experience period: ${error}` },
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

    await prisma.experiencePeriod.delete({
      where: { id: body.id },
    });

    revalidatePortfolioContent(CACHE_TAGS.profile);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to delete experience period: ${error}` },
      { status: 500 }
    );
  }
}
