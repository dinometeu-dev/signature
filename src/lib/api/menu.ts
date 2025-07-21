import type { MenuWithContent, ApiResponse } from '@/types/api'
import { BASE_API_URL } from '@/utils/constants/api'

const BASE_URL = `${BASE_API_URL}/api/menu`

export async function getMenu(): Promise<ApiResponse<MenuWithContent[]>> {
  const res = await fetch(BASE_URL, { cache: 'no-store' })

  if (!res.ok) {
    console.error('Failed to fetch:', res.statusText)
    return { data: [], error: res.statusText }
  }

  return res.json()
}

export async function createMenu(data: {
  title: string
  link: string
}): Promise<ApiResponse<MenuWithContent>> {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return res.json()
}

export async function updateMenu(data: {
  id: number
  title: string
  link: string
}): Promise<ApiResponse<MenuWithContent>> {
  const res = await fetch(BASE_URL, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return res.json()
}

export async function deleteMenu(
  id: number
): Promise<ApiResponse<{ message: string }>> {
  const res = await fetch(BASE_URL, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  })
  return res.json()
}
