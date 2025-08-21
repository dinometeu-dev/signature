'use client';

import React from 'react';
import { cn } from '@/utils/functions/mergeClasses';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/Button';
import { ChevronLeft } from 'lucide-react';
import { useGetQueryParams } from '@/utils/hooks/navigation';
import { QUERY_SLIDE_OPEN } from '@/utils/constants/routes';

interface SlideProps extends React.HTMLAttributes<HTMLDivElement> {
  setOverlowHidden?: boolean;
  backButtonOnClick?: () => void;
}

const Slide = React.forwardRef<HTMLDivElement, SlideProps>(
  ({ children, setOverlowHidden, backButtonOnClick, className }, ref) => {
    const getQueryParam = useGetQueryParams();
    const isOpen = getQueryParam(QUERY_SLIDE_OPEN);

    console.log(isOpen);

    const openWidth =
      typeof window !== 'undefined' ? window.innerWidth - 200 : 0;
    const openHeight =
      typeof window !== 'undefined' ? window.innerHeight - 20 : 0;

    return (
      <motion.div
        ref={ref}
        className={cn(
          `absolute rounded-slide bg-white shadow-material w-slide-width `,
          setOverlowHidden && 'overflow-hidden'
        )}
        initial={{
          height: 'var(--spacing-slide-height)',
        }}
        animate={{
          ...(isOpen
            ? {
                width: openWidth,
                height: openHeight,
                transition: { type: 'spring', bounce: 0.5, duration: 1 },
              }
            : {
                width: 'var(--spacing-slide-width)',
                height: 'var(--spacing-slide-height)',
                transition: { type: 'spring', bounce: 0.3, duration: 1 },
              }),
        }}
      >
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="absolute top-0 left-0 w-full bg-black-100 p-8 z-40"
              key="modal"
              exit={{ opacity: 0 }}
            >
              <div className="absolute left-0 top-0 h-full w-full progressive-backdrop-blur-reverse backdrop-blur-lg" />
              <div className="absolute left-0 top-0 h-full w-full  bg-gradient-to-b from-white to-transparent" />
              <Button
                contentClassName={'bg-white-300'}
                onClick={backButtonOnClick}
              >
                <ChevronLeft size={14} /> Back
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          className={cn(
            `w-full h-full relative transition-[padding] p-16 `,
            isOpen && 'overflow-y-scroll overflow-x-hidden pt-28',
            className
          )}
        >
          {children}
        </motion.div>
      </motion.div>
    );
  }
);

Slide.displayName = 'Slide';

export { Slide };
