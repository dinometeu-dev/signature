import { unstable_cache } from 'next/cache';

import { CACHE_TAGS } from '@/lib/cache-tags';
import { prisma } from '@/lib/prisma';
import { sortExperienceBlocksByTimeline, sortPeriodsByDate } from '@/lib/profile-timeline';

import type {
  ExperienceBlockDto,
  ExperiencePeriodDto,
  ProfileContentDto,
  PublicPortfolioContent,
  SignatureContentDto,
  TechnologyDto,
  WorkGalleryImageDto,
  WorkItemLinkDto,
  WorkItemDto,
} from '@/lib/content/types';

function serializeDate(date: Date) {
  return date.toISOString();
}

function normalizeAssetPath(path: string | null | undefined, prefix?: string) {
  if (!path) {
    return '';
  }

  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  if (path.startsWith('/')) {
    return path;
  }

  return prefix ? `${prefix}/${path}` : path;
}

function createEmptySignatureContentDto(): SignatureContentDto {
  return {
    id: 1,
    title: '',
    subtitle: '',
    createdAt: '',
    updatedAt: '',
  };
}

function createEmptyProfileContentDto(): ProfileContentDto {
  return {
    id: 1,
    title: '',
    description: '',
    createdAt: '',
    updatedAt: '',
  };
}

function toSignatureContentDto(
  content: Awaited<ReturnType<typeof prisma.signatureContent.findUnique>>
): SignatureContentDto {
  if (!content) {
    return createEmptySignatureContentDto();
  }

  return {
    id: content.id,
    title: content.title,
    subtitle: content.subtitle,
    createdAt: serializeDate(content.createdAt),
    updatedAt: serializeDate(content.updatedAt),
  };
}

function toProfileContentDto(
  content: Awaited<ReturnType<typeof prisma.profileContent.findUnique>>
): ProfileContentDto {
  if (!content) {
    return createEmptyProfileContentDto();
  }

  return {
    id: content.id,
    title: content.title,
    description: content.description,
    createdAt: serializeDate(content.createdAt),
    updatedAt: serializeDate(content.updatedAt),
  };
}

function toExperiencePeriodDto(
  period: Awaited<
    ReturnType<typeof prisma.experiencePeriod.findMany>
  >[number]
): ExperiencePeriodDto {
  return {
    id: period.id,
    position: period.position,
    startDate: serializeDate(period.startDate),
    endDate: period.endDate ? serializeDate(period.endDate) : null,
    sortOrder: period.sortOrder,
    createdAt: serializeDate(period.createdAt),
    updatedAt: serializeDate(period.updatedAt),
  };
}

function toExperienceBlockDto(
  block: Awaited<
    ReturnType<typeof prisma.experienceBlock.findMany>
  >[number] & {
    periods: Awaited<ReturnType<typeof prisma.experiencePeriod.findMany>>;
  }
): ExperienceBlockDto {
  return {
    id: block.id,
    companyName: block.companyName,
    iconPath: normalizeAssetPath(block.iconPath, '/experience-logos'),
    alt: block.alt,
    location: block.location,
    description: block.description,
    officialLink: block.officialLink,
    experienceHistory: block.experienceHistory,
    color: block.color,
    sortOrder: block.sortOrder,
    createdAt: serializeDate(block.createdAt),
    updatedAt: serializeDate(block.updatedAt),
    periods: sortPeriodsByDate(block.periods).map(toExperiencePeriodDto),
  };
}

function toTechnologyDto(
  technology: Awaited<ReturnType<typeof prisma.technology.findMany>>[number]
): TechnologyDto {
  return {
    id: technology.id,
    name: technology.name,
    iconPath: technology.iconPath,
    sortOrder: technology.sortOrder,
    createdAt: serializeDate(technology.createdAt),
    updatedAt: serializeDate(technology.updatedAt),
  };
}

function toWorkGalleryImageDto(
  image: Awaited<ReturnType<typeof prisma.workGalleryImage.findMany>>[number]
): WorkGalleryImageDto {
  return {
    id: image.id,
    imageUrl: normalizeAssetPath(image.imageUrl),
    alt: image.alt,
    sortOrder: image.sortOrder,
    workItemId: image.workItemId,
    createdAt: serializeDate(image.createdAt),
    updatedAt: serializeDate(image.updatedAt),
  };
}

function toWorkItemLinkDto(
  link: Awaited<ReturnType<typeof prisma.workItemLink.findMany>>[number]
): WorkItemLinkDto {
  return {
    id: link.id,
    url: link.url,
    label: link.label,
    iconPath: link.iconPath,
    workItemId: link.workItemId,
    createdAt: serializeDate(link.createdAt),
    updatedAt: serializeDate(link.updatedAt),
  };
}

