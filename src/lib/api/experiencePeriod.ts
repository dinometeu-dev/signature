'use client';

import useSWR, { mutate } from 'swr';
import { BASE_API_URL } from '@/utils/constants/api';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const BASE_URL = `${BASE_API_URL}/api/experience-period`;

export function useExperiencePeriods() {
  const { data, error, isLoading } = useSWR(BASE_URL, fetcher);

  const createPeriod = async (period: {
    position: string;
    startDate: string;
    endDate?: string;
    experienceBlockId: number;
  }) => {
    await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(period),
    });
    await mutate(BASE_URL);
  };

  const updatePeriod = async (
    id: number,
    period: Partial<{
      position: string;
      startDate: string;
      endDate?: string;
      experienceBlockId: number;
    }>
  ) => {
    await fetch(BASE_URL, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...period }),
    });
    await mutate(BASE_URL);
  };

  const deletePeriod = async (id: number) => {
    await fetch(`${BASE_URL}?id=${id}`, { method: 'DELETE' });
    await mutate(BASE_URL);
  };

  return {
    periods: data,
    error,
    isLoading,
    createPeriod,
    updatePeriod,
    deletePeriod,
  };
}
