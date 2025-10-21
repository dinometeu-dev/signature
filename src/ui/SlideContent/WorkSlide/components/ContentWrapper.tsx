import { HTMLMotionProps, motion } from 'framer-motion';
import React, { FC, ReactNode } from 'react';

import { cn } from '@/utils/functions/mergeClasses';
import {
  ContentAnimations,
  TitleAnimations,
} from '@slides/WorkSlide/animations/content-wrapper-animations';
import Title from '@slides/WorkSlide/components/Title';

interface ContentWrapperProps
  extends Omit<HTMLMotionProps<'div'>, 'title' | 'children'> {
  title: string;
  children?: ReactNode;
  isActive: string | null;
}

const ContentWrapper: FC<ContentWrapperProps> = ({
  className,
  children,
  title,
  onClick,
  isActive,
  ...props
}) => {
  const currentIsActive = isActive === title;

  return (
    <motion.div
      className={cn('flex items-center justify-center', className)}
      animate={{
        width: `${currentIsActive ? '100%' : 'fit-content'}`,
      }}
    >
      <motion.div className="flex relative items-center gap-10" {...props}>
        <Title
          animate={{
            fontSize: currentIsActive ? '80px' : '20px',
          }}
          onClick={onClick}
          whileHover={TitleAnimations.whileHover}
        >
          {title.charAt(0).toUpperCase() + title.slice(1)}
        </Title>

        {currentIsActive && (
          <motion.div
            className="text-black"
            initial={ContentAnimations.initial}
            animate={ContentAnimations.animate}
            transition={ContentAnimations.transition}
          >
            {children}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ContentWrapper;
