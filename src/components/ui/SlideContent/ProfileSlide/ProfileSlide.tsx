'use client';

import React from 'react';
import { Slide } from '@/components/Slide';
import { PROFILE_TITLE } from '@/utils/constants/content';
import { ProfileCard } from '@/components/ProfileCard';
import { Button } from '@/components/Button';
import { Bubbles } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import ExperienceScore from '@/components/ui/SlideContent/ProfileSlide/components/ExperienceScore';
import { useGetQueryParams } from '@/utils/hooks/navigation';
import { QUERY_STATE } from '@/utils/constants/routes';
import { Waves } from '@/components/Waves';
import { cn } from '@/utils/functions/mergeClasses';
import { QUERY_STATE_PROFILE } from '@/utils/constants/paths';
import OpenSlideContent from '@/components/ui/SlideContent/ProfileSlide/components/OpenSlideContent';
import { useSlide } from '@/utils/providers/SlideOpenProvider';

const ProfileSlide = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((props, ref) => {
  const { isOpen, close, open } = useSlide();

  const getQueryParam = useGetQueryParams();
  const currentSlide = getQueryParam(QUERY_STATE);

  return (
    <Slide
      ref={ref}
      isOpen={isOpen}
      setOverlowHidden
      className={`flex flex-col gap-12`}
      backButtonOnClick={() => close()}
      {...props}
    >
      <div className="relative flex flex-col justify-start gap-12 w-full">
        <h2 className="text-[40px] font-domine font-bold">{PROFILE_TITLE}</h2>
        <ExperienceScore />
        <ProfileCard className="z-20 absolute left-full -translate-x-full" />
      </div>
      <div className="relative z-30 w-full flex justify-center items-center">
        <AnimatePresence>
          {!isOpen && (
            <Button
              exit={{
                position: 'absolute',
                scale: 0,
                y: 20,
                transition: {
                  duration: 0.2,
                  ease: 'easeInOut',
                },
              }}
              className="text-darker-green translate-y-1/5"
              onClick={() => open()}
            >
              <Bubbles size={18} />
              Let’s dive deeper
            </Button>
          )}
        </AnimatePresence>
      </div>
      {isOpen && <OpenSlideContent />}
      {/*<SocialLinks className={'-translate-y-1/2'} />*/}
      <div
        className={cn(
          'absolute z-10 w-full left-0 bottom-0 h-[calc(100%-400px)]',
          isOpen ? 'h-[calc(100%-340px)]' : 'h-full translate-y-[50%]'
        )}
      >
        <Waves
          paused={currentSlide !== QUERY_STATE_PROFILE}
          baseEndGradient={isOpen ? '#00101e' : '#001d35'}
          offsetEnd={isOpen ? '65%' : '100%'}
        />
      </div>
    </Slide>
  );
});

ProfileSlide.displayName = 'ProfileSlide';

export { ProfileSlide };
