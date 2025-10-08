'use client';

import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';

import { useMenuProvider } from '@/utils/providers/MenuProvider';

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
  const { setCirclePosition: setContextCirclePosition } = useMenuProvider();

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const initialPosRef = useRef<{ x: number; y: number } | null>(null);
  const circleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [circlePosition, setCirclePosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  useEffect(() => {
    if (disable) return;

    const handleMouseDown = (e: MouseEvent): void => {
      const computedStyle = window.getComputedStyle(e.target as Element);
      const cursor = computedStyle.cursor;
      if (cursor !== 'auto' && cursor !== 'default') {
        return;
      }

      initialPosRef.current = { x: e.clientX, y: e.clientY };
      circleTimerRef.current = setTimeout(() => {
        setContextCirclePosition({ x: e.clientX, y: e.clientY });
        setCirclePosition({ x: e.clientX, y: e.clientY });
      }, DEFAULT_CIRCLE_DELAY);
      timerRef.current = setTimeout(() => {
        setCirclePosition(null);
        circleTimerRef.current = null;
        onLongPress();
      }, DEFAULT_MENU_OPEN_DELAY);
    };

    const handleMouseMove = (e: MouseEvent): void => {
      if (timerRef.current && initialPosRef.current) {
        const deltaX = Math.abs(e.clientX - initialPosRef.current.x);
        const deltaY = Math.abs(e.clientY - initialPosRef.current.y);

        if (deltaX <= moveThreshold && deltaY <= moveThreshold) {
          if (circlePosition) {
            setContextCirclePosition({ x: e.clientX, y: e.clientY });
            setCirclePosition({ x: e.clientX, y: e.clientY });
          }
        } else {
          if (circleTimerRef.current) {
            clearTimeout(circleTimerRef.current);
            circleTimerRef.current = null;
          }
          clearTimeout(timerRef.current);
          timerRef.current = null;
          initialPosRef.current = null;
          setCirclePosition(null);
        }
      }
    };

    const clearMouseTimer = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
        if (circleTimerRef.current) {
          clearTimeout(circleTimerRef.current);
          circleTimerRef.current = null;
        }
        initialPosRef.current = null;
        setCirclePosition(null);
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      const target = e.target as Element;
      const computedStyle = window.getComputedStyle(target);
      const cursor = computedStyle.cursor;
      if (cursor !== 'auto' && cursor !== 'default') {
        return;
      }

      initialPosRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
      circleTimerRef.current = setTimeout(() => {
        setContextCirclePosition({
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        });
        setCirclePosition({
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        });
      }, DEFAULT_CIRCLE_DELAY);
      timerRef.current = setTimeout(() => {
        setCirclePosition(null);
        circleTimerRef.current = null;
        onLongPress();
      }, DEFAULT_MENU_OPEN_DELAY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (timerRef.current && initialPosRef.current) {
        const deltaX = Math.abs(e.touches[0].clientX - initialPosRef.current.x);
        const deltaY = Math.abs(e.touches[0].clientY - initialPosRef.current.y);

        if (deltaX <= moveThreshold && deltaY <= moveThreshold) {
          if (circlePosition) {
            setContextCirclePosition({
              x: e.touches[0].clientX,
              y: e.touches[0].clientY,
            });
            setCirclePosition({
              x: e.touches[0].clientX,
              y: e.touches[0].clientY,
            });
          }
        } else {
          if (circleTimerRef.current) {
            clearTimeout(circleTimerRef.current);
            circleTimerRef.current = null;
          }
          clearTimeout(timerRef.current);
          timerRef.current = null;
          initialPosRef.current = null;
          setCirclePosition(null);
        }
      }
    };

    const clearTouchTimer = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
        if (circleTimerRef.current) {
          clearTimeout(circleTimerRef.current);
          circleTimerRef.current = null;
        }
        initialPosRef.current = null;
        setCirclePosition(null);
      }
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', clearMouseTimer);
    window.addEventListener('mouseleave', clearMouseTimer);

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', clearTouchTimer);
    window.addEventListener('touchcancel', clearTouchTimer);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', clearMouseTimer);
      window.removeEventListener('mouseleave', clearMouseTimer);

      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', clearTouchTimer);
      window.removeEventListener('touchcancel', clearTouchTimer);
    };
  }, [moveThreshold, onLongPress, circlePosition, disable]);

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
                exit={{
                  opacity: 0,
                  scale: 1.5,
                  transition: { duration: 0.1 },
                }}
                transition={{
                  duration:
                    (DEFAULT_MENU_OPEN_DELAY - DEFAULT_CIRCLE_DELAY) *
                    circle.durationFactor,
                  ease: 'easeInOut',
                  delay: circle.delay,
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
