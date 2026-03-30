'use client';

import {
  GripVertical,
  ImagePlus,
  Pencil,
  Plus,
  Save,
  Search,
  Trash2,
} from 'lucide-react';
import React, {
  ChangeEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { requestJson } from '@/lib/admin/client';
import type { TechnologyDto } from '@/lib/content/types';
import { cn } from '@/lib/utils';

type EditableTechnology = TechnologyDto;
type TechnologyCatalogItem = {
  title: string;
  slug: string;
  hex: string;
  source: string | null;
  iconUrl: string;
};

function TechnologyDropPlaceholder() {
  return (
    <div className="inline-flex min-h-[94px] min-w-[160px] items-center rounded-full border-2 border-dashed border-sky-300 bg-sky-50/80 px-4 py-2.5">
      <span className="text-sm font-medium text-sky-700">Drop chip here</span>
    </div>
  );
}

function sortTechnologies(items: EditableTechnology[]) {
  return [...items].sort((left, right) => {
    const orderDifference = left.sortOrder - right.sortOrder;

    if (orderDifference !== 0) {
      return orderDifference;
    }

    return left.id - right.id;
  });
}

function createEmptyTechnology(): EditableTechnology {
  const now = new Date().toISOString();

  return {
    id: -1,
    name: '',
    iconPath: '',
    sortOrder: 0,
    createdAt: now,
    updatedAt: now,
  };
}

function reorderTechnologies(
  items: EditableTechnology[],
  draggedId: number,
  targetId: number
) {
  const ordered = sortTechnologies(items);
  const draggedIndex = ordered.findIndex((item) => item.id === draggedId);
  const targetIndex = ordered.findIndex((item) => item.id === targetId);

  if (
    draggedIndex === -1 ||
    targetIndex === -1 ||
    draggedIndex === targetIndex
  ) {
    return ordered;
  }

  const next = [...ordered];
  const [dragged] = next.splice(draggedIndex, 1);
  const insertionIndex =
    draggedIndex < targetIndex ? targetIndex - 1 : targetIndex;
  next.splice(insertionIndex, 0, dragged);

  return next.map((item, index) => ({
    ...item,
    sortOrder: index,
  }));
}

export function TechnologyChipsManager({
  initialTechnologies,
}: {
  initialTechnologies: TechnologyDto[];
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [technologies, setTechnologies] = useState(
    sortTechnologies(initialTechnologies)
  );
  const [editingTechnology, setEditingTechnology] =
    useState<EditableTechnology | null>(null);
  const [dialogTechnology, setDialogTechnology] =
    useState<EditableTechnology | null>(null);
  const [technologyToDelete, setTechnologyToDelete] =
    useState<EditableTechnology | null>(null);
  const [dialogTechnologyToDelete, setDialogTechnologyToDelete] =
    useState<EditableTechnology | null>(null);
  const [draggedId, setDraggedId] = useState<number | null>(null);
  const [dragOverId, setDragOverId] = useState<number | null>(null);
  const [catalogQuery, setCatalogQuery] = useState('');
  const [catalogItems, setCatalogItems] = useState<TechnologyCatalogItem[]>([]);
  const [isCatalogLoading, setIsCatalogLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);

  const orderedTechnologies = useMemo(
    () => sortTechnologies(technologies),
    [technologies]
  );
  const activeDialogTechnology = editingTechnology ?? dialogTechnology;
  const activeDeleteTechnology = technologyToDelete ?? dialogTechnologyToDelete;

  useEffect(() => {
    if (editingTechnology) {
      setDialogTechnology(editingTechnology);
    }
  }, [editingTechnology]);

  useEffect(() => {
    if (technologyToDelete) {
      setDialogTechnologyToDelete(technologyToDelete);
    }
  }, [technologyToDelete]);

  const handleOpenCreate = () => {
    setEditingTechnology({
      ...createEmptyTechnology(),
      sortOrder: orderedTechnologies.length,
    });
    setCatalogQuery('');
    setCatalogItems([]);
  };

  const handleOpenEdit = (technology: EditableTechnology) => {
    setEditingTechnology(technology);
    setCatalogQuery(technology.name);
    setCatalogItems([]);
  };

  const updateEditingTechnology = (
    field: keyof EditableTechnology,
    value: string | number
  ) => {
    setEditingTechnology((current) =>
      current ? { ...current, [field]: value } : current
    );
  };

  const handleIconUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    startTransition(async () => {
      try {
        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/admin/upload/technology-icon', {
          method: 'POST',
          body: formData,
        });
        const payload = (await response.json()) as {
          path?: string;
          error?: string;
        };

        if (!response.ok || !payload.path) {
          throw new Error(payload.error || 'Failed to upload icon.');
        }

        setEditingTechnology((current) =>
          current ? { ...current, iconPath: payload.path! } : current
        );
        toast.success('Technology icon uploaded.');
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : 'Failed to upload icon.'
        );
      } finally {
        setIsUploading(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    });
  };

  useEffect(() => {
    if (!editingTechnology) {
      return;
    }

    const trimmedQuery = catalogQuery.trim();

    if (trimmedQuery.length < 2) {
      setCatalogItems([]);
      return;
    }

    const timeoutId = window.setTimeout(async () => {
      try {
        setIsCatalogLoading(true);
        const response = await fetch(
          `/api/admin/technology-catalog?q=${encodeURIComponent(trimmedQuery)}`
        );
        const payload = (await response.json()) as
          | TechnologyCatalogItem[]
          | { error?: string };

        if (!response.ok) {
          throw new Error(
            'error' in payload && payload.error
              ? payload.error
              : 'Failed to search technology catalog.'
          );
        }

        setCatalogItems(payload as TechnologyCatalogItem[]);
      } catch {
        setCatalogItems([]);
      } finally {
        setIsCatalogLoading(false);
      }
    }, 220);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [catalogQuery, editingTechnology]);

  const applyCatalogItem = (item: TechnologyCatalogItem) => {
    setEditingTechnology((current) =>
      current
        ? {
            ...current,
            name: item.title,
            iconPath: item.iconUrl,
          }
        : current
    );
    setCatalogQuery(item.title);
    setCatalogItems([]);
  };

  const persistOrder = (items: EditableTechnology[]) => {
    startTransition(async () => {
      try {
        await requestJson('/api/admin/technology', {
          method: 'PATCH',
          body: JSON.stringify({
            items: items.map((item, index) => ({
              id: item.id,
              sortOrder: index,
            })),
          }),
        });
        toast.success('Technology order updated.');
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : 'Failed to update order.'
        );
      }
    });
  };

  const handleDropOnTechnology = (targetId: number) => {
    if (draggedId === null) {
      return;
    }

    const reordered = reorderTechnologies(
      orderedTechnologies,
      draggedId,
      targetId
    );
    setDraggedId(null);
    setDragOverId(null);
    setTechnologies(reordered);
    persistOrder(reordered);
  };

  const handleDragOverTarget = (
    event: React.DragEvent<HTMLElement>,
    targetId: number
  ) => {
    event.preventDefault();

    if (draggedId !== targetId) {
      setDragOverId(targetId);
    }
  };

  const handleSaveTechnology = () => {
    if (!editingTechnology) {
      return;
    }

    startTransition(async () => {
      try {
        const payload = await requestJson<TechnologyDto>(
          '/api/admin/technology',
          {
            method: editingTechnology.id > 0 ? 'PATCH' : 'POST',
            body: JSON.stringify({
              ...(editingTechnology.id > 0
                ? { id: editingTechnology.id }
                : null),
              name: editingTechnology.name,
              iconPath: editingTechnology.iconPath,
              sortOrder: editingTechnology.sortOrder,
            }),
          }
        );

        setTechnologies((current) => {
          if (editingTechnology.id > 0) {
            return sortTechnologies(
              current.map((item) =>
                item.id === editingTechnology.id ? payload : item
              )
            );
          }

          return sortTechnologies([...current, payload]);
        });
        setEditingTechnology(null);
        toast.success(
          editingTechnology.id > 0
            ? 'Technology updated.'
            : 'Technology created.'
        );
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : 'Failed to save technology.'
        );
      }
    });
  };

  const handleDeleteTechnology = (technology: EditableTechnology) => {
    startTransition(async () => {
      try {
        await requestJson('/api/admin/technology', {
          method: 'DELETE',
          body: JSON.stringify({ id: technology.id }),
        });
        setTechnologies((current) =>
          sortTechnologies(
            current
              .filter((item) => item.id !== technology.id)
              .map((item, index) => ({ ...item, sortOrder: index }))
          )
        );
        setEditingTechnology((current) =>
          current?.id === technology.id ? null : current
        );
        setTechnologyToDelete(null);
        toast.success('Technology deleted.');
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : 'Failed to delete technology.'
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
              Technology stack
            </h2>
            <p className="mt-2 text-slate-500">
              Reorder chips with drag and drop, then edit or delete each one.
            </p>
          </div>
          <Button className="rounded-2xl" onClick={handleOpenCreate}>
            <Plus className="mr-2 size-4" />
            Add chip
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        {orderedTechnologies.map((technology) => (
          <React.Fragment key={technology.id}>
            {draggedId !== null &&
            dragOverId === technology.id &&
            draggedId !== technology.id ? (
              <div
                onDragEnter={(event) =>
                  handleDragOverTarget(event, technology.id)
                }
                onDragOver={(event) =>
                  handleDragOverTarget(event, technology.id)
                }
                onDrop={() => handleDropOnTechnology(technology.id)}
              >
                <TechnologyDropPlaceholder />
              </div>
            ) : null}

            <Card
              draggable
              onDragStart={() => {
                setDraggedId(technology.id);
                setDragOverId(technology.id);
              }}
              onDragEnd={() => {
                setDraggedId(null);
                setDragOverId(null);
              }}
              onDragEnter={(event) =>
                handleDragOverTarget(event, technology.id)
              }
              onDragOver={(event) => handleDragOverTarget(event, technology.id)}
              onDrop={() => handleDropOnTechnology(technology.id)}
              className={cn(
                'rounded-full border-white/70 bg-white/90 shadow-sm transition',
                draggedId === technology.id ? 'scale-[0.98] opacity-60' : '',
                dragOverId === technology.id && draggedId !== technology.id
                  ? 'ring-2 ring-sky-200'
                  : ''
              )}
            >
              <CardContent className="flex items-center gap-2.5 px-3.5 py-1.5">
                <button
                  type="button"
                  aria-label={`Reorder ${technology.name}`}
                  className="cursor-grab text-slate-400 transition hover:text-slate-700 active:cursor-grabbing"
                >
                  <GripVertical className="size-4" />
                </button>

                <div className="flex size-8 items-center justify-center overflow-hidden rounded-full bg-slate-100">
                  {technology.iconPath ? (
                    <img
                      src={technology.iconPath}
                      alt={technology.name}
                      className="h-full w-full object-contain p-1.5"
                    />
                  ) : (
                    <ImagePlus className="size-4 text-slate-400" />
                  )}
                </div>

                <span className="text-[13px] font-medium text-slate-900">
                  {technology.name}
                </span>

                <div className="ml-1 flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7 rounded-full"
                    onClick={() => handleOpenEdit(technology)}
                  >
                    <Pencil className="size-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7 rounded-full text-rose-500 hover:text-rose-600"
                    onClick={() => setTechnologyToDelete(technology)}
                    disabled={isPending}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </React.Fragment>
        ))}
      </div>

      {!orderedTechnologies.length ? (
        <Card className="rounded-[28px] border-dashed border-slate-200 bg-white/80 shadow-sm">
          <CardContent className="px-6 py-10 text-center text-slate-500">
            No technology chips yet.
          </CardContent>
        </Card>
      ) : null}

      <Dialog
        open={Boolean(editingTechnology)}
        onOpenChange={(open) => !open && setEditingTechnology(null)}
      >
        <DialogContent className="rounded-[32px] sm:max-w-xl">
          {activeDialogTechnology ? (
            <>
              <DialogHeader>
                <DialogTitle className="font-headings text-3xl">
                  {activeDialogTechnology.id > 0 ? 'Edit chip' : 'Create new chip'}
                </DialogTitle>
                <DialogDescription>
                  Set a chip name and upload its icon image.
                </DialogDescription>
              </DialogHeader>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleIconUpload}
              />

              <div className="grid gap-5 md:grid-cols-[160px_1fr]">
                <Card className="rounded-[28px] border-slate-200/80 bg-slate-50/80">
                  <CardContent className="space-y-4 p-4">
                    <div className="flex aspect-square items-center justify-center overflow-hidden rounded-[24px] bg-white shadow-sm">
                      {activeDialogTechnology.iconPath ? (
                        <img
                          src={activeDialogTechnology.iconPath}
                          alt={activeDialogTechnology.name || 'Technology icon'}
                          className="h-full w-full object-contain p-4"
                        />
                      ) : (
                        <ImagePlus className="size-8 text-slate-400" />
                      )}
                    </div>
                    <Button
                      variant="outline"
                      className="w-full rounded-2xl"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                    >
                      <ImagePlus className="mr-2 size-4" />
                      {isUploading ? 'Uploading...' : 'Upload icon'}
                    </Button>
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="technology-catalog-search">
                      Find from Simple Icons
                    </Label>
                    <div className="relative">
                      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        id="technology-catalog-search"
                        value={catalogQuery}
                        onChange={(event) =>
                          setCatalogQuery(event.target.value)
                        }
                        className="h-12 rounded-2xl pl-9"
                        placeholder="Search React, Figma, Docker..."
                      />
                    </div>
                    <div className="rounded-3xl border border-slate-200/80 bg-slate-50/70 p-2">
                      {catalogItems.length ? (
                        <div className="max-h-48 space-y-1 overflow-y-auto">
                          {catalogItems.map((item) => (
                            <button
                              key={item.slug}
                              type="button"
                              onClick={() => applyCatalogItem(item)}
                              className="flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-left transition hover:bg-white"
                            >
                              <span
                                className="flex size-9 items-center justify-center rounded-full"
                                style={{ backgroundColor: `#${item.hex}20` }}
                              >
                                <img
                                  src={item.iconUrl}
                                  alt={item.title}
                                  className="size-5 object-contain"
                                />
                              </span>
                              <span className="min-w-0">
                                <span className="block text-sm font-medium text-slate-900">
                                  {item.title}
                                </span>
                                <span className="block truncate text-xs text-slate-500">
                                  {item.slug}
                                </span>
                              </span>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <p className="px-2 py-3 text-sm text-slate-500">
                          {isCatalogLoading
                            ? 'Searching catalog...'
                            : 'Type at least 2 characters to search the Simple Icons catalog.'}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="technology-name">Chip name</Label>
                    <Input
                      id="technology-name"
                      value={activeDialogTechnology.name}
                      onChange={(event) =>
                        updateEditingTechnology('name', event.target.value)
                      }
                      className="h-12 rounded-2xl"
                      placeholder="React"
                    />
                  </div>

                  <div className="rounded-3xl border border-slate-200/80 bg-slate-50/70 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                      Preview
                    </p>
                    <div className="mt-3 inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-3 shadow-sm">
                      <div className="flex size-9 items-center justify-center overflow-hidden rounded-full bg-slate-100">
                        {activeDialogTechnology.iconPath ? (
                          <img
                            src={activeDialogTechnology.iconPath}
                            alt={activeDialogTechnology.name || 'Technology icon'}
                            className="h-full w-full object-contain p-1.5"
                          />
                        ) : (
                          <ImagePlus className="size-4 text-slate-400" />
                        )}
                      </div>
                      <span className="text-sm font-medium text-slate-900">
                        {activeDialogTechnology.name || 'Technology name'}
                      </span>
                    </div>
                  </div>

                  <Button
                    className="rounded-2xl"
                    onClick={handleSaveTechnology}
                    disabled={isPending || isUploading}
                  >
                    <Save className="mr-2 size-4" />
                    {isPending ? 'Saving...' : 'Save chip'}
                  </Button>
                </div>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(technologyToDelete)}
        onOpenChange={(open) => !open && setTechnologyToDelete(null)}
      >
        <DialogContent className="rounded-[32px] sm:max-w-md">
          {activeDeleteTechnology ? (
            <>
              <DialogHeader>
                <DialogTitle className="font-headings text-3xl">
                  Delete chip?
                </DialogTitle>
                <DialogDescription>
                  This action will remove{' '}
                  <span className="font-medium text-slate-900">
                    {activeDeleteTechnology.name}
                  </span>{' '}
                  from the technology stack.
                </DialogDescription>
              </DialogHeader>

              <DialogFooter className="gap-3 sm:justify-start">
                <Button
                  variant="outline"
                  className="rounded-2xl"
                  onClick={() => setTechnologyToDelete(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  className="rounded-2xl"
                  onClick={() => handleDeleteTechnology(activeDeleteTechnology)}
                  disabled={isPending}
                >
                  <Trash2 className="mr-2 size-4" />
                  Delete chip
                </Button>
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
