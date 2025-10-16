'use client';

import React, { ComponentProps, FC } from 'react';

import { SlideStack } from '@/ui/SlideContent/components/SlideStack';
import { ContactSlide } from '@/ui/SlideContent/ContactSlide/ContactSlide';
import { ProfileSlide } from '@/ui/SlideContent/ProfileSlide/ProfileSlide';
import SignatureSlide from '@/ui/SlideContent/SignatureSlide/SignatureSlide';
import { QUERY_SLIDE_VALUES } from '@/utils/constants/paths';
import { WORK_EXPERIENCE } from '@slides/WorkSlide/utils/content';
import WorkSlide from '@slides/WorkSlide/WorkSlide';

const SlideContent: FC<ComponentProps<'div'>> = (props) => {
  return (
    <SlideStack {...props}>
      <SignatureSlide aria-label={QUERY_SLIDE_VALUES.SIGNATURE} />
      <ProfileSlide aria-label={QUERY_SLIDE_VALUES.PROFILE} />
      {WORK_EXPERIENCE.map((slide) => (
        <WorkSlide
          key={slide.id}
          aria-label={QUERY_SLIDE_VALUES.WORKS}
          id={slide.id.toString()}
          title={slide.title}
        />
      ))}
      <ContactSlide aria-label={QUERY_SLIDE_VALUES.CONTACT} />
    </SlideStack>
  );
};

export { SlideContent };
