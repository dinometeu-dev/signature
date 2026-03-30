'use client';

import { useSearchParams } from 'next/navigation';
import React, { FormEvent, useRef, useState, useTransition } from 'react';
import { toast } from 'sonner';

import { ExperienceGalleryEditor } from '@/components/admin/experience-gallery-editor';
import { TechnologyChipsManager } from '@/components/admin/technology-chips-manager';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { requestJson } from '@/lib/admin/client';
import type {
  ExperienceBlockDto,
  ProfileContentDto,
  TechnologyDto,
} from '@/lib/content/types';

type ProfileSection = 'intro' | 'experience' | 'technology';

function normalizeProfileSection(value: string | undefined): ProfileSection {
  if (value === 'experience' || value === 'technology') {
    return value;
  }

  return 'intro';
}

export function ProfileEditor({
  initialProfileContent,
  initialExperienceBlocks,
  initialTechnologies,
  activeSection,
}: {
  initialProfileContent: ProfileContentDto;
  initialExperienceBlocks: ExperienceBlockDto[];
  initialTechnologies: TechnologyDto[];
  activeSection: ProfileSection;
}) {
  const searchParams = useSearchParams();

  const [profileContent, setProfileContent] = useState(initialProfileContent);
  const [isPending, startTransition] = useTransition();
  const currentSection = normalizeProfileSection(
    searchParams.get('section') ?? activeSection
  );

  const handleProfileSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    startTransition(async () => {
      try {
        const payload = await requestJson<ProfileContentDto>('/api/admin/profile', {
          method: 'PATCH',
          body: JSON.stringify({
            title: profileContent.title,
            description: profileContent.description,
          }),
        });
        setProfileContent(payload);
        toast.success('Profile intro updated.');
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : 'Failed to save profile intro.'
        );
      }
    });
  };

  return (
    <div className="space-y-6">
      {currentSection === 'intro' ? (
          <Card className="rounded-[28px] border-white/70 bg-white/80 shadow-sm">
            <CardHeader>
              <CardTitle className="font-headings text-3xl">Profile intro</CardTitle>
              <CardDescription>
                Edit the title and markdown description used on the profile slide.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-5" onSubmit={handleProfileSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="profile-title">Title</Label>
                  <Input
                    id="profile-title"
                    value={profileContent.title}
                    onChange={(event) =>
                      setProfileContent((current) => ({
                        ...current,
                        title: event.target.value,
                      }))
                    }
                    className="h-12 rounded-2xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profile-description">Description</Label>
                  <Textarea
                    id="profile-description"
                    value={profileContent.description}
                    onChange={(event) =>
                      setProfileContent((current) => ({
                        ...current,
                        description: event.target.value,
                      }))
                    }
                    className="min-h-48 rounded-2xl"
                  />
                </div>
                <Button type="submit" className="rounded-2xl" disabled={isPending}>
                  {isPending ? 'Saving...' : 'Save intro'}
                </Button>
              </form>
            </CardContent>
          </Card>
      ) : null}

      {currentSection === 'experience' ? (
        <ExperienceGalleryEditor initialBlocks={initialExperienceBlocks} />
      ) : null}

      {currentSection === 'technology' ? (
        <TechnologyChipsManager initialTechnologies={initialTechnologies} />
      ) : null}
    </div>
  );
}
