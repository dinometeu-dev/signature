'use client';

import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';

const DEFAULT_CIRCLE_DELAY = 200;
const DEFAULT_MENU_OPEN_DELAY = 1000;

type LongPressProviderProps = {
  children: React.ReactNode;
  onLongPress: () => void;
  moveThreshold?: number; // px, default 50
};

export function LongPress({
  children,
  onLongPress,
  moveThreshold = 50,
}: Readonly<LongPressProviderProps>) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const initialPosRef = useRef<{ x: number; y: number } | null>(null);
  const circleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [circlePosition, setCirclePosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent): void => {
      const computedStyle = window.getComputedStyle(e.target as Element);
      const cursor = computedStyle.cursor;
      if (cursor !== 'auto' && cursor !== 'default') {
        return;
      }

      initialPosRef.current = { x: e.clientX, y: e.clientY };
      circleTimerRef.current = setTimeout(() => {
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
  }, [moveThreshold, onLongPress, circlePosition]);

  return (
    <>
      {children}
      <AnimatePresence>
        {circlePosition && (
          <motion.div
            className="fixed pointer-events-none -translate-x-1/2 -translate-y-1/2 size-10 rounded-full bg-accent border-px border-border-secondary z-50"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5, transition: { duration: 0.1 } }}
            transition={{
              duration:
                (DEFAULT_MENU_OPEN_DELAY - DEFAULT_CIRCLE_DELAY) * 0.001,
              ease: 'easeInOut',
            }}
            style={{ left: circlePosition.x, top: circlePosition.y }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
