import { motion, SVGMotionProps, Variants } from 'framer-motion';
import { FC } from 'react';

const DEFAULT_PATH_ANIMATE_DURATION = 1.5;
const DEFAULT_DOT_ANIMATE_DURATION = 0.4;

const SignatureBg: FC<SVGMotionProps<SVGSVGElement>> = (props) => {
  const pathVariants: Variants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { pathLength: 1, opacity: 1 },
  };

  return (
    <motion.svg
      width="1181"
      height="625"
      viewBox="0 0 1181 625"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <motion.path
        d="M478.175 239.747C478.175 218.873 508.493 246.997 517.022 251.751C537.807 263.336 571.619 291.285 596.832 291.285C608.123 291.285 605.37 275.539 605.37 268.27C605.37 257.661 636.051 278.642 642.119 281.633C652.002 286.505 671.952 299.56 677.013 282.933C682.426 265.148 673.948 258.404 696.687 270.683C732.487 290.015 782.056 324.082 825.311 310.773C855.772 301.4 860.899 257.893 845.913 233.748C836.037 217.836 833.713 219.613 850.738 209.99C945.393 156.49 781.235 67.3374 741.232 52.9691C522.717 -25.5164 261.56 49.8645 98.8561 209.062C46.0905 260.691 2.59767 322.176 1.0427 398.564C-0.491924 473.952 39.449 531.442 103.496 568.763C273.109 667.598 526.361 635.944 628.385 455.359C663.363 393.446 675.431 310.174 630.983 249.71C599.746 207.216 544.827 188.313 493.636 187.718C469.152 187.433 439.348 194.293 423.292 214.63C401.224 242.583 491.357 239.834 494.75 239.687C737.413 229.178 960.404 91.5835 1180 0.999992"
        stroke="black"
        strokeOpacity="0.2"
        strokeWidth="0.5"
        strokeLinecap="round"
        variants={pathVariants}
        initial="hidden"
        animate="visible"
        transition={{
          default: {
            duration: DEFAULT_PATH_ANIMATE_DURATION,
            ease: 'easeInOut',
          },
          opacity: { duration: 0.5 },
        }}
      />
      <motion.path
        d="M439.296 118.812C435.172 118.812 431.672 116.273 431.672 110.762C431.672 96.1009 440.171 92.4792 451.515 91.2127C462.859 89.9462 478.478 90.6476 481.354 105.03C485.177 124.146 459.21 121.492 447.547 121.492"
        stroke="black"
        strokeOpacity="0.2"
        strokeWidth="0.5"
        strokeLinecap="round"
        variants={pathVariants}
        initial="hidden"
        animate="visible"
        transition={{
          default: {
            delay: DEFAULT_PATH_ANIMATE_DURATION,
            duration: DEFAULT_DOT_ANIMATE_DURATION,
            ease: 'easeInOut',
          },
          opacity: { duration: 0.5 },
        }}
      />
    </motion.svg>
  );
};

export default SignatureBg;
