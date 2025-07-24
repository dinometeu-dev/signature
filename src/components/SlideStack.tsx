import React, { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/utils/functions/mergeClasses'
import { useGetQueryParams, useSetQueryParam } from '@/utils/hooks/navigation'
import { QUERY_STATE, QUERY_WORK_ITEM } from '@/utils/constants/routes'
import { QUERY_STATE_WORKS } from '@/utils/constants/paths'

interface SlideStackProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const SlideStack = React.forwardRef<HTMLDivElement, SlideStackProps>(
  ({ className, children, ...props }, ref) => {
    const getQueryParams = useGetQueryParams()
    const setQueryParam = useSetQueryParam()
    const activeState = getQueryParams(QUERY_STATE)
    const activeWorkItem = getQueryParams(QUERY_WORK_ITEM)

    const slides = React.Children.toArray(children) as React.ReactElement<
      React.HTMLAttributes<HTMLDivElement>
    >[]

    const [activeIndex, setActiveIndex] = useState(0)
    const [previousIndex, setPreviousIndex] = useState(0)

    const SCREEN_HEIGHT = typeof window !== 'undefined' ? window.innerHeight : 0

    const OFFSET_Y = 55
    const SCALE_STEP = 0.1
    const FLIP_DURATION = 0.5

    const handleNext = useCallback(() => {
      setActiveIndex((prev) => {
        setPreviousIndex(prev)

        if (prev < slides.length - 1) {
          return prev + 1
        }
        return prev
      })
    }, [])

    const handlePrev = useCallback(() => {
      setActiveIndex((prev) => {
        setPreviousIndex(prev)

        if (prev - 1 < 0) {
          return 0
        }
        return prev - 1
      })
    }, [])

    useEffect(() => {
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowUp') {
          handleNext()
        } else if (e.key === 'ArrowDown') {
          handlePrev()
        }
      }
      window.addEventListener('keydown', onKeyDown)
      return () => window.removeEventListener('keydown', onKeyDown)
    }, [handleNext, handlePrev])

    useEffect(() => {
      setQueryParam({
        [QUERY_STATE]: slides[activeIndex]?.props['aria-label'],
        [QUERY_WORK_ITEM]: slides[activeIndex]?.props['id'],
      })
    }, [activeIndex])

    useEffect(() => {
      if (!activeState) return
      const target = slides.findIndex((slide) => {
        const slideState = slide.props['aria-label']

        if (slideState === QUERY_STATE_WORKS) {
          return (
            activeWorkItem === slide.props['id'] && slideState === activeState
          )
        }
        return slideState === activeState
      })
      if (target !== -1 && target !== activeIndex) {
        setActiveIndex((prev) => {
          setPreviousIndex(prev)
          return target
        })
      }
    }, [activeState])

    return (
      <div
        ref={ref}
        className={cn('relative w-full h-full', className)}
        {...props}
      >
        {slides.map((child, index) => {
          const relativeIndex = index - activeIndex

          let yOffset = 0
          let scale = 1
          let delay = 0

          if (Math.abs(previousIndex - activeIndex) > 1) {
            delay = Math.abs(
              Math.round((slides.length - Math.abs(relativeIndex) - 1) * 10) /
                100
            )
          }

          if (relativeIndex >= 0) {
            if (relativeIndex < 3) {
              yOffset = OFFSET_Y * relativeIndex
            }
            if (relativeIndex < 3) {
              scale = 1 - SCALE_STEP * relativeIndex
            } else {
              scale = 0.8
            }
          } else {
            yOffset -= SCREEN_HEIGHT + OFFSET_Y * 2
          }

          return (
            <motion.div
              key={index}
              className="absolute w-full h-full flex justify-center items-center"
              aria-label={child.props['aria-label']}
              id={child.props['id']}
              style={{ zIndex: slides.length - relativeIndex }}
              initial={{ y: yOffset, scale }}
              animate={{ y: yOffset, scale }}
              transition={{
                duration: FLIP_DURATION,
                delay,
              }}
            >
              {child}
            </motion.div>
          )
        })}
      </div>
    )
  }
)

SlideStack.displayName = 'SlideStack'
export { SlideStack }
