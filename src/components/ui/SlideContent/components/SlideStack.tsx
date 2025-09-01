'use client';

import React, { useEffect } from 'react';
import { AnimatePresence, HTMLMotionProps, motion } from 'framer-motion';
import { cn } from '@/utils/functions/mergeClasses';
import { SCREEN_HEIGHT } from '@/utils/constants/styled';
import { useSlideStack } from '@/utils/providers/SlideStackProvider';

export interface SlideStackProps extends Omit<HTMLMotionProps<'div'>, 'ref'> {
  children: React.ReactNode;
}

const OFFSET_Y = 55;
const SCALE_STEP = 0.1;
const FLIP_DURATION = 0.5;
const BOUNCE = 0.25;

const SlideStack = React.forwardRef<HTMLDivElement, SlideStackProps>(
  ({ className, children, ...props }, ref) => {
    const { register, next, prev, activeIndex } = useSlideStack();

    const slides = React.Children.toArray(children) as React.ReactElement<
      React.HTMLAttributes<HTMLDivElement>
    >[];

    useEffect(() => {
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowUp') {
          next();
        } else if (e.key === 'ArrowDown') {
          prev();
        }
      };
      window.addEventListener('keydown', onKeyDown);
      return () => window.removeEventListener('keydown', onKeyDown);
    }, [prev, next]);

    useEffect(() => {
      slides.forEach(({ props }, index) => {
        register({
          id: index,
          ariaLabel: props['aria-label'] ?? '',
          propId: props['id'] ?? '',
        });
      });
    }, [slides.length]);

    return (
      <AnimatePresence>
        {slides.map((child, index) => {
          let yOffset = (index - activeIndex) * OFFSET_Y;
          const scale = 1 - Math.abs(index - activeIndex) * SCALE_STEP;
          const zIndex = slides.length - (index - activeIndex);

          if (index - activeIndex < 0) {
            yOffset = -SCREEN_HEIGHT;
          } else if (Math.abs(index - activeIndex) > 2) {
            return null;
          }

          return (
            <motion.div
              layout
              ref={ref}
              key={`${child.props['aria-label']}${index}`}
              className={cn(
                'absolute w-full flex justify-center items-center',
                className
              )}
              aria-label={child.props['aria-label']}
              id={child.props['id']}
              style={{ zIndex }}
              initial={{ y: yOffset, scale }}
              animate={{ y: yOffset, scale }}
              exit={{ y: yOffset - OFFSET_Y, zIndex: zIndex - 1 }}
              transition={{
                type: 'spring',
                visualDuration: FLIP_DURATION,
                bounce: BOUNCE,
              }}
              {...props}
            >
              {child}
            </motion.div>
          );
        })}
      </AnimatePresence>
    );
  }
);

SlideStack.displayName = 'SlideStack';
export { SlideStack };
