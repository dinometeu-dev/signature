import { motion } from 'framer-motion';

import {
  ActiveCircleCursorAnimation,
  circleActiveColor,
  circleActiveStroke,
  CircleAnimation,
  circleDefaultColor,
  circleDefaultStroke,
  CursorAnimation,
  GlassEffectAnimation,
  menuItemActiveColor,
  menuItemDefaultColor,
  MenuItemsAnimation,
  MenuItemsAnimation2,
  MenuItemsMainAnimation,
} from '@slides/SignatureSlide/animations/open-menu-instruction-animation';

const OpenMenuInstruction = () => {
  const wrapperWidth = 360;
  const frameWidth = 191;
  const frameHeight = 102;

  const frameX = wrapperWidth - frameWidth;
  const frameY = 25;

  const slideWidth = 98;
  const slideHeight = 51;
  const slideX = frameX + frameWidth / 2 - slideWidth / 2;
  const slideY = frameHeight - slideHeight;

  return (
    <motion.svg width={wrapperWidth}>
      {/* ----- TRACKPAD ------*/}
      <rect
        x="45"
        y="60"
        width="109"
        height="56"
        rx="8.5"
        fill="#ECECEC"
        stroke="#CDCDCD"
      />
      {/* ----- CIRCLE ------*/}
      <motion.rect
        width="14.5"
        height="14.5"
        rx="7.25"
        fill={circleDefaultColor}
        stroke={circleDefaultStroke}
        strokeWidth="0.5"
        initial={CircleAnimation.initial}
        animate={CircleAnimation.animate}
      />

      {/* ----- FRAME ------*/}
      <rect
        width={frameWidth}
        height={frameHeight}
        x={frameX}
        y={frameY}
        rx="13"
        fill="#F4F4F4"
      />

      {/* ----- MINI_SLIDE ------*/}
      <rect
        x={slideX}
        y={slideY}
        width="98.5"
        height="51.5"
        rx="6.75"
        fill="#E9E9E9"
        stroke="#65B2E6"
        strokeWidth="0.5"
      />

      {/* ----- GLASS_EFFECT ------*/}
      <foreignObject x={frameX} y={frameY} width="203.6" height="114.6">
        <motion.div
          style={{
            backdropFilter: 'blur(3.15px)',
            clipPath: 'url(#bgblur_0_252_446_clip_path)',
            height: '100%',
            width: '100%',
            opacity: 0,
          }}
          initial={GlassEffectAnimation.initial}
          animate={GlassEffectAnimation.animate}
        />
      </foreignObject>
      <defs>
        <clipPath id="bgblur_0_252_446_clip_path">
          <rect width="191" height="102" rx="13" />
        </clipPath>
      </defs>

      {/* ----- ACTIVE_CIRCLE_CURSOR ------*/}
      <motion.rect
        x="228"
        y="58"
        width="8"
        height="8"
        rx="7.25"
        fill={circleActiveColor}
        stroke={circleActiveStroke}
        strokeWidth="0.5"
        initial={ActiveCircleCursorAnimation.initial}
        animate={ActiveCircleCursorAnimation.animate}
      />

      {/* ----- MENU_ITEMS ------*/}

      <motion.g
        transform={`translate(206, 52)`}
        initial={MenuItemsMainAnimation.initial}
        animate={MenuItemsMainAnimation.animate}
      >
        <motion.rect x="4" width="25" height="4" rx="2" fill="#ACACAC" />
        <motion.rect
          y="9"
          width="29"
          height="4"
          rx="2"
          fill={menuItemActiveColor}
          initial={MenuItemsAnimation.initial}
          animate={MenuItemsAnimation.animate}
        />
        <motion.rect
          x="11"
          y="18"
          width="18"
          height="4"
          rx="2"
          fill={menuItemDefaultColor}
          initial={MenuItemsAnimation2.initial}
          animate={MenuItemsAnimation2.animate}
        />
        <motion.rect x="7" y="27" width="22" height="4" rx="2" fill="#ACACAC" />
      </motion.g>

      {/* ----- CURSOR ------*/}
      <motion.g
        transform={`translate(320, 100)`}
        initial={CursorAnimation.initial}
        animate={CursorAnimation.animate}
      >
        <path
          d="M2.35486 2.73467C2.33184 2.68154 2.32532 2.62271 2.33616 2.56583C2.34699 2.50894 2.37468 2.45663 2.41563 2.41569C2.45657 2.37474 2.50888 2.34705 2.56577 2.33622C2.62265 2.32538 2.68148 2.3319 2.73461 2.35492L12.0679 6.14659C12.1247 6.16971 12.1727 6.21012 12.2052 6.26208C12.2377 6.31404 12.253 6.37491 12.2489 6.43606C12.2449 6.4972 12.2216 6.55551 12.1825 6.60271C12.1435 6.64991 12.0905 6.6836 12.0312 6.699L8.45886 7.62067C8.25702 7.67256 8.07276 7.77757 7.92525 7.92478C7.77773 8.07199 7.67234 8.25602 7.62003 8.45775L6.69894 12.0313C6.68354 12.0906 6.64985 12.1435 6.60265 12.1826C6.55545 12.2217 6.49714 12.2449 6.436 12.249C6.37485 12.253 6.31398 12.2378 6.26202 12.2053C6.21005 12.1728 6.16965 12.1248 6.14652 12.068L2.35486 2.73467Z"
          fill="#363636"
          stroke="white"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </motion.g>
    </motion.svg>
  );
};

export default OpenMenuInstruction;
