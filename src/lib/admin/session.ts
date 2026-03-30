import { createHash, randomBytes } from 'node:crypto';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { hashPassword } from '@/lib/admin/password';
import { prisma } from '@/lib/prisma';

const ADMIN_SESSION_COOKIE = 'portfolio-admin-session';
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7;

function getSessionSecret() {
  return (
    process.env.ADMIN_SESSION_SECRET ??
    process.env.DATABASE_URL ??
    'portfolio-admin-session-secret'
  );
}

function hashSessionToken(token: string) {
  return createHash('sha256')
    .update(`${getSessionSecret()}:${token}`)
    .digest('hex');
}

function buildSessionCookie(expiresAt: Date) {
  return {
    name: ADMIN_SESSION_COOKIE,
    value: '',
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: expiresAt,
  };
}

export async function ensureAdminUserFromEnv() {
  const adminCount = await prisma.adminUser.count();

  if (adminCount > 0) {
    return;
  }

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    return;
  }

  await prisma.adminUser.create({
    data: {
      email,
      passwordHash: hashPassword(password),
    },
  });
}

export async function createAdminSession(userId: number) {
  const token = randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  await prisma.adminSession.create({
    data: {
      tokenHash: hashSessionToken(token),
      expiresAt,
      userId,
    },
  });

  const cookieStore = await cookies();

  cookieStore.set({
    ...buildSessionCookie(expiresAt),
    value: token,
  });
}

export async function deleteAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (token) {
    await prisma.adminSession.deleteMany({
      where: {
        tokenHash: hashSessionToken(token),
      },
    });
  }

  cookieStore.set({
    ...buildSessionCookie(new Date(0)),
    maxAge: 0,
  });
}

export async function getCurrentAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  const session = await prisma.adminSession.findUnique({
    where: {
      tokenHash: hashSessionToken(token),
    },
    include: {
      user: true,
    },
  });

  if (!session) {
    return null;
  }

  if (session.expiresAt <= new Date()) {
    await prisma.adminSession.delete({
      where: {
        id: session.id,
      },
    });

    cookieStore.set({
      ...buildSessionCookie(new Date(0)),
      maxAge: 0,
    });

    return null;
  }

  return session;
}

export async function requireAdminSession() {
  const session = await getCurrentAdminSession();

  if (!session) {
    redirect('/admin/login');
  }

  return session;
}

export function isAdminSessionCookie(cookieName: string) {
  return cookieName === ADMIN_SESSION_COOKIE;
}
