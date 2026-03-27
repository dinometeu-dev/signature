import { HTMLMotionProps, motion } from 'framer-motion';
import { CircleArrowRight } from 'lucide-react';
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

const WorkSlide: FC<WorkSlideProps> = ({ title, id, details, ...props }) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

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
        {/*<Prism*/}
        {/*  animationType="3drotate"*/}
        {/*  timeScale={0.5}*/}
        {/*  height={3.5}*/}
        {/*  baseWidth={5.5}*/}
        {/*  scale={2.5}*/}
        {/*  hueShift={0}*/}
        {/*  colorFrequency={1}*/}
        {/*  noise={0.2}*/}
        {/*  glow={2}*/}
        {/*  transparent={false}*/}
        {/*/>*/}
      </div>

      <motion.div
        className="relative w-full h-full text-white flex items-center justify-center"
        initial={RoadItemsAnimation.initial}
        animate={RoadItemsAnimation.animate}
        transition={RoadItemsAnimation.transition}
      >
        {Object.entries(details).map(([key, value]) => (
          <ContentWrapper
            key={key}
            title={key}
            isActive={activeSection}
            onClick={() => handleActiveSection(key)}
          >
            {value}
          </ContentWrapper>
        ))}
        <Button className="px-4 py-2 text-sm gap-2">
          Next Project <CircleArrowRight size={18} className="rotate-90" />
        </Button>
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
