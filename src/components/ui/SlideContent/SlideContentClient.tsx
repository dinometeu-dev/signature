'use client'

import React from 'react'
import { SlideStack } from '@/components/SlideStack'
import { Slide } from '@/components/Slide'
import { WorkItem } from '@/types/api'
import { SignatureSlide } from '@/components/ui/SlideContent/SignatureSlide'
import {
  QUERY_STATE_CONTACT,
  QUERY_STATE_PROFILE,
  QUERY_STATE_SIGNATURE,
  QUERY_STATE_WORKS,
} from '@/utils/constants/paths'
import { ProfileSlide } from '@/components/ui/SlideContent/ProfileSlide'
import { ContactSlide } from '@/components/ui/SlideContent/ContactSlide'

interface SlideComponentsClientProps
  extends React.HTMLAttributes<HTMLDivElement> {
  workItems: WorkItem[]
}

const SlideContentClient = React.forwardRef<
  HTMLDivElement,
  SlideComponentsClientProps
>(({ workItems }, ref) => {
  return (
    <SlideStack ref={ref}>
      <SignatureSlide aria-label={QUERY_STATE_SIGNATURE} />
      <SignatureSlide aria-label={'1'} />
      <SignatureSlide aria-label={'2'} />
      <SignatureSlide aria-label={'3'} />
      <SignatureSlide aria-label={'4'} />

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
  )
})

SlideContentClient.displayName = 'SlideContentClient'

export { SlideContentClient }
