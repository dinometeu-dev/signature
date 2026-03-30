import React, { Suspense } from 'react';

import { FirstSlideAnimationProvider } from '@/utils/providers/FirstSlideAnimationProvider';
import { MenuProvider } from '@/utils/providers/MenuProvider';
import { SlideProvider } from '@/utils/providers/SlideOpenProvider';
import { SlideStackProvider } from '@/utils/providers/SlideStackProvider';
import { TimelineProvider } from '@/utils/providers/TimelineProvider';

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Suspense fallback={null}>
      <MenuProvider>
        <FirstSlideAnimationProvider>
          <SlideStackProvider>
            <SlideProvider>
              <TimelineProvider>{children}</TimelineProvider>
            </SlideProvider>
          </SlideStackProvider>
        </FirstSlideAnimationProvider>
      </MenuProvider>
    </Suspense>
  );
}
