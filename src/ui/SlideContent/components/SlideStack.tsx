'use client';

import {
  AnimatePresence,
  motion,
  usePresenceData,
  MotionProps,
} from 'framer-motion';
import React, {
  ComponentProps,
  FC,
  useCallback,
  useEffect,
  useState,
} from 'react';

import { QUERY_SLIDE } from '@/utils/constants/routes';
import { SCREEN_HEIGHT } from '@/utils/constants/styled';
import { cn } from '@/utils/functions/mergeClasses';
import { useSetQueryParam, useGetQueryParams } from '@/utils/hooks/navigation';
import { useFirstSlideAnimation } from '@/utils/providers/FirstSlideAnimationProvider';
import { useSlideStack } from '@/utils/providers/SlideStackProvider';

type MoveDirection = 1 | -1;

const DEFAULT_SCALE = 0.9;
const EXIT_DURATION = 0.25;
const FLIP_DURATION = 0.5;
const BOUNCE = 0.25;

const AnimSlide: FC<MotionProps> = ({ children, ...props }) => {
  const { firstSlideAnimation } = useFirstSlideAnimation();

  const direction = usePresenceData();
  const dirUp = direction > 0;

  return (
    <motion.div
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
      {...props}
    >
      {children}
    </motion.div>
  );
};

const SlideStack: FC<ComponentProps<'div'>> = ({ children }) => {
  const { firstSlideAnimation } = useFirstSlideAnimation();
  const { currentSlide, setSlideStack } = useSlideStack();

  const setQuery = useSetQueryParam();
  const getQuery = useGetQueryParams();

  const slides = React.Children.toArray(children) as React.ReactElement<
    React.HTMLAttributes<HTMLDivElement>
  >[];

  const findSlideIndexByAriaLabel = useCallback(
    (ariaLabel: string | null) => {
      return slides.findIndex(
        (slide) => slide.props['aria-label'] === ariaLabel
      );
    },
    [slides]
  );

  const [selectedItem, setSelectedItem] = useState(() => {
    const slideParam = getQuery(QUERY_SLIDE);
    const index = findSlideIndexByAriaLabel(slideParam);
    return index !== -1 ? index : 0;
  });
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
    (newDirection: MoveDirection, nextCustomSlide?: number) => {
      const now = Date.now();

      if (
        !firstSlideAnimation &&
        (direction === newDirection ||
          now - lastCallTime > EXIT_DURATION * 1000)
      ) {
        const nextItem =
          nextCustomSlide ??
          handleItems(newDirection, slides.length, selectedItem);
        setSelectedItem(nextItem);
        setDirection(newDirection);
        setLastCallTime(now);
        setSlideStack(null);

        const nextSlide = slides[nextItem];
        const ariaLabel = nextSlide.props['aria-label'];
        if (ariaLabel) {
          setQuery(QUERY_SLIDE, ariaLabel);
        }
      }
    },
    [direction, lastCallTime, slides.length, selectedItem, firstSlideAnimation]
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        setSlide(-1);
      } else if (e.key === 'ArrowDown') {
        setSlide(1);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [setSlide]);

  useEffect(() => {
    const index = findSlideIndexByAriaLabel(currentSlide);

    if (index !== -1 && index !== selectedItem) {
      const direction = index > selectedItem ? 1 : -1;
      setSlide(direction, index);
    }
  }, [currentSlide]);

  return (
    <AnimatePresence custom={direction} initial={true}>
      <AnimSlide key={selectedItem}>{slides[selectedItem]}</AnimSlide>
    </AnimatePresence>
  );
};

AnimSlide.displayName = 'AnimSlide';
SlideStack.displayName = 'SlideStack';

export { SlideStack };
