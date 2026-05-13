import { AnimatePresence, HTMLMotionProps, motion } from 'framer-motion';
import {
  Facebook,
  Github,
  Globe,
  Instagram,
  Linkedin,
  Link2,
  Minimize2,
} from 'lucide-react';
import Link from 'next/dist/client/link';
import dynamic from 'next/dynamic';
import React, { FC, useEffect, useState } from 'react';
import Markdown from 'react-markdown';

import BlurText from '@components/BlurText';
import { Button } from '@components/Button';
import { Slide } from '@components/Slide';
import {
  GalleryLightboxImageAnimation,
  GalleryLightboxOverlayAnimation,
} from '@slides/WorkSlide/animations/work-gallery-animations';
import { WorkLinksAnimation } from '@slides/WorkSlide/animations/work-links-animations';
import {
  MainTitleAnimations,
  RoadItemsAnimation,
} from '@slides/WorkSlide/animations/work-slide-animations';
import ContentWrapper from '@slides/WorkSlide/components/ContentWrapper';
import WorkGallery from '@slides/WorkSlide/components/WorkGallery';
import { WorkItemProps } from '@slides/WorkSlide/utils/types';

type WorkSlideProps = Omit<HTMLMotionProps<'div'>, keyof WorkItemProps> &
  WorkItemProps;

type GalleryItem = WorkItemProps['details']['gallery'][0];

const Prism = dynamic(() => import('@components/PrismBg'), {
  ssr: false,
  loading: () => <div className="w-full h-full" aria-hidden="true" />,
});

const WorkSlide: FC<WorkSlideProps> = ({ title, id, details, ...props }) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedImage(null);
    };
    globalThis.window?.addEventListener('keydown', handleKeyDown);
    return () =>
      globalThis.window?.removeEventListener('keydown', handleKeyDown);
  }, []);

  const links = details.links ?? [];
  const detailEntries = Object.entries(details).filter(([key, value]) => {
    if (key === 'links') return false;
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'string') return value.trim().length > 0;
    return value != null;
  });

  const getLinkIcon = (iconPath: string | null) => {
    switch (iconPath) {
      case 'github':
        return Github;
      case 'official':
        return Globe;
      case 'instagram':
        return Instagram;
      case 'linkedin':
        return Linkedin;
      case 'facebook':
        return Facebook;
      default:
        return Link2;
    }
  };

  const renderDetailValue = (
    section: string,
    value: WorkItemProps['details'][keyof WorkItemProps['details']]
  ) => {
    if (section === 'gallery' && Array.isArray(value)) {
      const galleryItems = value as WorkItemProps['details']['gallery'];
      return (
        <WorkGallery
          items={galleryItems}
          title={title}
          onImageSelect={setSelectedImage}
        />
      );
    }

    if (typeof value === 'string') {
      return (
        <div className="space-y-3">
          <Markdown>{value}</Markdown>
        </div>
      );
    }

    return null;
  };

  const handleActiveSection = (section: string) => {
    if (activeSection === section) {
      setActiveSection(null);
    } else {
      setActiveSection(section);
    }
  };

  return (
    <Slide {...props} id={id.toString()} setOverlowHidden>
      <div className="absolute inset-0 bg-black">
        <Prism
          animationType="3drotate"
          timeScale={0.5}
          height={3.5}
          baseWidth={5.5}
          scale={2.5}
          hueShift={0}
          colorFrequency={1}
          noise={0.18}
          glow={0.6}
          transparent={false}
          suspendWhenOffscreen
          maxDpr={1.25}
          maxFps={30}
          sampleCount={64}
        />
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="absolute inset-0 z-20 bg-black/70 flex justify-center"
            initial={GalleryLightboxOverlayAnimation.initial}
            animate={GalleryLightboxOverlayAnimation.animate}
            exit={GalleryLightboxOverlayAnimation.exit}
            transition={GalleryLightboxOverlayAnimation.transition}
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              className="absolute inset-0 z-30 p-10 flex items-center justify-center"
              initial={GalleryLightboxImageAnimation.initial}
              animate={GalleryLightboxImageAnimation.animate}
              exit={GalleryLightboxImageAnimation.exit}
              transition={GalleryLightboxImageAnimation.transition}
            >
              <div className="relative w-full h-full flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedImage.imageUrl}
                  alt={selectedImage.alt ?? title}
                  className="max-w-full max-h-full w-auto h-auto rounded-3xl block"
                />
              </div>
              <Button
                className="p-0 absolute top-0 right-0 size-11 backdrop-blur-xl"
                onClick={() => setSelectedImage(null)}
              >
                <Minimize2 size={16} className="text-white" />
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        layout
        className="relative w-full h-full text-white flex items-center justify-center"
        initial={RoadItemsAnimation.initial}
        animate={RoadItemsAnimation.animate}
        transition={RoadItemsAnimation.transition}
      >
        <div className="relative flex items-center">
          {detailEntries.map(([key, value], index) => (
            <ContentWrapper
              key={key}
              title={key}
              isActive={activeSection}
              hasActiveSection={Boolean(activeSection)}
              showDivider={index < detailEntries.length - 1}
              onClick={() => handleActiveSection(key)}
            >
              {renderDetailValue(key, value)}
            </ContentWrapper>
          ))}
        </div>
        <AnimatePresence>
          {links.length > 0 && !activeSection && (
            <motion.div
              className="absolute mt-40 flex items-center gap-3"
              initial={WorkLinksAnimation.initial}
              animate={WorkLinksAnimation.animate}
              exit={WorkLinksAnimation.exit}
              transition={WorkLinksAnimation.transition}
            >
              {links.map((link) => {
                const Icon = getLinkIcon(link.iconPath);
                return (
                  <Link key={link.id} href={link.url} target="_blank">
                    <Button className="p-0 size-11">
                      <Icon className="size-4" />
                    </Button>
                  </Link>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div
        className="absolute z-10"
        initial={MainTitleAnimations.initial}
        animate={MainTitleAnimations.animate}
        transition={MainTitleAnimations.transition}
      >
        <BlurText
          text={title}
          delay={80}
          animateBy="words"
          direction="top"
          className="font-headings tracking-wide font-medium text-white"
        />
      </motion.div>
    </Slide>
  );
};

export default WorkSlide;
