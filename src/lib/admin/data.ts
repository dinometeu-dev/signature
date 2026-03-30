import type {
  ExperienceBlockDto,
  ProfileContentDto,
  SignatureContentDto,
  TechnologyDto,
  WorkItemDto,
} from '@/lib/content/types';
import { getProfileContentBundle, getSignatureContentDto, getWorkItemsDto } from '@/lib/content/public';
import { prisma } from '@/lib/prisma';

export async function getAdminSignatureData(): Promise<SignatureContentDto> {
  return getSignatureContentDto();
}

export async function getAdminProfileData(): Promise<{
  profileContent: ProfileContentDto;
  experienceBlocks: ExperienceBlockDto[];
  technologies: TechnologyDto[];
}> {
  return getProfileContentBundle();
}

export async function getAdminWorksData(): Promise<WorkItemDto[]> {
  return getWorkItemsDto();
}

export async function getAdminDashboardSnapshot() {
  const [signature, profile, experienceCount, technologyCount, workCount, latestWork, latestExperience] =
    await Promise.all([
      prisma.signatureContent.findUnique({ where: { id: 1 } }),
      prisma.profileContent.findUnique({ where: { id: 1 } }),
      prisma.experienceBlock.count(),
      prisma.technology.count(),
      prisma.workItem.count(),
      prisma.workItem.findFirst({
        orderBy: { updatedAt: 'desc' },
      }),
      prisma.experienceBlock.findFirst({
        orderBy: { updatedAt: 'desc' },
      }),
    ]);

  return {
    signatureTitle: signature?.title ?? null,
    profileTitle: profile?.title ?? null,
    experienceCount,
    technologyCount,
    workCount,
    latestWorkUpdatedAt: latestWork?.updatedAt.toISOString() ?? null,
    latestExperienceUpdatedAt: latestExperience?.updatedAt.toISOString() ?? null,
  };
}
