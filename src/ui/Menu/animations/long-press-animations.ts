import { AnimationType } from '@/types/animation';

export const CirclePressAnimation: AnimationType = {
  exit: {
    opacity: 0,
    scale: 1.5,
    transition: { duration: 0.1 },
  },
  transition: {
    ease: 'easeInOut',
  },
};
