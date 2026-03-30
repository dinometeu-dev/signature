'use client';

import {
  Archive,
  Facebook,
  Github,
  Globe,
  GripVertical,
  ImagePlus,
  Instagram,
  Link2,
  Linkedin,
  Pencil,
  Plus,
  Save,
  Trash2,
  Upload,
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

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { requestJson } from '@/lib/admin/client';
import type {
  WorkGalleryImageDto,
  WorkItemDto,
  WorkItemLinkDto,
} from '@/lib/content/types';
import { cn } from '@/lib/utils';

type EditableWorkItem = WorkItemDto;
type WorkLinkType =
  | 'official'
  | 'github'
  | 'instagram'
  | 'linkedin'
  | 'facebook'
  | 'custom';

const WORK_LINK_OPTIONS: Array<{
  value: WorkLinkType;
  label: string;
}> = [
  { value: 'official', label: 'Official link' },
  { value: 'github', label: 'GitHub' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'custom', label: 'Custom link' },
];

const QUICK_LINK_TYPES: WorkLinkType[] = [
  'github',
  'official',
  'instagram',
  'linkedin',
  'facebook',
  'custom',
];

function getDefaultWorkLinkLabel(type: WorkLinkType) {
  switch (type) {
    case 'official':
      return 'Official link';
    case 'github':
      return 'GitHub';
    case 'instagram':
      return 'Instagram';
    case 'linkedin':
      return 'LinkedIn';
    case 'facebook':
      return 'Facebook';
    default:
      return 'Custom link';
  }
}

function getWorkLinkIcon(type: WorkLinkType) {
  switch (type) {
    case 'official':
      return Globe;
    case 'github':
      return Github;
    case 'instagram':
      return Instagram;
    case 'linkedin':
      return Linkedin;
    case 'facebook':
      return Facebook;
    default:
      return Link2;
  }
}

function sortWorkItems(items: EditableWorkItem[]) {
  return [...items].sort((left, right) => {
    const orderDifference = left.sortOrder - right.sortOrder;

    if (orderDifference !== 0) {
      return orderDifference;
    }

    return left.id - right.id;
  });
}

function reorderWorkItems(
  items: EditableWorkItem[],
  draggedId: number,
  targetId: number
) {
  const ordered = sortWorkItems(items);
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

function createEmptyWorkItem(id: number): EditableWorkItem {
  const now = new Date().toISOString();

  return {
    id,
    title: '',
    overview: '',
    problem: '',
    impact: '',
    isArchived: false,
    iconPath: '',
    menuId: 0,
    sortOrder: 0,
    createdAt: now,
    updatedAt: now,
    galleryImages: [],
    links: [],
  };
}

function createGalleryAlt(fileName: string) {
  return fileName
    .replace(/\.[^.]+$/, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function createEmptyWorkLink(
  id: number,
  workItemId: number,
  type: WorkLinkType = 'custom'
): WorkItemLinkDto {
  const now = new Date().toISOString();

  return {
    id,
    url: '',
    label: getDefaultWorkLinkLabel(type),
    iconPath: type,
    workItemId,
    createdAt: now,
    updatedAt: now,
  };
}

function WorksDropPlaceholder() {
  return (
    <div className="min-h-[264px] rounded-[28px] border-2 border-dashed border-sky-300 bg-sky-50/80 p-5 flex items-center justify-center relative">
      <span className="text-sm font-medium text-sky-700">
        Drop project here
      </span>
    </div>
  );
}

export function WorksManager({
  initialWorkItems,
}: {
  initialWorkItems: WorkItemDto[];
}) {
  const tempId = useRef(-1);
  const galleryInputRef = useRef<HTMLInputElement | null>(null);
  const nextTempId = () => {
    tempId.current -= 1;
    return tempId.current;
  };

  const [workItems, setWorkItems] = useState(sortWorkItems(initialWorkItems));
  const [editingItem, setEditingItem] = useState<EditableWorkItem | null>(null);
  const [dialogItem, setDialogItem] = useState<EditableWorkItem | null>(null);
  const [draggedId, setDraggedId] = useState<number | null>(null);
  const [dragOverId, setDragOverId] = useState<number | null>(null);
  const [armedDragId, setArmedDragId] = useState<number | null>(null);
  const [isClientDnDReady, setIsClientDnDReady] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);
  const [isGalleryDropActive, setIsGalleryDropActive] = useState(false);

  const orderedWorkItems = useMemo(() => sortWorkItems(workItems), [workItems]);
  const totalGalleryImages = useMemo(
    () =>
      orderedWorkItems.reduce(
        (sum, item) => sum + item.galleryImages.length,
        0
      ),
    [orderedWorkItems]
  );
  const archivedCount = useMemo(
    () => orderedWorkItems.filter((item) => item.isArchived).length,
    [orderedWorkItems]
  );
  const activeCount = orderedWorkItems.length - archivedCount;
  const activeDialogItem = editingItem ?? dialogItem;

  useEffect(() => {
    if (editingItem) {
      setDialogItem(editingItem);
    }
  }, [editingItem]);

  useEffect(() => {
    setIsClientDnDReady(true);
  }, []);

  const replaceWorkItem = (payload: WorkItemDto) => {
    setWorkItems((current) =>
      sortWorkItems(
        current.some((item) => item.id === payload.id)
          ? current.map((item) => (item.id === payload.id ? payload : item))
          : [...current, payload]
      )
    );

    setEditingItem((current) =>
      current?.id === payload.id ? payload : current
    );
  };

  const openNewDialog = () => {
    setEditingItem({
      ...createEmptyWorkItem(nextTempId()),
      sortOrder: orderedWorkItems.length,
    });
  };

  const openEditDialog = (item: EditableWorkItem) => {
    setEditingItem(item);
  };

  const updateEditingItem = (
    field: keyof EditableWorkItem,
    value:
      | string
      | number
      | boolean
      | WorkGalleryImageDto[]
      | WorkItemLinkDto[]
  ) => {
    setEditingItem((current) =>
      current ? { ...current, [field]: value } : current
    );
  };

  const persistOrder = (items: EditableWorkItem[]) => {
    startTransition(async () => {
      try {
        await requestJson('/api/admin/work-item', {
          method: 'PATCH',
          body: JSON.stringify({
            items: items.map((item, index) => ({
              id: item.id,
              sortOrder: index,
            })),
          }),
        });

        toast.success('Project order updated.');
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : 'Failed to update project order.'
        );
      }
    });
  };

  const handleDropOnWorkItem = (targetId: number) => {
    if (draggedId === null) {
      return;
    }

    const reordered = reorderWorkItems(orderedWorkItems, draggedId, targetId);
    setDraggedId(null);
    setDragOverId(null);
    setWorkItems(reordered);
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

  const saveWorkItem = () => {
    if (!editingItem) {
      return;
    }

    startTransition(async () => {
      try {
        const method = editingItem.id > 0 ? 'PATCH' : 'POST';
        const payload = await requestJson<WorkItemDto>('/api/admin/work-item', {
          method,
          body: JSON.stringify({
            ...(editingItem.id > 0 ? { id: editingItem.id } : null),
            title: editingItem.title,
            overview: editingItem.overview,
            problem: editingItem.problem,
            impact: editingItem.impact,
            isArchived: editingItem.isArchived,
            menuId: editingItem.menuId || undefined,
            sortOrder: editingItem.sortOrder,
          }),
        });

        replaceWorkItem(payload);
        toast.success(
          editingItem.id > 0 ? 'Project updated.' : 'Project created.'
        );
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : 'Failed to save project.'
        );
      }
    });
  };

  const toggleArchive = (item: EditableWorkItem) => {
    startTransition(async () => {
      try {
        const payload = await requestJson<WorkItemDto>('/api/admin/work-item', {
          method: 'PATCH',
          body: JSON.stringify({
            id: item.id,
            isArchived: !item.isArchived,
          }),
        });

        replaceWorkItem(payload);
        toast.success(
          payload.isArchived ? 'Project archived.' : 'Project restored.'
        );
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : 'Failed to update archive state.'
        );
      }
    });
  };

  const deleteWorkItem = (id: number) => {
    if (id < 0) {
      setEditingItem(null);
      return;
    }

    startTransition(async () => {
      try {
        await requestJson('/api/admin/work-item', {
          method: 'DELETE',
          body: JSON.stringify({ id }),
        });
        setWorkItems((current) =>
          sortWorkItems(
            current
              .filter((item) => item.id !== id)
              .map((item, index) => ({ ...item, sortOrder: index }))
          )
        );
        setEditingItem((current) => (current?.id === id ? null : current));
        toast.success('Project deleted.');
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : 'Failed to delete project.'
        );
      }
    });
  };

  const updateGalleryImage = (
    imageId: number,
    field: keyof WorkGalleryImageDto,
    value: string | number
  ) => {
    setEditingItem((current) =>
      current
        ? {
            ...current,
            galleryImages: current.galleryImages.map((image) =>
              image.id === imageId ? { ...image, [field]: value } : image
            ),
          }
        : current
    );
  };

  const updateWorkLink = (
    linkId: number,
    field: keyof WorkItemLinkDto,
    value: string | null
  ) => {
    setEditingItem((current) =>
      current
        ? {
            ...current,
            links: current.links.map((link) =>
              link.id === linkId ? { ...link, [field]: value } : link
            ),
          }
        : current
    );
  };

  const addWorkLink = (type: WorkLinkType) => {
    setEditingItem((current) =>
      current
        ? {
            ...current,
            links: [
              ...current.links,
              createEmptyWorkLink(nextTempId(), current.id, type),
            ],
          }
        : current
    );
  };

  const saveWorkLink = (link: WorkItemLinkDto) => {
    if (!editingItem) {
      return;
    }

    if (editingItem.id < 0) {
      toast.message('Save the project first, then add links.');
      return;
    }

    startTransition(async () => {
      try {
        const method = link.id > 0 ? 'PATCH' : 'POST';
        const payload = await requestJson<WorkItemLinkDto>(
          '/api/admin/work-item-link',
          {
            method,
            body: JSON.stringify({
              ...(link.id > 0 ? { id: link.id } : null),
              ...(link.id < 0 ? { workItemId: editingItem.id } : null),
              url: link.url,
              label: link.label,
              iconPath: link.iconPath,
            }),
          }
        );

        setEditingItem((current) =>
          current
            ? {
                ...current,
                links: current.links.some((item) => item.id === link.id)
                  ? current.links.map((item) =>
                      item.id === link.id ? payload : item
                    )
                  : [...current.links, payload],
              }
            : current
        );
        setWorkItems((current) =>
          sortWorkItems(
            current.map((item) =>
              item.id === editingItem.id
                ? {
                    ...item,
                    links: item.links.some((itemLink) => itemLink.id === link.id)
                      ? item.links.map((itemLink) =>
                          itemLink.id === link.id ? payload : itemLink
                        )
                      : [...item.links, payload],
                  }
                : item
            )
          )
        );

        toast.success(link.id > 0 ? 'Link updated.' : 'Link created.');
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : 'Failed to save link.'
        );
      }
    });
  };

  const deleteWorkLink = (linkId: number) => {
    if (!editingItem) {
      return;
    }

    if (linkId < 0) {
      setEditingItem((current) =>
        current
          ? {
              ...current,
              links: current.links.filter((link) => link.id !== linkId),
            }
          : current
      );
      return;
    }

    startTransition(async () => {
      try {
        await requestJson('/api/admin/work-item-link', {
          method: 'DELETE',
          body: JSON.stringify({ id: linkId }),
        });

        setEditingItem((current) =>
          current
            ? {
                ...current,
                links: current.links.filter((link) => link.id !== linkId),
              }
            : current
        );
        setWorkItems((current) =>
          sortWorkItems(
            current.map((item) =>
              item.id === editingItem.id
                ? {
                    ...item,
                    links: item.links.filter((link) => link.id !== linkId),
                  }
                : item
            )
          )
        );

        toast.success('Link deleted.');
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : 'Failed to delete link.'
        );
      }
    });
  };

  const saveGalleryImage = (image: WorkGalleryImageDto) => {
    if (!editingItem || image.id < 0) {
      return;
    }

    startTransition(async () => {
      try {
        const payload = await requestJson<WorkGalleryImageDto>(
          '/api/admin/work-gallery-image',
          {
            method: 'PATCH',
            body: JSON.stringify({
              id: image.id,
              alt: image.alt,
            }),
          }
        );

        setEditingItem((current) =>
          current
            ? {
                ...current,
                galleryImages: current.galleryImages.map((item) =>
                  item.id === image.id ? payload : item
                ),
              }
            : current
        );
        setWorkItems((current) =>
          sortWorkItems(
            current.map((item) =>
              item.id === editingItem.id
                ? {
                    ...item,
                    galleryImages: item.galleryImages.map((galleryItem) =>
                      galleryItem.id === image.id ? payload : galleryItem
                    ),
                  }
                : item
            )
          )
        );

        toast.success('Gallery image updated.');
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : 'Failed to save gallery image.'
        );
      }
    });
  };

  const deleteGalleryImage = (imageId: number) => {
    if (!editingItem) {
      return;
    }

    startTransition(async () => {
      try {
        await requestJson('/api/admin/work-gallery-image', {
          method: 'DELETE',
          body: JSON.stringify({ id: imageId }),
        });

        setEditingItem((current) =>
          current
            ? {
                ...current,
                galleryImages: current.galleryImages
                  .filter((image) => image.id !== imageId)
                  .map((image, index) => ({ ...image, sortOrder: index })),
              }
            : current
        );
        setWorkItems((current) =>
          sortWorkItems(
            current.map((item) =>
              item.id === editingItem.id
                ? {
                    ...item,
                    galleryImages: item.galleryImages
                      .filter((image) => image.id !== imageId)
                      .map((image, index) => ({ ...image, sortOrder: index })),
                  }
                : item
            )
          )
        );
        toast.success('Gallery image deleted.');
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : 'Failed to delete gallery image.'
        );
      }
    });
  };

  const uploadGalleryFiles = async (files: File[]) => {
    if (!files.length || !editingItem || editingItem.id < 0) {
      return;
    }

    try {
      setIsUploading(true);

      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);

        const uploadResponse = await fetch(
          '/api/admin/upload/work-gallery-image',
          {
            method: 'POST',
            body: formData,
          }
        );
        const uploadPayload = (await uploadResponse.json()) as {
          path?: string;
          error?: string;
        };

        if (!uploadResponse.ok || !uploadPayload.path) {
          throw new Error(
            uploadPayload.error || 'Failed to upload gallery image.'
          );
        }

        const imagePayload = await requestJson<WorkGalleryImageDto>(
          '/api/admin/work-gallery-image',
          {
            method: 'POST',
            body: JSON.stringify({
              workItemId: editingItem.id,
              imageUrl: uploadPayload.path,
              alt: createGalleryAlt(file.name),
            }),
          }
        );

        setEditingItem((current) =>
          current
            ? {
                ...current,
                galleryImages: [...current.galleryImages, imagePayload],
              }
            : current
        );
        setWorkItems((current) =>
          sortWorkItems(
            current.map((item) =>
              item.id === editingItem.id
                ? {
                    ...item,
                    galleryImages: [...item.galleryImages, imagePayload],
                  }
                : item
            )
          )
        );
      }

      toast.success(
        files.length === 1
          ? 'Gallery image uploaded.'
          : `${files.length} gallery images uploaded.`
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to upload gallery images.'
      );
    } finally {
      setIsUploading(false);
      setIsGalleryDropActive(false);
      if (galleryInputRef.current) {
        galleryInputRef.current.value = '';
      }
    }
  };

  const handleGalleryUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    await uploadGalleryFiles(files);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="rounded-[28px] border-white/70 bg-white/80 shadow-sm">
          <CardHeader className="pb-3">
            <CardDescription>Total projects</CardDescription>
            <CardTitle className="font-headings text-4xl">
              {orderedWorkItems.length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="rounded-[28px] border-white/70 bg-white/80 shadow-sm">
          <CardHeader className="pb-3">
            <CardDescription>Visible on site</CardDescription>
            <CardTitle className="font-headings text-4xl">
              {activeCount}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="rounded-[28px] border-white/70 bg-white/80 shadow-sm">
          <CardHeader className="pb-3">
            <CardDescription>Archived</CardDescription>
            <CardTitle className="font-headings text-4xl">
              {archivedCount}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="rounded-[28px] border-white/70 bg-white/80 shadow-sm">
          <CardHeader className="pb-3">
            <CardDescription>Gallery images</CardDescription>
            <CardTitle className="font-headings text-4xl">
              {totalGalleryImages}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="sticky top-0 z-20 -mx-2 rounded-[28px] bg-[linear-gradient(180deg,rgba(248,251,255,0.97),rgba(248,251,255,0.86))] px-2 py-2 backdrop-blur">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-headings text-3xl text-slate-950">
              Works gallery
            </h2>
            <p className="mt-2 text-slate-500">
              Reorder projects with drag and drop, archive old cases, and upload
              gallery images.
            </p>
          </div>
          <Button className="rounded-2xl" onClick={openNewDialog}>
            <Plus className="mr-2 size-4" />
            Add project
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {orderedWorkItems.map((item) => (
          <React.Fragment key={item.id}>
            {draggedId !== null &&
            dragOverId === item.id &&
            draggedId !== item.id ? (
              <div
                onDragEnter={(event) => handleDragOverTarget(event, item.id)}
                onDragOver={(event) => handleDragOverTarget(event, item.id)}
                onDrop={() => handleDropOnWorkItem(item.id)}
              >
                <WorksDropPlaceholder />
              </div>
            ) : null}

            <Card
              {...(isClientDnDReady
                ? {
                    draggable: true,
                    onDragStart: (event: React.DragEvent<HTMLElement>) => {
                      if (armedDragId !== item.id) {
                        event.preventDefault();
                        return;
                      }

                      setDraggedId(item.id);
                      setDragOverId(item.id);
                    },
                    onDragEnter: (event: React.DragEvent<HTMLElement>) =>
                      handleDragOverTarget(event, item.id),
                    onDragOver: (event: React.DragEvent<HTMLElement>) =>
                      handleDragOverTarget(event, item.id),
                    onDrop: () => handleDropOnWorkItem(item.id),
                    onDragEnd: () => {
                      setDraggedId(null);
                      setDragOverId(null);
                      setArmedDragId(null);
                    },
                  }
                : {
                    draggable: false,
                  })}
              className={cn(
                'overflow-hidden rounded-[28px] border-white/70 bg-white/85 shadow-sm transition',
                item.isArchived ? 'border-slate-200/80 bg-slate-100/70' : '',
                draggedId === item.id ? 'scale-[0.985] opacity-60' : '',
                dragOverId === item.id && draggedId !== item.id
                  ? 'ring-2 ring-sky-200'
                  : ''
              )}
            >
              <CardHeader className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-2">
                    <CardTitle className="font-headings text-2xl text-slate-950">
                      {item.title}
                    </CardTitle>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="secondary">
                        {item.galleryImages.length} image
                        {item.galleryImages.length === 1 ? '' : 's'}
                      </Badge>
                      {item.isArchived ? (
                        <Badge className="bg-slate-900 text-white hover:bg-slate-900">
                          Archived
                        </Badge>
                      ) : (
                        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                          Live
                        </Badge>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    aria-label={`Reorder ${item.title}`}
                    className="mt-1 cursor-grab text-slate-400 transition hover:text-slate-700 active:cursor-grabbing"
                    draggable={false}
                    {...(isClientDnDReady
                      ? {
                          onPointerDown: () => {
                            setArmedDragId(item.id);
                          },
                          onPointerUp: () => {
                            setArmedDragId((current) =>
                              current === item.id ? null : current
                            );
                          },
                          onPointerLeave: () => {
                            setArmedDragId((current) =>
                              current === item.id && draggedId === null
                                ? null
                                : current
                            );
                          },
                        }
                      : {})}
                  >
                    <GripVertical className="size-5" />
                  </button>
                </div>
                <CardDescription className="line-clamp-3 min-h-[72px] text-sm leading-6">
                  {item.overview || 'No overview yet.'}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  {item.galleryImages.slice(0, 3).map((image) => (
                    <div
                      key={image.id}
                      className="aspect-[1.15] overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-100"
                    >
                      <img
                        src={image.imageUrl}
                        alt={image.alt || item.title}
                        className="h-full w-full object-cover"
                        draggable={false}
                      />
                    </div>
                  ))}
                  {Array.from({
                    length: Math.max(
                      0,
                      3 - item.galleryImages.slice(0, 3).length
                    ),
                  }).map((_, index) => (
                    <div
                      key={`empty-${item.id}-${index}`}
                      className="flex aspect-[1.15] items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-slate-300"
                    >
                      <ImagePlus className="size-4" />
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant="outline"
                    className="rounded-2xl"
                    onClick={() => openEditDialog(item)}
                  >
                    <Pencil className="mr-2 size-4" />
                    Edit project
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-2xl"
                    onClick={() => toggleArchive(item)}
                    disabled={isPending}
                  >
                    <Archive className="mr-2 size-4" />
                    {item.isArchived ? 'Restore' : 'Archive'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </React.Fragment>
        ))}
      </div>

      {!orderedWorkItems.length ? (
        <Card className="rounded-[28px] border-dashed border-slate-200 bg-white/80 shadow-sm">
          <CardContent className="px-6 py-12 text-center text-slate-500">
            No work items yet.
          </CardContent>
        </Card>
      ) : null}

      <Dialog
        open={Boolean(editingItem)}
        onOpenChange={(open) => !open && setEditingItem(null)}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto rounded-[32px] sm:max-w-5xl">
          {activeDialogItem ? (
            <>
              <DialogHeader>
                <DialogTitle className="font-headings text-3xl">
                  {activeDialogItem.id > 0
                    ? activeDialogItem.title || 'Edit project'
                    : 'New project'}
                </DialogTitle>
                <DialogDescription>
                  Update the project content, then upload gallery images with
                  previews.
                </DialogDescription>
              </DialogHeader>

              <input
                ref={galleryInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleGalleryUpload}
              />

              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-[1.2fr_auto]">
                  <div className="space-y-2">
                    <Label htmlFor="work-title">Title</Label>
                    <Input
                      id="work-title"
                      value={activeDialogItem.title}
                      onChange={(event) =>
                        updateEditingItem('title', event.target.value)
                      }
                      className="rounded-2xl"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      variant="outline"
                      className="rounded-2xl"
                      onClick={() =>
                        updateEditingItem(
                          'isArchived',
                          !activeDialogItem.isArchived
                        )
                      }
                    >
                      <Archive className="mr-2 size-4" />
                      {activeDialogItem.isArchived
                        ? 'Restore project'
                        : 'Archive project'}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="work-overview">Overview</Label>
                  <Textarea
                    id="work-overview"
                    value={activeDialogItem.overview}
                    onChange={(event) =>
                      updateEditingItem('overview', event.target.value)
                    }
                    className="min-h-28 rounded-2xl"
                  />
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="work-problem">Problem</Label>
                    <Textarea
                      id="work-problem"
                      value={activeDialogItem.problem}
                      onChange={(event) =>
                        updateEditingItem('problem', event.target.value)
                      }
                      className="min-h-32 rounded-2xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="work-impact">Impact</Label>
                    <Textarea
                      id="work-impact"
                      value={activeDialogItem.impact}
                      onChange={(event) =>
                        updateEditingItem('impact', event.target.value)
                      }
                      className="min-h-32 rounded-2xl"
                    />
                  </div>
                </div>

                <div className="space-y-3 rounded-[24px] border border-slate-200/80 bg-slate-50/60 p-3">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-headings text-xl text-slate-950">
                        Project links
                      </h3>
                      <p className="mt-1 text-xs text-slate-500">
                        GitHub, official, socials, and custom links.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {QUICK_LINK_TYPES.map((type) => {
                        const Icon = getWorkLinkIcon(type);

                        return (
                          <Button
                            key={type}
                            type="button"
                            variant="outline"
                            className="h-8 rounded-full px-2.5 text-xs"
                            onClick={() => addWorkLink(type)}
                            disabled={activeDialogItem.id < 0}
                          >
                            <Icon className="mr-1.5 size-3.5" />
                            {type === 'official'
                              ? 'Official'
                              : type === 'custom'
                                ? 'Custom'
                                : getDefaultWorkLinkLabel(type)}
                          </Button>
                        );
                      })}
                    </div>
                  </div>

                  {activeDialogItem.id < 0 ? (
                    <div className="rounded-3xl border border-dashed border-slate-200 bg-white px-4 py-4 text-sm text-slate-500">
                      Save the project first to unlock link management.
                    </div>
                  ) : null}

                  <div className="space-y-2">
                    {activeDialogItem.links.map((link) => {
                      const currentType = (link.iconPath || 'custom') as WorkLinkType;
                      const Icon = getWorkLinkIcon(currentType);

                      return (
                        <div
                          key={link.id}
                          className="rounded-[20px] border border-slate-200/80 bg-white/90 p-3"
                        >
                          <div className="grid gap-2 lg:grid-cols-[152px_minmax(0,1fr)_180px_auto]">
                            <div className="relative">
                              <Icon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
                              <select
                                value={currentType}
                                onChange={(event) => {
                                  const nextType = event.target
                                    .value as WorkLinkType;
                                  updateWorkLink(
                                    link.id,
                                    'iconPath',
                                    nextType
                                  );
                                  updateWorkLink(
                                    link.id,
                                    'label',
                                    getDefaultWorkLinkLabel(nextType)
                                  );
                                }}
                                className="flex h-9 w-full appearance-none rounded-2xl border border-input bg-transparent pr-3 pl-9 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                              >
                                {WORK_LINK_OPTIONS.map((option) => (
                                  <option
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <Input
                              value={link.url}
                              onChange={(event) =>
                                updateWorkLink(
                                  link.id,
                                  'url',
                                  event.target.value
                                )
                              }
                              className="h-9 rounded-2xl bg-white"
                              placeholder="https://..."
                            />

                            <Input
                              value={link.label || ''}
                              onChange={(event) =>
                                updateWorkLink(
                                  link.id,
                                  'label',
                                  event.target.value
                                )
                              }
                              className="h-9 rounded-2xl bg-white"
                              placeholder="Label"
                            />

                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="size-9 rounded-full"
                                onClick={() => saveWorkLink(link)}
                                disabled={isPending}
                              >
                                <Save className="size-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="icon"
                                className="size-9 rounded-full"
                                onClick={() => deleteWorkLink(link.id)}
                                disabled={isPending}
                              >
                                <Trash2 className="size-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {!activeDialogItem.links.length &&
                    activeDialogItem.id > 0 ? (
                      <div className="rounded-[20px] border border-dashed border-slate-200 bg-white px-4 py-4 text-sm text-slate-500">
                        No project links yet.
                      </div>
                    ) : null}
                  </div>
                </div>

                <DialogFooter className="gap-3 sm:justify-start">
                  <Button
                    className="rounded-2xl"
                    onClick={saveWorkItem}
                    disabled={isPending}
                  >
                    <Save className="mr-2 size-4" />
                    Save project
                  </Button>
                  {activeDialogItem.id > 0 ? (
                    <Button
                      variant="destructive"
                      className="rounded-2xl"
                      onClick={() => deleteWorkItem(activeDialogItem.id)}
                      disabled={isPending}
                    >
                      <Trash2 className="mr-2 size-4" />
                      Delete project
                    </Button>
                  ) : null}
                </DialogFooter>

                <Separator />

                <div className="space-y-4">
                  <div className="sticky top-0 z-10 -mx-1 rounded-[24px] bg-white/95 px-1 py-2 backdrop-blur">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h3 className="font-headings text-2xl">
                          Gallery images
                        </h3>
                        <p className="text-sm text-slate-500">
                          Upload screenshots for this project. Click or drop
                          images into the add tile below.
                        </p>
                      </div>
                    </div>
                  </div>

                  {activeDialogItem.id < 0 ? (
                    <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-500">
                      Save the project first to unlock gallery uploads.
                    </div>
                  ) : null}

                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {activeDialogItem.galleryImages.map((image) => (
                      <Card
                        key={image.id}
                        className="overflow-hidden rounded-[28px] border-slate-200/80 bg-slate-50/80 p-0 gap-2"
                      >
                        <div className="aspect-[2] overflow-hidden bg-slate-100">
                          <img
                            src={image.imageUrl}
                            alt={image.alt || activeDialogItem.title}
                            className="h-full w-full object-cover"
                            draggable={false}
                          />
                        </div>
                        <CardContent className="space-y-3 p-3">
                          <div className="space-y-2">
                            <Label>Alt text</Label>
                            <Input
                              value={image.alt}
                              onChange={(event) =>
                                updateGalleryImage(
                                  image.id,
                                  'alt',
                                  event.target.value
                                )
                              }
                              className="rounded-2xl bg-white"
                            />
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Button
                              variant="outline"
                              className="h-9 rounded-2xl px-3"
                              onClick={() => saveGalleryImage(image)}
                              disabled={isPending}
                            >
                              <Save className="mr-2 size-4" />
                              Save
                            </Button>
                            <Button
                              variant="destructive"
                              className="h-9 rounded-2xl px-3"
                              onClick={() => deleteGalleryImage(image.id)}
                              disabled={isPending}
                            >
                              <Trash2 className="mr-2 size-4" />
                              Delete
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    <button
                      type="button"
                      className={cn(
                        'group flex aspect-[1] flex-col items-center justify-center rounded-[28px] border-2 border-dashed p-4 text-center transition',
                        activeDialogItem.id < 0
                          ? 'cursor-not-allowed border-slate-200 bg-slate-50/70 text-slate-400'
                          : 'cursor-pointer border-slate-200 bg-slate-50/80 text-slate-500 hover:border-sky-300 hover:bg-sky-50/80 hover:text-sky-700',
                        isGalleryDropActive && activeDialogItem.id > 0
                          ? 'border-sky-400 bg-sky-50 text-sky-700'
                          : ''
                      )}
                      onClick={() => {
                        if (activeDialogItem.id > 0 && !isUploading) {
                          galleryInputRef.current?.click();
                        }
                      }}
                      onDragEnter={(event) => {
                        event.preventDefault();
                        if (activeDialogItem.id > 0) {
                          setIsGalleryDropActive(true);
                        }
                      }}
                      onDragOver={(event) => {
                        event.preventDefault();
                        if (activeDialogItem.id > 0) {
                          setIsGalleryDropActive(true);
                        }
                      }}
                      onDragLeave={(event) => {
                        event.preventDefault();
                        const relatedTarget =
                          event.relatedTarget as Node | null;

                        if (!event.currentTarget.contains(relatedTarget)) {
                          setIsGalleryDropActive(false);
                        }
                      }}
                      onDrop={async (event) => {
                        event.preventDefault();

                        if (activeDialogItem.id < 0 || isUploading) {
                          setIsGalleryDropActive(false);
                          return;
                        }

                        const files = Array.from(
                          event.dataTransfer.files
                        ).filter((file) => file.type.startsWith('image/'));
                        await uploadGalleryFiles(files);
                      }}
                      disabled={activeDialogItem.id < 0 || isUploading}
                    >
                      <div
                        className={cn(
                          'mb-3 flex size-12 items-center justify-center rounded-full border bg-white transition',
                          activeDialogItem.id < 0
                            ? 'border-slate-200 text-slate-300'
                            : 'border-slate-200 text-slate-400 group-hover:border-sky-200 group-hover:text-sky-600',
                          isGalleryDropActive && activeDialogItem.id > 0
                            ? 'border-sky-200 text-sky-600'
                            : ''
                        )}
                      >
                        <Upload className="size-5" />
                      </div>
                      <p className="text-sm font-medium">
                        {isUploading
                          ? 'Uploading images...'
                          : activeDialogItem.id < 0
                            ? 'Save project first'
                            : 'Add images'}
                      </p>
                      <p className="mt-1 max-w-[180px] text-xs leading-5">
                        {activeDialogItem.id < 0
                          ? 'Create the project before adding gallery images.'
                          : 'Click to choose files or drop images here.'}
                      </p>
                    </button>
                  </div>

                  {!activeDialogItem.galleryImages.length &&
                  activeDialogItem.id > 0 ? (
                    <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-500">
                      No gallery images yet. Use the add tile to upload the
                      first screenshots.
                    </div>
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
