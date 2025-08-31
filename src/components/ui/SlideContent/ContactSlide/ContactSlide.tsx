import React from 'react'
import { Slide } from '@/components/Slide'

const ContactSlide = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((props, ref) => {
  return <Slide ref={ref}>Contact Slide</Slide>
})

ContactSlide.displayName = 'ContactSlide'

export { ContactSlide }
