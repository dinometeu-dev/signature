import { NextResponse } from 'next/server';

import { requireAdminRouteSession } from '@/lib/admin/guards';
import { CACHE_TAGS } from '@/lib/cache-tags';
import { getSignatureContentDto } from '@/lib/content/public';
import { revalidatePortfolioContent } from '@/lib/content/revalidate';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await requireAdminRouteSession();

  if (session instanceof NextResponse) {
    return session;
  }

  return NextResponse.json(await getSignatureContentDto());
}

export async function PATCH(request: Request) {
  const session = await requireAdminRouteSession();

  if (session instanceof NextResponse) {
    return session;
  }

  try {
    const body = (await request.json()) as {
      title?: string;
      subtitle?: string;
    };

    const title = body.title?.trim();
    const subtitle = body.subtitle?.trim();

    if (!title || !subtitle) {
      return NextResponse.json(
        { error: 'Title and subtitle are required.' },
        { status: 400 }
      );
    }

    const content = await prisma.signatureContent.upsert({
      where: { id: 1 },
      create: { id: 1, title, subtitle },
      update: { title, subtitle },
    });

    revalidatePortfolioContent(CACHE_TAGS.signature);

    return NextResponse.json(content);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to update signature content: ${error}` },
      { status: 500 }
    );
  }
}
