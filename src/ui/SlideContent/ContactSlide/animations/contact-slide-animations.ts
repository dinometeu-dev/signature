import { AnimationType } from '@/types/animation';
import {
  DEFAULT_CONTENT_APPEAR_DELAY,
  DEFAULT_CONTENT_APPEAR_DURATION,
  DEFAULT_CONTENT_FILTER_BLUR_OFF,
  DEFAULT_CONTENT_FILTER_BLUR_ON,
} from '@/utils/constants/global-settings';

export const ContactCardSubtitleAnimation: AnimationType = {
  initial: { opacity: 0, filter: DEFAULT_CONTENT_FILTER_BLUR_ON },
  animate: { opacity: 1, filter: DEFAULT_CONTENT_FILTER_BLUR_OFF },
  transition: {
    duration: DEFAULT_CONTENT_APPEAR_DURATION,
    delay: DEFAULT_CONTENT_APPEAR_DELAY * 1.5,
  },
};

export const ContactCardFormWrapperAnimation: AnimationType = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: {
    duration: DEFAULT_CONTENT_APPEAR_DURATION,
    delay: DEFAULT_CONTENT_APPEAR_DELAY * 2,
  },
};

export const ContactFormFirstMessageAnimation: AnimationType = {
  initial: { opacity: 0, filter: DEFAULT_CONTENT_FILTER_BLUR_ON },
  animate: { opacity: 1, filter: DEFAULT_CONTENT_FILTER_BLUR_OFF },
  transition: {
    duration: DEFAULT_CONTENT_APPEAR_DURATION,
    delay: DEFAULT_CONTENT_APPEAR_DELAY * 2.5,
  },
};
