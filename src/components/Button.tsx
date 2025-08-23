'use client';

import React from 'react';

import { cn } from '@/utils/functions/mergeClasses';
import { motion, HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends Omit<HTMLMotionProps<'div'>, 'onDrag'> {
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLDivElement, ButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          'relative rounded-full cursor-pointer w-fit flex items-center justify-center gap-3 text-base px-[22px] py-3 text-nowrap select-none transition font-sf-pro',
          'shadow-lg inset-shadow-sm inset-shadow-white-200 bg-white-200 hover:bg-white-400 backdrop-blur-xs',
          className
        )}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.95 }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
Button.displayName = 'Button';

export { Button };
