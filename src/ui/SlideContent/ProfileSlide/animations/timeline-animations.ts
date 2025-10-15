import { AnimationType } from '@/types/animation';
import {
  DEFAULT_CONTENT_APPEAR_DELAY,
  DEFAULT_CONTENT_APPEAR_DURATION,
  DEFAULT_CONTENT_FILTER_BLUR_OFF,
  DEFAULT_CONTENT_FILTER_BLUR_ON,
} from '@/utils/constants/global-settings';

export const TimelineWrapperAnimation: AnimationType = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
  transition: {
    delay: DEFAULT_CONTENT_APPEAR_DELAY,
    duration: DEFAULT_CONTENT_APPEAR_DURATION,
    ease: 'easeInOut',
  },
};

export const TimelineAnimations: AnimationType = {
  initial: {
    width: 0,
  },
};

export const CompanyInfoAnimation: AnimationType = {
  exit: {
    opacity: 0,
    filter: DEFAULT_CONTENT_FILTER_BLUR_ON,
    transition: {
      duration: 0.1,
    },
  },
};

export const ExperienceTitleAnimation: AnimationType = {
  initial: { opacity: 0, filter: DEFAULT_CONTENT_FILTER_BLUR_ON },
  animate: {
    opacity: 1,
    filter: DEFAULT_CONTENT_FILTER_BLUR_OFF,
    transition: {
      delay: DEFAULT_CONTENT_APPEAR_DELAY,
    },
  },
  exit: {
    opacity: 0,
    filter: DEFAULT_CONTENT_FILTER_BLUR_ON,
    transition: {
      duration: 0.1,
    },
  },
};

export const ExperienceCompanyTitleAnimation: AnimationType = {
  initial: { opacity: 0, filter: DEFAULT_CONTENT_FILTER_BLUR_ON },
  animate: {
    opacity: 1,
    filter: DEFAULT_CONTENT_FILTER_BLUR_OFF,
    transition: {
      delay: DEFAULT_CONTENT_APPEAR_DELAY,
    },
  },
  exit: {
    opacity: 0,
    filter: DEFAULT_CONTENT_FILTER_BLUR_ON,
  },
};
