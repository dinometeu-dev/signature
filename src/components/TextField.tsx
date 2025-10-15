import { motion, MotionProps } from 'framer-motion';
import { ComponentProps, FC } from 'react';

import { cn } from '@/utils/functions/mergeClasses';

interface TextFieldProps extends ComponentProps<'input'> {
  title: string;
  defaultValue?: string;
  animation?: MotionProps;
}

const TextField: FC<TextFieldProps> = ({
  className,
  title,
  animation,
  ...props
}) => {
  return (
    <motion.div
      className={cn('flex items-center gap-6', className)}
      {...animation}
    >
      <h3 className="font-headings text-6xl text-black font-medium mb-2 text-nowrap">
        {title}
      </h3>
      <input
        type="text"
        className="border-b w-full border-black/60 outline-0 p-1.5"
        {...props}
      />
    </motion.div>
  );
};

export default TextField;
