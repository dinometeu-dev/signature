'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useGetQueryParams, useSetQueryParam } from '@/utils/hooks/navigation';
import { QUERY_STATE, QUERY_WORK_ITEM } from '@/utils/constants/routes';
import { QUERY_STATE_WORKS } from '@/utils/constants/paths';

type SlideProp = {
  id: number;
  ariaLabel: string;
  propId: string;
};

type SlideStackContextValue = {
  activeAriaLabel: string;
  activePropId: string;
  activeIndex: number;
  slideStack: SlideProp[];
  querySlideId: number;

  register: (slide: SlideProp) => void;
  setActiveSlideById: (id: number) => void;
  setActiveSlideByAriaLabel: (ariaLabel: string, propId?: string) => void;
  next: () => void;
  prev: () => void;

  isActive: (id: number) => boolean;
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
  const getQueryParams = useGetQueryParams();
  const setQueryParams = useSetQueryParam();
  const activeState = getQueryParams(QUERY_STATE);
  const activeWorkItem = getQueryParams(QUERY_WORK_ITEM);

  const [slideStack, setSlideStack] = useState<SlideProp[]>([]);
  const [activeId, setActiveId] = useState<number>(0);

  const querySlideId = useMemo(() => {
    return slideStack.findIndex((slide) => {
      if (slide.ariaLabel === QUERY_STATE_WORKS) {
        return (
          activeWorkItem === slide.propId && slide.ariaLabel === activeState
        );
      }
      return slide.ariaLabel === activeState;
    });
  }, [activeState, activeWorkItem, slideStack]);

  const setActiveSlideById = useCallback((id: number) => {
    setActiveId(id);
  }, []);

  const setActiveSlideByAriaLabel = useCallback(
    (ariaLabel: string, propId?: string) => {
      const index = slideStack.findIndex(
        (slide) => slide.ariaLabel === ariaLabel
      );
      if (index !== -1) {
        setActiveId(index);
      } else if (propId) {
        const index = slideStack.findIndex((slide) => slide.propId === propId);
        if (index !== -1) {
          setActiveId(index);
        }
      }
    },
    [slideStack]
  );

  const activeIndex = useMemo(() => activeId, [activeId]);
  const activeAriaLabel = useMemo(
    () => slideStack[activeIndex]?.ariaLabel,
    [slideStack, activeIndex]
  );
  const activePropId = useMemo(
    () => slideStack[activeIndex]?.propId,
    [slideStack, activeIndex]
  );

  const register = useCallback((newSlide: SlideProp) => {
    setSlideStack((prev) => {
      if (prev.find(({ id }) => id === newSlide.id)) return prev;
      return [...prev, newSlide];
    });
  }, []);

  const next = useCallback(() => {
    setActiveId((prev) => {
      if (prev < slideStack.length - 1) {
        return prev + 1;
      }
      return prev;
    });
  }, [slideStack.length]);

  const prev = useCallback(() => {
    setActiveId((prev) => {
      if (prev - 1 < 0) {
        return 0;
      }
      return prev - 1;
    });
  }, []);

  const isActive = useCallback((id: number) => id === activeId, [activeId]);

  useEffect(() => {
    if (slideStack[activeId]?.ariaLabel === QUERY_STATE_WORKS) {
      setQueryParams({
        [QUERY_STATE]: slideStack[activeId]?.ariaLabel,
        [QUERY_WORK_ITEM]: slideStack[activeId]?.propId,
      });
    } else {
      setQueryParams({
        [QUERY_STATE]: slideStack[activeId]?.ariaLabel,
      });
    }
  }, [activeId]);

  const value = useMemo<SlideStackContextValue>(
    () => ({
      register,
      slideStack,
      activeAriaLabel,
      setActiveSlideByAriaLabel,
      activePropId,
      activeIndex,
      setActiveSlideById,
      next,
      prev,
      isActive,
      querySlideId,
    }),
    [
      register,
      slideStack,
      activeAriaLabel,
      setActiveSlideByAriaLabel,
      activePropId,
      activeIndex,
      setActiveSlideById,
      next,
      prev,
      isActive,
      querySlideId,
    ]
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
