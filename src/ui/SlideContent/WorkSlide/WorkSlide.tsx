import { HTMLMotionProps, motion } from 'framer-motion';
import React, { FC } from 'react';

import { Slide } from '@components/Slide';
import BlurText from '@components/TextAnimations/BlurText';
import { MainTitleAnimations } from '@slides/WorkSlide/animations/work-slide-animations';

const WorkSlide: FC<HTMLMotionProps<'div'>> = ({ title, ...props }) => {
  return (
    <Slide {...props} className="relative flex flex-col gap-6">
      <motion.div
        className="absolute"
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
