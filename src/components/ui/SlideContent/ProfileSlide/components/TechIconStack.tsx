import React from 'react';
import IconStack from '@/components/IconStack';
import { cn } from '@/utils/functions/mergeClasses';
import { BASE_TECHNOLOGY_LOGOS } from '@/utils/constants/paths';
import { useTechnologies } from '@/lib/api/technology';

const TechIconStack = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { technologies, isLoading } = useTechnologies();

  return (
    <div
      ref={ref}
      className={cn('flex justify-center items-center gap-8', className)}
      {...props}
    >
      <p>Stack</p>
      <IconStack
        isLoading={isLoading}
        icons={technologies?.map(({ name, iconPath }) => ({
          src: `${BASE_TECHNOLOGY_LOGOS}/${iconPath}`,
          alt: name,
        }))}
      />
    </div>
  );
});

TechIconStack.displayName = 'TechIconStack';
export default TechIconStack;
