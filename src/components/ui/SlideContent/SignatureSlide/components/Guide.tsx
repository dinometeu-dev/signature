import { HTMLMotionProps, motion } from 'framer-motion';
import { FC } from 'react';

const GuideWrapper: FC<HTMLMotionProps<'div'>> = ({ children, ...props }) => {
  return (
    <motion.div
      className="w-full flex items-center justify-between text-black/40"
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
