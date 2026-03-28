import { HTMLMotionProps, motion } from 'framer-motion';
import { FC, ReactNode } from 'react';

import { cn } from '@/utils/functions/mergeClasses';
import Magnet from '@components/Magnet';

interface TitleProps extends HTMLMotionProps<'h3'> {
  children: ReactNode;
}

const Title: FC<TitleProps> = ({ className, children, ...props }) => {
  return (
    <Magnet padding={50} magnetStrength={10} className={'cursor-pointer'}>
      <motion.h3
        className={cn(
          'inline-flex items-center justify-center text-center font-headings text-xl cursor-pointer',
          className
        )}
        {...props}
      >
        {children}
      </motion.h3>
    </Magnet>
  );
};

export default Title;
