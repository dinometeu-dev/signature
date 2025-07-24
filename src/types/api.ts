import type {
  Menu as MenuPrisma,
  WorkItem as WorkItemPrisma,
  Link as LinkPrisma,
  Technology as TechnologyPrisma,
} from '@/generated/prisma'

export type MenuWithContent = MenuPrisma & {
  content: WorkItemPrisma[]
}

export type WorkItem = WorkItemPrisma & {
  links: LinkPrisma[]
  menu: MenuPrisma
  technologies: TechnologyPrisma[]
}

export type ApiResponse<T> = {
  data: T | null
  error?: string
}
