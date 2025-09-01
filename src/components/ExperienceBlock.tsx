import React, { FC, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { cn } from '@/utils/functions/mergeClasses';
import dayjs from 'dayjs';
import { ExperiencePeriodType } from '@/types/api';
import ColorThief from 'colorthief';
import SpotlightCard from '@/components/SpotlightCard';

interface ExperiencePeriodProps extends React.HTMLAttributes<HTMLDivElement> {
  position: string;
  startDate: Date;
  endDate: Date | null;
}

interface ExperienceBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  companyName: string;
  imgPath: string;
  imageAlt: string;
  location: string;
  periods?: ExperiencePeriodType[];
}

const BASE_ICON_SIZE = 40;

const ExperiencePeriod = React.forwardRef<
  HTMLDivElement,
  ExperiencePeriodProps
>(({ className, position, endDate, startDate, ...props }, ref) => {
  const initialFrom = dayjs(startDate);
  const initialTo = endDate ? dayjs(endDate) : dayjs();

  const from = initialFrom.format('MMM YYYY');
  const to = initialTo.format('MMM YYYY');

  const periodOfWork =
    initialTo.diff(startDate, 'year') > 1
      ? `${initialTo.diff(startDate, 'year')} yrs`
      : `${initialTo.diff(startDate, 'month')} mo`;

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

const ExperienceBlock: FC<ExperienceBlockProps> = ({
  periods,
  imgPath,
  imageAlt,
  companyName,
  location,
  className,
}) => {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [bgColor, setBgColor] = useState<string | null>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    const handleLoad = () => {
      try {
        const colorThief = new ColorThief();
        const [r, g, b] = colorThief.getColor(img);
        setBgColor(`${r}, ${g}, ${b}`);
      } catch (err) {
        console.error('ColorThief failed:', err);
      }
    };

    if (img.complete) {
      handleLoad();
    } else {
      img.addEventListener('load', handleLoad);
      return () => img.removeEventListener('load', handleLoad);
    }
  }, []);

  return (
    <SpotlightCard
      spotlightColor={`rgba(${bgColor}, 0.6)`}
      className={cn(
        'flex relative w-full overflow-hidden flex-col gap-8 items-start p-6 backdrop-blur-sm rounded-3xl border border-white-200',
        className
      )}
    >
      <header className="w-full flex items-center gap-4">
        <Image
          ref={imgRef}
          src={imgPath}
          alt={imageAlt}
          width={BASE_ICON_SIZE}
          height={BASE_ICON_SIZE}
          unoptimized
          className={'size-10 rounded-full'}
        />
        <h2 className="text-4xl font-medium  font-headings">{companyName}</h2>
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
      <p className="text-white-800 text-base text-center w-full">{location}</p>
    </SpotlightCard>
  );
};

ExperiencePeriod.displayName = 'ExperiencePeriod';
ExperienceBlock.displayName = 'ExperienceBlock';

export { ExperiencePeriod, ExperienceBlock };
