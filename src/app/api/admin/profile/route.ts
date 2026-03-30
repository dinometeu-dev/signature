import { NextResponse } from 'next/server';

import { requireAdminRouteSession } from '@/lib/admin/guards';
import { CACHE_TAGS } from '@/lib/cache-tags';
import { getAdminProfileData } from '@/lib/admin/data';
import { revalidatePortfolioContent } from '@/lib/content/revalidate';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await requireAdminRouteSession();

  if (session instanceof NextResponse) {
    return session;
  }

  return NextResponse.json(await getAdminProfileData());
}

export async function PATCH(request: Request) {
  const session = await requireAdminRouteSession();

  if (session instanceof NextResponse) {
    return session;
  }

  try {
    const body = (await request.json()) as {
      title?: string;
      description?: string;
    };

    const title = body.title?.trim();
    const description = body.description?.trim();

    if (!title || !description) {
      return NextResponse.json(
        { error: 'Title and description are required.' },
        { status: 400 }
      );
    }

    const content = await prisma.profileContent.upsert({
      where: { id: 1 },
      create: {
        id: 1,
        title,
        description,
      },
      update: {
        title,
        description,
      },
    });

    revalidatePortfolioContent(CACHE_TAGS.profile);

    return NextResponse.json(content);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to update profile content: ${error}` },
      { status: 500 }
    );
  }
}
