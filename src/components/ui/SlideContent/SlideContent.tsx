'use client';

import { Slide } from '@/components/Slide';
import React from 'react';
import {
  QUERY_STATE_CONTACT,
  QUERY_STATE_PROFILE,
  QUERY_STATE_SIGNATURE,
  QUERY_STATE_WORKS,
} from '@/utils/constants/paths';
import { SignatureSlide } from '@/components/ui/SlideContent/SignatureSlide';
import { ProfileSlide } from '@/components/ui/SlideContent/ProfileSlide/ProfileSlide';
import { SlideStack } from '@/components/SlideStack';
import { ContactSlide } from '@/components/ui/SlideContent/ContactSlide';
import { useWorkItems } from '@/lib/api/workItem';

const SlideContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((props, ref) => {
  const { workItems } = useWorkItems();

  return (
    <SlideStack ref={ref}>
      <SignatureSlide aria-label={QUERY_STATE_SIGNATURE} />
      <ProfileSlide aria-label={QUERY_STATE_PROFILE} />
      {workItems?.map((item) => (
        <Slide
          key={item.id}
          aria-label={QUERY_STATE_WORKS}
          id={item.id.toString()}
          className="flex flex-col items-center justify-center h-full w-full"
        >
          <h2 className="text-2xl font-bold mb-4">{item.title}</h2>
          <p className="text-lg">{item.description}</p>
        </Slide>
      ))}
      <ContactSlide aria-label={QUERY_STATE_CONTACT} />
    </SlideStack>
  );
});

SlideContent.displayName = 'SlideContent';

export { SlideContent };
