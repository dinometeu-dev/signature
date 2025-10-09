import { motion } from 'framer-motion';
import React from 'react';

import { PROFILE_DESCRIPTION, PROFILE_TITLE } from '@/utils/constants/content';
import BlurText from '@components/TextAnimations/BlurText';

const ProfileInfo = () => {
  return (
    <div className="flex flex-col gap-12 items-start justify-center relative">
      <BlurText
        text={PROFILE_TITLE}
        delay={80}
        animateBy="words"
        direction="top"
        className="font-headings tracking-wide font-medium text-gray-title text-[40px] text-center leading-normal"
      />
      <motion.p
        className="text-2xl text-blue-accent tracking-wide"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {PROFILE_DESCRIPTION.map((value, index) => {
          if (index % 2 !== 0) {
            return (
              <span key={index} className="font-black">
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
