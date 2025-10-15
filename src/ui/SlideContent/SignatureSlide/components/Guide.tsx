import { HTMLMotionProps, motion } from 'framer-motion';
import { FC } from 'react';

import { cn } from '@/utils/functions/mergeClasses';
import { GuideAnimations } from '@slides/SignatureSlide/animations/guide-animations';

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
      initial={GuideAnimations.initial}
      animate={GuideAnimations.animate}
      transition={GuideAnimations.transition}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export { GuideWrapper };
