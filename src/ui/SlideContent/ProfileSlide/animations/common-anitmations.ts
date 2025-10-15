import { AnimationType } from '@/types/animation';
import { DEFAULT_CONTENT_APPEAR_DELAY } from '@/utils/constants/global-settings';

export const SegmentHoverAnimationOn: AnimationType = {
  animate: {
    opacity: 0.3,
    transition: {
      delay: 0.6,
    },
  },
};

export const SegmentHoverAnimationOff: AnimationType = {
  animate: {
    opacity: 1,
    transition: {
      delay: DEFAULT_CONTENT_APPEAR_DELAY,
    },
  },
};
