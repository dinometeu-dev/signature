'use client';

import React, { useEffect, useState } from 'react';
import { SendHorizontal } from 'lucide-react';
import { Button } from '@/components/Button';
import Image from 'next/image';
import PaperAirplane from '../../../../../../public/PaperAirplane.png';
import { motion, useAnimationControls } from 'framer-motion';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '@/utils/constants/styled';
import { QUERY_SLIDE_VALUES } from '@/utils/constants/paths';
import { cn } from '@/utils/functions/mergeClasses';
import { useSlideStack } from '@/utils/providers/SlideStackProvider';

const SECOND_AIRPLANE_DURATION = 0.8;

const AirplaneButton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { setActiveSlideByAriaLabel } = useSlideStack();

  const controls = useAnimationControls();
  const controlSecondAirplane = useAnimationControls();
  const [buttonIsHovered, setButtonIsHovered] = useState(false);
  const [isClick, setIsClick] = useState(false);

  useEffect(() => {
    if (isClick) {
      controls
        .start({
          x: SCREEN_WIDTH,
          transition: { duration: 1, ease: 'backInOut' },
        })
        .then(() => {
          controls.stop();
          controlSecondAirplane
            .start({
              y: -SCREEN_HEIGHT * 2,
              rotateZ: -90,
              rotateX: 0,
              scale: 58,
              transition: {
                type: 'keyframes',
                duration: SECOND_AIRPLANE_DURATION,
                ease: 'easeIn',
              },
            })
            .then(() => {
              controls.set({
                x: -36,
                y: 4,
                scale: 0.3,
                rotateX: 0,
              });
              setIsClick(false);
              setButtonIsHovered(false);
            });

          setTimeout(() => {
            setActiveSlideByAriaLabel(QUERY_SLIDE_VALUES.CONTACT);
          }, SECOND_AIRPLANE_DURATION * 800);
        });
    }
  }, [isClick]);

  useEffect(() => {
    if (buttonIsHovered) {
      controls
        .start({
          scale: 1.5,
          x: '50%',
          y: 0,
          rotateX: 0,
          rotateZ: 0,
          transformOrigin: 'center',
          transition: { duration: 0.3, ease: 'easeInOut' },
        })
        .then(() => {
          controls.stop();
          controls.start({
            x: ['50%', '40%', '47%', '43%', '50%'],
            y: [0, -2, -5, 2, 5, 0],
            rotateX: [0, 25, -5, 4, -25, -5, 0],
            rotateZ: [0, 2, -2, 1.5, -1.5, 0],
            scale: [1.5, 1.45, 1.55, 1.5],
            transition: {
              duration: 5,
              ease: 'easeInOut',
              repeat: Infinity,
              repeatType: 'mirror',
            },
          });
        });
    } else {
      controls.start({
        x: -36,
        y: 4,
        scale: 0.3,
        rotateX: 0,
      });
    }
  }, [buttonIsHovered]);

  return (
    <div
      ref={ref}
      className={cn(
        'absolute flex justify-center items-center translate-y-16',
        className
      )}
      {...props}
    >
      <Button
        className={'z-10 text-blue-dark'}
        onMouseEnter={() => !isClick && setButtonIsHovered(true)}
        onMouseLeave={() => !isClick && setButtonIsHovered(false)}
        onClick={() => {
          if (!isClick) setIsClick(true);
        }}
      >
        <SendHorizontal size={18} /> {`Let's talk`}
      </Button>
      <motion.div
        style={{ animationFillMode: 'none' }}
        initial={{
          x: -36,
          y: 4,
          scale: 0.3,
          rotateX: 0,
        }}
        animate={controls}
        className={'absolute transform-3d'}
      >
        <Image
          alt={'paper-airplane'}
          style={{ width: '100%', height: '100%' }}
          src={PaperAirplane}
        />
      </motion.div>

      {isClick && (
        <motion.div
          initial={{
            y: SCREEN_HEIGHT * 3,
            rotateZ: -90,
            rotateX: 0,
            scale: 58,
          }}
          animate={controlSecondAirplane}
          className={
            'absolute transform-3d top-1/2 left-1/2 -translate-x-1/2 z-[99999] blur-[0.5px]'
          }
        >
          <Image
            alt={'paper-airplane'}
            style={{ width: '100%', height: '100%' }}
            src={PaperAirplane}
          />
        </motion.div>
      )}
    </div>
  );
});

AirplaneButton.displayName = 'AirplaneButton';

export { AirplaneButton };
