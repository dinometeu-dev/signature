import { motion } from 'framer-motion';
import React, { ComponentProps, FC } from 'react';

import { PROFILE_DESCRIPTION, PROFILE_TITLE } from '@/utils/constants/content';
import { cn } from '@/utils/functions/mergeClasses';
import BlurText from '@components/TextAnimations/BlurText';

const ProfileInfo: FC<ComponentProps<'div'>> = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        'flex flex-col gap-12 items-start justify-center relative',
        className
      )}
      {...props}
    >
      <BlurText
        text={PROFILE_TITLE}
        delay={80}
        animateBy="words"
        direction="top"
        className="font-headings tracking-wide font-medium text-black text-[40px] text-center leading-normal"
      />
      <motion.p
        className="text-2xl text-black tracking-wide mr-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {PROFILE_DESCRIPTION.map((value, index) => {
          if (index % 2 !== 0) {
            return (
              <span key={index} className="font-bold relative">
                {value}
              </span>
            );
          }
          return `${' '}${value}${' '}`;
        })}
      </motion.p>
    </div>
  );
};

export default ProfileInfo;
