'use client';

import useSWR, { mutate } from 'swr';
import { BASE_API_URL } from '@/utils/constants/api';

const fetcher = (url: string) => fetch(url).then((res) => res.json());
const BASE_URL = `${BASE_API_URL}/api/social-link`;

export function useSocialLinks() {
  const { data, error, isLoading } = useSWR(BASE_URL, fetcher);

  const createSocialLink = async (link: {
    url: string;
    imgPath: string;
    alt: string;
  }) => {
    await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(link),
    });
    await mutate(BASE_URL);
  };

  const updateSocialLink = async (
    id: number,
    link: Partial<{
      url: string;
      imgPath: string;
      alt: string;
    }>
  ) => {
    await fetch(BASE_URL, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...link }),
    });
    await mutate(BASE_URL);
  };

  const deleteSocialLink = async (id: number) => {
    await fetch(`${BASE_URL}?id=${id}`, { method: 'DELETE' });
    await mutate(BASE_URL);
  };

  return {
    socialLinks: data,
    error,
    isLoading,
    createSocialLink,
    updateSocialLink,
    deleteSocialLink,
  };
}
