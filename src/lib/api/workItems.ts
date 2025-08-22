import type { ApiResponse, WorkItem } from '@/types/api';
import { BASE_API_URL } from '@/utils/constants/api';

const BASE_URL = `${BASE_API_URL}/api/workItems`;

export async function getWorkItems(): Promise<ApiResponse<WorkItem[]>> {
  const res = await fetch(BASE_URL, { cache: 'no-store' });

  if (!res.ok) {
    console.error('Failed to fetch work items:', res.statusText);
    return { data: [], error: res.statusText };
  }

  return res.json();
}

export async function getWorkItemById(
  id: number
): Promise<ApiResponse<WorkItem>> {
  const res = await fetch(`${BASE_URL}?id=${id}`, { cache: 'no-store' });

  if (!res.ok) {
    console.error(`Failed to fetch work item ${id}:`, res.statusText);
    return { data: null, error: res.statusText };
  }

  return res.json();
}

export async function createWorkItem(data: {
  title: string;
  link: string;
  menuId: number;
}): Promise<ApiResponse<WorkItem>> {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  return res.json();
}

export async function updateWorkItem(data: {
  id: number;
  title: string;
  link: string;
}): Promise<ApiResponse<WorkItem>> {
  const res = await fetch(BASE_URL, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  return res.json();
}

export async function deleteWorkItem(
  id: number
): Promise<ApiResponse<{ message: string }>> {
  const res = await fetch(BASE_URL, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  });

  return res.json();
}
