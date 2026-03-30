import { NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';

import { requireAdminRouteSession } from '@/lib/admin/guards';

type SimpleIconEntry = {
  title: string;
  slug: string;
  hex: string;
  source?: string;
  aliases?: {
    aka?: string[];
    dupes?: string[];
    loc?: string[];
    old?: string[];
  };
};

const getTechnologyCatalog = unstable_cache(
  async () => {
    const response = await fetch(
      'https://cdn.jsdelivr.net/npm/simple-icons@latest/data/simple-icons.json',
      {
        next: {
          revalidate: 60 * 60 * 24,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch technology catalog.');
    }

    return (await response.json()) as SimpleIconEntry[];
  },
  ['admin-technology-catalog'],
  {
    revalidate: 60 * 60 * 24,
  }
);

export async function GET(request: Request) {
  const session = await requireAdminRouteSession();

  if (session instanceof NextResponse) {
    return session;
  }

  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.trim().toLowerCase() ?? '';

    if (query.length < 2) {
      return NextResponse.json([]);
    }

    const catalog = await getTechnologyCatalog();
    const results = catalog
      .filter((item) => {
        const aliases = Object.values(item.aliases ?? {})
          .flat()
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        return (
          item.title.toLowerCase().includes(query) ||
          item.slug.toLowerCase().includes(query) ||
          aliases.includes(query)
        );
      })
      .slice(0, 24)
      .map((item) => ({
        title: item.title,
        slug: item.slug,
        hex: item.hex,
        source: item.source || null,
        iconUrl: `https://cdn.simpleicons.org/${item.slug}`,
      }));

    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch technology catalog: ${error}` },
      { status: 500 }
    );
  }
}
