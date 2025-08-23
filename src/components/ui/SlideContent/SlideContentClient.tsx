'use client';

import { Slide } from '@/components/Slide';
import { WorkItem } from '@/types/api';
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

interface SlideComponentsClientProps
  extends React.HTMLAttributes<HTMLDivElement> {
  workItems: WorkItem[];
}

const SlideContentClient = React.forwardRef<
  HTMLDivElement,
  SlideComponentsClientProps
>(({ workItems }, ref) => {
  return (
    <SlideStack ref={ref}>
      <SignatureSlide aria-label={QUERY_STATE_SIGNATURE} />
      <ProfileSlide aria-label={QUERY_STATE_PROFILE} />
      {workItems.map((item) => (
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

SlideContentClient.displayName = 'SlideContentClient';

export { SlideContentClient };
