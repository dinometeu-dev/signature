'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  useAddQueryParam,
  useDeleteQueryParam,
  useGetQueryParams,
} from '@/utils/hooks/navigation';
import { QUERY_SLIDE_OPEN } from '@/utils/constants/routes';

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
  const addQuery = useAddQueryParam();
  const getQuery = useGetQueryParams();
  const deleteQuery = useDeleteQueryParam();

  const slideOpen = getQuery(QUERY_SLIDE_OPEN);

  const [isOpen, setIsOpen] = useState<boolean>(Boolean(slideOpen));

  const open = useCallback(() => {
    setIsOpen(true);
    addQuery(QUERY_SLIDE_OPEN, 'true');
  }, [addQuery]);

  const close = useCallback(() => {
    setIsOpen(false);
    deleteQuery(QUERY_SLIDE_OPEN);
  }, [deleteQuery]);

  const toggle = useCallback(() => {
    setIsOpen((prev) => {
      const next = !prev;
      if (next) addQuery(QUERY_SLIDE_OPEN, 'true');
      else deleteQuery(QUERY_SLIDE_OPEN);
      return next;
    });
  }, [addQuery, deleteQuery]);

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
