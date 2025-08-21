import React from 'react';
import Heading from '@/components/Heading';
import { PROFILE_CERTIFICATES } from '@/utils/constants/content';

const Certificates = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((props, ref) => {
  return (
    <div ref={ref} {...props}>
      <Heading text={PROFILE_CERTIFICATES} minFontSize={68} />
    </div>
  );
});

Certificates.displayName = 'Certificates';
export default Certificates;
