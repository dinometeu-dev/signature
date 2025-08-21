'use client';

import React, { useEffect, useState } from 'react';
import { PROFILE_WORK_EXPERIENCE } from '@/utils/constants/content';
import { cn } from '@/utils/functions/mergeClasses';
import Heading from '@/components/Heading';
import { ExperienceBlock } from '@/components/ExperienceBlock';
import { getExperiences } from '@/lib/api/experience';
import { ExperienceBlockType } from '@/types/api';
import Material from '@/components/Material';

const WorkExperience = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const [data, setData] = useState<null | ExperienceBlockType[]>(null);

  useEffect(() => {
    async function fetchData() {
      const experiences = await getExperiences();
      setData(experiences.data);
    }
    fetchData();
  }, []);

  console.log(data);

  return (
    <div
      ref={ref}
      className={cn('flex flex-col items-end w-full gap-8', className)}
      {...props}
    >
      <Heading text={PROFILE_WORK_EXPERIENCE} minFontSize={68} />
      <div className={'w-full flex flex-col gap-11'}>
        {data &&
          data.map(
            ({ id, companyName, imgPath, imageAlt, location, periods }) => (
              <ExperienceBlock
                key={id}
                companyName={companyName}
                imgPath={imgPath}
                imageAlt={imageAlt}
                location={location}
                periods={periods}
              />
            )
          )}
        <Material
          ref={ref}
          width="100%"
          height="100%"
          displace={3}
          borderRadius={26}
          style={{
            overflow: 'unset',
          }}
          contentClassName={cn(
            'flex w-full flex-col gap-8 items-start p-6 bg-black-150',
            className
          )}
        >
          <h2 className="text-4xl font-stretch-extra-expanded font-medium text-center w-full">
            Here I start
          </h2>
          <p className="w-full text-center text-white-600 text-base">
            I was 16
          </p>
        </Material>
      </div>
    </div>
  );
});

WorkExperience.displayName = 'WorkExperience';
export default WorkExperience;
