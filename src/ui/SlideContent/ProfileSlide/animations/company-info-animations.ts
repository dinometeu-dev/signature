import { AnimationType } from '@/types/animation';
import {
  DEFAULT_CONTENT_FILTER_BLUR_OFF,
  DEFAULT_CONTENT_FILTER_BLUR_ON,
} from '@/utils/constants/global-settings';

export const CompanyInfoAnimation: AnimationType = {
  initial: { opacity: 0, filter: DEFAULT_CONTENT_FILTER_BLUR_ON },
  animate: { opacity: 1, filter: DEFAULT_CONTENT_FILTER_BLUR_OFF },
};
