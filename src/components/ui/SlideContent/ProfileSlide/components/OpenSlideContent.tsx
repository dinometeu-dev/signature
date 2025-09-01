import React from 'react';
import { cn } from '@/utils/functions/mergeClasses';
import WorkExperience from '@/components/ui/SlideContent/ProfileSlide/components/WorkExperience';

const OpenSlideContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('w-full flex z-20 text-white mt-24 gap-36', className)}
      {...props}
    >
      <div className={'w-[90%] flex flex-col gap-32 mt-64'}>
        <div></div>
      </div>
      <WorkExperience />
    </div>
  );
});

OpenSlideContent.displayName = 'OpenSlideContent';
export default OpenSlideContent;
