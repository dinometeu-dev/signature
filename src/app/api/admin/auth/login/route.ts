import { NextResponse } from 'next/server';

import { verifyPassword } from '@/lib/admin/password';
import { createAdminSession, ensureAdminUserFromEnv } from '@/lib/admin/session';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: string;
      password?: string;
    };

    const email = body.email?.trim().toLowerCase();
    const password = body.password?.trim();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    await ensureAdminUserFromEnv();

    const user = await prisma.adminUser.findUnique({
      where: {
        email,
      },
    });

    if (!user && (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD)) {
      return NextResponse.json(
        {
          error:
            'No admin user exists yet. Set ADMIN_EMAIL and ADMIN_PASSWORD to bootstrap the first admin account.',
        },
        { status: 500 }
      );
    }

    if (!user || !verifyPassword(password, user.passwordHash)) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    await createAdminSession(user.id);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to log in: ${error}` },
      { status: 500 }
    );
  }
}
