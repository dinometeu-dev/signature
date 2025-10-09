'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import { QUERY_SLIDE_VALUES } from '@/utils/constants/paths';
import { QUERY_SLIDE } from '@/utils/constants/routes';
import { useGetQueryParams } from '@/utils/hooks/navigation';

export type SlideNameType =
  | (typeof QUERY_SLIDE_VALUES)[keyof typeof QUERY_SLIDE_VALUES]
  | null;

type SlideStackContextValue = {
  setSlideStack: (slideName: SlideNameType) => void;
  currentSlide: string | null;
};

const SlideStackContext = createContext<SlideStackContextValue | undefined>(
  undefined
);

type SlideStackProviderProps = {
  children: React.ReactNode;
};

export function SlideStackProvider({
  children,
}: Readonly<SlideStackProviderProps>) {
  const getQuery = useGetQueryParams();

  const [currentSlide, setCurrentSlide] = useState<string | null>(() => {
    const slideParam = getQuery(QUERY_SLIDE);
    return slideParam || QUERY_SLIDE_VALUES.SIGNATURE;
  });

  const setSlideStack = useCallback((slideName: SlideNameType) => {
    setCurrentSlide(slideName);
  }, []);

  const value = useMemo<SlideStackContextValue>(
    () => ({
      setSlideStack,
      currentSlide,
    }),
    [setSlideStack, currentSlide]
  );

  return (
    <SlideStackContext.Provider value={value}>
      {children}
    </SlideStackContext.Provider>
  );
}

export function useSlideStack() {
  const ctx = useContext(SlideStackContext);
  if (!ctx)
    throw new Error('useSlideStack must be used within a SlideStackProvider');
  return ctx;
}
