import { MotionNodeAnimationOptions } from 'motion-dom';

export type AnimationType = {
  [K in keyof MotionNodeAnimationOptions]: MotionNodeAnimationOptions[K];
};
