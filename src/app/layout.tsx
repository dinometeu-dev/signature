import './globals.css';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import React, { Suspense } from 'react';

import FeedbackWidget from '@/components/FeedbackWidget';
import MobileBlocker from '@/components/MobileBlocker';
import PreventImageDrag from '@/components/PreventImageDrag';
import { Toaster } from '@/components/ui/sonner';

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
      <body className="min-h-screen bg-background text-foreground">
        <MobileBlocker />
        <div className="hidden min-[1410px]:contents">
          <PreventImageDrag />
          {children}
          <Suspense>
            <FeedbackWidget />
          </Suspense>
        </div>
        <Toaster richColors position="top-right" />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
