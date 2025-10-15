import { AnimationType } from '@/types/animation';

const DEFAULT_ANIMATION_DURATION = 4.5;
const DEFAULT_ANIMATION_DELAY = 1.5;

export const arrowUpColorBase = '#ECECEC';
export const arrowUpColorActive = '#6FB3E0';
export const arrowUpStrokeActive = '#BCE4FE';
export const arrowUpIconColorBase = '#767676';
export const arrowUpIconColorActive = 'white';

export const ArrowUpAnimation: AnimationType = {
  initial: {
    scale: 1,
    fill: arrowUpColorBase,
    stroke: arrowUpColorBase,
  },
  animate: {
    scale: [1, 1, 1, 1, 1, 0.94, 1, 1, 1, 1, 0.94, 1],
    fill: [
      arrowUpColorBase,
      arrowUpColorBase,
      arrowUpColorBase,
      arrowUpColorBase,
      arrowUpColorBase,
      arrowUpColorActive,
      arrowUpColorBase,
      arrowUpColorBase,
      arrowUpColorBase,
      arrowUpColorBase,
      arrowUpColorActive,
      arrowUpColorBase,
    ],
    stroke: [
      arrowUpColorBase,
      arrowUpColorBase,
      arrowUpColorBase,
      arrowUpColorBase,
      arrowUpColorBase,
      arrowUpStrokeActive,
      arrowUpColorBase,
      arrowUpColorBase,
      arrowUpColorBase,
      arrowUpColorBase,
      arrowUpStrokeActive,
      arrowUpColorBase,
    ],
    transition: {
      repeat: Infinity,
      repeatType: 'loop',
      duration: DEFAULT_ANIMATION_DURATION,
      delay: DEFAULT_ANIMATION_DELAY,
    },
  },
};

export const ArrowUpIconAnimation: AnimationType = {
  initial: {
    scale: 1,
    stroke: arrowUpIconColorBase,
    transform: 'translate(-27px, -12px)',
  },
  animate: {
    transform: 'translate(-27px, -12px)',
    scale: [1, 1, 1, 1, 1, 0.8, 1, 1, 1, 1, 0.8, 1],
    stroke: [
      arrowUpIconColorBase,
      arrowUpIconColorBase,
      arrowUpIconColorBase,
      arrowUpIconColorBase,
      arrowUpIconColorBase,
      arrowUpIconColorActive,
      arrowUpIconColorBase,
      arrowUpIconColorBase,
      arrowUpIconColorBase,
      arrowUpIconColorBase,
      arrowUpIconColorActive,
      arrowUpIconColorBase,
    ],
    transition: {
      repeat: Infinity,
      repeatType: 'loop',
      duration: DEFAULT_ANIMATION_DURATION,
      delay: DEFAULT_ANIMATION_DELAY,
    },
  },
};

export const SlideChangeAnimation1: AnimationType = {
  initial: {
    y: 25,
    opacity: 1,
    scale: 1,
  },
  animate: {
    y: [25, 25, 25, 25, 25, -20, 25, 25, 25, 25, 25],
    scale: [1, 1, 1, 1, 1, 1, 0.8, 0.8, 0.8, 0.8, 1],
    opacity: [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1],
    transition: {
      repeat: Infinity,
      repeatType: 'loop',
      duration: DEFAULT_ANIMATION_DURATION,
      delay: DEFAULT_ANIMATION_DELAY,
    },
  },
};

export const SlideChangeAnimation2: AnimationType = {
  initial: {
    y: 25,
    opacity: 1,
    scale: 1,
  },
  animate: {
    y: [25, 25, 25, 25, 25, 25, 25, 25, 25, 25, -20],
    scale: [0.8, 0.8, 0.8, 0.8, 0.8, 1, 1, 1, 1, 1, 1],
    opacity: [0, 0, 0, 0, 0, 1, 1, 1, 1, 0],
    transition: {
      repeat: Infinity,
      repeatType: 'loop',
      duration: DEFAULT_ANIMATION_DURATION,
      delay: DEFAULT_ANIMATION_DELAY,
    },
  },
};
