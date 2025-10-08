import './globals.css';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import React, { Suspense } from 'react';

import { FirstSlideAnimationProvider } from '@/utils/providers/FirstSlideAnimationProvider';
import { MenuProvider } from '@/utils/providers/MenuProvider';
import { SlideProvider } from '@/utils/providers/SlideOpenProvider';
import { SlideStackProvider } from '@/utils/providers/SlideStackProvider';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Signature',
  description: 'My personal collection of all my professional life...',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Suspense fallback={null}>
          <MenuProvider>
            <FirstSlideAnimationProvider>
              <SlideStackProvider>
                <SlideProvider>{children}</SlideProvider>
              </SlideStackProvider>
            </FirstSlideAnimationProvider>
          </MenuProvider>
        </Suspense>
        <SpeedInsights /> <Analytics />
      </body>
    </html>
  );
}
