import { ProfileEditor } from '@/components/admin/profile-editor';
import { getAdminProfileData } from '@/lib/admin/data';

const profileSections = ['intro', 'experience', 'technology'] as const;

type ProfileSection = (typeof profileSections)[number];

function getSingleSearchParam(
  value: string | string[] | undefined
): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function isProfileSection(value: string | undefined): value is ProfileSection {
  return profileSections.includes(value as ProfileSection);
}

export default async function AdminProfilePage({
  searchParams,
}: {
  searchParams?:
    | Promise<{ section?: string | string[] }>
    | { section?: string | string[] };
}) {
  const profile = await getAdminProfileData();
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const section = getSingleSearchParam(resolvedSearchParams?.section);
  const activeSection = isProfileSection(section)
    ? section
    : 'intro';

  return (
    <ProfileEditor
      initialProfileContent={profile.profileContent}
      initialExperienceBlocks={profile.experienceBlocks}
      initialTechnologies={profile.technologies}
      activeSection={activeSection}
    />
  );
}
