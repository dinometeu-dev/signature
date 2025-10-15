import { AnimationType } from '@/types/animation';
import { DEFAULT_CONTENT_APPEAR_DURATION } from '@/utils/constants/global-settings';

const DEFAULT_PATH_ANIMATE_DURATION = 1.5;
const DEFAULT_DOT_ANIMATE_DURATION = 0.4;

export const SignatureMainPathAnimation: AnimationType = {
  transition: {
    default: {
      duration: DEFAULT_PATH_ANIMATE_DURATION,
      ease: 'easeInOut',
    },
    opacity: { duration: DEFAULT_CONTENT_APPEAR_DURATION },
  },
};

export const SignatureDotAnimation: AnimationType = {
  transition: {
    default: {
      delay: DEFAULT_PATH_ANIMATE_DURATION,
      duration: DEFAULT_DOT_ANIMATE_DURATION,
      ease: 'easeInOut',
    },
    opacity: { duration: DEFAULT_CONTENT_APPEAR_DURATION },
  },
};
