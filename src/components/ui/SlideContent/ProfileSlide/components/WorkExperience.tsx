'use client';

import React from 'react';
import { PROFILE_WORK_EXPERIENCE } from '@/utils/constants/content';
import { cn } from '@/utils/functions/mergeClasses';
import Heading from '@/components/Heading';
import { ExperienceBlock } from '@/components/ExperienceBlock';

import { useExperienceBlocks } from '@/lib/api/experienceBlock';

const WorkExperience = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { blocks } = useExperienceBlocks();

  return (
    <div
      ref={ref}
      className={cn('flex flex-col items-end w-full gap-8', className)}
      {...props}
    >
      <Heading text={PROFILE_WORK_EXPERIENCE} minFontSize={68} />
      <div className={'w-full flex flex-col gap-11'}>
        {blocks?.map(
          ({ id, companyName, iconPath, alt, location, periods }) => (
            <ExperienceBlock
              key={id}
              companyName={companyName}
              imgPath={iconPath}
              imageAlt={alt}
              location={location}
              periods={periods}
            />
          )
        )}
        <div className="flex w-full flex-col gap-8 items-start p-6 backdrop-blur-sm rounded-3xl border border-white-200 bg-black-200">
          <h2 className="text-4xl font-stretch-extra-expanded font-medium text-center w-full">
            Here I start
          </h2>
          <p className="w-full text-center text-white-600 text-base">
            I was 16
          </p>
        </div>
      </div>
    </div>
  );
});

WorkExperience.displayName = 'WorkExperience';
export default WorkExperience;
