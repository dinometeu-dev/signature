import React from 'react'
import { Slide } from '@/components/Slide'

const ProfileSlide = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((props, ref) => {
  return <Slide ref={ref}>Profile Slide</Slide>
})

ProfileSlide.displayName = 'ProfileSlide'

export { ProfileSlide }
