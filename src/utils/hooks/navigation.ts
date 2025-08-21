'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export function useSetQueryParam() {
  const router = useRouter();

  return (
    updates: Record<string, string | null | undefined> | string,
    value?: string | null | undefined
  ) => {
    const params = new URLSearchParams();

    if (typeof updates === 'string') {
      if (value) {
        params.set(updates, value);
      } else {
        params.delete(updates);
      }
    } else {
      for (const [key, val] of Object.entries(updates)) {
        if (val) {
          params.set(key, val);
        } else {
          params.delete(key);
        }
      }
    }

    router.push(`?${params.toString()}`, { scroll: false });
  };
}

export function useAddQueryParam() {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    updates: Record<string, string | null | undefined> | string,
    value?: string | null | undefined
  ) => {
    const params = new URLSearchParams(searchParams.toString());

    if (typeof updates === 'string') {
      if (value) {
        params.set(updates, value);
      } else {
        params.delete(updates);
      }
    } else {
      for (const [key, val] of Object.entries(updates)) {
        if (val) {
          params.set(key, val);
        } else {
          params.delete(key);
        }
      }
    }

    router.push(`${window.location.pathname}?${params.toString()}`, {
      scroll: false,
    });
  };
}

export function useDeleteQueryParam() {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    router.push(`${window.location.pathname}?${params.toString()}`, {
      scroll: false,
    });
  };
}

export function useGetQueryParams() {
  const searchParams = useSearchParams();

  return (key: string) => {
    return searchParams.get(key);
  };
}
