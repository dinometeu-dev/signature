import { NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';

import { requireAdminRouteSession } from '@/lib/admin/guards';

type CountryNowResponse = {
  error: boolean;
  msg: string;
  data: Array<{
    iso2: string;
    iso3: string;
    country: string;
    cities: string[];
  }>;
};

const getLocationDataset = unstable_cache(
  async () => {
    const response = await fetch('https://countriesnow.space/api/v0.1/countries', {
      next: {
        revalidate: 60 * 60 * 24,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch countries and cities.');
    }

    const payload = (await response.json()) as CountryNowResponse;

    if (payload.error) {
      throw new Error(payload.msg || 'Failed to fetch countries and cities.');
    }

    return payload.data;
  },
  ['admin-location-dataset'],
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

    const dataset = await getLocationDataset();
    const results: Array<{
      value: string;
      label: string;
      city: string | null;
      country: string;
      type: 'city' | 'country';
    }> = [];

    for (const countryEntry of dataset) {
      if (countryEntry.country.toLowerCase().includes(query)) {
        results.push({
          value: countryEntry.country,
          label: countryEntry.country,
          city: null,
          country: countryEntry.country,
          type: 'country',
        });
      }

      for (const city of countryEntry.cities) {
        const searchable = `${city}, ${countryEntry.country}`.toLowerCase();

        if (searchable.includes(query)) {
          results.push({
            value: `${city}, ${countryEntry.country}`,
            label: `${city}, ${countryEntry.country}`,
            city,
            country: countryEntry.country,
            type: 'city',
          });
        }

        if (results.length >= 30) {
          break;
        }
      }

      if (results.length >= 30) {
        break;
      }
    }

    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to search locations: ${error}` },
      { status: 500 }
    );
  }
}
