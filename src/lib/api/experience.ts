import type { ApiResponse, ExperienceBlockType } from '@/types/api';
import { BASE_API_URL } from '@/utils/constants/api';

const BASE_URL = `${BASE_API_URL}/api/experience`;

export async function getExperiences(): Promise<
  ApiResponse<ExperienceBlockType[]>
> {
  const res = await fetch(BASE_URL, { cache: 'no-store' });

  if (!res.ok) {
    console.error('Failed to fetch experiences:', res.statusText);
    return { data: [], error: res.statusText };
  }

  return res.json();
}

export async function getExperienceById(
  id: number
): Promise<ApiResponse<ExperienceBlockType>> {
  const res = await fetch(`${BASE_URL}?id=${id}`, { cache: 'no-store' });

  if (!res.ok) {
    console.error(`Failed to fetch experience ${id}:`, res.statusText);
    return { data: null, error: res.statusText };
  }

  return res.json();
}

export async function createExperience(data: {
  companyName: string;
  imgPath: string;
  imageAlt: string;
  location: string;
  periods: string[];
}): Promise<ApiResponse<ExperienceBlockType>> {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  return res.json();
}

export async function updateExperience(data: {
  id: number;
  companyName: string;
  imgPath: string;
  imageAlt: string;
  location: string;
}): Promise<ApiResponse<ExperienceBlockType>> {
  const res = await fetch(BASE_URL, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  return res.json();
}

export async function deleteExperience(
  id: number
): Promise<ApiResponse<{ message: string }>> {
  const res = await fetch(BASE_URL, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  });

  return res.json();
}
