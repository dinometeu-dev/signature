import { motion } from 'framer-motion';
import { ComponentProps, FC } from 'react';

const DEFAULT_ANIMATION_DURATION = 3.5;
const DEFAULT_ANIMATION_DELAY = 1.5;

const SlideChangeInstruction: FC<ComponentProps<'svg'>> = () => {
  const arrowDownRectX = 238;
  const arrowDownRectY = 85;
  const arrowDownRectWidth = 53;
  const arrowDownRectHeight = 25;
  const arrowDownRectRx = 5;
  const arrowDownCenterX = arrowDownRectX + arrowDownRectWidth / 2;
  const arrowDownCenterY = arrowDownRectY + arrowDownRectHeight / 2;

  const arrowUpRectX = 238;
  const arrowUpRectY = 56;
  const arrowUpRectWidth = 53;
  const arrowUpRectHeight = 25;
  const arrowUpRectRx = 5;
  const arrowUpCenterX = arrowUpRectX + arrowUpRectWidth / 2;
  const arrowUpCenterY = arrowUpRectY + arrowUpRectHeight / 2;

  const arrowUpColorBase = '#ECECEC';
  const arrowUpColorActive = '#6FB3E0';
  const arrowUpStrokeActive = '#BCE4FE';
  const arrowUpIconColorBase = '#767676';
  const arrowUpIconColorActive = 'white';

  return (
    <motion.svg fill="none" width="360" xmlns="http://www.w3.org/2000/svg">
      <motion.rect
        x={arrowUpRectX}
        y={arrowUpRectY}
        width={arrowUpRectWidth}
        height={arrowUpRectHeight}
        rx={arrowUpRectRx}
        fill={arrowUpColorBase}
        stroke={arrowUpColorBase}
        strokeWidth="0.5"
        initial={{
          scale: 1,
          fill: arrowUpColorBase,
          stroke: arrowUpColorBase,
        }}
        animate={{
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
        }}
      />
      <motion.g transform={`translate(${arrowUpCenterX}, ${arrowUpCenterY})`}>
        <motion.path
          d="M31.5002 15.25L27.0002 10.75L22.5002 15.25"
          stroke={arrowUpIconColorBase}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{
            scale: 1,
            stroke: arrowUpIconColorBase,
            transform: 'translate(-27px, -12px)',
          }}
          animate={{
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
          }}
        />
      </motion.g>

      <rect
        x="180"
        y="85"
        width="53"
        height="25"
        rx="5"
        fill="url(#paint0_linear_252_401)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_252_401"
          x1="0"
          y1="0.5"
          x2="1"
          y2="0.5"
          gradientUnits="objectBoundingBox"
        >
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#ececec" />
        </linearGradient>
      </defs>

      <rect
        x={arrowDownRectX}
        y={arrowDownRectY}
        width={arrowDownRectWidth}
        height={arrowDownRectHeight}
        rx={arrowDownRectRx}
        fill="#ECECEC"
      />
      <g transform={`translate(${arrowDownCenterX}, ${arrowDownCenterY})`}>
        <path
          d="M22.5002 10.75L27.0002 15.25L31.5002 10.75"
          stroke="#767676"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          transform="translate(-27, -12)"
        />
      </g>

      <rect
        x="296.5"
        y="85"
        width="53"
        height="25"
        rx="5"
        fill="url(#paint0_linear_252_402)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_252_402"
          x1="0"
          y1="0.5"
          x2="1"
          y2="0.5"
          gradientUnits="objectBoundingBox"
        >
          <stop offset="0%" stopColor="#ececec" />
          <stop offset="100%" stopColor="#ffffff" />
        </linearGradient>
      </defs>

      <motion.rect
        x="0.25"
        y="0.25"
        width="190.5"
        height="101.5"
        rx="12.75"
        fill="#F4F4F4"
        stroke="#65B2E6"
        strokeWidth="0.5"
        initial={{ y: 25, opacity: 1, scale: 1 }}
        animate={{
          y: [25, 25, 25, 25, 25, -20, 25, 25, 25, 25, 25],
          scale: [1, 1, 1, 1, 1, 1, 0.8, 0.8, 0.8, 0.8, 1],
          opacity: [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1],
          transition: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: DEFAULT_ANIMATION_DURATION,
            delay: DEFAULT_ANIMATION_DELAY,
          },
        }}
      />
      <motion.rect
        x="0.25"
        y="0.25"
        width="190.5"
        height="101.5"
        rx="12.75"
        fill="#F4F4F4"
        stroke="#65B2E6"
        strokeWidth="0.5"
        initial={{ y: 25, opacity: 1, scale: 1 }}
        animate={{
          y: [25, 25, 25, 25, 25, 25, 25, 25, 25, 25, -20],
          scale: [0.8, 0.8, 0.8, 0.8, 0.8, 1, 1, 1, 1, 1, 1],
          opacity: [0, 0, 0, 0, 0, 1, 1, 1, 1, 0],
          transition: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: DEFAULT_ANIMATION_DURATION,
            delay: DEFAULT_ANIMATION_DELAY,
          },
        }}
      />
    </motion.svg>
  );
};

export default SlideChangeInstruction;
