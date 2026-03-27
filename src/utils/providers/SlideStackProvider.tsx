'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

export type SlideNameType =
  | 'signature'
  | 'profile'
  | 'works'
  | 'contact'
  | null;

type SlideStackContextValue = {
  setSlideStack: (slideName: SlideNameType, id?: number) => void;
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
  const [currentSlide, setCurrentSlide] = useState<string | null>(null);

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
