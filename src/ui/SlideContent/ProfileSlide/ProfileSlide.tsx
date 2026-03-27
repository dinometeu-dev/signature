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
import BlurText from '@components/BlurText';
import Loop from '@components/Loop';
import ProfileImg from '@public/ProfileImg.png';
import { ProfileDescriptionAnimation } from '@slides/ProfileSlide/animations/profile-info-animations';
import Timeline from '@slides/ProfileSlide/components/Timeline/Timeline';

const ProfileSlide: FC<HTMLMotionProps<'div'>> = (props) => {
  return (
    <Slide setOverlowHidden className="flex flex-col gap-10" {...props}>
      <BlurText
        text={PROFILE_TITLE}
        delay={80}
        animateBy="words"
        direction="top"
        className="font-headings tracking-wide font-medium text-[40px] text-center leading-normal"
      />
      <div className="flex w-full h-full flex-col justify-between">
        <motion.div
          className="text-2xl pr-52 tracking-wide mr-6 transition-colors text-black/90"
          initial={ProfileDescriptionAnimation.initial}
          animate={ProfileDescriptionAnimation.animate}
          transition={ProfileDescriptionAnimation.transition}
        >
          <Markdown>{PROFILE_DESCRIPTION}</Markdown>
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
          }}
          className="z-10 select-none"
          alt={'Profile Image'}
        />
      </motion.div>
    </Slide>
  );
};

export { ProfileSlide };
