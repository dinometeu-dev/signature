import React, { useEffect, useState } from 'react'
import { cn } from '@/utils/functions/mergeClasses'
import Material, { GlassSurfaceProps } from '@/components/Material'
import { motion } from 'framer-motion'
import { LucideProps } from 'lucide-react'

interface SwitcherProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'onChange'> {
  children: React.ReactNode
  onChange?: (isActive: boolean) => void
  defaultActive?: boolean
  contentClassName?: string
  glass?: GlassSurfaceProps
}

const Switcher = React.forwardRef<HTMLDivElement, SwitcherProps>(
  (
    {
      className,
      contentClassName,
      glass,
      children,
      defaultActive,
      onChange,
      ...props
    },
    ref
  ) => {
    const content = React.Children.toArray(children)
      .filter(React.isValidElement)
      .map((child) =>
        React.cloneElement(child as React.ReactElement<LucideProps>, {
          size: 14,
        })
      )

    const [isActive, setIsActive] = useState(defaultActive)

    const SWITCHER_MOVE = 22

    useEffect(() => {
      if (onChange) {
        onChange(Boolean(isActive))
      }
    }, [isActive])

    return (
      <div
        ref={ref}
        className={cn('relative flex justify-center items-center', className)}
        {...props}
      >
        <motion.div
          className={cn('absolute cursor-pointer ', contentClassName)}
          onClick={() => setIsActive(!isActive)}
          initial={{
            x: isActive ? `${SWITCHER_MOVE}%` : `-${SWITCHER_MOVE}%`,
          }}
          animate={{
            x: isActive ? `${SWITCHER_MOVE}%` : `-${SWITCHER_MOVE}%`,
          }}
          whileHover={{
            scale: 1.1,
          }}
        >
          <Material
            borderRadius={glass?.borderRadius ?? 24}
            width={glass?.width ?? '100%'}
            height={glass?.height ?? '100%'}
            distortionScale={glass?.distortionScale ?? -20}
            opacity={glass?.opacity ?? 0.5}
            blur={glass?.opacity ?? 20}
            displace={glass?.displace ?? 1.3}
            redOffset={glass?.redOffset ?? 0}
            greenOffset={glass?.greenOffset ?? 5}
            blueOffset={glass?.blueOffset ?? 10}
            {...glass}
          >
            <motion.div
              className={`px-3 py-1 text-black-750`}
              initial={{
                background: isActive
                  ? 'rgba(212, 94, 94, 0.25)'
                  : 'rgba(80, 182, 73, 0.25)',
              }}
              animate={{
                background: isActive
                  ? 'rgba(80, 182, 73, 0.25)'
                  : 'rgba(212, 94, 94, 0.25)',
              }}
            >
              {content}
            </motion.div>
          </Material>
        </motion.div>

        <div className={'px-6 py-[5px] rounded-full bg-gray-150'} />
      </div>
    )
  }
)

Switcher.displayName = 'Switcher'

export { Switcher }
