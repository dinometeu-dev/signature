'use client';

import React from 'react';

import { cn } from '@/utils/functions/mergeClasses';
import Material, { GlassSurfaceProps } from '@/components/Material';
import { motion, HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends Omit<HTMLMotionProps<'div'>, 'onDrag'> {
  children: React.ReactNode;
  contentClassName?: string;
  glass?: GlassSurfaceProps;
}

const Button = React.forwardRef<HTMLDivElement, ButtonProps>(
  ({ className, children, contentClassName, glass, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn('cursor-pointer w-fit', className)}
        whileTap={{ scale: 0.95 }}
        {...props}
      >
        <Material
          borderRadius={glass?.borderRadius ?? 28}
          width={glass?.width ?? '100%'}
          height={glass?.height ?? '100%'}
          distortionScale={glass?.distortionScale ?? -20}
          opacity={glass?.opacity ?? 0.5}
          blur={glass?.opacity ?? 20}
          displace={glass?.displace ?? 1.3}
          redOffset={glass?.redOffset ?? 0}
          greenOffset={glass?.greenOffset ?? 5}
          blueOffset={glass?.blueOffset ?? 10}
          {...glass}
        >
          <span
            className={cn(
              'flex items-center justify-center gap-3 text-base px-[22px] py-3 text-nowrap select-none transition hover:bg-white-300 font-sf-pro',
              contentClassName
            )}
          >
            {children}
          </span>
        </Material>
      </motion.div>
    );
  }
);
Button.displayName = 'Button';

export { Button };
