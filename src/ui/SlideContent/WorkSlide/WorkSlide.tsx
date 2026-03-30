import { HTMLMotionProps, motion } from 'framer-motion';
import {
  Facebook,
  Github,
  Globe,
  Instagram,
  Linkedin,
  Link2,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import React, { FC, useState } from 'react';
import Markdown from 'react-markdown';

import BlurText from '@components/BlurText';
import { Slide } from '@components/Slide';
import {
  MainTitleAnimations,
  RoadItemsAnimation,
} from '@slides/WorkSlide/animations/work-slide-animations';
import ContentWrapper from '@slides/WorkSlide/components/ContentWrapper';
import { WorkItemProps } from '@slides/WorkSlide/utils/types';

type WorkSlideProps = Omit<HTMLMotionProps<'div'>, keyof WorkItemProps> &
  WorkItemProps;

const Prism = dynamic(() => import('@components/PrismBg'), {
  ssr: false,
  loading: () => <div className="w-full h-full" aria-hidden="true" />,
});

const WorkSlide: FC<WorkSlideProps> = ({ title, id, details, ...props }) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const detailEntries = Object.entries(details);

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

  const renderDetailValue = (section: string, value: WorkItemProps['details'][keyof WorkItemProps['details']]) => {
    if (section === 'gallery' && Array.isArray(value)) {
      const galleryItems = value as WorkItemProps['details']['gallery'];

      if (!galleryItems.length) {
        return <p className="text-white/70">No gallery images yet.</p>;
      }

      return (
        <div className="grid grid-cols-2 gap-3">
          {galleryItems.map((image) => (
            <div
              key={image.id}
              className="overflow-hidden rounded-2xl border border-white/15 bg-white/5"
            >
              <img
                src={image.imageUrl}
                alt={image.alt || title}
                className="h-32 w-full object-cover"
              />
            </div>
          ))}
        </div>
      );
    }

    if (section === 'links' && Array.isArray(value)) {
      const linkItems = value as WorkItemProps['details']['links'];

      if (!linkItems.length) {
        return <p className="text-white/70">No links yet.</p>;
      }

      return (
        <div className="flex flex-wrap gap-3">
          {linkItems.map((link) => {
            const Icon = getLinkIcon(link.iconPath);

            return (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white px-4 py-2 text-sm text-slate-950 transition hover:border-white hover:bg-slate-100"
              >
                <Icon className="size-4 shrink-0 text-slate-950" />
                <span>{link.label}</span>
              </a>
            );
          })}
        </div>
      );
    }

    if (typeof value === 'string') {
      return (
        <div className="space-y-3 text-white/90">
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
          noise={0.2}
          glow={2}
          transparent={false}
          suspendWhenOffscreen
          maxDpr={1.25}
          maxFps={30}
          sampleCount={64}
        />
      </div>

      <motion.div
        layout
        className="relative w-full h-full text-white flex items-center justify-center"
        initial={RoadItemsAnimation.initial}
        animate={RoadItemsAnimation.animate}
        transition={RoadItemsAnimation.transition}
      >
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
          className="font-headings tracking-wide font-medium text-center leading-normal"
        />
      </motion.div>
    </Slide>
  );
};

export default WorkSlide;
