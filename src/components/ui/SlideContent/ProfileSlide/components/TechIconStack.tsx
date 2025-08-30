import React, { useEffect, useState } from 'react';
import IconStack from '@/components/IconStack';
import { cn } from '@/utils/functions/mergeClasses';
import type { TechnologyType } from '@/types/api';
import { getTechnology } from '@/lib/api/technology';
import { BASE_TECHNOLOGY_LOGOS } from '@/utils/constants/paths';

const TechIconStack = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const [technologies, setTechnologies] = useState<TechnologyType[] | null>(
    null
  );

  useEffect(() => {
    const fetchTechnology = async () => {
      const response = await getTechnology();

      if (!response.error) {
        setTechnologies(response.data);
      }
    };

    fetchTechnology();
  }, []);

  console.log(technologies);

  return technologies ? (
    <div
      ref={ref}
      className={cn('flex justify-center items-center gap-8', className)}
      {...props}
    >
      <p>Stack</p>
      <IconStack
        icons={technologies?.map(({ name, iconPath }) => ({
          src: `${BASE_TECHNOLOGY_LOGOS}/${iconPath}`,
          alt: name,
        }))}
      />
    </div>
  ) : (
    <div>Loading</div>
  );
});

TechIconStack.displayName = 'TechIconStack';
export default TechIconStack;
