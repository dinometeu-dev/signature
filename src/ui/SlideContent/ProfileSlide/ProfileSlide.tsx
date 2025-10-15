import { HTMLMotionProps, motion } from 'framer-motion';
import React, { FC } from 'react';

import { Slide } from '@/components/Slide';
import {
  PROFILE_WORK_EXPERIENCE_SUBTITLE,
  PROFILE_WORK_EXPERIENCE_TITLE,
} from '@/utils/constants/content';
import { useTimeline } from '@/utils/providers/TimelineProvider';
import {
  SegmentHoverAnimationOff,
  SegmentHoverAnimationOn,
} from '@slides/ProfileSlide/animations/common-anitmations';
import {
  ExperienceSubTitleAnimations,
  ExperienceTitleAnimations,
} from '@slides/ProfileSlide/animations/profile-slide-animations';
import ProfileCard from '@slides/ProfileSlide/components/ProfileCard';
import ProfileInfo from '@slides/ProfileSlide/components/ProfileInfo';
import Timeline from '@slides/ProfileSlide/components/Timeline/Timeline';

const ProfileSlide: FC<HTMLMotionProps<'div'>> = (props) => {
  const { segmentHover } = useTimeline();

  return (
    <Slide setOverlowHidden className="grid grid-rows-7 gap-8" {...props}>
      <div className="grid grid-cols-2 h-full items-start row-span-4">
        <ProfileInfo />
        <ProfileCard />
      </div>
      <div className="w-full h-full flex flex-col gap-10 row-span-3">
        <motion.div
          className="space-y-2"
          animate={
            segmentHover === null
              ? SegmentHoverAnimationOff.animate
              : SegmentHoverAnimationOn.animate
          }
        >
          <motion.h3
            className="font-headings text-4xl text-black font-medium"
            initial={ExperienceTitleAnimations.initial}
            animate={ExperienceTitleAnimations.animate}
            transition={ExperienceTitleAnimations.transition}
          >
            {PROFILE_WORK_EXPERIENCE_TITLE}
          </motion.h3>
          <motion.p
            className="text-black/60"
            initial={ExperienceSubTitleAnimations.initial}
            animate={ExperienceSubTitleAnimations.animate}
            transition={ExperienceSubTitleAnimations.transition}
          >
            {PROFILE_WORK_EXPERIENCE_SUBTITLE}
          </motion.p>
        </motion.div>
        <Timeline />
      </div>
    </Slide>
  );
};

export { ProfileSlide };
