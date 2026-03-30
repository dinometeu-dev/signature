import { prisma } from '@/lib/prisma';

type PeriodLike = {
  id: number;
  startDate: Date | string;
  createdAt?: Date | string;
};

type BlockLike<TPeriod extends PeriodLike> = {
  id: number;
  createdAt?: Date | string;
  periods: TPeriod[];
};

function toTimestamp(value: Date | string | undefined) {
  if (!value) {
    return 0;
  }

  return new Date(value).getTime();
}

export function sortPeriodsByDate<TPeriod extends PeriodLike>(periods: TPeriod[]) {
  return [...periods].sort((left, right) => {
    const startDifference =
      toTimestamp(left.startDate) - toTimestamp(right.startDate);

    if (startDifference !== 0) {
      return startDifference;
    }

    return toTimestamp(left.createdAt) - toTimestamp(right.createdAt);
  });
}

export function sortExperienceBlocksByTimeline<
  TPeriod extends PeriodLike,
  TBlock extends BlockLike<TPeriod>,
>(blocks: TBlock[]) {
  return [...blocks].sort((left, right) => {
    const leftPeriods = sortPeriodsByDate(left.periods);
    const rightPeriods = sortPeriodsByDate(right.periods);

    const leftStart =
      leftPeriods[0]?.startDate ?? left.createdAt ?? new Date(0).toISOString();
    const rightStart =
      rightPeriods[0]?.startDate ?? right.createdAt ?? new Date(0).toISOString();

    const startDifference = toTimestamp(leftStart) - toTimestamp(rightStart);

    if (startDifference !== 0) {
      return startDifference;
    }

    return toTimestamp(left.createdAt) - toTimestamp(right.createdAt);
  });
}

export async function syncExperienceSortOrders() {
  const blocks = await prisma.experienceBlock.findMany({
    include: {
      periods: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  const sortedBlocks = sortExperienceBlocksByTimeline(blocks);

  const updates = sortedBlocks.flatMap((block, blockIndex) => {
    const sortedPeriods = sortPeriodsByDate(block.periods);

    return [
      prisma.experienceBlock.update({
        where: { id: block.id },
        data: { sortOrder: blockIndex },
      }),
      ...sortedPeriods.map((period, periodIndex) =>
        prisma.experiencePeriod.update({
          where: { id: period.id },
          data: { sortOrder: periodIndex },
        })
      ),
    ];
  });

  if (!updates.length) {
    return;
  }

  await prisma.$transaction(updates);
}
