'use client';

import { AnimatePresence, motion, usePresenceData } from 'framer-motion';
import React, {
  ComponentProps,
  FC,
  useCallback,
  useEffect,
  useState,
} from 'react';

import { SCREEN_HEIGHT } from '@/utils/constants/styled';
import { cn } from '@/utils/functions/mergeClasses';
import { useFirstSlideAnimation } from '@/utils/providers/FirstSlideAnimationProvider';

type MoveDirection = 1 | -1;

const DEFAULT_SCALE = 0.9;
const EXIT_DURATION = 0.25;
const FLIP_DURATION = 0.5;
const BOUNCE = 0.25;

const AnimSlide: FC<ComponentProps<'div'>> = ({ children, ref }) => {
  const { firstSlideAnimation } = useFirstSlideAnimation();

  const direction = usePresenceData();
  const dirUp = direction > 0;

  return (
    <motion.div
      ref={ref}
      className={cn('absolute w-full h-full flex items-center justify-center')}
      initial={
        !firstSlideAnimation
          ? {
              scale: DEFAULT_SCALE,
              y: dirUp ? 0 : -SCREEN_HEIGHT,
              zIndex: dirUp ? 0 : 1,
            }
          : undefined
      }
      animate={{ scale: 1, y: 0 }}
      exit={{
        y: dirUp ? -SCREEN_HEIGHT : 0,
        scale: DEFAULT_SCALE,
        zIndex: dirUp ? 1 : 0,
        transition: {
          type: 'keyframes',
          duration: EXIT_DURATION,
        },
      }}
      transition={{
        type: 'spring',
        visualDuration: FLIP_DURATION,
        bounce: BOUNCE,
      }}
    >
      {children}
    </motion.div>
  );
};
const SlideStack: FC<ComponentProps<'div'>> = ({ children }) => {
  const { firstSlideAnimation } = useFirstSlideAnimation();

  const slides = React.Children.toArray(children) as React.ReactElement<
    React.HTMLAttributes<HTMLDivElement>
  >[];

  const [selectedItem, setSelectedItem] = useState(0);
  const [direction, setDirection] = useState<MoveDirection>(1);
  const [lastCallTime, setLastCallTime] = useState(0);

  const handleItems = useCallback(
    (increment: MoveDirection, itemsLength: number, selectedItem: number) => {
      if (increment > 0) {
        if (selectedItem + increment < itemsLength) {
          return selectedItem + increment;
        }
        return itemsLength - 1;
      } else {
        if (selectedItem + increment >= 0) {
          return selectedItem + increment;
        }
        return 0;
      }
    },
    []
  );

  const setSlide = useCallback(
    (newDirection: MoveDirection) => {
      const now = Date.now();

      if (
        !firstSlideAnimation &&
        (direction === newDirection ||
          now - lastCallTime > EXIT_DURATION * 1000)
      ) {
        const nextItem = handleItems(newDirection, slides.length, selectedItem);
        setSelectedItem(nextItem);
        setDirection(newDirection);
        setLastCallTime(now);
      }
    },
    [direction, lastCallTime, slides.length, selectedItem, firstSlideAnimation]
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        setSlide(1);
      } else if (e.key === 'ArrowDown') {
        setSlide(-1);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [setSlide]);

  return (
    <AnimatePresence custom={direction} initial={true}>
      <AnimSlide key={selectedItem}>{slides[selectedItem]}</AnimSlide>
    </AnimatePresence>
  );
};
AnimSlide.displayName = 'AnimSlide';
SlideStack.displayName = 'SlideStack';
export { SlideStack };
