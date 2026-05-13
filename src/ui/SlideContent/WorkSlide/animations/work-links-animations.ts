import { AnimationType } from '@/types/animation';
import {
  DEFAULT_CONTENT_APPEAR_DURATION,
  DEFAULT_CONTENT_FILTER_BLUR_OFF,
  DEFAULT_CONTENT_FILTER_BLUR_ON,
} from '@/utils/constants/global-settings';

export const WorkLinksAnimation: AnimationType = {
  initial: { opacity: 0, y: 8, filter: DEFAULT_CONTENT_FILTER_BLUR_ON },
  animate: { opacity: 1, y: 0, filter: DEFAULT_CONTENT_FILTER_BLUR_OFF },
  exit: { opacity: 0, y: 8, filter: DEFAULT_CONTENT_FILTER_BLUR_ON },
  transition: { duration: DEFAULT_CONTENT_APPEAR_DURATION, ease: 'easeInOut' },
};
