import type {
  Menu as MenuPrisma,
  WorkItem as WorkItemPrisma,
  WorkItemLink as WorkItemLinkPrisma,
  Technology as TechnologyPrisma,
  ExperienceBlock as ExperienceBlockPrisma,
  ExperiencePeriod as ExperiencePeriodPrisma,
} from '@/generated/prisma';

export type MenuType = MenuPrisma & {
  content: WorkItemPrisma[];
};

export type WorkItemType = WorkItemPrisma & {
  links: WorkItemLinkPrisma[];
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

export type LinkType = WorkItemLinkPrisma;
