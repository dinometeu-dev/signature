'use client';

import React, { ComponentProps, FC } from 'react';

import type { PublicPortfolioContent } from '@/lib/content/types';
import { SlideStack } from '@/ui/SlideContent/components/SlideStack';
import { ContactSlide } from '@/ui/SlideContent/ContactSlide/ContactSlide';
import { ProfileSlide } from '@/ui/SlideContent/ProfileSlide/ProfileSlide';
import SignatureSlide from '@/ui/SlideContent/SignatureSlide/SignatureSlide';
import { QUERY_SLIDE_VALUES } from '@/utils/constants/paths';
import WorkSlide from '@slides/WorkSlide/WorkSlide';

type SlideContentProps = ComponentProps<'div'> & {
  portfolioContent: PublicPortfolioContent;
};

const SlideContent: FC<SlideContentProps> = ({ portfolioContent, ...props }) => {
  React.useEffect(() => {
    const preloadPrism = () => {
      void import('@components/PrismBg');
    };

    if (typeof requestIdleCallback === 'function') {
      const idleId = requestIdleCallback(preloadPrism, {
        timeout: 1500,
      });

      return () => {
        cancelIdleCallback(idleId);
      };
    }

    const timeoutId = setTimeout(preloadPrism, 300);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <SlideStack {...props}>
      <SignatureSlide
        aria-label={QUERY_SLIDE_VALUES.SIGNATURE}
        title={portfolioContent.signature.title}
        subtitle={portfolioContent.signature.subtitle}
      />
      <ProfileSlide
        aria-label={QUERY_SLIDE_VALUES.PROFILE}
        title={portfolioContent.profile.title}
        description={portfolioContent.profile.description}
        technologies={portfolioContent.profile.technologies}
        experience={portfolioContent.profile.experience}
      />
      {portfolioContent.works.map((slide) => (
        <WorkSlide
          key={slide.id}
          aria-label={QUERY_SLIDE_VALUES.WORKS}
          {...slide}
        />
      ))}
      <ContactSlide aria-label={QUERY_SLIDE_VALUES.CONTACT} />
    </SlideStack>
  );
};

export { SlideContent };
