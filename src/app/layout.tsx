import './globals.css';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import React from 'react';

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
        <PreventImageDrag />
        {children}
        <Toaster richColors position="top-right" />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
