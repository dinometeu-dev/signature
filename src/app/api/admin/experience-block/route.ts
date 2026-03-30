import { NextResponse } from 'next/server';

import { requireAdminRouteSession } from '@/lib/admin/guards';
import { CACHE_TAGS } from '@/lib/cache-tags';
import { revalidatePortfolioContent } from '@/lib/content/revalidate';
import { prisma } from '@/lib/prisma';
import { deleteUploadedImage } from '@/lib/storage/delete-uploaded-image';

const LINK_CHECK_CACHE_TTL_MS = 1000 * 60 * 60 * 6;
const failedLinkChecksTtlMs = 1000 * 60 * 10;
const linkCheckCache = new Map<
  string,
  { ok: boolean; expiresAt: number }
>();

function isValidHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

async function isReachableHttpUrl(value: string) {
  const cached = linkCheckCache.get(value);

  if (cached && cached.expiresAt > Date.now()) {
    return cached.ok;
  }

  const requestInit = {
    redirect: 'follow' as const,
    signal: AbortSignal.timeout(1500),
    cache: 'no-store' as const,
  };

  try {
    const response = await fetch(value, {
      ...requestInit,
      method: 'HEAD',
    });

    if (response.ok) {
      linkCheckCache.set(value, {
        ok: true,
        expiresAt: Date.now() + LINK_CHECK_CACHE_TTL_MS,
      });
      return true;
    }

    if ([403, 405].includes(response.status)) {
      const fallbackResponse = await fetch(value, {
        ...requestInit,
        method: 'GET',
      });

      const ok = fallbackResponse.ok;

      linkCheckCache.set(value, {
        ok,
        expiresAt: Date.now() + (ok ? LINK_CHECK_CACHE_TTL_MS : failedLinkChecksTtlMs),
      });

      return ok;
    }

    linkCheckCache.set(value, {
      ok: false,
      expiresAt: Date.now() + failedLinkChecksTtlMs,
    });
    return false;
  } catch {
    linkCheckCache.set(value, {
      ok: false,
      expiresAt: Date.now() + failedLinkChecksTtlMs,
    });
    return false;
  }
}

async function validateExperiencePayload(payload: {
  companyName?: string;
  iconPath?: string;
  alt?: string;
  officialLink?: string;
  description?: string;
  experienceHistory?: string;
  periods?: Array<{
    position?: string;
    startDate?: string;
  }>;
}, options?: {
  validateReachability?: boolean;
}) {
  if (!payload.companyName?.trim()) {
    return 'Company name is required.';
  }

  if (payload.iconPath?.trim() && !payload.alt?.trim()) {
    return 'Alt text is required when a logo is uploaded.';
  }

  if (
    payload.officialLink?.trim() &&
    !isValidHttpUrl(payload.officialLink.trim())
  ) {
    return 'Official link must be a valid http or https URL.';
  }

  if (
    payload.officialLink?.trim() &&
    options?.validateReachability !== false &&
    !(await isReachableHttpUrl(payload.officialLink.trim()))
  ) {
    return 'Official link must point to a reachable website.';
  }

  if ((payload.description?.trim().length ?? 0) > 140) {
    return 'Description must be 140 characters or fewer.';
  }

  if ((payload.experienceHistory?.trim().length ?? 0) > 350) {
    return 'Work experience must be 350 characters or fewer.';
  }

  if (
    payload.periods?.some(
      (period) => !period.position?.trim() || !period.startDate?.trim()
    )
  ) {
    return 'Each period must include a position and a start date.';
  }

  return null;
}

