import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from '@/generated/prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

function readPoolNumber(name: string, fallback: number) {
  const value = process.env[name];

  if (!value) {
    return fallback;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function readOptionalBoolean(name: string) {
  const value = process.env[name]?.trim().toLowerCase();

  if (!value) {
    return undefined;
  }

  if (['1', 'true', 'yes', 'on'].includes(value)) {
    return true;
  }

  if (['0', 'false', 'no', 'off'].includes(value)) {
    return false;
  }

  return undefined;
}

function createAdapter() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('DATABASE_URL is not set');
  }

  const url = new URL(connectionString);
  const sslRejectUnauthorized =
    readOptionalBoolean('PRISMA_SSL_REJECT_UNAUTHORIZED') ??
    (url.hostname.endsWith('db.prisma.io') ? false : undefined);

  return new PrismaPg({
    connectionString,
    max: readPoolNumber('PRISMA_POOL_MAX', 1),
    connectionTimeoutMillis: readPoolNumber('PRISMA_CONNECTION_TIMEOUT_MS', 5_000),
    idleTimeoutMillis: readPoolNumber('PRISMA_IDLE_TIMEOUT_MS', 300_000),
    ssl:
      sslRejectUnauthorized === undefined
        ? undefined
        : { rejectUnauthorized: sslRejectUnauthorized },
  });
}

function createPrismaClient() {
  return new PrismaClient({
    adapter: createAdapter(),
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
