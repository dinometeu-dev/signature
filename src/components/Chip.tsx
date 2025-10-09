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
        'border-[0.5px] border-accent bg-white/1 backdrop-blur-xs flex items-center justify-center gap-1 px-1.5 py-1 rounded-full text-xs text-black/60 cursor-default select-none'
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Chip;
