import type {
  Menu as MenuPrisma,
  WorkItem as WorkItemPrisma,
  Link as LinkPrisma,
  Technology as TechnologyPrisma,
  ExperienceBlock as ExperienceBlockPrisma,
  ExperiencePeriod as ExperiencePeriodPrisma,
} from '@/generated/prisma';

export type MenuWithContent = MenuPrisma & {
  content: WorkItemPrisma[];
};

export type WorkItem = WorkItemPrisma & {
  links: LinkPrisma[];
  menu: MenuPrisma;
  technologies: TechnologyPrisma[];
};

export type ApiResponse<T> = {
  data: T | null;
  error?: string;
};

export type ExperienceBlockType = ExperienceBlockPrisma & {
  periods: ExperiencePeriodPrisma[];
};

export type ExperiencePeriodType = ExperiencePeriodPrisma;

export type TechnologyType = TechnologyPrisma;

export type LinkType = LinkPrisma;
