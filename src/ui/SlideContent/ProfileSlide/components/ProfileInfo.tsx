'use client';

import { motion, MotionProps } from 'framer-motion';
import React, { FC } from 'react';

import { PROFILE_DESCRIPTION, PROFILE_TITLE } from '@/utils/constants/content';
import { cn } from '@/utils/functions/mergeClasses';
import { useTimeline } from '@/utils/providers/TimelineProvider';
import BlurText from '@components/TextAnimations/BlurText';
import {
  SegmentHoverAnimationOff,
  SegmentHoverAnimationOn,
} from '@slides/ProfileSlide/animations/common-anitmations';
import { ProfileDescriptionAnimation } from '@slides/ProfileSlide/animations/profile-info-animations';

const ProfileInfo: FC<MotionProps & { className?: string }> = ({
  className,
  ...props
}) => {
  const { segmentHover } = useTimeline();

  return (
    <motion.div
      className={cn(
        'flex flex-col gap-12 items-start justify-center relative',
        className
      )}
      animate={
        segmentHover === null
          ? SegmentHoverAnimationOff.animate
          : SegmentHoverAnimationOn.animate
      }
      {...props}
    >
      <BlurText
        text={PROFILE_TITLE}
        delay={80}
        animateBy="words"
        direction="top"
        className="font-headings tracking-wide font-medium text-[40px] text-center leading-normal"
      />
      <motion.p
        className="text-2xl tracking-wide mr-6 transition-colors"
        initial={ProfileDescriptionAnimation.initial}
        animate={ProfileDescriptionAnimation.animate}
        transition={ProfileDescriptionAnimation.transition}
      >
        {PROFILE_DESCRIPTION.map((value, index) => {
          if (index % 2 !== 0) {
            return (
              <span key={index} className="font-bold relative">
                {value}
              </span>
            );
          }
          return `${' '}${value}${' '}`;
        })}
      </motion.p>
    </motion.div>
  );
};

export default ProfileInfo;
