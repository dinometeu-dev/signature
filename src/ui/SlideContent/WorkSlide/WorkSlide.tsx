import { HTMLMotionProps, motion } from 'framer-motion';
import React, { FC } from 'react';

import BlurText from '@components/BlurText';
import Prism from '@components/PrismBg';
import { Slide } from '@components/Slide';
import { MainTitleAnimations } from '@slides/WorkSlide/animations/work-slide-animations';

// const ContentWrapper: FC<ComponentProps<'div'>> = ({
//   className,
//   children,
//   ...props
// }) => {
//   return (
//     <div
//       className={cn(
//         'bg-black/20 rounded-2xl p-6 border-[0.5px] border-black/20',
//         className
//       )}
//       {...props}
//     >
//       {children}
//     </div>
//   );
// };

const WorkSlide: FC<HTMLMotionProps<'div'>> = ({ title, ...props }) => {
  return (
    <Slide {...props} setOverlowHidden>
      <div className="absolute inset-0">
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
        />
      </div>

      <motion.div className="relative w-full h-full text-white flex gap-4">
        {/*<div className="w-[60%] h-full flex flex-col gap-4">*/}
        {/*  <ContentWrapper className="h-[60%]">1</ContentWrapper>*/}
        {/*  <ContentWrapper className="h-[40%]">2</ContentWrapper>*/}
        {/*</div>*/}
        {/*<ContentWrapper className="w-[40%]">3</ContentWrapper>*/}
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
