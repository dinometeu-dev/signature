import React from 'react'
import { Slide } from '@/components/Slide'
import { PROFILE_TITLE } from '@/utils/constants/content'
import Counter from '@/components/Counter'
import dayjs from 'dayjs'
import { ProfileCard } from '@/components/ProfileCard'

const ProfileSlide = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((props, ref) => {
  const start = dayjs('2019-01-01', 'YYYY-MM-DD')
  const years = dayjs().diff(start, 'year')
  const months = dayjs().diff(start, 'month')
  const weeks = dayjs().diff(start, 'week')
  const days = dayjs().diff(start, 'day')
  const hours = dayjs().diff(start, 'hour')

  const timeStats = [
    {
      key: 'years',
      value: years,
      label: 'years',
      className: 'text-xl text-black-600',
      duration: 0.5,
    },
    {
      key: 'months',
      value: months,
      label: 'months',
      className: 'text-[22px] text-black-700',
      duration: 0.5,
    },
    {
      key: 'weeks',
      value: weeks,
      label: 'weeks',
      className: 'text-[26px] text-black-800',
      duration: 0.5,
    },
    {
      key: 'days',
      value: days,
      label: 'days',
      className: 'text-[32px] text-black-900',
      duration: 0.5,
    },
    {
      key: 'hours',
      value: hours,
      label: 'hours',
      className: 'text-[36px]',
      duration: 1,
    },
  ]

  const handleGetStoredValue = (key: string) => {
    return typeof window !== 'undefined' && localStorage.getItem(key)
  }

  return (
    <Slide ref={ref} className={' overflow-hidden flex justify-between'}>
      <div className={'flex flex-col justify-start gap-12 w-full'}>
        <h2 className={'text-[40px] font-domine font-bold '}>
          {PROFILE_TITLE}
        </h2>
        <div
          className={
            'flex flex-col justify-start gap-3.5 font-sf-pro font-stretch-extra-expanded'
          }
        >
          {timeStats.map(({ key, value, label, className, duration }) => (
            <div key={key} className={className}>
              <Counter
                from={handleGetStoredValue(key) ? value : 0}
                to={value}
                duration={duration}
                direction="up"
                onEnd={() => localStorage.setItem(key, String(value))}
              />{' '}
              {label}
            </div>
          ))}
          <h1 className={'text-[64px]'}>Of experience</h1>
        </div>
      </div>

      <div className={'relative w-full'}>
        <ProfileCard className={'z-10 absolute justify-self-end '} />
      </div>

      <div
        className={
          "absolute bg-[url('/WaterBg.png')] bg-cover bg-no-repeat w-full h-[300px] left-0 bottom-0"
        }
      />
    </Slide>
  )
})

ProfileSlide.displayName = 'ProfileSlide'

export { ProfileSlide }
