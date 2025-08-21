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
    fontSize: 18,
    textColor: '--color-black-400',
    duration: 0.5,
  },
  {
    key: 'months',
    value: months,
    label: 'months',
    className: 'text-[22px] text-black-600',
    textColor: '--color-black-600',
    fontSize: 22,
    duration: 0.5,
  },
  {
    key: 'weeks',
    value: weeks,
    label: 'weeks',
    className: 'text-[26px] text-black-700',
    textColor: '--color-black-700',
    fontSize: 26,
    duration: 0.5,
  },
  {
    key: 'days',
    value: days,
    label: 'days',
    className: 'text-[32px] text-black-800',
    textColor: '--color-black-800',
    fontSize: 32,
    duration: 0.5,
  },
  {
    key: 'hours',
    value: hours,
    label: 'hours',
    className: 'text-[36px] text-black-900',
    textColor: '--color-black-900',
    fontSize: 36,
    duration: 1,
  },
];

const ExperienceScore = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
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
          <Counter from={value} to={value} duration={duration} direction="up" />{' '}
          {label}
        </div>
      ))}
      <h1 className="text-[64px]">Of experience</h1>
    </div>
  );
});

ExperienceScore.displayName = 'ExperienceScore';
export default ExperienceScore;
