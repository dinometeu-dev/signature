import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = new URL(request.url)

  if (pathname === '/signature') {
    if ([...searchParams.keys()].length === 0) {
      const url = request.nextUrl.clone()
      url.searchParams.set('state', 'signature')
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}
