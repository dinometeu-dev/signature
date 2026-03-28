import { HTMLMotionProps, motion } from 'framer-motion';
import Image from 'next/image';
import React, { FC } from 'react';
import Markdown from 'react-markdown';

import { Slide } from '@/components/Slide';
import {
  PROFILE_DESCRIPTION,
  PROFILE_TECHNOLOGY_STAK_DESCRIPTION,
  PROFILE_TITLE,
} from '@/utils/constants/content';
import { useTimeline } from '@/utils/providers/TimelineProvider';
import BlurText from '@components/BlurText';
import Loop from '@components/Loop';
import ProfileImg from '@public/ProfileImg.png';
import { ProfileDescriptionAnimation } from '@slides/ProfileSlide/animations/profile-info-animations';
import Timeline from '@slides/ProfileSlide/components/Timeline/Timeline';

const ProfileSlide: FC<HTMLMotionProps<'div'>> = (props) => {
  const { segmentHover } = useTimeline();
  const isTimelineHoverActive = segmentHover !== null;

  return (
    <Slide setOverlowHidden className="flex flex-col gap-10" {...props}>
      <motion.div
        animate={{
          filter: isTimelineHoverActive ? 'blur(6px)' : 'blur(0px)',
          color: isTimelineHoverActive
            ? 'rgba(17, 24, 39, 0.5)'
            : 'rgba(17, 24, 39, 0.95)',
          opacity: isTimelineHoverActive ? 0.8 : 1,
        }}
        transition={{
          delay: isTimelineHoverActive ? 0.4 : 0.1,
          duration: 0.3,
          ease: 'easeInOut',
        }}
      >
        <BlurText
          text={PROFILE_TITLE}
          delay={80}
          animateBy="words"
          direction="top"
          className="font-headings tracking-wide font-medium text-[40px] text-center leading-normal"
        />
      </motion.div>
      <div className="flex w-full h-full flex-col justify-between">
        <motion.div
          className="mr-6 pr-52"
          animate={{
            filter: isTimelineHoverActive ? 'blur(6px)' : 'blur(0px)',
            color: isTimelineHoverActive
              ? 'rgba(17, 24, 39, 0.5)'
              : 'rgba(0, 0, 0, 0.9)',
            opacity: isTimelineHoverActive ? 0.8 : 1,
          }}
          transition={{
            delay: isTimelineHoverActive ? 0.4 : 0.1,
            duration: 0.3,
            ease: 'easeInOut',
          }}
        >
          <motion.span
            className="text-2xl tracking-wide transition text-black/90"
            initial={ProfileDescriptionAnimation.initial}
            animate={ProfileDescriptionAnimation.animate}
            transition={ProfileDescriptionAnimation.transition}
          >
            <Markdown>{PROFILE_DESCRIPTION}</Markdown>
          </motion.span>
        </motion.div>
        <div className="pr-80">
          <Timeline />
        </div>
        <Loop
          logos={PROFILE_TECHNOLOGY_STAK_DESCRIPTION}
          speed={40}
          direction="right"
          gap={20}
          pauseOnHover
          fadeOut
          fadeOutColor="#ffffff"
          ariaLabel="Technology partners"
        />
      </div>
      <motion.div className="absolute self-end top-full -translate-y-full translate-x-[100px]">
        <Image
          src={ProfileImg}
          style={{
            width: 'auto',
            height: '100%',
            filter: 'drop-shadow(0 18px 28px rgba(-3, -3, 23, 0.25))',
          }}
          className="z-10 select-none"
          alt={'Profile Image'}
        />
      </motion.div>
    </Slide>
  );
};

export { ProfileSlide };
