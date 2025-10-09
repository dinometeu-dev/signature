'use client';

import { HTMLMotionProps } from 'framer-motion';
import React, { FC } from 'react';

import { Slide } from '@/components/Slide';
import { PROFILE_WORK_EXPERIENCE_TITLE } from '@/utils/constants/content';
import ProfileCard from '@slides/ProfileSlide/components/ProfileCard';
import ProfileInfo from '@slides/ProfileSlide/components/ProfileInfo';
import Timeline from '@slides/ProfileSlide/components/Timeline';

const ProfileSlide: FC<HTMLMotionProps<'div'>> = (props) => {
  return (
    <Slide setOverlowHidden className="flex flex-col gap-20" {...props}>
      <div className="grid gap-10 grid-cols-2 items-start">
        <ProfileInfo />
        <ProfileCard />
      </div>
      <div className="w-full h-full flex flex-col gap-10">
        <h3 className="font-headings text-xl text-gray-title text-center font-light">
          {PROFILE_WORK_EXPERIENCE_TITLE}
        </h3>
        <Timeline />
      </div>
    </Slide>
  );
};

export { ProfileSlide };
