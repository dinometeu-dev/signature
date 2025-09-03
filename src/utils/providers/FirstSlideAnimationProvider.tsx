'use client';

import React, { createContext, useContext, useMemo, useState } from 'react';

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
  const [firstSlideAnimation, setFirstSlideAnimation] = useState(true);

  console.log(firstSlideAnimation);

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
