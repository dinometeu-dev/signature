import type {
  Menu as MenuPrisma,
  WorkItem as WorkItemPrisma,
  WorkItemLink as WorkItemLinkPrisma,
  Technology as TechnologyPrisma,
  SocialLink as SocialLinkPrisma,
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

export type ExperienceBlockType = ExperienceBlockPrisma & {
  periods: ExperiencePeriodPrisma[];
};

export type ExperiencePeriodType = ExperiencePeriodPrisma;

export type TechnologyType = TechnologyPrisma;

export type SocialLinkType = SocialLinkPrisma;
