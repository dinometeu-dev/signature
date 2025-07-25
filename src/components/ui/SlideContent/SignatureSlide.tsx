import React from 'react'
import { Slide } from '@/components/Slide'
import { AirplaneButton } from '@/components/AirplaneButton'
import { SUBTITLE, TITLE } from '@/utils/constants/content'

const SignatureSlide = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((props, ref) => {
  return (
    <Slide
      ref={ref}
      className={
        "bg-[url('/svg/Signature.svg')] bg-cover bg-position-[center_top_1em] bg-no-repeat flex flex-col justify-between items-center"
      }
    >
      <div className={'flex flex-col items-center gap-9 text-center pt-24'}>
        <h1 className="font-domine text-5xl font-bold text-center leading-normal">
          {TITLE}
        </h1>
        <p className="text-base font-normal text-black-600 font-sf-pro">
          {SUBTITLE}
        </p>
      </div>
      <AirplaneButton className={'top-1/2 -translate-y-1/4'} />
      <div>vfdf</div>
    </Slide>
  )
})

SignatureSlide.displayName = 'SignatureSlide'

export { SignatureSlide }
