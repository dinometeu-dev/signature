'use client';

import { HTMLMotionProps, motion } from 'framer-motion';
import React, { FC } from 'react';

import { Slide } from '@/components/Slide';
import BlurText from '@/components/TextAnimations/BlurText';
import { AirplaneButton } from '@/ui/SlideContent/SignatureSlide/components/AirplaneButton';
import { GuideWrapper } from '@/ui/SlideContent/SignatureSlide/components/Guide';
import SignatureBg from '@/ui/SlideContent/SignatureSlide/components/SignatureBg';
import SlideChangeInstruction from '@/ui/SlideContent/SignatureSlide/components/SlideChangeInstruction';
import { SUBTITLE, TITLE } from '@/utils/constants/content';
import { useFirstSlideAnimation } from '@/utils/providers/FirstSlideAnimationProvider';
import {
  AirplaneAnimation,
  SignatureBgAnimation,
  SlideAnimation,
  SubtitleAnimation,
} from '@slides/SignatureSlide/animations/signature-animations';
import OpenMenuInstruction from '@slides/SignatureSlide/components/OpenMenuInstruction';

const SignatureSlide: FC<HTMLMotionProps<'div'>> = (props) => {
  const { firstSlideAnimation, setFirstSlideAnimation } =
    useFirstSlideAnimation();

  return (
    <Slide
      className="flex items-center justify-center"
      initial={firstSlideAnimation ? SlideAnimation.initial : undefined}
      animate={firstSlideAnimation ? SlideAnimation.animate : undefined}
      onAnimationComplete={() => setFirstSlideAnimation(false)}
      {...props}
    >
      {!firstSlideAnimation && (
        <div className="flex flex-col items-center justify-between w-full h-full">
          <div className="flex flex-col items-center gap-6 text-center pt-24 z-10">
            <BlurText
              text={TITLE}
              delay={80}
              animateBy="words"
              direction="top"
              className="font-headings text-5xl font-bold text-center leading-normal"
            />
            <motion.p
              className="text-black/60 text-lg"
              initial={SubtitleAnimation.initial}
              animate={SubtitleAnimation.animate}
            >
              {SUBTITLE}
            </motion.p>
          </div>
          <AirplaneButton
            className="top-1/2 -translate-y-1/4 z-50"
            initial={AirplaneAnimation.initial}
            animate={AirplaneAnimation.animate}
            transition={AirplaneAnimation.transition}
          />

          <GuideWrapper className="z-10">
            <div className="flex flex-col  justify-center items-start w-full transition">
              <SlideChangeInstruction />
              <p className="text-sm">Use arrows or scroll to switch slides</p>
            </div>
            <div className="flex flex-col  justify-center items-end w-full transition">
              <OpenMenuInstruction />
              <p className="text-sm">Press and hold anywhere to open menu</p>
            </div>
          </GuideWrapper>
        </div>
      )}

      <div className="w-full h-full absolute z-0 overflow-hidden flex items-center justify-center rounded-slide">
        <SignatureBg
          className="absolute"
          initial={SignatureBgAnimation.initial}
          animate={SignatureBgAnimation.animate}
          transition={SignatureBgAnimation.transition}
        />
      </div>
    </Slide>
  );
};

export default SignatureSlide;
