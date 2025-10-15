import { AnimationType } from '@/types/animation';
import { DEFAULT_CONTENT_FILTER_BLUR_OFF } from '@/utils/constants/global-settings';

export const SegmentHoverAnimationOn: AnimationType = {
  animate: {
    opacity: 0.4,
    filter: 'blur(4px)',
    transition: {
      delay: 0.6,
    },
  },
};

export const SegmentHoverAnimationOff: AnimationType = {
  animate: {
    opacity: 1,
    filter: DEFAULT_CONTENT_FILTER_BLUR_OFF,
    transition: {
      delay: 0.1,
    },
  },
};
