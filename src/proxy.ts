import { NextRequest, NextResponse } from 'next/server';

import { isAdminSessionCookie } from '@/lib/admin/session';
import { QUERY_SLIDE_VALUES } from '@/utils/constants/paths';
import { QUERY_SLIDE } from '@/utils/constants/routes';

export function proxy(request: NextRequest) {
  const { pathname, searchParams } = new URL(request.url);

  if (pathname === `/${QUERY_SLIDE_VALUES.SIGNATURE}`) {
    if ([...searchParams.keys()].length === 0) {
      const url = request.nextUrl.clone();
      url.searchParams.set(QUERY_SLIDE, QUERY_SLIDE_VALUES.SIGNATURE);
      return NextResponse.redirect(url);
    }
  }

  if (
    pathname.startsWith('/admin') &&
    pathname !== '/admin/login' &&
    !request.cookies.getAll().some((cookie) => isAdminSessionCookie(cookie.name))
  ) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/login';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
