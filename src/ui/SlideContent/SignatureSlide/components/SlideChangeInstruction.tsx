import { motion } from 'framer-motion';

import {
  ArrowUpAnimation,
  arrowUpColorBase,
  ArrowUpIconAnimation,
  arrowUpIconColorBase,
  SlideChangeAnimation1,
  SlideChangeAnimation2,
} from '@slides/SignatureSlide/animations/slide-change-instruction-animatons';

const SlideChangeInstruction = () => {
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
        initial={ArrowUpAnimation.initial}
        animate={ArrowUpAnimation.animate}
      />
      <motion.g transform={`translate(${arrowUpCenterX}, ${arrowUpCenterY})`}>
        <motion.path
          d="M31.5002 15.25L27.0002 10.75L22.5002 15.25"
          stroke={arrowUpIconColorBase}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={ArrowUpIconAnimation.initial}
          animate={ArrowUpIconAnimation.animate}
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
        initial={SlideChangeAnimation1.initial}
        animate={SlideChangeAnimation1.animate}
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
        initial={SlideChangeAnimation2.initial}
        animate={SlideChangeAnimation2.animate}
      />
    </motion.svg>
  );
};

export default SlideChangeInstruction;
