'use client';

import { AnimatePresence, motion } from 'framer-motion';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { CirclePressAnimation } from '@/ui/Menu/animations/long-press-animations';
import { useMenuPosition } from '@/utils/providers/MenuProvider';

const DEFAULT_CIRCLE_DELAY = 200;
const DEFAULT_MENU_OPEN_DELAY = 900;

type LongPressProviderProps = {
  children: React.ReactNode;
  onLongPress: () => void;
  disable: boolean;
  moveThreshold?: number; // px, default 50
};

function LongPress({
  children,
  onLongPress,
  disable = false,
  moveThreshold = 50,
}: Readonly<LongPressProviderProps>) {
  const { setCirclePosition: setContextCirclePosition } = useMenuPosition();

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const circleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initialPosRef = useRef<{ x: number; y: number } | null>(null);
  const circlePositionRef = useRef<{ x: number; y: number } | null>(null);
  const disableRef = useRef(disable);
  const moveThresholdRef = useRef(moveThreshold);
  const onLongPressRef = useRef(onLongPress);
  const setContextCirclePositionRef = useRef(setContextCirclePosition);
  const [circlePosition, setCirclePosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const syncCirclePosition = useCallback(
    (nextCirclePosition: { x: number; y: number } | null) => {
      circlePositionRef.current = nextCirclePosition;
      setCirclePosition(nextCirclePosition);
    },
    []
  );

  const clearPress = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (circleTimerRef.current) {
      clearTimeout(circleTimerRef.current);
      circleTimerRef.current = null;
    }

    initialPosRef.current = null;
    syncCirclePosition(null);
  }, [syncCirclePosition]);

  useEffect(() => {
    disableRef.current = disable;
    moveThresholdRef.current = moveThreshold;
    onLongPressRef.current = onLongPress;
    setContextCirclePositionRef.current = setContextCirclePosition;

    if (disable) {
      clearPress();
    }
  }, [clearPress, disable, moveThreshold, onLongPress, setContextCirclePosition]);

  useEffect(() => {
    const hasInteractiveCursor = (target: EventTarget | null) => {
      if (!(target instanceof Element)) {
        return false;
      }

      const cursor = window.getComputedStyle(target).cursor;

      return cursor !== 'auto' && cursor !== 'default';
    };

    const startPress = (x: number, y: number) => {
      initialPosRef.current = { x, y };

      circleTimerRef.current = setTimeout(() => {
        const nextCirclePosition = { x, y };

        setContextCirclePositionRef.current(nextCirclePosition);
        syncCirclePosition(nextCirclePosition);
      }, DEFAULT_CIRCLE_DELAY);

      timerRef.current = setTimeout(() => {
        syncCirclePosition(null);
        circleTimerRef.current = null;
        onLongPressRef.current();
      }, DEFAULT_MENU_OPEN_DELAY);
    };

    const updatePressPosition = (x: number, y: number) => {
      if (!timerRef.current || !initialPosRef.current) {
        return;
      }

      const deltaX = Math.abs(x - initialPosRef.current.x);
      const deltaY = Math.abs(y - initialPosRef.current.y);

      if (
        deltaX > moveThresholdRef.current ||
        deltaY > moveThresholdRef.current
      ) {
        clearPress();
        return;
      }

      if (circlePositionRef.current) {
        const nextCirclePosition = { x, y };

        setContextCirclePositionRef.current(nextCirclePosition);
        syncCirclePosition(nextCirclePosition);
      }
    };

    const handleMouseDown = (e: MouseEvent): void => {
      if (disableRef.current || hasInteractiveCursor(e.target)) {
        return;
      }

      clearPress();
      startPress(e.clientX, e.clientY);
    };

    const handleMouseMove = (e: MouseEvent): void => {
      updatePressPosition(e.clientX, e.clientY);
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (disableRef.current || hasInteractiveCursor(e.target)) {
        return;
      }

      const touch = e.touches[0];
      if (!touch) {
        return;
      }

      clearPress();
      startPress(touch.clientX, touch.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) {
        return;
      }

      updatePressPosition(touch.clientX, touch.clientY);
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', clearPress);
    window.addEventListener('mouseleave', clearPress);

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', clearPress);
    window.addEventListener('touchcancel', clearPress);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', clearPress);
      window.removeEventListener('mouseleave', clearPress);

      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', clearPress);
      window.removeEventListener('touchcancel', clearPress);
    };
  }, [clearPress, syncCirclePosition]);

  const circleSettings = [
    {
      size: 'size-12',
      bg: 'bg-radial from-transparent from-60% to-accent/60',
      initial: { opacity: 1, scale: 0.4 },
      animate: { opacity: 1, scale: 1 },
      delay: 0.1,
      durationFactor: 0.0006,
    },
    {
      size: 'size-16',
      bg: 'bg-radial from-transparent from-60% to-accent/40',
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 },
      delay: 0.2,
      durationFactor: 0.0006,
    },
    {
      size: 'size-6',
      bg: 'bg-accent border border-border-secondary',
      initial: { opacity: 0, scale: 0.5 },
      animate: { opacity: 1, scale: 1 },
      delay: 0,
      durationFactor: 0.0006,
    },
  ];

  return (
    <>
      {children}
      {!disable && (
        <AnimatePresence>
          {circlePosition &&
            circleSettings.map((circle, i) => (
              <motion.span
                key={i}
                className={`fixed pointer-events-none -translate-x-1/2 -translate-y-1/2 rounded-full z-50 ${circle.size} ${circle.bg}`}
                initial={circle.initial}
                animate={circle.animate}
                exit={CirclePressAnimation.exit}
                transition={{
                  duration:
                    (DEFAULT_MENU_OPEN_DELAY - DEFAULT_CIRCLE_DELAY) *
                    circle.durationFactor,
                  delay: circle.delay,
                  ...CirclePressAnimation.transition,
                }}
                style={{
                  left: circlePosition.x,
                  top: circlePosition.y,
                }}
              />
            ))}
        </AnimatePresence>
      )}
    </>
  );
}

export default LongPress;
