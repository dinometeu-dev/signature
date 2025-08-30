'use client';

import useSWR, { mutate } from 'swr';
import { BASE_API_URL } from '@/utils/constants/api';
import { WorkItemType } from '@/types/api';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const BASE_URL = `${BASE_API_URL}/api/workitem`;

export function useWorkItems() {
  const { data, error, isLoading } = useSWR<WorkItemType[]>(BASE_URL, fetcher);

  const createWorkItem = async (item: {
    title: string;
    description: string;
    img: string;
    menuId: number;
  }) => {
    await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    await mutate(BASE_URL);
  };

  const updateWorkItem = async (
    id: number,
    item: Partial<{
      title: string;
      description: string;
      img: string;
      menuId: number;
    }>
  ) => {
    await fetch(BASE_URL, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...item }),
    });
    await mutate(BASE_URL);
  };

  const deleteWorkItem = async (id: number) => {
    await fetch(`${BASE_URL}?id=${id}`, { method: 'DELETE' });
    await mutate(BASE_URL);
  };

  return {
    workItems: data,
    error,
    isLoading,
    createWorkItem,
    updateWorkItem,
    deleteWorkItem,
  };
}
