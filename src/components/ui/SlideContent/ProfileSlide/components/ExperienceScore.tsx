import React, { Fragment } from 'react';
import Counter from '@/components/Counter';
import dayjs from 'dayjs';
import { cn } from '@/utils/functions/mergeClasses';
import TechIconStack from '@/components/ui/SlideContent/ProfileSlide/components/TechIconStack';
import SocialIconStack from '@/components/ui/SlideContent/ProfileSlide/components/SocialIconStack';

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
    more: 'Next.js • React • UI Engineering',
  },
  {
    key: 'months',
    value: months,
    label: 'months',
    more: 'Improving performance up to 60%',
  },
  {
    key: 'weeks',
    value: weeks,
    label: 'weeks',
    more: '20+ projects delivered',
  },
  {
    key: 'days',
    value: days,
    label: 'days',
    more: <TechIconStack />,
  },
  {
    key: 'hours',
    value: hours,
    label: 'hours',
    more: <SocialIconStack />,
  },
];

const MIN_FONT_SIZE = 20;
const STEP_FONT_SIZE = 6;

export const ExperienceScore = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'flex flex-col justify-start  relative leading-none',
        className
      )}
      {...props}
    >
      <div className="flex flex-col justify-start gap-3 max-w-2/3 tracking-wide z-50">
        {timeStats.map(({ key, value, label, more }, idx) => {
          const fontSize = MIN_FONT_SIZE + idx * STEP_FONT_SIZE;
          return (
            <Fragment key={key}>
              <div
                style={{ fontSize }}
                className="w-full flex justify-between items-center"
              >
                <div>
                  <Counter from={0} to={value} duration={2} direction="up" />{' '}
                  {label}
                </div>
                <div className="text-sm italic text-black">{more}</div>
              </div>
              <div className="w-full h-px rounded-full bg-gradient-to-r from-transparent to-black/20" />
            </Fragment>
          );
        })}
      </div>
      <h1 className="text-[118px]">Of experience</h1>
      {/*<div className="absolute inset-0 bg-gradient-to-b from-white/80  to-white/10 to-70%" />*/}
    </div>
  );
});

ExperienceScore.displayName = 'ExperienceScore';
