import { NextResponse } from 'next/server';

import { requireAdminRouteSession } from '@/lib/admin/guards';
import { CACHE_TAGS } from '@/lib/cache-tags';
import { revalidatePortfolioContent } from '@/lib/content/revalidate';
import { prisma } from '@/lib/prisma';

function normalizeUrl(value: string) {
  const trimmedValue = value.trim();

  try {
    const url = new URL(trimmedValue);

    if (!['http:', 'https:'].includes(url.protocol)) {
      throw new Error('Invalid protocol');
    }

    return url.toString();
  } catch {
    throw new Error('A valid http/https URL is required.');
  }
}

export async function POST(request: Request) {
  const session = await requireAdminRouteSession();

  if (session instanceof NextResponse) {
    return session;
  }

  try {
    const body = (await request.json()) as {
      url?: string;
      label?: string | null;
      iconPath?: string | null;
      workItemId?: number;
    };

    if (!body.workItemId || !body.url?.trim()) {
      return NextResponse.json(
        { error: 'workItemId and url are required.' },
        { status: 400 }
      );
    }

    const link = await prisma.workItemLink.create({
      data: {
        workItemId: body.workItemId,
        url: normalizeUrl(body.url),
        label: body.label?.trim() || null,
        iconPath: body.iconPath?.trim() || null,
      },
    });

    revalidatePortfolioContent(CACHE_TAGS.works);

    return NextResponse.json(link, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : `Failed to create work item link: ${error}`,
      },
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
      url?: string;
      label?: string | null;
      iconPath?: string | null;
      workItemId?: number;
    };

    if (!body.id) {
      return NextResponse.json({ error: 'ID is required.' }, { status: 400 });
    }

    const link = await prisma.workItemLink.update({
      where: { id: body.id },
      data: {
        ...(body.url !== undefined && { url: normalizeUrl(body.url) }),
        ...(body.label !== undefined && { label: body.label?.trim() || null }),
        ...(body.iconPath !== undefined && {
          iconPath: body.iconPath?.trim() || null,
        }),
        ...(body.workItemId !== undefined && { workItemId: body.workItemId }),
      },
    });

    revalidatePortfolioContent(CACHE_TAGS.works);

    return NextResponse.json(link);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : `Failed to update work item link: ${error}`,
      },
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

    await prisma.workItemLink.delete({
      where: { id: body.id },
    });

    revalidatePortfolioContent(CACHE_TAGS.works);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to delete work item link: ${error}` },
      { status: 500 }
    );
  }
}
