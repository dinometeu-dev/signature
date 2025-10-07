import { HTMLMotionProps, motion } from 'framer-motion';
import { FC } from 'react';

import { cn } from '@/utils/functions/mergeClasses';

const GuideWrapper: FC<HTMLMotionProps<'div'>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <motion.div
      className={cn(
        'w-full flex items-center justify-between text-black/40',
        className
      )}
      initial={{ opacity: 0, filter: 'blur(10px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      transition={{ delay: 0.3, duration: 0.5 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export { GuideWrapper };
