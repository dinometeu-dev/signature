'use client';

import { ImagePlus, Link2, Plus, Save, Trash2 } from 'lucide-react';
import Image from 'next/image';
import React, { ChangeEvent, useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { toast } from 'sonner';

import { LocationCombobox } from '@/components/admin/location-combobox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { requestJson } from '@/lib/admin/client';
import type { ExperienceBlockDto, ExperiencePeriodDto } from '@/lib/content/types';

type EditablePeriod = ExperiencePeriodDto;
type EditableBlock = ExperienceBlockDto;

function sortPeriods(periods: EditablePeriod[]) {
  return [...periods].sort((left, right) => {
    return new Date(left.startDate).getTime() - new Date(right.startDate).getTime();
  });
}

function getLatestTimelineDate(block: EditableBlock) {
  const orderedPeriods = sortPeriods(block.periods);
  const lastPeriod = orderedPeriods.at(-1);

  return new Date(lastPeriod?.endDate ?? lastPeriod?.startDate ?? block.createdAt).getTime();
}

function createEmptyPeriod(id: number): EditablePeriod {
  const now = new Date().toISOString();

  return {
    id,
    position: '',
    startDate: now,
    endDate: null,
    sortOrder: 0,
    createdAt: now,
    updatedAt: now,
  };
}

function createEmptyBlock(id: number): EditableBlock {
  const now = new Date().toISOString();

  return {
    id,
    companyName: '',
    iconPath: '',
    alt: '',
    location: '',
    description: '',
    officialLink: '',
    experienceHistory: '',
    color: '#94a3b8',
    sortOrder: 0,
    createdAt: now,
    updatedAt: now,
    periods: [
      {
        ...createEmptyPeriod(id - 1000),
      },
    ],
  };
}

function sortBlocks(blocks: EditableBlock[]) {
  return [...blocks].sort((left, right) => {
    const latestDifference = getLatestTimelineDate(right) - getLatestTimelineDate(left);

    if (latestDifference !== 0) {
      return latestDifference;
    }

    const leftStart = sortPeriods(left.periods)[0]?.startDate ?? left.createdAt;
    const rightStart = sortPeriods(right.periods)[0]?.startDate ?? right.createdAt;

    return new Date(rightStart).getTime() - new Date(leftStart).getTime();
  });
}

export function ExperienceGalleryEditor({
  initialBlocks,
}: {
  initialBlocks: ExperienceBlockDto[];
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const tempId = useRef(-1);
  const nextTempId = () => {
    tempId.current -= 1;
    return tempId.current;
  };

  const [blocks, setBlocks] = useState(initialBlocks);
  const [editingBlock, setEditingBlock] = useState<EditableBlock | null>(null);
  const [dialogBlock, setDialogBlock] = useState<EditableBlock | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);

  const orderedBlocks = useMemo(() => sortBlocks(blocks), [blocks]);
  const activeDialogBlock = editingBlock ?? dialogBlock;

  useEffect(() => {
    if (editingBlock) {
      setDialogBlock(editingBlock);
    }
  }, [editingBlock]);

  const updateEditingBlock = (
    field: keyof EditableBlock,
    value: string | number
  ) => {
    setEditingBlock((current) =>
      current ? { ...current, [field]: value } : current
    );
  };

  const updatePeriod = (
    periodId: number,
    field: keyof EditablePeriod,
    value: string | number | null
  ) => {
    setEditingBlock((current) =>
      current
        ? {
            ...current,
            periods: current.periods.map((period) =>
              period.id === periodId ? { ...period, [field]: value } : period
            ),
          }
        : current
    );
  };

  const addPeriod = () => {
    setEditingBlock((current) =>
      current
        ? {
            ...current,
            periods: [...current.periods, createEmptyPeriod(nextTempId())],
          }
        : current
    );
  };

  const removePeriod = (periodId: number) => {
    setEditingBlock((current) =>
      current
        ? {
            ...current,
            periods: current.periods.filter((period) => period.id !== periodId),
          }
        : current
    );
  };

  const openNewDialog = () => {
    setEditingBlock(createEmptyBlock(nextTempId()));
  };

  const handleLogoPick = () => {
    fileInputRef.current?.click();
  };

  const handleLogoUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    startTransition(async () => {
      try {
        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/admin/upload/experience-logo', {
          method: 'POST',
          body: formData,
        });
        const payload = (await response.json()) as { path?: string; error?: string };

        if (!response.ok || !payload.path) {
          throw new Error(payload.error || 'Failed to upload logo.');
        }

        const uploadedPath = payload.path;

        setEditingBlock((current) =>
          current ? { ...current, iconPath: uploadedPath } : current
        );
        toast.success('Logo uploaded and compressed.');
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : 'Failed to upload logo.'
        );
      } finally {
        setIsUploading(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    });
  };

  const saveBlock = () => {
    if (!editingBlock) {
      return;
    }

    startTransition(async () => {
      try {
        const payload = await requestJson<ExperienceBlockDto>(
          '/api/admin/experience-block',
          {
            method: editingBlock.id > 0 ? 'PATCH' : 'POST',
            body: JSON.stringify({
              ...(editingBlock.id > 0 ? { id: editingBlock.id } : null),
              companyName: editingBlock.companyName,
              location: editingBlock.location,
              iconPath: editingBlock.iconPath,
              alt: editingBlock.alt,
              officialLink: editingBlock.officialLink,
              description: editingBlock.description,
              experienceHistory: editingBlock.experienceHistory,
              color: editingBlock.color,
              periods: editingBlock.periods.map((period) => ({
                ...(period.id > 0 ? { id: period.id } : null),
                position: period.position,
                startDate: period.startDate,
                endDate: period.endDate,
              })),
            }),
          }
        );

        setBlocks((current) => {
          if (editingBlock.id > 0) {
            return sortBlocks(
              current.map((block) => (block.id === editingBlock.id ? payload : block))
            );
          }

          return sortBlocks([...current, payload]);
        });
        setEditingBlock(payload);
        toast.success(
          editingBlock.id > 0 ? 'Experience updated.' : 'Experience created.'
        );
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : 'Failed to save experience.'
        );
      }
    });
  };

  const deleteBlock = (blockId: number) => {
    if (blockId < 0) {
      setEditingBlock(null);
      return;
    }

    startTransition(async () => {
      try {
        await requestJson('/api/admin/experience-block', {
          method: 'DELETE',
          body: JSON.stringify({ id: blockId }),
        });
        setBlocks((current) => current.filter((block) => block.id !== blockId));
        setEditingBlock((current) => (current?.id === blockId ? null : current));
        toast.success('Experience deleted.');
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : 'Failed to delete experience.'
        );
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="sticky top-0 z-20 -mx-2 rounded-[28px] bg-[linear-gradient(180deg,rgba(248,251,255,0.97),rgba(248,251,255,0.86))] px-2 py-2 backdrop-blur">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-headings text-3xl text-slate-950">
              Experience gallery
            </h2>
            <p className="mt-2 text-slate-500">
              Items are ordered automatically by timeline dates. Click a card to edit.
            </p>
          </div>
          <Button className="rounded-2xl" onClick={openNewDialog}>
            <Plus className="mr-2 size-4" />
            Add experience
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {orderedBlocks.map((block) => {
          const orderedPeriods = sortPeriods(block.periods);
          const firstPeriod = orderedPeriods[0];
          const lastPeriod = orderedPeriods.at(-1);

          return (
            <button
              key={block.id}
              type="button"
              onClick={() => setEditingBlock(block)}
              className="h-full text-left"
            >
              <Card className="h-full overflow-hidden rounded-[28px] border-white/70 bg-white/80 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex items-center gap-4 border-b border-slate-100 px-5 py-4">
                  <div className="flex size-16 items-center justify-center overflow-hidden rounded-2xl bg-slate-100">
                    {block.iconPath ? (
                      <Image
                        src={block.iconPath}
                        alt={block.alt || block.companyName}
                        width={64}
                        height={64}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <ImagePlus className="size-6 text-slate-400" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-headings text-2xl text-slate-950">
                      {block.companyName}
                    </p>
                    <p className="truncate text-sm text-slate-500">{block.location}</p>
                  </div>
                </div>
                <CardContent className="space-y-4 px-5 py-5">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">
                      {block.periods.length} period{block.periods.length === 1 ? '' : 's'}
                    </Badge>
                    {block.officialLink ? <Badge variant="outline">Linked</Badge> : null}
                  </div>
                  <p className="line-clamp-3 text-sm leading-6 text-slate-500">
                    {block.description || 'No short description yet.'}
                  </p>
                  {firstPeriod ? (
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                      {firstPeriod.startDate.slice(0, 10)}{' '}
                      {lastPeriod?.endDate ? `→ ${lastPeriod.endDate.slice(0, 10)}` : '→ current'}
                    </p>
                  ) : null}
                </CardContent>
              </Card>
            </button>
          );
        })}
      </div>

      {!orderedBlocks.length ? (
        <Card className="rounded-[28px] border-dashed border-slate-200 bg-white/80 shadow-sm">
          <CardContent className="px-6 py-12 text-center text-slate-500">
            No experience items yet.
          </CardContent>
        </Card>
      ) : null}

      <Dialog
        open={Boolean(editingBlock)}
        onOpenChange={(open) => !open && setEditingBlock(null)}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto rounded-[32px] sm:max-w-4xl">
          {activeDialogBlock ? (
            <>
              <DialogHeader>
                <DialogTitle className="font-headings text-3xl">
                  {activeDialogBlock.companyName || 'New experience'}
                </DialogTitle>
                <DialogDescription>
                  Update company info, logo, validation-sensitive fields, and timeline periods.
                </DialogDescription>
              </DialogHeader>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogoUpload}
              />

              <div className="space-y-6">
                <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
                  <Card className="rounded-[28px] border-slate-200/80 bg-slate-50/80">
                    <CardContent className="space-y-4 p-5">
                      <div className="flex aspect-square items-center justify-center overflow-hidden rounded-[24px] bg-white shadow-sm">
                        {activeDialogBlock.iconPath ? (
                          <Image
                            src={activeDialogBlock.iconPath}
                            alt={activeDialogBlock.alt || activeDialogBlock.companyName || 'Company logo'}
                            width={200}
                            height={200}
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <ImagePlus className="size-10 text-slate-400" />
                        )}
                      </div>
                      <Button
                        variant="outline"
                        className="w-full rounded-2xl"
                        onClick={handleLogoPick}
                        disabled={isUploading}
                      >
                        <ImagePlus className="mr-2 size-4" />
                        {isUploading ? 'Uploading...' : 'Upload logo'}
                      </Button>
                      <div className="space-y-2">
                        <Label htmlFor="experience-alt">Alt text</Label>
                        <Input
                          id="experience-alt"
                          value={activeDialogBlock.alt}
                          onChange={(event) =>
                            updateEditingBlock('alt', event.target.value)
                          }
                          className="rounded-2xl bg-white"
                          placeholder="Company logo alt text"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Company</Label>
                      <Input
                        value={activeDialogBlock.companyName}
                        onChange={(event) =>
                          updateEditingBlock('companyName', event.target.value)
                        }
                        className="rounded-2xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Official link</Label>
                      <div className="relative">
                        <Link2 className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
                        <Input
                          value={activeDialogBlock.officialLink}
                          onChange={(event) =>
                            updateEditingBlock('officialLink', event.target.value)
                          }
                          className="rounded-2xl pl-9"
                          placeholder="https://example.com"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Accent color</Label>
                      <div className="flex items-center gap-3">
                        <Input
                          type="color"
                          value={activeDialogBlock.color || '#94a3b8'}
                          onChange={(event) =>
                            updateEditingBlock('color', event.target.value)
                          }
                          className="h-11 w-16 cursor-pointer rounded-2xl border border-input bg-white p-1"
                        />
                        <Input
                          value={activeDialogBlock.color}
                          onChange={(event) =>
                            updateEditingBlock('color', event.target.value)
                          }
                          className="rounded-2xl"
                          placeholder="#94a3b8"
                        />
                      </div>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Location</Label>
                      <LocationCombobox
                        value={activeDialogBlock.location}
                        onChange={(value) => updateEditingBlock('location', value)}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Description</Label>
                      <Textarea
                        value={activeDialogBlock.description}
                        onChange={(event) =>
                          updateEditingBlock('description', event.target.value)
                        }
                        className="min-h-24 rounded-2xl"
                        maxLength={140}
                      />
                      <p className="text-xs text-slate-400">
                        {activeDialogBlock.description.length}/140
                      </p>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Work experience</Label>
                      <Textarea
                        value={activeDialogBlock.experienceHistory}
                        onChange={(event) =>
                          updateEditingBlock('experienceHistory', event.target.value)
                        }
                        className="min-h-32 rounded-2xl"
                        maxLength={350}
                      />
                      <p className="text-xs text-slate-400">
                        {activeDialogBlock.experienceHistory.length}/350
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="sticky top-0 z-10 -mx-1 rounded-[24px] bg-white/95 px-1 py-2 backdrop-blur">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h3 className="font-headings text-2xl">Periods</h3>
                        <p className="text-sm text-slate-500">
                          Timeline order is automatic. Just add the correct dates.
                        </p>
                      </div>
                      <Button variant="outline" className="rounded-2xl" onClick={addPeriod}>
                        <Plus className="mr-2 size-4" />
                        Add period
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {sortPeriods(activeDialogBlock.periods).map((period) => {
                      const isCurrent = !period.endDate;

                      return (
                        <Card
                          key={period.id}
                          className="rounded-3xl border-slate-200/80 bg-slate-50/80"
                        >
                          <CardContent className="grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-[1.3fr_0.8fr_0.8fr_auto]">
                            <div className="space-y-2">
                              <Label>Position</Label>
                              <Input
                                value={period.position}
                                onChange={(event) =>
                                  updatePeriod(period.id, 'position', event.target.value)
                                }
                                className="rounded-2xl bg-white"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Start date</Label>
                              <Input
                                type="date"
                                value={period.startDate.slice(0, 10)}
                                onChange={(event) =>
                                  updatePeriod(
                                    period.id,
                                    'startDate',
                                    new Date(event.target.value).toISOString()
                                  )
                                }
                                className="rounded-2xl bg-white"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>End date</Label>
                              <Input
                                type="date"
                                value={period.endDate ? period.endDate.slice(0, 10) : ''}
                                disabled={isCurrent}
                                onChange={(event) =>
                                  updatePeriod(
                                    period.id,
                                    'endDate',
                                    event.target.value
                                      ? new Date(event.target.value).toISOString()
                                      : null
                                  )
                                }
                                className="rounded-2xl bg-white"
                              />
                              <label className="flex items-center gap-2 text-sm text-slate-500">
                                <Checkbox
                                  checked={isCurrent}
                                  onCheckedChange={(checked) =>
                                    updatePeriod(
                                      period.id,
                                      'endDate',
                                      checked ? null : new Date().toISOString()
                                    )
                                  }
                                />
                                Current
                              </label>
                            </div>
                            <div className="flex items-end">
                              <Button
                                variant="destructive"
                                className="rounded-2xl"
                                onClick={() => removePeriod(period.id)}
                              >
                                <Trash2 className="mr-2 size-4" />
                                Remove
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button className="rounded-2xl" onClick={saveBlock} disabled={isPending}>
                    <Save className="mr-2 size-4" />
                    {isPending ? 'Saving...' : 'Save experience'}
                  </Button>
                  {activeDialogBlock.id > 0 ? (
                    <Button
                      variant="destructive"
                      className="rounded-2xl"
                      onClick={() => deleteBlock(activeDialogBlock.id)}
                      disabled={isPending}
                    >
                      <Trash2 className="mr-2 size-4" />
                      Delete experience
                    </Button>
                  ) : null}
                </div>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
