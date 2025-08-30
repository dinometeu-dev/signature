'use client';

import useSWR, { mutate } from 'swr';
import { BASE_API_URL } from '@/utils/constants/api';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const BASE_URL = `${BASE_API_URL}/api/workitem-link`;

export function useWorkItemLinks() {
  const { data, error, isLoading } = useSWR(BASE_URL, fetcher);

  const createWorkItemLink = async (link: {
    url: string;
    label?: string;
    imgPath?: string;
    workItemId: number;
  }) => {
    await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(link),
    });
    await mutate(BASE_URL);
  };

  const updateWorkItemLink = async (
    id: number,
    link: Partial<{
      url: string;
      label?: string;
      imgPath?: string;
      workItemId: number;
    }>
  ) => {
    await fetch(BASE_URL, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...link }),
    });
    await mutate(BASE_URL);
  };

  const deleteWorkItemLink = async (id: number) => {
    await fetch(`${BASE_URL}?id=${id}`, { method: 'DELETE' });
    await mutate(BASE_URL);
  };

  return {
    workItemLinks: data,
    error,
    isLoading,
    createWorkItemLink,
    updateWorkItemLink,
    deleteWorkItemLink,
  };
}
