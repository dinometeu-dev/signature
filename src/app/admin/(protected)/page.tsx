import { Activity, Boxes, Clock3, Sparkles } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getAdminDashboardSnapshot } from '@/lib/admin/data';

const formatter = new Intl.DateTimeFormat('en', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

export default async function AdminDashboardPage() {
  const snapshot = await getAdminDashboardSnapshot();

  const cards = [
    {
      label: 'Experience blocks',
      value: snapshot.experienceCount,
      description: 'Company sections powering the timeline.',
      icon: Activity,
    },
    {
      label: 'Technology chips',
      value: snapshot.technologyCount,
      description: 'Scrolling stack items on the profile slide.',
      icon: Sparkles,
    },
    {
      label: 'Work items',
      value: snapshot.workCount,
      description: 'Portfolio project slides currently published.',
      icon: Boxes,
    },
  ];

  return (
    <div className="space-y-6">
      <Card className="rounded-[28px] border-white/70 bg-white/80 shadow-sm">
        <CardHeader>
          <Badge variant="secondary" className="w-fit rounded-full px-3 py-1">
            Phase 1 foundation
          </Badge>
          <CardTitle className="mt-3 font-headings text-4xl text-slate-950">
            Live admin workspace
          </CardTitle>
          <CardDescription className="max-w-2xl text-base leading-7 text-slate-500">
            The portfolio now reads signature, profile, and works content from
            the database, and this admin panel controls those live values.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <Card
              key={card.label}
              className="rounded-[28px] border-white/70 bg-white/80 shadow-sm"
            >
              <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div>
                  <CardDescription>{card.label}</CardDescription>
                  <CardTitle className="mt-3 font-headings text-5xl text-slate-950">
                    {card.value}
                  </CardTitle>
                </div>
                <div className="flex size-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                  <Icon className="size-5" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6 text-slate-500">
                  {card.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="rounded-[28px] border-white/70 bg-white/80 shadow-sm">
          <CardHeader>
            <CardTitle className="font-headings text-3xl">
              Current content snapshot
            </CardTitle>
            <CardDescription>
              Quick reference for the active singleton records.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                Signature title
              </p>
              <p className="mt-3 text-lg font-medium text-slate-900">
                {snapshot.signatureTitle || 'Not set yet'}
              </p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                Profile title
              </p>
              <p className="mt-3 text-lg font-medium text-slate-900">
                {snapshot.profileTitle || 'Not set yet'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[28px] border-white/70 bg-white/80 shadow-sm">
          <CardHeader>
            <CardTitle className="font-headings text-3xl">Recent activity</CardTitle>
            <CardDescription>
              Last updated timestamps across the most edited sections.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3 rounded-3xl bg-slate-50 p-4">
              <div className="mt-1 flex size-10 items-center justify-center rounded-2xl bg-white text-slate-950 shadow-sm">
                <Clock3 className="size-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">Latest work edit</p>
                <p className="mt-1 text-sm text-slate-500">
                  {snapshot.latestWorkUpdatedAt
                    ? formatter.format(new Date(snapshot.latestWorkUpdatedAt))
                    : 'No work updates yet'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-3xl bg-slate-50 p-4">
              <div className="mt-1 flex size-10 items-center justify-center rounded-2xl bg-white text-slate-950 shadow-sm">
                <Clock3 className="size-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">
                  Latest profile timeline edit
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {snapshot.latestExperienceUpdatedAt
                    ? formatter.format(new Date(snapshot.latestExperienceUpdatedAt))
                    : 'No profile timeline updates yet'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
