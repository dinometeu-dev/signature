import React from 'react';
import Image from 'next/image';
import { cn } from '@/utils/functions/mergeClasses';
import dayjs from 'dayjs';
import { ExperiencePeriodType } from '@/types/api';

interface ExperiencePeriodProps extends React.HTMLAttributes<HTMLDivElement> {
  position: string;
  startDate: Date;
  endDate: Date;
}

interface ExperienceBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  companyName: string;
  imgPath: string;
  imageAlt: string;
  location: string;
  periods?: ExperiencePeriodType[];
}

const ExperiencePeriod = React.forwardRef<
  HTMLDivElement,
  ExperiencePeriodProps
>(({ className, position, endDate, startDate, ...props }, ref) => {
  const from = dayjs(startDate).format('MMM YYYY');
  const to = dayjs(endDate).format('MMM YYYY');
  const periodOfWork =
    dayjs(endDate).diff(startDate, 'year') > 1
      ? `${dayjs(endDate).diff(startDate, 'year')} yrs`
      : `${dayjs(endDate).diff(startDate, 'month')} mo`;

  return (
    <div ref={ref} className={cn('flex gap-3.5', className)} {...props}>
      <div className="flex flex-col items-center justify-center mt-4">
        <div className="size-1 min-h-1 rounded-full bg-white-600" />
        <div className="w-px h-full bg-gradient-to-b from-white-600 to-transparent to-95%" />
      </div>
      <div className="flex flex-col gap-3.5">
        <h4 className="text-2xl">{position}</h4>
        <div className="flex items-center justify-start gap-4 text-white-800 text-base">
          <p className="">
            {from} - {to}
          </p>
          <div className="w-px h-3/4 rounded-full bg-white-600" />
          <p className=" italic">{periodOfWork}</p>
        </div>
      </div>
    </div>
  );
});

const ExperienceBlock = React.forwardRef<HTMLDivElement, ExperienceBlockProps>(
  ({ periods, imgPath, imageAlt, companyName, location, className }, ref) => {
    return (
      <div
        className={cn(
          'flex w-full flex-col gap-8 items-start p-6 backdrop-blur-sm rounded-3xl border border-white-200 bg-black-200',
          className
        )}
        ref={ref}
      >
        <header className="w-full flex items-center gap-4">
          <Image
            src={`/${imgPath}`}
            alt={imageAlt}
            width={40}
            height={40}
            className={'size-10 rounded-full'}
          />
          <h2 className="text-4xl font-stretch-extra-expanded font-medium">
            {companyName}
          </h2>
        </header>
        <div className={'flex flex-col gap-6'}>
          {periods?.map(({ id, position, startDate, endDate }) => (
            <ExperiencePeriod
              key={id}
              position={position}
              startDate={startDate}
              endDate={endDate}
            />
          ))}
        </div>
        <p className="text-white-800 text-base text-center w-full">
          {location}
        </p>
      </div>
    );
  }
);

ExperiencePeriod.displayName = 'ExperiencePeriod';
ExperienceBlock.displayName = 'ExperienceBlock';

export { ExperiencePeriod, ExperienceBlock };
