import { AnimationType } from '@/types/animation';

export const MenuItemsLineAnimations: AnimationType = {
  initial: { height: 0 },
  animate: { height: 16 },
  exit: {
    translateX: '100%',
  },
  transition: {
    duration: 0.5,
  },
};
