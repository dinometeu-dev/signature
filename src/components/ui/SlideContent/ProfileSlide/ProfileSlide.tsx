'use client';

import React from 'react';
import { Slide } from '@/components/Slide';

const ProfileSlide = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((props, ref) => {
  return (
    <Slide
      ref={ref}
      setOverlowHidden
      className={`flex flex-col gap-12`}
      {...props}
    >
      Profile
    </Slide>
  );
});

ProfileSlide.displayName = 'ProfileSlide';

export { ProfileSlide };
