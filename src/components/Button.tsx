'use client'

import React, { FC } from 'react'

import { LiquidGlassProps, Material } from '@/components/Material'
import { cn } from '@/utils/functions/mergeClasses'

const Button: FC<LiquidGlassProps> = ({ className, children, ...props }) => {
  return (
    <Material
      displacementScale={64}
      blurAmount={0.1}
      saturation={130}
      aberrationIntensity={2}
      elasticity={0.35}
      cornerRadius={100}
      mode={'standard'}
      padding="12px 22px"
      className={'cursor-pointer'}
      {...props}
    >
      <span
        className={cn(
          'flex items-center justify-center gap-3 text-base',
          className
        )}
      >
        {children}
      </span>
    </Material>
  )
}

Button.displayName = 'Button'

export { Button }
