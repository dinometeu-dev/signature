export type SignatureContentDto = {
  id: number;
  title: string;
  subtitle: string;
  createdAt: string;
  updatedAt: string;
};

export type ProfileContentDto = {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export type ExperiencePeriodDto = {
  id: number;
  position: string;
  startDate: string;
  endDate: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type ExperienceBlockDto = {
  id: number;
  companyName: string;
  iconPath: string;
  alt: string;
  location: string;
  description: string;
  officialLink: string;
  experienceHistory: string;
  color: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  periods: ExperiencePeriodDto[];
};

export type TechnologyDto = {
  id: number;
  name: string;
  iconPath: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type WorkGalleryImageDto = {
  id: number;
  imageUrl: string;
  alt: string;
  sortOrder: number;
  workItemId: number;
  createdAt: string;
  updatedAt: string;
};

export type WorkItemLinkDto = {
  id: number;
  url: string;
  label: string | null;
  iconPath: string | null;
  workItemId: number;
  createdAt: string;
  updatedAt: string;
};

export type WorkItemDto = {
  id: number;
  title: string;
  overview: string;
  problem: string;
  impact: string;
  isArchived: boolean;
  iconPath: string;
  menuId: number;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  galleryImages: WorkGalleryImageDto[];
  links: WorkItemLinkDto[];
};

export type PublicTechnology = {
  id: number;
  title: string;
  iconPath: string;
};

export type PublicExperienceItem = {
  id: number;
  title: string;
  company: {
    title: string | null;
    logoPath: string | null;
    officialLink: string | null;
    description: string | null;
    experienceHistory: string | null;
  };
  color: string | null;
  startDate: string | null;
  endDate: string | null;
};

export type PublicWorkGalleryImage = {
  id: number;
  imageUrl: string;
  alt: string;
};

export type PublicWorkLink = {
  id: number;
  url: string;
  label: string;
  iconPath: string | null;
};

export type PublicWorkItem = {
  id: number;
  title: string;
  details: {
    overview: string;
    problem: string;
    impact: string;
    gallery: PublicWorkGalleryImage[];
    links: PublicWorkLink[];
  };
};

export type PublicPortfolioContent = {
  signature: {
    title: string;
    subtitle: string;
  };
  profile: {
    title: string;
    description: string;
    technologies: PublicTechnology[];
    experience: PublicExperienceItem[];
  };
  works: PublicWorkItem[];
};
