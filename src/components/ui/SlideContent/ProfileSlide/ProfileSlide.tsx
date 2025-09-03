'use client';

import { HTMLMotionProps } from 'framer-motion';
import React, { FC } from 'react';

import { Slide } from '@/components/Slide';

const ProfileSlide: FC<HTMLMotionProps<'div'>> = (props) => {
  return (
    <Slide setOverlowHidden className={`flex flex-col gap-12`} {...props}>
      Profile
    </Slide>
  );
};

export { ProfileSlide };
