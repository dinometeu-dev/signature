import { AnimationType } from '@/types/animation';
import {
  DEFAULT_CONTENT_APPEAR_DELAY,
  DEFAULT_CONTENT_APPEAR_DURATION,
  DEFAULT_CONTENT_FILTER_BLUR_OFF,
  DEFAULT_CONTENT_FILTER_BLUR_ON,
} from '@/utils/constants/global-settings';

export const ProfileCardAnimation: AnimationType = {
  initial: { scale: 0.95, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  transition: {
    duration: DEFAULT_CONTENT_APPEAR_DURATION,
    delay: DEFAULT_CONTENT_APPEAR_DELAY,
  },
};

export const TechnologyStackAnimation: AnimationType = {
  initial: {
    opacity: 0,
    filter: DEFAULT_CONTENT_FILTER_BLUR_ON,
  },
  animate: {
    opacity: 1,
    filter: DEFAULT_CONTENT_FILTER_BLUR_OFF,
  },
  transition: {
    duration: 0.3,
  },
};

export const SocialLinksAnimation: AnimationType = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
  transition: {
    duration: 0.3,
  },
};
