import React, { useState } from 'react';
import { Slide } from '@/components/Slide';
import { PROFILE_TITLE } from '@/utils/constants/content';
import { ProfileCard } from '@/components/ProfileCard';
import { Button } from '@/components/Button';
import { Bubbles } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import ExperienceScore from '@/components/ui/SlideContent/ProfileSlide/components/ExperienceScore';
import OpenSlideContent from '@/components/ui/SlideContent/ProfileSlide/components/OpenSlideContent';
import {
  useAddQueryParam,
  useDeleteQueryParam,
} from '@/utils/hooks/navigation';
import { QUERY_SLIDE_OPEN } from '@/utils/constants/routes';

const ProfileSlide = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((props, ref) => {
  const addQueryParam = useAddQueryParam();
  const deleteQueryParam = useDeleteQueryParam();

  const [isOpen, setIsOpen] = useState(false);

  const handleOpenSlide = () => {
    setIsOpen(true);
    addQueryParam(QUERY_SLIDE_OPEN, 'open');
  };

  const handleCloseSlide = () => {
    setIsOpen(false);
    deleteQueryParam(QUERY_SLIDE_OPEN);
  };

  return (
    <Slide
      ref={ref}
      setOverlowHidden
      className={`flex flex-col gap-12`}
      open={isOpen}
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
      {isOpen && <OpenSlideContent />}
      <motion.div
        layout
        className={`absolute z-10 bg-[url('/WaterBg.png')] bg-cover bg-no-repeat w-full h-full  left-0 bottom-0`}
        initial={{ top: isOpen ? '57%' : '62%' }}
        animate={{ top: isOpen ? '57%' : '62%' }}
        transition={{
          type: 'spring',
          duration: 0.5,
        }}
      />
    </Slide>
  );
});

ProfileSlide.displayName = 'ProfileSlide';

export { ProfileSlide };
