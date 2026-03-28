import { HTMLMotionProps, motion } from 'framer-motion';
import { CircleArrowRight } from 'lucide-react';
import dynamic from 'next/dynamic';
import React, { FC, useState } from 'react';

import BlurText from '@components/BlurText';
import { Button } from '@components/Button';
import { Slide } from '@components/Slide';
import {
  MainTitleAnimations,
  RoadItemsAnimation,
} from '@slides/WorkSlide/animations/work-slide-animations';
import ContentWrapper from '@slides/WorkSlide/components/ContentWrapper';
import { WorkItemProps } from '@slides/WorkSlide/utils/types';

type WorkSlideProps = Omit<HTMLMotionProps<'div'>, keyof WorkItemProps> &
  WorkItemProps;

const Prism = dynamic(() => import('@components/PrismBg'), {
  ssr: false,
  loading: () => <div className="w-full h-full" aria-hidden="true" />,
});

const WorkSlide: FC<WorkSlideProps> = ({ title, id, details, ...props }) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const detailEntries = Object.entries(details);

  const handleActiveSection = (section: string) => {
    if (activeSection === section) {
      setActiveSection(null);
    } else {
      setActiveSection(section);
    }
  };

  return (
    <Slide {...props} id={id.toString()} setOverlowHidden>
      <div className="absolute inset-0 bg-black">
        <Prism
          animationType="3drotate"
          timeScale={0.5}
          height={3.5}
          baseWidth={5.5}
          scale={2.5}
          hueShift={0}
          colorFrequency={1}
          noise={0.2}
          glow={2}
          transparent={false}
          suspendWhenOffscreen
          maxDpr={1.25}
          maxFps={30}
          sampleCount={64}
        />
      </div>

      <motion.div
        layout
        className="relative w-full h-full text-white flex items-center justify-center"
        initial={RoadItemsAnimation.initial}
        animate={RoadItemsAnimation.animate}
        transition={RoadItemsAnimation.transition}
      >
        {detailEntries.map(([key, value], index) => (
          <ContentWrapper
            key={key}
            title={key}
            isActive={activeSection}
            hasActiveSection={Boolean(activeSection)}
            showDivider={index < detailEntries.length - 1}
            onClick={() => handleActiveSection(key)}
          >
            {value}
          </ContentWrapper>
        ))}
      </motion.div>

      <motion.div
        className="absolute z-10"
        initial={MainTitleAnimations.initial}
        animate={MainTitleAnimations.animate}
        transition={MainTitleAnimations.transition}
      >
        <BlurText
          text={title}
          delay={80}
          animateBy="words"
          direction="top"
          className="font-headings tracking-wide font-medium text-center leading-normal"
        />
      </motion.div>
    </Slide>
  );
};

export default WorkSlide;
