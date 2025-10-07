import { HTMLMotionProps } from 'framer-motion';
import React, { FC } from 'react';

import { Slide } from '@/components/Slide';

const ContactSlide: FC<HTMLMotionProps<'div'>> = (props) => {
  return <Slide {...props}>Contact Slide</Slide>;
};

export { ContactSlide };
