import { motion, MotionProps } from 'framer-motion';
import { ComponentProps, FC } from 'react';

import { cn } from '@/utils/functions/mergeClasses';

const Chip: FC<MotionProps & Pick<ComponentProps<'div'>, 'className'>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <motion.div
      className={cn(
        className,
        'border border-black/20  backdrop-blur-xs flex items-center justify-center gap-3 px-5 py-3 rounded-full text-2xl text-nowrap text-black cursor-default select-none'
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Chip;
