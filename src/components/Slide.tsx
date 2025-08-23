'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@/utils/functions/mergeClasses';
import {
  AnimatePresence,
  motion,
  TargetAndTransition,
  VariantLabels,
} from 'framer-motion';
import { Button } from '@/components/Button';
import { ChevronLeft } from 'lucide-react';

interface SlideProps extends React.HTMLAttributes<HTMLDivElement> {
  setOverlowHidden?: boolean;
  backButtonOnClick?: () => void;
  isOpen?: boolean;
}

const Slide = React.forwardRef<HTMLDivElement, SlideProps>(
  (
    { children, setOverlowHidden, backButtonOnClick, isOpen, className },
    ref
  ) => {
    const [open, setOpen] = useState(isOpen);

    const openWidth =
      typeof window !== 'undefined' ? window.innerWidth - 200 : 0;
    const openHeight =
      typeof window !== 'undefined' ? window.innerHeight - 20 : 0;

    const animate: TargetAndTransition | VariantLabels = {
      width: open ? openWidth : 'var(--spacing-slide-width)',
      height: open ? openHeight : 'var(--spacing-slide-height)',
      transition: { type: 'spring', bounce: open ? 0.5 : 0.4, duration: 1 },
    };

    useEffect(() => {
      setOpen(isOpen);
    }, [isOpen]);

    return (
      <motion.div
        ref={ref}
        className={cn(
          `absolute rounded-slide bg-white shadow-material w-slide-width h-slide-height z-10`,
          setOverlowHidden && 'overflow-hidden',
          open && `overflow-hidden`
        )}
        animate={animate}
      >
        <AnimatePresence>
          {open && (
            <motion.div
              className="absolute top-0 left-0 w-full bg-black-100 p-8 z-40"
              key="modal"
              exit={{ opacity: 0 }}
            >
              <div className="absolute left-0 top-0 h-full w-full progressive-backdrop-blur-reverse backdrop-blur-lg" />
              <div className="absolute left-0 top-0 h-full w-full  bg-gradient-to-b from-white to-transparen" />
              <Button className="bg-white-300" onClick={backButtonOnClick}>
                <ChevronLeft size={14} /> Back
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          className={cn(
            open && `overflow-y-scroll overflow-x-hidden pt-28 h-full`
          )}
        >
          <div
            className={cn(
              'w-full min-h-slide-height relative transition-[padding] p-16',
              className
            )}
          >
            {children}
          </div>
        </motion.div>
      </motion.div>
    );
  }
);

Slide.displayName = 'Slide';

export { Slide };
