'use client';

import { createContext, ReactNode, useContext, useMemo, useState } from 'react';

type TimelineContextValue = {
  segmentHover: number | null;
  setSegmentHover: (hover: number | null) => void;
};

type TimelineProviderProps = {
  children: ReactNode;
};

const TimelineContext = createContext<TimelineContextValue | undefined>(
  undefined
);

export const TimelineProvider = ({
  children,
}: Readonly<TimelineProviderProps>) => {
  const [segmentHover, setSegmentHover] = useState<number | null>(null);

  const value = useMemo<TimelineContextValue>(
    () => ({
      segmentHover,
      setSegmentHover,
    }),
    [segmentHover, setSegmentHover]
  );

  return (
    <TimelineContext.Provider value={value}>
      {children}
    </TimelineContext.Provider>
  );
};

export const useTimeline = () => {
  const ctx = useContext(TimelineContext);
  if (!ctx) {
    throw new Error('useSlide must be used within a SlideProvider');
  }
  return ctx;
};
