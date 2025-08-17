import { cn } from '@/utils/functions/mergeClasses';

import TiltedCard from '@/components/TitledCard';
import React from 'react';

const ProfileCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div className={cn('', className)} ref={ref} {...props}>
      <TiltedCard
        altText="Petrov Dmitri - Front End Developer"
        captionText="Petrov Dmitri - Front End Developer"
        containerHeight="486px"
        containerWidth="296px"
        imageHeight="486px"
        imageWidth="296px"
        rotateAmplitude={12}
        scaleOnHover={1.2}
        showMobileWarning={false}
        showTooltip={true}
      />
    </div>
  );
});

ProfileCard.displayName = 'ProfileCard';

export { ProfileCard };
