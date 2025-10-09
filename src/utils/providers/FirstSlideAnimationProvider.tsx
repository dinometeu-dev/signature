'use client';

import React, { createContext, useContext, useMemo, useState } from 'react';

import { QUERY_SLIDE_VALUES } from '@/utils/constants/paths';
import { QUERY_SLIDE } from '@/utils/constants/routes';
import { useGetQueryParams } from '@/utils/hooks/navigation';

type FirstSlideAnimationContextValue = {
  firstSlideAnimation: boolean;
  setFirstSlideAnimation: (done: boolean) => void;
};

const FirstSlideAnimationContext = createContext<
  FirstSlideAnimationContextValue | undefined
>(undefined);

export const FirstSlideAnimationProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const getQuery = useGetQueryParams();
  const querySlide = getQuery(QUERY_SLIDE);
  const introAnim = querySlide === QUERY_SLIDE_VALUES.SIGNATURE;

  const [firstSlideAnimation, setFirstSlideAnimation] = useState(introAnim);

  const value = useMemo<FirstSlideAnimationContextValue>(
    () => ({ firstSlideAnimation, setFirstSlideAnimation }),
    [firstSlideAnimation, setFirstSlideAnimation]
  );

  return (
    <FirstSlideAnimationContext.Provider value={value}>
      {children}
    </FirstSlideAnimationContext.Provider>
  );
};

export const useFirstSlideAnimation = (): FirstSlideAnimationContextValue => {
  const ctx = useContext(FirstSlideAnimationContext);
  if (!ctx) {
    throw new Error('useSlide must be used within a SlideProvider');
  }
  return ctx;
};
