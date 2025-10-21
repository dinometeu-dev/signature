import { MotionNodeHoverHandlers } from 'motion-dom';

import { AnimationType } from '@/types/animation';
import {
  DEFAULT_CONTENT_FILTER_BLUR_OFF,
  DEFAULT_CONTENT_FILTER_BLUR_ON,
} from '@/utils/constants/global-settings';

// export const ItemAnimations: AnimationType & MotionNodeHoverHandlers = {
//   whileHover: {
//     inset: 0,
//     zIndex: 100,
//     width: '100%',
//     height: '100%',
//     transition: {
//       type: 'spring',
//       bounce: 0.1,
//       duration: 0.4,
//     },
//   },
// };

export const ContentAnimations: AnimationType = {
  initial: {
    opacity: 0,
    filter: DEFAULT_CONTENT_FILTER_BLUR_ON,
  },
  animate: {
    opacity: 1,
    filter: DEFAULT_CONTENT_FILTER_BLUR_OFF,
  },
  exit: {
    opacity: 0,
    filter: DEFAULT_CONTENT_FILTER_BLUR_ON,
    position: 'absolute',
    transition: {
      delay: 0,
      duration: 0.1,
    },
  },
  transition: {
    delay: 0.5,
  },
};

export const TitleAnimations: AnimationType & MotionNodeHoverHandlers = {
  whileHover: {
    scale: 1.05,
  },
};
