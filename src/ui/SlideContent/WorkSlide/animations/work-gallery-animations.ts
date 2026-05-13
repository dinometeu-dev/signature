import { AnimationType } from '@/types/animation';
import {
  DEFAULT_CONTENT_APPEAR_DELAY,
  DEFAULT_CONTENT_APPEAR_DURATION,
  DEFAULT_CONTENT_FILTER_BLUR_OFF,
  DEFAULT_CONTENT_FILTER_BLUR_ON,
} from '@/utils/constants/global-settings';

export const GalleryImageHoverAnimation = {
  whileHover: { scale: 1.08 },
  transition: { duration: 0.25, ease: 'easeOut' as const },
};

export const GalleryLightboxOverlayAnimation: AnimationType = {
  initial: { opacity: 0, backdropFilter: DEFAULT_CONTENT_FILTER_BLUR_OFF },
  animate: { opacity: 1, backdropFilter: DEFAULT_CONTENT_FILTER_BLUR_ON },
  exit: { opacity: 0, backdropFilter: DEFAULT_CONTENT_FILTER_BLUR_OFF },
  transition: { duration: 0.2, ease: 'easeOut' },
};

export const GalleryLightboxImageAnimation: AnimationType = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
  transition: { duration: 0.2, ease: 'easeOut' },
};

export const GalleryCloseButtonAnimation: AnimationType = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 },
  transition: {
    duration: DEFAULT_CONTENT_APPEAR_DURATION,
    delay: DEFAULT_CONTENT_APPEAR_DELAY,
  },
};
