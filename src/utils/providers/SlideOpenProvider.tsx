'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from 'react';
import { QUERY_SLIDE_OPEN } from '@/utils/constants/routes';
import {
  useGetQueryParams,
  useMergeQueryParams,
  useDeleteQueryParam,
} from '@/utils/hooks/navigation';

type SlideContextValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

const SlideContext = createContext<SlideContextValue | undefined>(undefined);

export const SlideProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const mergeQuery = useMergeQueryParams();
  const getQuery = useGetQueryParams();
  const deleteQuery = useDeleteQueryParam();

  const slideOpen = getQuery(QUERY_SLIDE_OPEN);
  const isOpen = Boolean(slideOpen);

  const open = useCallback(() => {
    mergeQuery(QUERY_SLIDE_OPEN, 'true');
  }, [mergeQuery]);

  const close = useCallback(() => {
    deleteQuery(QUERY_SLIDE_OPEN);
  }, [deleteQuery]);

  const toggle = useCallback(() => {
    if (isOpen) {
      deleteQuery(QUERY_SLIDE_OPEN);
      return;
    }

    mergeQuery(QUERY_SLIDE_OPEN, 'true');
  }, [deleteQuery, isOpen, mergeQuery]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [close]);

  const value = useMemo<SlideContextValue>(
    () => ({ isOpen, open, close, toggle }),
    [isOpen, open, close, toggle]
  );

  return (
    <SlideContext.Provider value={value}>{children}</SlideContext.Provider>
  );
};

export const useSlide = (): SlideContextValue => {
  const ctx = useContext(SlideContext);
  if (!ctx) {
    throw new Error('useSlide must be used within a SlideProvider');
  }
  return ctx;
};
