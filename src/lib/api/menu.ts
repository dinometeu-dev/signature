'use client';

import useSWR, { mutate } from 'swr';
import { BASE_API_URL } from '@/utils/constants/api';
import { MenuType } from '@/types/api';

const fetcher = (url: string) => fetch(url).then((res) => res.json());
const BASE_URL = `${BASE_API_URL}/api/menu`;

export function useMenus() {
  const { data, error, isLoading } = useSWR<MenuType[]>(BASE_URL, fetcher);

  const createMenu = async (menu: { title: string; link: string }) => {
    await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(menu),
    });
    await mutate(BASE_URL);
  };

  const updateMenu = async (
    id: number,
    menu: Partial<{
      title: string;
      link: string;
    }>
  ) => {
    await fetch(BASE_URL, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...menu }),
    });
    await mutate(BASE_URL);
  };

  const deleteMenu = async (id: number) => {
    await fetch(`${BASE_URL}?id=${id}`, { method: 'DELETE' });
    await mutate(BASE_URL);
  };

  return {
    menus: data,
    error,
    isLoading,
    createMenu,
    updateMenu,
    deleteMenu,
  };
}
