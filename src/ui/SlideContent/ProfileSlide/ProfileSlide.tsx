'use client';

import { HTMLMotionProps, motion } from 'framer-motion';
import React, { FC } from 'react';

import { Slide } from '@/components/Slide';
import { PROFILE_WORK_EXPERIENCE_TITLE } from '@/utils/constants/content';
import ProfileCard from '@slides/ProfileSlide/components/ProfileCard';
import ProfileInfo from '@slides/ProfileSlide/components/ProfileInfo';
import Timeline from '@slides/ProfileSlide/components/Timeline/Timeline';

const ProfileSlide: FC<HTMLMotionProps<'div'>> = (props) => {
  return (
    <Slide setOverlowHidden className="grid grid-rows-7 gap-8" {...props}>
      <div className="grid grid-cols-2 h-full items-start row-span-4">
        <ProfileInfo />
        <ProfileCard />
      </div>
      <div className="w-full h-full flex flex-col gap-10 row-span-3">
        <div className="space-y-2">
          <motion.h3
            className="font-headings text-4xl text-black font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {PROFILE_WORK_EXPERIENCE_TITLE}
          </motion.h3>
          <motion.p
            className="text-black/60"
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ delay: 0.2, duration: 1 }}
          >
            Hover the timeline to see more details about each experience.
          </motion.p>
        </div>
        <Timeline />
      </div>
    </Slide>
  );
};

export { ProfileSlide };
