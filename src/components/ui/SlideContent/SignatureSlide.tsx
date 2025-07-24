import React from 'react'
import { Slide } from '@/components/Slide'

const SignatureSlide = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((props, ref) => {
  return <Slide ref={ref}>Signature slide</Slide>
})

SignatureSlide.displayName = 'SignatureSlide'

export { SignatureSlide }
