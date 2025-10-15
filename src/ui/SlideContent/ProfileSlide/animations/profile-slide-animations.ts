import { AnimationType } from '@/types/animation';
import {
  DEFAULT_CONTENT_APPEAR_DELAY,
  DEFAULT_CONTENT_APPEAR_DURATION,
  DEFAULT_CONTENT_FILTER_BLUR_OFF,
  DEFAULT_CONTENT_FILTER_BLUR_ON,
} from '@/utils/constants/global-settings';

export const ExperienceTitleAnimations: AnimationType = {
  initial: {
    opacity: 0,
    filter: DEFAULT_CONTENT_FILTER_BLUR_ON,
  },
  animate: {
    opacity: 1,
    filter: DEFAULT_CONTENT_FILTER_BLUR_OFF,
  },
  transition: {
    delay: DEFAULT_CONTENT_APPEAR_DELAY,
    duration: DEFAULT_CONTENT_APPEAR_DURATION,
  },
};

export const ExperienceSubTitleAnimations: AnimationType = {
  initial: {
    opacity: 0,
    filter: DEFAULT_CONTENT_FILTER_BLUR_ON,
  },
  animate: {
    opacity: 1,
    filter: DEFAULT_CONTENT_FILTER_BLUR_OFF,
  },
  transition: {
    delay: DEFAULT_CONTENT_APPEAR_DELAY,
    duration: DEFAULT_CONTENT_APPEAR_DURATION * 2,
  },
};
