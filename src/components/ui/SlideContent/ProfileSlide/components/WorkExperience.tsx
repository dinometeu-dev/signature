'use client';

import React, { useEffect, useState } from 'react';
import { PROFILE_WORK_EXPERIENCE } from '@/utils/constants/content';
import { cn } from '@/utils/functions/mergeClasses';
import Heading from '@/components/Heading';
import { ExperienceBlock } from '@/components/ExperienceBlock';
import { getExperiences } from '@/lib/api/experience';
import { ExperienceBlockType } from '@/types/api';

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

  return (
    <div
      ref={ref}
      className={cn('flex flex-col items-end w-full gap-11', className)}
      {...props}
    >
      <Heading text={PROFILE_WORK_EXPERIENCE} minFontSize={68} />
      <div className={'w-full'}>
        {data &&
          data.map(
            ({ id, companyName, imgPath, imageAlt, location, period }) => (
              <ExperienceBlock
                key={id}
                companyName={companyName}
                imgPath={imgPath}
                imageAlt={imageAlt}
                location={location}
                periods={period}
              />
            )
          )}
      </div>
    </div>
  );
});

WorkExperience.displayName = 'WorkExperience';
export default WorkExperience;
