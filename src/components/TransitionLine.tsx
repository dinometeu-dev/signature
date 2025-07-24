'use client'

import { FC, useEffect, useState } from 'react'
import clsx from 'clsx'
import { cn } from '@/utils/functions/mergeClasses'

type TransitionLineProps = {
  isActiveFromTop?: boolean
  isActiveFromBottom?: boolean
  className?: string
  style?: React.CSSProperties
}

export const TransitionLine: FC<TransitionLineProps> = ({
  isActiveFromTop,
  isActiveFromBottom,
  className,
  style,
}) => {
  const [activeStyle, setActiveStyle] = useState<'top' | 'bottom' | 'default'>(
    'default'
  )

  useEffect(() => {
    if (isActiveFromTop) {
      setActiveStyle('top')
    } else if (isActiveFromBottom) {
      setActiveStyle('bottom')
    } else {
      setActiveStyle('default')
    }
  }, [isActiveFromTop, isActiveFromBottom])

  return (
    <div
      className={cn('relative w-0.5 h-[18px] rounded-full', className)}
      style={style}
    >
      <div
        className={clsx(
          'absolute inset-0 rounded-full bg-gradient-to-b from-black-800 to-transparent transition-opacity duration-300',
          activeStyle === 'bottom' ? 'opacity-100' : 'opacity-0'
        )}
      />
      <div
        className={clsx(
          'absolute inset-0 rounded-full bg-gradient-to-b from-transparent to-black-800 transition-opacity duration-300',
          activeStyle === 'top' ? 'opacity-100' : 'opacity-0'
        )}
      />
      <div
        className={clsx(
          'absolute inset-0 rounded-full bg-black-200 transition-opacity duration-300',
          activeStyle === 'default' ? 'opacity-100' : 'opacity-0'
        )}
      />
    </div>
  )
}
