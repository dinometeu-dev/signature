import React, { FC } from 'react'
import { cn } from '@/utils/functions/mergeClasses'
import { LiquidGlassProps, Material } from '@/components/Material'

const Slide: FC<LiquidGlassProps> = ({ className, ...props }) => (
  <Material
    displacementScale={64}
    blurAmount={0.1}
    saturation={130}
    aberrationIntensity={2}
    elasticity={0}
    cornerRadius={50}
    mode={'standard'}
    padding="64px"
    className={cn('max-w-slide-width max-h-slide-height bg-white', className)}
    {...props}
  >
    <div className="flex items-center justify-center w-slide-height h-slide-height">
      {props.children}
    </div>
  </Material>
)

Slide.displayName = 'Slide'

export { Slide }
