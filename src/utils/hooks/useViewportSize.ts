'use client';

import { useEffect, useState } from 'react';

export type ViewportSize = {
  width: number;
  height: number;
};

const EMPTY_VIEWPORT: ViewportSize = {
  width: 0,
  height: 0,
};

export const getViewportSize = (): ViewportSize => {
  if (typeof window === 'undefined') {
    return EMPTY_VIEWPORT;
  }

  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
};

export const useViewportSize = (): ViewportSize => {
  const [viewportSize, setViewportSize] = useState<ViewportSize>(EMPTY_VIEWPORT);

  useEffect(() => {
    const updateViewportSize = () => {
      setViewportSize(getViewportSize());
    };

    updateViewportSize();

    window.addEventListener('resize', updateViewportSize);

    return () => {
      window.removeEventListener('resize', updateViewportSize);
    };
  }, []);

  return viewportSize;
};
