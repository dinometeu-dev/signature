import type { LinkType, ApiResponse } from '@/types/api';
import { BASE_API_URL } from '@/utils/constants/api';

const BASE_URL = `${BASE_API_URL}/api/link`;

export async function getLink(): Promise<ApiResponse<LinkType[]>> {
  const res = await fetch(BASE_URL, { cache: 'no-store' });

  if (!res.ok) {
    console.error('Failed to fetch:', res.statusText);
    return { data: [], error: res.statusText };
  }

  return res.json();
}

export async function createLink(data: {
  url: string;
  workItemId: number;
  label?: string;
  imgPath?: string;
}): Promise<ApiResponse<LinkType>> {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateLink(data: {
  id: number;
  url?: string;
  label?: string;
  imgPath?: string;
  workItemId?: number;
}): Promise<ApiResponse<LinkType>> {
  const res = await fetch(BASE_URL, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteLink(
  id: number
): Promise<ApiResponse<{ message: string }>> {
  const res = await fetch(BASE_URL, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  });
  return res.json();
}
