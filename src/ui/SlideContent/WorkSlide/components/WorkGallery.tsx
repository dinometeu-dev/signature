'use client';

import { motion } from 'framer-motion';
import React, { FC } from 'react';

import { GalleryImageHoverAnimation } from '@slides/WorkSlide/animations/work-gallery-animations';
import { WorkItemProps } from '@slides/WorkSlide/utils/types';

type GalleryItem = WorkItemProps['details']['gallery'][0];

type WorkGalleryProps = {
  items: GalleryItem[];
  title: string;
  onImageSelect: (image: GalleryItem) => void;
};

const WorkGallery: FC<WorkGalleryProps> = ({ items, title, onImageSelect }) => {
  return (
    <div className="grid grid-cols-2 gap-3 m-2">
      {items.map((image) => (
        <motion.div
          key={image.id}
          className="rounded-2xl border border-white/15 bg-white/5 overflow-hidden cursor-zoom-in"
          whileHover={GalleryImageHoverAnimation.whileHover}
          transition={GalleryImageHoverAnimation.transition}
          onClick={() => onImageSelect(image)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image.imageUrl}
            alt={image.alt || title}
            className="h-32 w-full object-cover"
          />
        </motion.div>
      ))}
    </div>
  );
};

export default WorkGallery;
