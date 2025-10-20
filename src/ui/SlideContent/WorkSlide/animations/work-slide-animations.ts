import { AnimationType } from '@/types/animation';
import {
  DEFAULT_CONTENT_FILTER_BLUR_OFF,
  DEFAULT_CONTENT_FILTER_BLUR_ON,
} from '@/utils/constants/global-settings';

export const MainTitleAnimations: AnimationType = {
  initial: {
    fontSize: '70px',
    left: '50%',
    top: '50%',
    translateX: '-50%',
    translateY: '-50%',
  },
  animate: {
    fontSize: '40px',
    top: '98%',
    translateY: '-100%',
  },
  transition: {
    delay: 0.8,
    type: 'spring',
    bounce: 0.25,
  },
};

export const DomeGalleryAnimation: AnimationType = {
  initial: {
    opacity: 0,
    filter: DEFAULT_CONTENT_FILTER_BLUR_ON,
  },
  animate: {
    opacity: 1,
    filter: DEFAULT_CONTENT_FILTER_BLUR_OFF,
  },
  transition: {
    delay: 1,
  },
};
