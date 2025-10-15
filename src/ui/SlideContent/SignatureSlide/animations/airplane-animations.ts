import { AnimationType } from '@/types/animation';
import { SCREEN_HEIGHT } from '@/utils/constants/styled';

export const AirplaneAnimations: AnimationType = {
  initial: {
    x: -36,
    y: 4,
    scale: 0.3,
    rotateX: 0,
  },
};

export const BigAirplaneAnimations: AnimationType = {
  initial: {
    y: SCREEN_HEIGHT * 3,
    rotateZ: -90,
    rotateX: 0,
    scale: 58,
  },
};
