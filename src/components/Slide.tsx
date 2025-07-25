'use client'

import React from 'react'
import { cn } from '@/utils/functions/mergeClasses'

const Slide = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'relative p-16 rounded-slide bg-white shadow-material w-full max-h-slide-height h-full',
        className
      )}
    >
      {children}
    </div>
  )
})

Slide.displayName = 'Slide'

export { Slide }
