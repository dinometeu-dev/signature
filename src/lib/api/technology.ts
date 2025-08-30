import type { TechnologyType, ApiResponse } from '@/types/api';
import { BASE_API_URL } from '@/utils/constants/api';

const BASE_URL = `${BASE_API_URL}/api/technology`;

export async function getTechnology(): Promise<ApiResponse<TechnologyType[]>> {
  const res = await fetch(BASE_URL, { cache: 'no-store' });

  if (!res.ok) {
    console.error('Failed to fetch:', res.statusText);
    return { data: [], error: res.statusText };
  }

  return res.json();
}

export async function createTechnology(data: {
  name: string;
  icon: string;
}): Promise<ApiResponse<TechnologyType>> {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateTechnology(data: {
  id: number;
  name: string;
  icon: string;
}): Promise<ApiResponse<TechnologyType>> {
  const res = await fetch(BASE_URL, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteTechnology(
  id: number
): Promise<ApiResponse<{ message: string }>> {
  const res = await fetch(BASE_URL, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  });
  return res.json();
}
