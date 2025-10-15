import { AnimationType } from '@/types/animation';

const DEFAULT_ANIMATION_DURATION = 8;
const DEFAULT_ANIMATION_DELAY = 1.5;

export const circleDefaultColor = '#FFFFFF';
export const circleActiveColor = '#6FB3E0';
export const circleDefaultStroke = '#CDCDCD';
export const circleActiveStroke = '#BCE4FE';

export const menuItemDefaultColor = '#ACACAC';
export const menuItemActiveColor = '#EC6464';

export const CircleAnimation: AnimationType = {
  initial: {
    x: 120,
    y: 90,
    fill: circleDefaultColor,
    stroke: circleDefaultStroke,
    scale: 1,
  },
  animate: {
    x: [120, 80, 80, 80, 80, 80, 80, 80, 78, 78, 78, 78, 78, 78, 120],
    y: [90, 75, 75, 75, 75, 75, 75, 75, 80, 80, 80, 80, 80, 80, 90],
    opacity: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
    scale: [1, 1, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 1, 1, 1, 1, 1],
    fill: [
      circleDefaultColor,
      circleDefaultColor,
      circleActiveColor,
      circleActiveColor,
      circleActiveColor,
      circleActiveColor,
      circleActiveColor,
      circleActiveColor,
      circleActiveColor,
      circleActiveColor,
      circleDefaultColor,
      circleDefaultColor,
      circleDefaultColor,
      circleDefaultColor,
      circleDefaultColor,
    ],
    stroke: [
      circleDefaultStroke,
      circleDefaultStroke,
      circleActiveStroke,
      circleActiveStroke,
      circleActiveStroke,
      circleActiveStroke,
      circleActiveStroke,
      circleActiveStroke,
      circleActiveStroke,
      circleActiveStroke,
      circleDefaultStroke,
      circleDefaultStroke,
      circleDefaultStroke,
      circleDefaultStroke,
      circleDefaultStroke,
    ],
    transition: {
      repeat: Infinity,
      repeatType: 'loop',
      duration: DEFAULT_ANIMATION_DURATION,
      delay: DEFAULT_ANIMATION_DELAY,
    },
  },
};

export const GlassEffectAnimation: AnimationType = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
    transition: {
      repeat: Infinity,
      repeatType: 'loop',
      duration: DEFAULT_ANIMATION_DURATION,
      delay: DEFAULT_ANIMATION_DELAY,
    },
  },
};

export const ActiveCircleCursorAnimation: AnimationType = {
  initial: {
    opacity: 0,
    scale: 0.8,
  },
  animate: {
    opacity: [0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    scale: [
      0.8, 0.8, 0.8, 0.8, 1, 1.2, 1.2, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8,
    ],
    transition: {
      repeat: Infinity,
      repeatType: 'loop',
      duration: DEFAULT_ANIMATION_DURATION,
      delay: DEFAULT_ANIMATION_DELAY,
    },
  },
};

export const MenuItemsMainAnimation: AnimationType = {
  initial: { opacity: 0 },
  animate: {
    opacity: [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0],
    transition: {
      repeat: Infinity,
      repeatType: 'loop',
      duration: DEFAULT_ANIMATION_DURATION,
      delay: DEFAULT_ANIMATION_DELAY,
    },
  },
};

export const MenuItemsAnimation: AnimationType = {
  initial: { fill: menuItemActiveColor },
  animate: {
    fill: [
      menuItemActiveColor,
      menuItemActiveColor,
      menuItemActiveColor,
      menuItemActiveColor,
      menuItemActiveColor,
      menuItemActiveColor,
      menuItemActiveColor,
      menuItemActiveColor,
      menuItemDefaultColor,
      menuItemDefaultColor,
      menuItemDefaultColor,
      menuItemDefaultColor,
      menuItemDefaultColor,
      menuItemActiveColor,
      menuItemActiveColor,
    ],
    transition: {
      repeat: Infinity,
      repeatType: 'loop',
      duration: DEFAULT_ANIMATION_DURATION,
      delay: DEFAULT_ANIMATION_DELAY,
    },
  },
};

export const MenuItemsAnimation2: AnimationType = {
  initial: { fill: menuItemDefaultColor },
  animate: {
    fill: [
      menuItemDefaultColor,
      menuItemDefaultColor,
      menuItemDefaultColor,
      menuItemDefaultColor,
      menuItemDefaultColor,
      menuItemDefaultColor,
      menuItemDefaultColor,
      menuItemDefaultColor,
      menuItemActiveColor,
      menuItemActiveColor,
      menuItemDefaultColor,
      menuItemDefaultColor,
      menuItemDefaultColor,
      menuItemDefaultColor,
      menuItemDefaultColor,
    ],
    transition: {
      repeat: Infinity,
      repeatType: 'loop',
      duration: DEFAULT_ANIMATION_DURATION,
      delay: DEFAULT_ANIMATION_DELAY,
    },
  },
};

export const CursorAnimation: AnimationType = {
  initial: {
    x: 320,
    y: 100,
    scale: 1,
  },
  animate: {
    x: [
      320, 230, 230, 230, 230, 230, 230, 230, 225, 225, 225, 225, 225, 225, 320,
    ],
    opacity: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
    y: [100, 60, 60, 60, 60, 60, 60, 60, 70, 70, 70, 70, 70, 70, 100],
    transition: {
      repeat: Infinity,
      repeatType: 'loop',
      duration: DEFAULT_ANIMATION_DURATION,
      delay: DEFAULT_ANIMATION_DELAY,
    },
  },
};
