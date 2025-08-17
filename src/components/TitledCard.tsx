import type { SpringOptions } from 'framer-motion';
import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import {
  PROFILE_CARD_DESCRIPTION,
  PROFILE_CARD_NAME,
  PROFILE_CARD_STATUS,
} from '@/utils/constants/content';

interface TiltedCardProps {
  altText?: string;
  captionText?: string;
  containerHeight?: React.CSSProperties['height'];
  containerWidth?: React.CSSProperties['width'];
  imageHeight?: React.CSSProperties['height'];
  imageWidth?: React.CSSProperties['width'];
  scaleOnHover?: number;
  rotateAmplitude?: number;
  showMobileWarning?: boolean;
  showTooltip?: boolean;
}

const springValues: SpringOptions = {
  damping: 30,
  stiffness: 50,
  mass: 1,
};

export default function TiltedCard({
  altText = 'Tilted card image',
  captionText = '',
  containerHeight = '300px',
  containerWidth = '100%',
  imageHeight = '300px',
  imageWidth = '300px',
  scaleOnHover = 1.1,
  rotateAmplitude = 14,
  showMobileWarning = true,
  showTooltip = true,
}: Readonly<TiltedCardProps>) {
  const ref = useRef<HTMLElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useMotionValue(0), springValues);
  const rotateY = useSpring(useMotionValue(0), springValues);
  const scale = useSpring(1, springValues);
  const opacity = useSpring(0);
  const rotateFigcaption = useSpring(0, {
    stiffness: 350,
    damping: 30,
    mass: 1,
  });

  const [lastY, setLastY] = useState(0);

  function handleMouse(e: React.MouseEvent<HTMLElement>) {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;

    const rotationX = (offsetY / (rect.height / 2)) * -rotateAmplitude;
    const rotationY = (offsetX / (rect.width / 2)) * rotateAmplitude;

    rotateX.set(rotationX);
    rotateY.set(rotationY);

    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);

    const velocityY = offsetY - lastY;
    rotateFigcaption.set(-velocityY * 0.6);
    setLastY(offsetY);
  }

  function handleMouseEnter() {
    scale.set(scaleOnHover);
    opacity.set(1);
  }

  function handleMouseLeave() {
    opacity.set(0);
    scale.set(1);
    rotateX.set(0);
    rotateY.set(0);
    rotateFigcaption.set(0);
  }

  return (
    <figure
      ref={ref}
      className="relative w-full h-full [perspective:800px] flex flex-col items-center justify-center"
      style={{
        height: containerHeight,
        width: containerWidth,
      }}
      onMouseMove={handleMouse}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {showMobileWarning && (
        <div className="absolute top-4 text-center text-sm block sm:hidden">
          This effect is not optimized for mobile. Check on desktop.
        </div>
      )}

      <motion.div
        className="relative [transform-style:preserve-3d] flex items-end rounded-[36px]"
        style={{
          width: imageWidth,
          height: imageHeight,
          rotateX,
          rotateY,
          scale,
        }}
      >
        <motion.img
          src={'/ProfileImg.png'}
          alt={altText}
          className="absolute top-0 left-0 object-cover rounded-[36px] will-change-transform [transform:translateZ(0)]"
          style={{
            width: imageWidth,
            height: imageHeight,
          }}
        />
        <motion.div className="relative bg-gradient-to-t from-dark-green to-dark-green-0 w-full z-10 h-1/2 flex flex-col items-start justify-end  pb-6 gap-2.5 [transform-style:preserve-3d] rounded-[36px] ">
          <motion.div className="absolute z-[2] will-change-transform [transform:translateZ(30px)] scale-85 flex flex-col items-center justify-end overflow-hidden gap-2.5">
            <div className="text-white flex flex-col gap-1">
              <h2 className="text-2xl font-sf-pro font-stretch-extra-expanded font-medium">
                {PROFILE_CARD_NAME}
              </h2>
              <h5 className="text-sm font-sf-pro font-stretch-extra-expanded font-medium">
                {PROFILE_CARD_STATUS}
              </h5>
            </div>
            <p className="text-sm  text-white-800 font-sf-pro font-light">
              {PROFILE_CARD_DESCRIPTION}
            </p>
          </motion.div>
        </motion.div>
        <div className="absolute h-1/2 w-full progressive-backdrop-blur backdrop-blur-sm rounded-[36px]" />
      </motion.div>

      {showTooltip && (
        <motion.figcaption
          className="pointer-events-none absolute left-0 top-0 rounded-[4px] bg-white px-[10px] py-[4px] text-[10px] text-[#2d2d2d] opacity-0 z-[3] hidden sm:block"
          style={{
            x,
            y,
            opacity,
            rotate: rotateFigcaption,
          }}
        >
          {captionText}
        </motion.figcaption>
      )}
    </figure>
  );
}
