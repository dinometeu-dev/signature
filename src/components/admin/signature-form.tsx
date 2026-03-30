'use client';

import React, { FormEvent, useState, useTransition } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { SignatureContentDto } from '@/lib/content/types';
import { requestJson } from '@/lib/admin/client';

export function SignatureForm({
  initialContent,
}: {
  initialContent: SignatureContentDto;
}) {
  const [title, setTitle] = useState(initialContent.title);
  const [subtitle, setSubtitle] = useState(initialContent.subtitle);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    startTransition(async () => {
      try {
        await requestJson('/api/admin/signature', {
          method: 'PATCH',
          body: JSON.stringify({ title, subtitle }),
        });
        toast.success('Signature slide updated.');
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : 'Failed to save signature.'
        );
      }
    });
  };

  return (
    <Card className="rounded-[28px] border-white/70 bg-white/80 shadow-sm">
      <CardHeader>
        <CardTitle className="font-headings text-3xl text-slate-950">
          Hero content
        </CardTitle>
        <CardDescription className="text-base text-slate-500">
          Edit the first slide title and subtitle shown on the public site.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="signature-title">Title</Label>
            <Input
              id="signature-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="h-12 rounded-2xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="signature-subtitle">Subtitle</Label>
            <Input
              id="signature-subtitle"
              value={subtitle}
              onChange={(event) => setSubtitle(event.target.value)}
              className="h-12 rounded-2xl"
            />
          </div>

          <Button type="submit" className="rounded-2xl" disabled={isPending}>
            {isPending ? 'Saving...' : 'Save signature content'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
