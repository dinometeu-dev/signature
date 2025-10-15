import { AnimationType } from '@/types/animation';
import {
  DEFAULT_CONTENT_APPEAR_DELAY,
  DEFAULT_CONTENT_FILTER_BLUR_OFF,
} from '@/utils/constants/global-settings';

export const MenuItemsWrapperAnimation: AnimationType = {
  initial: {
    opacity: 0,
    backdropFilter: DEFAULT_CONTENT_FILTER_BLUR_OFF,
    background: 'rgba(255, 255, 255, 0)',
  },
  animate: {
    opacity: 1,
    backdropFilter: 'blur(20px)',
    background: 'rgba(255, 255, 255, 0.6)',
  },
  exit: {
    opacity: 0,
    backdropFilter: DEFAULT_CONTENT_FILTER_BLUR_OFF,
    background: 'rgba(255, 255, 255, 0)',
    transition: {
      delay: DEFAULT_CONTENT_APPEAR_DELAY,
    },
  },
};
