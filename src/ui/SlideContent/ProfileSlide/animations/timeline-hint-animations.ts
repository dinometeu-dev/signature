import { AnimationType } from '@/types/animation';
import {
  DEFAULT_CONTENT_APPEAR_DELAY,
  DEFAULT_CONTENT_APPEAR_DURATION,
} from '@/utils/constants/global-settings';

export const TimelineHintAnimation: AnimationType = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: {
    delay: DEFAULT_CONTENT_APPEAR_DELAY,
    duration: DEFAULT_CONTENT_APPEAR_DURATION,
  },
};
