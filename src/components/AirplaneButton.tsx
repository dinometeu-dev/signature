'use client'

import React, { useEffect, useState } from 'react'
import { SendHorizontal } from 'lucide-react'
import { Button } from '@/components/Button'
import Image from 'next/image'
import PaperAirplane from '@/../public/PaperAirplane.png'
import { motion, useAnimationControls } from 'framer-motion'
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '@/utils/constants/styled'
import { useSetQueryParam } from '@/utils/hooks/navigation'
import { QUERY_STATE } from '@/utils/constants/routes'
import { QUERY_STATE_CONTACT } from '@/utils/constants/paths'
import { cn } from '@/utils/functions/mergeClasses'

const AirplaneButton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const setQueryParam = useSetQueryParam()

  const controls = useAnimationControls()
  const controlSecondAirplane = useAnimationControls()
  const [buttonIsHovered, setButtonIsHovered] = useState(false)
  const [isClick, setIsClick] = useState(false)

  const SECOND_AIRPLANE_DURATION = 0.8

  useEffect(() => {
    if (isClick) {
      controls
        .start({
          x: SCREEN_WIDTH,
          transition: { duration: 1, ease: 'backInOut' },
        })
        .then(() => {
          controlSecondAirplane.start({
            y: -SCREEN_HEIGHT + 200,
            rotateZ: [-90, -92, -86, -90],
            rotateX: [0, 14, 0],
            scale: [30, 28, 30],
            transition: {
              type: 'keyframes',
              duration: SECOND_AIRPLANE_DURATION,
              ease: 'easeIn',
              rotateX: {
                duration: SECOND_AIRPLANE_DURATION,
                ease: 'easeInOut',
              },
              scale: {
                duration: SECOND_AIRPLANE_DURATION,
                ease: 'easeInOut',
              },
              rotateZ: {
                duration: SECOND_AIRPLANE_DURATION,
                ease: 'easeInOut',
              },
            },
          })

          setTimeout(() => {
            setQueryParam(QUERY_STATE, QUERY_STATE_CONTACT)
          }, SECOND_AIRPLANE_DURATION * 800)

          setTimeout(() => setIsClick(false), SECOND_AIRPLANE_DURATION * 2000)
        })

      return
    }
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
          return controls.start({
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
          })
        })
    } else {
      controls.stop()
      controls.start({
        x: -36,
        y: 4,
        scale: 0.3,
        rotateX: 0,
      })
    }
  }, [buttonIsHovered, isClick, controls])

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
        contentClassName={'text-blue-dark'}
        className={'z-10'}
        onMouseEnter={() => setButtonIsHovered(true)}
        onMouseLeave={() => setButtonIsHovered(false)}
        onClick={() => {
          if (!isClick) setIsClick(true)
        }}
      >
        <SendHorizontal size={18} /> {`Let's talk`}
      </Button>
      <motion.div
        style={{ animationFillMode: isClick ? 'forwards' : 'none' }}
        initial={{ scale: 0.3, y: 4 }}
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
          initial={{ y: SCREEN_HEIGHT * 2, scale: 30 }}
          animate={controlSecondAirplane}
          className={
            'absolute transform-3d top-1/2 left-1/2 -translate-x-1/2 z-40 blur-[0.2px]'
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
  )
})

AirplaneButton.displayName = 'AirplaneButton'

export { AirplaneButton }
