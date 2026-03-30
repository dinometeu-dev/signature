import { NextResponse } from 'next/server';

import { getCurrentAdminSession } from '@/lib/admin/session';

export async function requireAdminRouteSession() {
  const session = await getCurrentAdminSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return session;
}
