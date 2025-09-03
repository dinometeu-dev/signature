'use client';

import {
  AnimatePresence,
  HTMLMotionProps,
  motion,
  TargetAndTransition,
  VariantLabels,
} from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import React, { FC, ReactNode, useEffect, useState } from 'react';

import { Button } from '@/components/Button';
import { cn } from '@/utils/functions/mergeClasses';

interface SlideProps extends Omit<HTMLMotionProps<'div'>, 'ref' | 'children'> {
  children: ReactNode;
  setOverlowHidden?: boolean;
  backButtonOnClick?: () => void;
  isOpen?: boolean;
  mainClassName?: string;
}

const Slide: FC<SlideProps> = ({
  children,
  setOverlowHidden,
  backButtonOnClick,
  isOpen,
  className,
  mainClassName,
  ...props
}) => {
  const [open, setOpen] = useState(isOpen);

  const openWidth = typeof window !== 'undefined' ? window.innerWidth - 200 : 0;
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
      className={cn(
        `absolute rounded-slide bg-white shadow-material w-slide-width h-slide-height z-10`,
        setOverlowHidden && 'overflow-hidden',
        open && `overflow-hidden`,
        mainClassName
      )}
      animate={animate}
      {...props}
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
          'w-full h-full relative transition-[padding] p-16',
          open && `overflow-y-scroll overflow-x-hidden pt-28 h-full`,
          isOpen && 'pt-0',
          className
        )}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

Slide.displayName = 'Slide';

export { Slide };
