import React from 'react'
import { Slide } from '@/components/Slide'
import { AirplaneButton } from '@/components/AirplaneButton'
import { SUBTITLE, TITLE } from '@/utils/constants/content'
import { Switcher } from '@/components/Switcher'
import { Volume2 } from 'lucide-react'
import { motion } from 'framer-motion'
import Image from 'next/image'

import ArrowUp from '@/../public/ArrowUp.png'
import ArrowDown from '@/../public/ArrowDown.png'
import Mouse from '@/../public/Mouse.png'

const SignatureSlide = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((props, ref) => {
  return (
    <Slide
      ref={ref}
      className={
        "bg-[url('/svg/Signature.svg')] bg-cover bg-position-[center_top_1em] bg-no-repeat flex flex-col justify-between items-center pb-9 overflow-visible"
      }
    >
      <div
        className={'flex flex-col items-center gap-9 text-center pt-24 z-10'}
      >
        <h1 className="font-domine text-5xl font-bold text-center leading-normal">
          {TITLE}
        </h1>
        <p className="text-base font-normal text-black-600 font-sf-pro">
          {SUBTITLE}
        </p>
      </div>
      <AirplaneButton className={'top-1/2 -translate-y-1/4 z-50'} />
      <div
        className={
          'w-full flex  items-center justify-between text-[12px] text-black-400 italic'
        }
      >
        <div className={'flex justify-center items-center gap-6 z-10'}>
          <Switcher defaultActive>
            <Volume2 />
          </Switcher>
          <p>You can turn ON the sounds</p>
        </div>
        <div
          className={
            'flex items-center justify-center gap-2 relative mr-32 z-10'
          }
        >
          <p>Use arrows for switch slides</p>
          <div className={'flex'}>
            <motion.div
              className={'-mr-2'}
              initial={{ width: 84, height: 84 }}
              animate={{
                scale: [1, 0.95, 1, 1, 1, 1, 1, 1, 1],
                transition: {
                  duration: 2,
                  ease: 'easeInOut',
                  repeat: Infinity,
                  repeatType: 'loop',
                },
              }}
            >
              <Image
                alt={'arrow up'}
                src={ArrowUp}
                style={{ width: '100%', height: '100%' }}
              />
            </motion.div>
            <motion.div
              initial={{ width: 84, height: 84 }}
              animate={{
                scale: [1, 1, 1, 1, 1, 0.95, 1, 1, 1],
                transition: {
                  duration: 2,
                  repeat: Infinity,
                  repeatType: 'loop',
                },
              }}
            >
              <Image
                alt={'arrow down'}
                src={ArrowDown}
                style={{ width: '100%', height: '100%' }}
              />
            </motion.div>
          </div>
          <p>or</p>
        </div>
        <div className="absolute inset-0 overflow-hidden rounded-slide">
          <div
            className={
              'absolute  right-0 top-1/2 translate-x-1/3 translate-y-1/12 scale-60 flex flex-col justify-top'
            }
          >
            <p
              className={
                'absolute text-2xl translate-x-full -rotate-12 translate-y-full'
              }
            >
              Just scroll!!
            </p>
            <Image
              alt={'mouse'}
              src={Mouse}
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        </div>
      </div>
    </Slide>
  )
})

SignatureSlide.displayName = 'SignatureSlide'

export { SignatureSlide }