function toWorkItemDto(
  item: Awaited<ReturnType<typeof prisma.workItem.findMany>>[number] & {
    galleryImages: Awaited<ReturnType<typeof prisma.workGalleryImage.findMany>>;
    links: Awaited<ReturnType<typeof prisma.workItemLink.findMany>>;
  }
): WorkItemDto {
  return {
    id: item.id,
    title: item.title,
    overview: item.overview,
    problem: item.problem,
    impact: item.impact,
    isArchived: item.isArchived,
    iconPath: normalizeAssetPath(item.iconPath),
    menuId: item.menuId,
    sortOrder: item.sortOrder,
    createdAt: serializeDate(item.createdAt),
    updatedAt: serializeDate(item.updatedAt),
    galleryImages: [...item.galleryImages]
      .sort((left, right) => left.sortOrder - right.sortOrder)
      .map(toWorkGalleryImageDto),
    links: [...item.links]
      .sort((left, right) => left.id - right.id)
      .map(toWorkItemLinkDto),
  };
}

const getSignatureContentCached = unstable_cache(
  async () => {
    const content = await prisma.signatureContent.findUnique({ where: { id: 1 } });
    return toSignatureContentDto(content);
  },
  ['portfolio-signature-content'],
  { tags: [CACHE_TAGS.signature] }
);

const getProfileContentCached = unstable_cache(
  async () => {
    const [profileContent, experienceBlocks, technologies] = await Promise.all([
      prisma.profileContent.findUnique({ where: { id: 1 } }),
      prisma.experienceBlock.findMany({
        include: { periods: true },
        orderBy: [{ createdAt: 'asc' }],
      }),
      prisma.technology.findMany({
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
      }),
    ]);

    return {
      profileContent: toProfileContentDto(profileContent),
      experienceBlocks: sortExperienceBlocksByTimeline(experienceBlocks).map(
        (block) =>
          toExperienceBlockDto({
            ...block,
            periods: sortPeriodsByDate(block.periods),
          })
      ),
      technologies: technologies.map(toTechnologyDto),
    };
  },
  ['portfolio-profile-content'],
  { tags: [CACHE_TAGS.profile] }
);

const getWorksContentCached = unstable_cache(
  async () => {
    const items = await prisma.workItem.findMany({
      include: { galleryImages: true, links: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    });

    return items.map((item) => toWorkItemDto(item));
  },
  ['portfolio-work-items'],
  { tags: [CACHE_TAGS.works] }
);

export async function getSignatureContentDto() {
  return getSignatureContentCached();
}

export async function getProfileContentBundle() {
  return getProfileContentCached();
}

export async function getWorkItemsDto() {
  return getWorksContentCached();
}

export async function getPublicWorkItemsDto() {
  const items = await getWorksContentCached();
  return items.filter((item) => !item.isArchived);
}

export async function getPublicPortfolioContent(): Promise<PublicPortfolioContent> {
  const [signature, profileBundle, works] = await Promise.all([
    getSignatureContentDto(),
    getProfileContentBundle(),
    getPublicWorkItemsDto(),
  ]);

  const experience = profileBundle.experienceBlocks.flatMap((block) =>
    block.periods.map((period) => ({
      id: period.id,
      title: period.position,
      company: {
        title: block.companyName || null,
        logoPath: block.iconPath || null,
        officialLink: block.officialLink || null,
        description: block.description || null,
        experienceHistory: block.experienceHistory || null,
      },
      color: block.color || null,
      startDate: period.startDate,
      endDate: period.endDate,
    }))
  );

  return {
    signature: {
      title: signature.title,
      subtitle: signature.subtitle,
    },
    profile: {
      title: profileBundle.profileContent.title,
      description: profileBundle.profileContent.description,
      technologies: profileBundle.technologies.map((technology) => ({
        id: technology.id,
        title: technology.name,
        iconPath: technology.iconPath,
      })),
      experience,
    },
    works: works.map((item) => ({
      id: item.id,
      title: item.title,
      details: {
        overview: item.overview,
        problem: item.problem,
        impact: item.impact,
        gallery: item.galleryImages.map((image) => ({
          id: image.id,
          imageUrl: image.imageUrl,
          alt: image.alt,
        })),
        links: item.links.map((link) => ({
          id: link.id,
          url: link.url,
          label: link.label || 'Link',
          iconPath: link.iconPath || null,
        })),
      },
    })),
  };
}
