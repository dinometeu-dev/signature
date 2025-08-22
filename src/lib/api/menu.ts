import type { MenuWithContent, ApiResponse } from '@/types/api';

const BASE_URL = `/api/menu`;

export async function getMenu(): Promise<ApiResponse<MenuWithContent[]>> {
  const res = await fetch(BASE_URL, { cache: 'no-store' });

  if (!res.ok) {
    console.error('Failed to fetch:', res.statusText);
    return { data: [], error: res.statusText };
  }

  return res.json();
}

export async function createMenu(data: {
  title: string;
  link: string;
}): Promise<ApiResponse<MenuWithContent>> {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateMenu(data: {
  id: number;
  title: string;
  link: string;
}): Promise<ApiResponse<MenuWithContent>> {
  const res = await fetch(BASE_URL, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteMenu(
  id: number
): Promise<ApiResponse<{ message: string }>> {
  const res = await fetch(BASE_URL, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  });
  return res.json();
}
