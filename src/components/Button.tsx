'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import React, { FC } from 'react';

import { cn } from '@/utils/functions/mergeClasses';

const Button: FC<HTMLMotionProps<'button'>> = ({
  className,
  children,
  disabled,
  ...props
}) => {
  return (
    <motion.button
      className={cn(
        'relative rounded-full cursor-pointer w-fit flex items-center justify-center gap-3 text-base px-[22px] py-3 text-nowrap select-none transition',
        'shadow-lg inset-shadow-sm inset-shadow-white-200 bg-white-200 hover:bg-white-400 backdrop-blur-xs',
        disabled && 'cursor-not-allowed shadow-sm opacity-50',
        className
      )}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      transition={{ duration: 0.05, type: 'spring', bounce: 0.5 }}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export { Button };
