import { HTMLMotionProps, motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import React, { FC } from 'react';
import Markdown from 'react-markdown';

import { Slide } from '@/components/Slide';
import type { PublicExperienceItem, PublicTechnology } from '@/lib/content/types';
import { useTimeline } from '@/utils/providers/TimelineProvider';
import BlurText from '@components/BlurText';
import Loop from '@components/Loop';
import ProfileImg from '@public/ProfileImg.png';
import { ProfileDescriptionAnimation } from '@slides/ProfileSlide/animations/profile-info-animations';

const TimelineLoading = () => (
  <div className="relative flex h-[180px] w-full items-center">
    <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-black/10" />
    <div className="absolute left-0 top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/15" />

    <div className="flex w-full items-center">
      <div className="h-1 w-[24%] rounded-full bg-sky-300/50 animate-pulse" />
      <div className="relative h-16 w-[10%]">
        <div className="absolute left-1/2 top-1/2 size-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-black/10 bg-white/80 shadow-sm" />
        <div className="absolute left-1/2 top-full mt-4 h-3 w-16 -translate-x-1/2 rounded-full bg-black/8" />
      </div>
      <div className="h-1 w-[18%] rounded-full bg-rose-300/50 animate-pulse [animation-delay:120ms]" />
      <div className="relative h-16 w-[10%]">
        <div className="absolute left-1/2 top-1/2 size-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-black/10 bg-white/80 shadow-sm" />
        <div className="absolute left-1/2 top-full mt-4 h-3 w-20 -translate-x-1/2 rounded-full bg-black/8" />
      </div>
      <div className="h-1 w-[30%] rounded-full bg-fuchsia-300/50 animate-pulse [animation-delay:240ms]" />
      <div className="relative h-16 w-[8%]">
        <div className="absolute left-1/2 top-1/2 size-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-black/10 bg-white/80 shadow-sm" />
        <div className="absolute left-1/2 top-full mt-4 h-3 w-14 -translate-x-1/2 rounded-full bg-black/8" />
      </div>
    </div>

    <div className="absolute right-0 top-1/2 size-3 translate-x-1/2 -translate-y-1/2 rounded-full bg-black/15" />
  </div>
);

const Timeline = dynamic(
  () => import('@slides/ProfileSlide/components/Timeline/Timeline'),
  {
    ssr: false,
    loading: () => <TimelineLoading />,
  }
);

type ProfileSlideProps = HTMLMotionProps<'div'> & {
  title: string;
  description: string;
  technologies: PublicTechnology[];
  experience: PublicExperienceItem[];
};

const ProfileSlide: FC<ProfileSlideProps> = ({
  title,
  description,
  technologies,
  experience,
  ...props
}) => {
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
          text={title}
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
            <Markdown>{description}</Markdown>
          </motion.span>
        </motion.div>
        <div className="pr-80">
          <Timeline experience={experience} />
        </div>
        <Loop
          logos={technologies}
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
