'use client'

import { useRef, useEffect, useState } from 'react'
import type { FC } from 'react'
import type { WorkItem } from '@/generated/prisma'
import { useGetQueryParams } from '@/utils/hooks/navigation'
import { QUERY_STATE } from '@/utils/constants/routes'
import { QUERY_STATE_WORKS } from '@/utils/constants/paths'

type TransitionGroupProps = {
  menuContent: WorkItem[] | number[]
}

const TransitionGroup: FC<TransitionGroupProps> = ({ menuContent }) => {
  const getQueryParams = useGetQueryParams()
  const currentState = getQueryParams(QUERY_STATE)

  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollIndex, setScrollIndex] = useState(0)
  const [visibleCount, setVisibleCount] = useState(0)

  const firstVisibleItem = scrollIndex >= 1
  const lastVisibleItem = scrollIndex < menuContent.length - 1 - visibleCount

  const centerIndex = scrollIndex

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const handleScroll = () => {
      const itemHeight = el.scrollHeight / menuContent.length
      const index = Math.round(el.scrollTop / itemHeight)
      setScrollIndex(index)

      const count = Math.ceil(el.clientHeight / itemHeight)
      setVisibleCount(count)
    }

    handleScroll()
    el.addEventListener('scroll', handleScroll)
    return () => el.removeEventListener('scroll', handleScroll)
  }, [menuContent.length])

  return (
    <div className="relative h-[96.4px] w-10">
      {/* top fade */}
      <div
        className={`pointer-events-none absolute top-0 left-0 w-full h-2 bg-gradient-to-b from-white to-transparent z-10 transition ${
          firstVisibleItem && lastVisibleItem ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* scrollable container */}
      <div
        ref={containerRef}
        className="h-full w-full overflow-y-scroll scroll-smooth scrollbar-hidden flex flex-col items-center gap-2"
      >
        {menuContent.map((_, index) => {
          const distance = Math.abs(index - centerIndex)

          const handleBgColor = (color: string) =>
            currentState === QUERY_STATE_WORKS ? color : 'rgba(0, 0, 0, 0.2)'

          const setStyles = (height?: string, bgColor?: string) => {
            return {
              height: height ?? '18px',
              minHeight: height ?? '18px',
              backgroundColor: bgColor ?? handleBgColor('rgba(0, 0, 0, 1)'),
            }
          }

          let styles = setStyles()

          if (distance === 1) {
            styles = setStyles('14px', handleBgColor('rgba(0, 0, 0, 0.4)'))
          } else if (distance === 2) {
            styles = setStyles('10px', handleBgColor('rgba(0, 0, 0, 0.2)'))
          } else if (distance > 2) {
            styles = setStyles('6px', handleBgColor('rgba(0, 0, 0, 0.1)'))
          }

          return (
            <div
              key={index}
              className={`relative w-0.5 bg-black-200 rounded-full transition-all ease-in-out duration-200 cursor-pointer`}
              style={styles}
            />
          )
        })}
      </div>

      {/*bottom fade*/}
      <div
        className={`pointer-events-none absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-white to-transparent z-10 transition`}
      />
    </div>
  )
}

TransitionGroup.displayName = 'TransitionGroup'

export { TransitionGroup }
