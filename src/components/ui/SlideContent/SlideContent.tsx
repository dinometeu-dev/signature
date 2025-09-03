'use client';

import React, { ComponentProps, FC } from 'react';

import { SlideStack } from '@/components/ui/SlideContent/components/SlideStack';
import { ContactSlide } from '@/components/ui/SlideContent/ContactSlide/ContactSlide';
import { ProfileSlide } from '@/components/ui/SlideContent/ProfileSlide/ProfileSlide';
import SignatureSlide from '@/components/ui/SlideContent/SignatureSlide/SignatureSlide';
import { QUERY_SLIDE_VALUES } from '@/utils/constants/paths';

const SlideContent: FC<ComponentProps<'div'>> = (props) => {
  return (
    <SlideStack {...props}>
      <SignatureSlide aria-label={QUERY_SLIDE_VALUES.SIGNATURE} />
      <ProfileSlide aria-label={QUERY_SLIDE_VALUES.PROFILE} />
      <ContactSlide aria-label={QUERY_SLIDE_VALUES.CONTACT} />
    </SlideStack>
  );
};

export { SlideContent };
