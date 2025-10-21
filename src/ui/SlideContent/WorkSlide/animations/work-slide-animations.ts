import { AnimationType } from '@/types/animation';

export const MainTitleAnimations: AnimationType = {
  initial: {
    fontSize: '70px',
    left: '50%',
    top: '50%',
    translateX: '-50%',
    translateY: '-50%',
  },
  animate: {
    fontSize: '40px',
    top: '95%',
    translateY: '-100%',
  },
  transition: {
    delay: 0.8,
    type: 'spring',
    bounce: 0.25,
  },
};

export const RoadItemsAnimation: AnimationType = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
  transition: {
    delay: 1,
  },
};
