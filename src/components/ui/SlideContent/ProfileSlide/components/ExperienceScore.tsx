import React from 'react';
import Counter from '@/components/Counter';
import dayjs from 'dayjs';
import { cn } from '@/utils/functions/mergeClasses';

const start = dayjs('2019-01-01', 'YYYY-MM-DD');
const years = dayjs().diff(start, 'year');
const months = dayjs().diff(start, 'month');
const weeks = dayjs().diff(start, 'week');
const days = dayjs().diff(start, 'day');
const hours = dayjs().diff(start, 'hour');

const timeStats = [
  {
    key: 'years',
    value: years,
    label: 'years',
    className: 'text-xl text-black-400',
    duration: 0.5,
  },
  {
    key: 'months',
    value: months,
    label: 'months',
    className: 'text-[22px] text-black-600',
    duration: 0.5,
  },
  {
    key: 'weeks',
    value: weeks,
    label: 'weeks',
    className: 'text-[26px] text-black-700',
    duration: 0.5,
  },
  {
    key: 'days',
    value: days,
    label: 'days',
    className: 'text-[32px] text-black-800',
    duration: 0.5,
  },
  {
    key: 'hours',
    value: hours,
    label: 'hours',
    className: 'text-[36px] text-black-900',
    duration: 1,
  },
];

const ExperienceScore = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const handleGetStoredValue = (key: string) => {
    return typeof window !== 'undefined' && localStorage.getItem(key);
  };

  return (
    <div
      ref={ref}
      className={cn(
        'flex flex-col justify-start gap-3.5 font-stretch-extra-expanded',
        className
      )}
      {...props}
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
      <h1 className="text-[64px]">Of experience</h1>
    </div>
  );
});

ExperienceScore.displayName = 'ExperienceScore';
export default ExperienceScore;
