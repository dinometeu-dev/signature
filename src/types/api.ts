import { Menu, WorkItem } from '@/generated/prisma'

export type MenuWithContent = Menu & {
  content: WorkItem[]
}

export type ApiResponse<T> = {
  data: T
  error?: string
}
