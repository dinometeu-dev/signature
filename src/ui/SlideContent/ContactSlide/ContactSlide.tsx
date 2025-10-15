import { HTMLMotionProps, motion } from 'framer-motion';
import { Smile } from 'lucide-react';
import React, { FC } from 'react';

import { Slide } from '@/components/Slide';
import {
  CONTACT_CARD_SUBTITLE,
  CONTACT_CARD_TITLE,
} from '@/utils/constants/content';
import BlurText from '@components/TextAnimations/BlurText';
import {
  ContactCardFormWrapperAnimation,
  ContactCardSubtitleAnimation,
  ContactFormFirstMessageAnimation,
} from '@slides/ContactSlide/animations/contact-slide-animations';
import ContactForm from '@slides/ContactSlide/components/ContactForm';

const ContactSlide: FC<HTMLMotionProps<'div'>> = (props) => {
  return (
    <Slide {...props} className="flex flex-col gap-12">
      <div className="flex flex-col gap-2 z-10">
        <BlurText
          text={CONTACT_CARD_TITLE}
          delay={80}
          animateBy="words"
          direction="top"
          className="font-headings tracking-wide font-medium text-[40px] text-center leading-normal"
        />
        <motion.p
          className="text-black/60"
          initial={ContactCardSubtitleAnimation.initial}
          animate={ContactCardSubtitleAnimation.animate}
          transition={ContactCardSubtitleAnimation.transition}
        >
          {CONTACT_CARD_SUBTITLE}
        </motion.p>
      </div>
      <motion.div
        className="relative w-full h-full flex flex-col gap-6 justify-center border border-black/10 rounded-4xl p-10"
        initial={ContactCardFormWrapperAnimation.initial}
        animate={ContactCardFormWrapperAnimation.animate}
        transition={ContactCardFormWrapperAnimation.transition}
      >
        <motion.h2
          className="font-headings text-6xl text-black font-medium mb-2 text-nowrap flex items-center gap-6"
          initial={ContactFormFirstMessageAnimation.initial}
          animate={ContactFormFirstMessageAnimation.animate}
          transition={ContactFormFirstMessageAnimation.transition}
        >
          Hello! <Smile size={80} />
        </motion.h2>
        <ContactForm />
      </motion.div>
    </Slide>
  );
};

export { ContactSlide };
