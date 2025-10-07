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
import OpenMenuInstruction from '@slides/SignatureSlide/components/OpenMenuInstruction';

const SignatureSlide: FC<HTMLMotionProps<'div'>> = (props) => {
  const { firstSlideAnimation, setFirstSlideAnimation } =
    useFirstSlideAnimation();

  return (
    <Slide
      className="flex items-center justify-center"
      setOverlowHidden
      initial={
        firstSlideAnimation
          ? {
              width: '100%',
              height: '100%',
              scale: 1.1,
            }
          : undefined
      }
      animate={
        firstSlideAnimation
          ? {
              width: 'var(--spacing-slide-width)',
              height: 'var(--spacing-slide-height)',
              scale: 1,
              transition: {
                delay: 2,
                duration: 1.3,
                bounce: 0.5,
                type: 'spring',
              },
            }
          : undefined
      }
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
              className="text-black/60"
              initial={{
                opacity: 0,
                translateY: '-50%',
                filter: 'blur(10px)',
              }}
              animate={{
                opacity: 1,
                translateY: 0,
                filter: 'blur(0px)',
                transition: { delay: 0.2, duration: 0.5 },
              }}
            >
              {SUBTITLE}
            </motion.p>
          </div>
          <AirplaneButton
            className="top-1/2 -translate-y-1/4 z-50"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{ delay: 0.3, duration: 0.5 }}
          />
          <GuideWrapper className="z-10">
            <div className="flex justify-center items-center w-full">
              <SlideChangeInstruction />
            </div>
            <p className="w-full text-center">Quick guide</p>
            <div className="flex items-center justify-center w-full">
              <OpenMenuInstruction />
            </div>
          </GuideWrapper>
        </div>
      )}

      <SignatureBg
        className="absolute"
        initial={{ scale: 1.2 }}
        animate={{ scale: 1.2 }}
        transition={{ delay: 3, duration: 0.3 }}
      />
    </Slide>
  );
};

export default SignatureSlide;
