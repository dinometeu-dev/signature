'use client'

import React from 'react'
import { cn } from '@/utils/functions/mergeClasses'
import LiquidGlass from 'liquid-glass-react'

export interface LiquidGlassProps {
  children: React.ReactNode
  displacementScale?: number
  blurAmount?: number
  saturation?: number
  aberrationIntensity?: number
  elasticity?: number
  cornerRadius?: number
  globalMousePos?: {
    x: number
    y: number
  }
  mouseOffset?: {
    x: number
    y: number
  }
  mouseContainer?: React.RefObject<HTMLElement | null> | null
  className?: string
  padding?: string
  style?: React.CSSProperties
  overLight?: boolean
  mode?: 'standard' | 'polar' | 'prominent' | 'shader'
  onClick?: () => void
}

const Material = ({ children, className, ...props }: LiquidGlassProps) => (
  <LiquidGlass className={cn('', className)} {...props}>
    {children}
  </LiquidGlass>
)

export { Material }
