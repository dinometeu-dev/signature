import { AnimationType } from '@/types/animation';
import {
  DEFAULT_CONTENT_APPEAR_DELAY,
  DEFAULT_CONTENT_APPEAR_DURATION,
  DEFAULT_CONTENT_FILTER_BLUR_OFF,
  DEFAULT_CONTENT_FILTER_BLUR_ON,
} from '@/utils/constants/global-settings';

export const FieldsAnimationOn: AnimationType = {
  initial: {
    opacity: 0.8,
    filter: DEFAULT_CONTENT_FILTER_BLUR_ON,
    userSelect: 'none',
  },
  animate: {
    opacity: 1,
    filter: DEFAULT_CONTENT_FILTER_BLUR_ON,
    userSelect: 'none',
  },
};

export const FieldsAnimationOff: AnimationType = {
  animate: {
    opacity: 1,
    filter: DEFAULT_CONTENT_FILTER_BLUR_OFF,
    userSelect: 'auto',
  },
};

export const NameFieldAnimation: AnimationType = {
  initial: {
    opacity: 0,
    filter: DEFAULT_CONTENT_FILTER_BLUR_ON,
  },
  animate: {
    opacity: 1,
    filter: DEFAULT_CONTENT_FILTER_BLUR_OFF,
  },
  transition: {
    duration: DEFAULT_CONTENT_APPEAR_DURATION,
    delay: DEFAULT_CONTENT_APPEAR_DELAY * 3,
  },
};
