'use client';

import { useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

type QueryUpdates = Record<string, string | null | undefined>;

const applyQueryUpdates = (
  params: URLSearchParams,
  updates: QueryUpdates | string,
  value?: string | null | undefined
) => {
  if (typeof updates === 'string') {
    if (value) {
      params.set(updates, value);
    } else {
      params.delete(updates);
    }

    return params;
  }

  for (const [key, nextValue] of Object.entries(updates)) {
    if (nextValue) {
      params.set(key, nextValue);
    } else {
      params.delete(key);
    }
  }

  return params;
};

const buildHref = (pathname: string, params: URLSearchParams) => {
  const nextQuery = params.toString();

  return nextQuery ? `${pathname}?${nextQuery}` : pathname;
};

export function useReplaceQueryParams() {
  const router = useRouter();
  const pathname = usePathname();

  return useCallback((
    updates: QueryUpdates | string,
    value?: string | null | undefined
  ) => {
    const params = applyQueryUpdates(new URLSearchParams(), updates, value);

    router.push(buildHref(pathname, params), { scroll: false });
  }, [pathname, router]);
}

export function useMergeQueryParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return useCallback((
    updates: QueryUpdates | string,
    value?: string | null | undefined
  ) => {
    const params = applyQueryUpdates(
      new URLSearchParams(searchParams.toString()),
      updates,
      value
    );

    router.push(buildHref(pathname, params), { scroll: false });
  }, [pathname, router, searchParams]);
}

export function useDeleteQueryParam() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return useCallback((key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    router.push(buildHref(pathname, params), { scroll: false });
  }, [pathname, router, searchParams]);
}

export function useGetQueryParams() {
  const searchParams = useSearchParams();

  return useCallback((key: string) => {
    return searchParams.get(key);
  }, [searchParams]);
}

export const useSetQueryParam = useReplaceQueryParams;
export const useAddQueryParam = useMergeQueryParams;
