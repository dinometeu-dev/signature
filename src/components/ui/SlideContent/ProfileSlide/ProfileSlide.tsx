'use client';

import React from 'react';
import { Slide } from '@/components/Slide';
import { PROFILE_TITLE } from '@/utils/constants/content';
import { ProfileCard } from '@/components/ProfileCard';
import { Button } from '@/components/Button';
import { Bubbles } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import ExperienceScore from '@/components/ui/SlideContent/ProfileSlide/components/ExperienceScore';
import OpenSlideContent from '@/components/ui/SlideContent/ProfileSlide/components/OpenSlideContent';
import {
  useAddQueryParam,
  useDeleteQueryParam,
  useGetQueryParams,
} from '@/utils/hooks/navigation';
import { QUERY_SLIDE_OPEN } from '@/utils/constants/routes';
import { Waves } from '@/components/Waves';
import { cn } from '@/utils/functions/mergeClasses';

const ProfileSlide = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((props, ref) => {
  const addQueryParam = useAddQueryParam();
  const deleteQueryParam = useDeleteQueryParam();
  const getQueryParam = useGetQueryParams();
  const isOpenSlide = getQueryParam(QUERY_SLIDE_OPEN);

  const handleOpenSlide = () => {
    addQueryParam(QUERY_SLIDE_OPEN, 'open');
  };

  const handleCloseSlide = () => {
    deleteQueryParam(QUERY_SLIDE_OPEN);
  };

  return (
    <Slide
      ref={ref}
      setOverlowHidden
      className={`flex flex-col gap-12`}
      backButtonOnClick={() => handleCloseSlide()}
      {...props}
    >
      <div className="relative flex flex-col justify-start gap-12 w-full">
        <h2 className="text-[40px] font-domine font-bold">{PROFILE_TITLE}</h2>
        <ExperienceScore />
        <ProfileCard className="z-20 absolute left-full -translate-x-full" />
      </div>
      <div className="relative z-20 w-full flex justify-center items-center">
        <AnimatePresence>
          {!isOpenSlide && (
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
              glass={{ backgroundOpacity: 0.3 }}
              className="text-darker-green translate-y-1/5"
              onClick={() => handleOpenSlide()}
            >
              <Bubbles size={18} />
              Let’s dive deeper
            </Button>
          )}
        </AnimatePresence>
      </div>
      {isOpenSlide && <OpenSlideContent />}

      <div
        className={cn(
          'absolute z-10 w-full left-0 bottom-0 h-[calc(100%-400px)]',
          isOpenSlide ? 'h-[calc(100%-400px)]' : 'h-full translate-y-1/2'
        )}
      >
        <Waves
          baseEndGradient={isOpenSlide ? '#00101e' : '#001d35'}
          offsetEnd={isOpenSlide ? '65%' : '100%'}
        />
      </div>
    </Slide>
  );
});

ProfileSlide.displayName = 'ProfileSlide';

export { ProfileSlide };
