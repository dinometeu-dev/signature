import type { Metadata } from 'next';
import './globals.css';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';
import { SlideProvider } from '@/utils/providers/useSlideOpen';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Signature',
  description: 'My personal collection of all my professional life',
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
          <SlideProvider>{children}</SlideProvider>
        </Suspense>
        <SpeedInsights /> <Analytics />
      </body>
    </html>
  );
}
