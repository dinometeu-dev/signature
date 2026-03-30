'use client';

import dynamic from 'next/dynamic';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type { WorkItemDto } from '@/lib/content/types';

const WorksManager = dynamic(
  () => import('@/components/admin/works-manager').then((module) => module.WorksManager),
  {
    ssr: false,
    loading: () => (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card
              key={index}
              className="rounded-[28px] border-white/70 bg-white/80 shadow-sm"
            >
              <CardHeader className="space-y-3 pb-3">
                <div className="h-4 w-24 rounded-full bg-slate-200" />
                <div className="h-10 w-16 rounded-full bg-slate-200" />
              </CardHeader>
            </Card>
          ))}
        </div>

        <div className="sticky top-0 z-20 -mx-2 rounded-[28px] bg-[linear-gradient(180deg,rgba(248,251,255,0.97),rgba(248,251,255,0.86))] px-2 py-2 backdrop-blur">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-3">
              <div className="h-10 w-52 rounded-full bg-slate-200" />
              <div className="h-5 w-96 max-w-full rounded-full bg-slate-200" />
            </div>
            <div className="h-11 w-32 rounded-2xl bg-slate-200" />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card
              key={index}
              className="overflow-hidden rounded-[28px] border-white/70 bg-white/85 shadow-sm"
            >
              <CardHeader className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-3">
                    <div className="h-8 w-40 rounded-full bg-slate-200" />
                    <div className="flex gap-2">
                      <div className="h-6 w-24 rounded-full bg-slate-200" />
                      <div className="h-6 w-16 rounded-full bg-slate-200" />
                    </div>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-slate-200" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-full rounded-full bg-slate-200" />
                  <div className="h-4 w-10/12 rounded-full bg-slate-200" />
                  <div className="h-4 w-8/12 rounded-full bg-slate-200" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  {Array.from({ length: 3 }).map((__, imageIndex) => (
                    <div
                      key={imageIndex}
                      className="aspect-[1.15] rounded-2xl bg-slate-200"
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  <div className="h-10 w-32 rounded-2xl bg-slate-200" />
                  <div className="h-10 w-28 rounded-2xl bg-slate-200" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    ),
  }
);

export function WorksManagerClient({
  initialWorkItems,
}: {
  initialWorkItems: WorkItemDto[];
}) {
  return <WorksManager initialWorkItems={initialWorkItems} />;
}
