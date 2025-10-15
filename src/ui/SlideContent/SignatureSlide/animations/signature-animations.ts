import { AnimationType } from '@/types/animation';
import {
  DEFAULT_CONTENT_APPEAR_DELAY,
  DEFAULT_CONTENT_APPEAR_DURATION,
  DEFAULT_CONTENT_FILTER_BLUR_OFF,
  DEFAULT_CONTENT_FILTER_BLUR_ON,
} from '@/utils/constants/global-settings';

export const SlideAnimation: AnimationType = {
  initial: {
    width: '100%',
    height: '100%',
    scale: 1.1,
  },
  animate: {
    width: 'var(--spacing-slide-width)',
    height: 'var(--spacing-slide-height)',
    scale: 1,
    transition: {
      delay: DEFAULT_CONTENT_APPEAR_DELAY * 10,
      duration: 1.3,
      bounce: 0.5,
      type: 'spring',
    },
  },
};

export const SubtitleAnimation: AnimationType = {
  initial: {
    opacity: 0,
    translateY: '-50%',
    filter: DEFAULT_CONTENT_FILTER_BLUR_ON,
  },
  animate: {
    opacity: 1,
    translateY: 0,
    filter: DEFAULT_CONTENT_FILTER_BLUR_OFF,
    transition: {
      delay: DEFAULT_CONTENT_APPEAR_DELAY,
      duration: DEFAULT_CONTENT_APPEAR_DURATION,
    },
  },
};

export const AirplaneAnimation: AnimationType = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
  transition: {
    delay: DEFAULT_CONTENT_APPEAR_DELAY + 0.1,
    duration: DEFAULT_CONTENT_APPEAR_DURATION,
  },
};

export const SignatureBgAnimation: AnimationType = {
  initial: {
    scale: 1.2,
  },
  animate: { scale: 1.2 },
  transition: { delay: 3, duration: 0.3 },
};
