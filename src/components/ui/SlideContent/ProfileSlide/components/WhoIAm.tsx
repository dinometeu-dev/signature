import React from 'react';
import Heading from '@/components/Heading';
import { PROFILE_WHO_I_AM } from '@/utils/constants/content';

const WhoIAm = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((props, ref) => {
  return (
    <div ref={ref} {...props} className={'w-full flex flex-col gap-11'}>
      <Heading text={PROFILE_WHO_I_AM} minFontSize={68} />
      <p className="text-base leading-8 tracking-wide text-white-800">
        I’m a thoughtful and proactive Front-End Developer with a strong focus
        on building reliable, user-centered interfaces and improving the quality
        of both code and processes. I approach development not just as a task,
        but as a way to improve the flow of work within a team — through
        structure, documentation, and clear communication. I believe in
        balancing precision and speed, delivering well-organized code while also
        contributing to a positive and collaborative team environment. My
        development style emphasizes clarity, consistency, and maintainability.
      </p>
    </div>
  );
});

WhoIAm.displayName = 'WhoIAm';
export default WhoIAm;
