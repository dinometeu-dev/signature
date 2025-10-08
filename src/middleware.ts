import { NextRequest, NextResponse } from 'next/server';

import { QUERY_SLIDE_VALUES } from '@/utils/constants/paths';
import { QUERY_SLIDE } from '@/utils/constants/routes';

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = new URL(request.url);

  if (pathname === `/${QUERY_SLIDE_VALUES.SIGNATURE}`) {
    if ([...searchParams.keys()].length === 0) {
      const url = request.nextUrl.clone();
      url.searchParams.set(QUERY_SLIDE, QUERY_SLIDE_VALUES.SIGNATURE);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}
