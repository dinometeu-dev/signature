'use client';

import React, { ComponentProps, FC } from 'react';

import { SlideStack } from '@/ui/SlideContent/components/SlideStack';
import { ContactSlide } from '@/ui/SlideContent/ContactSlide/ContactSlide';
import { ProfileSlide } from '@/ui/SlideContent/ProfileSlide/ProfileSlide';
import SignatureSlide from '@/ui/SlideContent/SignatureSlide/SignatureSlide';
import { QUERY_SLIDE_VALUES } from '@/utils/constants/paths';
import { TimelineProvider } from '@/utils/providers/TimelineProvider';

const SlideContent: FC<ComponentProps<'div'>> = (props) => {
  return (
    <SlideStack {...props}>
      <SignatureSlide aria-label={QUERY_SLIDE_VALUES.SIGNATURE} />
      <TimelineProvider>
        <ProfileSlide aria-label={QUERY_SLIDE_VALUES.PROFILE} />
      </TimelineProvider>
      <ContactSlide aria-label={QUERY_SLIDE_VALUES.CONTACT} />
    </SlideStack>
  );
};

export { SlideContent };
