'use client';

import useSWR, { mutate } from 'swr';
import { BASE_API_URL } from '@/utils/constants/api';
import { ExperienceBlockType } from '@/types/api';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const BASE_URL = `${BASE_API_URL}/api/experience-block`;

export function useExperienceBlocks() {
  const { data, error, isLoading } = useSWR<ExperienceBlockType[]>(
    BASE_URL,
    fetcher
  );

  const createBlock = async (block: {
    companyName: string;
    iconPath: string;
    alt: string;
    location: string;
  }) => {
    await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(block),
    });
    await mutate(BASE_URL);
  };

  const updateBlock = async (
    id: number,
    block: Partial<{
      companyName: string;
      iconPath: string;
      alt: string;
      location: string;
    }>
  ) => {
    await fetch(BASE_URL, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...block }),
    });
    await mutate(BASE_URL);
  };

  const deleteBlock = async (id: number) => {
    await fetch(`${BASE_URL}?id=${id}`, { method: 'DELETE' });
    await mutate(BASE_URL);
  };

  return {
    blocks: data,
    error,
    isLoading,
    createBlock,
    updateBlock,
    deleteBlock,
  };
}