export async function POST(request: Request) {
  const session = await requireAdminRouteSession();

  if (session instanceof NextResponse) {
    return session;
  }

  try {
    const body = (await request.json()) as {
      companyName?: string;
      iconPath?: string;
      alt?: string;
      location?: string;
      description?: string;
      officialLink?: string;
      experienceHistory?: string;
      color?: string;
      periods?: Array<{
        position: string;
        startDate: string;
        endDate?: string | null;
      }>;
    };

    const validationError = await validateExperiencePayload(body, {
      validateReachability: true,
    });

    if (validationError) {
      return NextResponse.json(
        { error: validationError },
        { status: 400 }
      );
    }

    const companyName = body.companyName!.trim();

    const block = await prisma.experienceBlock.create({
      data: {
        companyName,
        iconPath: body.iconPath?.trim() || '',
        alt: body.alt?.trim() || companyName,
        location: body.location?.trim() || '',
        description: body.description?.trim() || '',
        officialLink: body.officialLink?.trim() || '',
        experienceHistory: body.experienceHistory?.trim() || '',
        color: body.color?.trim() || '#94a3b8',
        periods: body.periods?.length
          ? {
              create: body.periods.map((period, index) => ({
                position: period.position.trim(),
                startDate: new Date(period.startDate),
                endDate: period.endDate ? new Date(period.endDate) : null,
                sortOrder: index,
              })),
            }
          : undefined,
      },
      include: { periods: true },
    });

    revalidatePortfolioContent(CACHE_TAGS.profile);

    return NextResponse.json(block, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to create experience block: ${error}` },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  const session = await requireAdminRouteSession();

  if (session instanceof NextResponse) {
    return session;
  }

  try {
    const body = (await request.json()) as {
      id?: number;
      companyName?: string;
      iconPath?: string;
      alt?: string;
      location?: string;
      description?: string;
      officialLink?: string;
      experienceHistory?: string;
      color?: string;
      periods?: Array<{
        id?: number;
        position: string;
        startDate: string;
        endDate?: string | null;
      }>;
    };

    if (!body.id) {
      return NextResponse.json({ error: 'ID is required.' }, { status: 400 });
    }

    const blockId = body.id;
    const existingBlock = await prisma.experienceBlock.findUnique({
      where: { id: blockId },
      select: { officialLink: true, iconPath: true },
    });

    if (!existingBlock) {
      return NextResponse.json({ error: 'Experience block not found.' }, { status: 404 });
    }

    const nextOfficialLink = body.officialLink?.trim();
    const shouldValidateReachability =
      nextOfficialLink !== undefined &&
      nextOfficialLink !== (existingBlock.officialLink || '');

    const validationError = await validateExperiencePayload(body, {
      validateReachability: shouldValidateReachability,
    });

    if (validationError) {
      return NextResponse.json(
        { error: validationError },
        { status: 400 }
      );
    }

    const block = await prisma.$transaction(async (transaction) => {
      const updatedBlock = await transaction.experienceBlock.update({
        where: { id: blockId },
        data: {
          ...(body.companyName !== undefined && {
            companyName: body.companyName.trim(),
          }),
          ...(body.iconPath !== undefined && { iconPath: body.iconPath.trim() }),
          ...(body.alt !== undefined && { alt: body.alt.trim() }),
          ...(body.location !== undefined && { location: body.location.trim() }),
          ...(body.description !== undefined && {
            description: body.description.trim(),
          }),
          ...(body.officialLink !== undefined && {
            officialLink: body.officialLink.trim(),
          }),
          ...(body.experienceHistory !== undefined && {
            experienceHistory: body.experienceHistory.trim(),
          }),
          ...(body.color !== undefined && { color: body.color.trim() }),
        },
      });

      if (body.periods) {
        const existingPeriods = await transaction.experiencePeriod.findMany({
          where: {
            experienceBlockId: blockId,
          },
        });

        const incomingIds = body.periods
          .map((period) => period.id)
          .filter((id): id is number => Boolean(id));

        const removedIds = existingPeriods
          .filter((period) => !incomingIds.includes(period.id))
          .map((period) => period.id);

        if (removedIds.length) {
          await transaction.experiencePeriod.deleteMany({
            where: {
              id: {
                in: removedIds,
              },
            },
          });
        }

        for (const [index, period] of body.periods.entries()) {
          if (period.id) {
            await transaction.experiencePeriod.update({
              where: { id: period.id },
              data: {
                position: period.position.trim(),
                startDate: new Date(period.startDate),
                endDate: period.endDate ? new Date(period.endDate) : null,
                sortOrder: index,
              },
            });
          } else {
            await transaction.experiencePeriod.create({
              data: {
                experienceBlockId: blockId,
                position: period.position.trim(),
                startDate: new Date(period.startDate),
                endDate: period.endDate ? new Date(period.endDate) : null,
                sortOrder: index,
              },
            });
          }
        }
      }

      return transaction.experienceBlock.findUniqueOrThrow({
        where: { id: updatedBlock.id },
        include: { periods: true },
      });
    });

    if (
      body.iconPath !== undefined &&
      existingBlock.iconPath &&
      existingBlock.iconPath !== body.iconPath.trim()
    ) {
      await deleteUploadedImage(existingBlock.iconPath);
    }

    revalidatePortfolioContent(CACHE_TAGS.profile);

    return NextResponse.json(block);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to update experience block: ${error}` },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const session = await requireAdminRouteSession();

  if (session instanceof NextResponse) {
    return session;
  }

  try {
    const body = (await request.json()) as {
      id?: number;
    };

    if (!body.id) {
      return NextResponse.json({ error: 'ID is required.' }, { status: 400 });
    }

    const existingBlock = await prisma.experienceBlock.findUnique({
      where: { id: body.id },
      select: { iconPath: true },
    });

    await prisma.$transaction([
      prisma.experiencePeriod.deleteMany({
        where: { experienceBlockId: body.id },
      }),
      prisma.experienceBlock.delete({
        where: { id: body.id },
      }),
    ]);

    await deleteUploadedImage(existingBlock?.iconPath);

    revalidatePortfolioContent(CACHE_TAGS.profile);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to delete experience block: ${error}` },
      { status: 500 }
    );
  }
}
