'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Fragment, useCallback, useState } from 'react';

import dayjs from '@/lib/dayjs';
import { cn } from '@/utils/functions/mergeClasses';
import Point from '@slides/ProfileSlide/components/Timeline/components/Point';
import {
  emptyData,
  workExperience,
} from '@slides/ProfileSlide/components/Timeline/utils/constants';

const Timeline = () => {
  const [segmentHover, setSegmentHover] = useState<number | null>(null);

  const isHoverCurrentElement = useCallback(
    (idx: number, positive?: boolean) => {
      if (segmentHover === null) return Boolean(positive);
      return segmentHover === idx;
    },
    [segmentHover]
  );

  const startDate = dayjs('2019');
  const endDate = dayjs();

  const monthSegments = endDate.diff(startDate, 'month') + 1;

  const beforeSegmentExist = startDate.isBefore(
    workExperience[0].startDate,
    'years'
  );
  const afterSegmentExist = endDate.isAfter(
    workExperience.at(-1)?.endDate,
    'years'
  );

  const segments = [];

  if (beforeSegmentExist) {
    const firstJobStart = dayjs(workExperience[0].startDate);
    const segmentMonths = firstJobStart.diff(startDate, 'month');
    segments.push({
      ...emptyData,
      type: 'before',
      width: (segmentMonths / monthSegments) * 100,
    });
  }

  for (let i = 0; i < workExperience.length; i++) {
    const element = workExperience[i];
    if (i > 0) {
      const prevJobEnd = dayjs(workExperience[i - 1].endDate);
      const currJobStart = dayjs(element.startDate);
      const gapMonths = currJobStart.diff(prevJobEnd, 'month');
      if (gapMonths > 0) {
        segments.push({
          ...emptyData,
          type: 'interval',
          width: (gapMonths / monthSegments) * 100,
        });
      }
    }
    const segmentMonths = dayjs(element.endDate).diff(
      dayjs(element.startDate),
      'month'
    );
    segments.push({
      ...element,
      type: 'work',
      width: (segmentMonths / monthSegments) * 100,
    });
  }

  if (afterSegmentExist) {
    const lastJobEnd = dayjs(workExperience.at(-1)?.endDate);
    const segmentMonths = endDate.diff(lastJobEnd, 'month');
    segments.push({
      ...emptyData,
      type: 'after',
      width: (segmentMonths / monthSegments) * 100,
    });
  }

  const totalWidth = segments.reduce((sum, s) => sum + s.width, 0);
  const diff = 100 - totalWidth;
  if (segments.length > 0) {
    segments[segments.length - 1].width += diff;
  }

  return (
    <motion.div
      className="w-full h-full flex items-center relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.5, ease: 'easeInOut' }}
    >
      {segmentHover === null && (
        <Point position="start" date={startDate} isStart />
      )}
      {segments.map((seg, idx) => {
        const duration = dayjs.duration(
          dayjs(seg.endDate).diff(dayjs(seg.startDate))
        );
        const years = duration.get('years');
        const months = duration.get('months');
        const durationString =
          `${years ? ` ${years}${years > 1 ? ' yrs' : ' y'} ` : ''}${months ? `${months}${months > 1 ? ' mos' : ' m'} ` : ''}`.trim();

        return (
          <motion.div
            key={idx}
            className={cn('relative flex items-center justify-center')}
            style={{ width: `${seg.width}%` }}
            initial={{ width: 0 }}
            onHoverEnd={() => setSegmentHover(null)}
            animate={{
              width: (() => {
                if (segmentHover === null) return `${seg.width}%`;
                if (segmentHover === idx) return '100%';
                return 0;
              })(),
              transition: {
                type: 'spring',
                ease: 'easeInOut',
                bounce: 0.2,
              },
            }}
          >
            {seg.type === 'work' && isHoverCurrentElement(idx, true) && (
              <Point
                position="start"
                className="cursor-zoom-in"
                onHoverStart={() => seg.type === 'work' && setSegmentHover(idx)}
                date={dayjs(seg.startDate)}
                color={seg.color}
                logo={seg.logo}
              />
            )}
            <motion.div
              className={cn(
                'py-4 my-6 w-full',
                seg.type === 'work' && 'cursor-zoom-in',
                isHoverCurrentElement(idx) && 'py-10 my-0'
              )}
              onHoverStart={() => seg.type === 'work' && setSegmentHover(idx)}
            >
              <motion.div
                style={{
                  background:
                    seg.type === 'work' ? `${seg.color}` : 'var(--border)',
                }}
                className={cn(
                  'h-0.5 w-full transition-[height]',
                  segmentHover !== null && 'h-[2.5px]'
                )}
              />
            </motion.div>
            <AnimatePresence>
              {segmentHover === idx && (
                <Fragment>
                  <motion.div
                    className="absolute left-0 translate-x-10 -translate-y-[20%]"
                    initial={{ opacity: 0, filter: 'blur(10px)' }}
                    exit={{ opacity: 0, filter: 'blur(10px)' }}
                    animate={{
                      opacity: 1,
                      filter: 'blur(0px)',
                      transition: {
                        delay: 0.2,
                      },
                    }}
                  >
                    <motion.p
                      className="text-6xl font-headings font-light select-none cursor-zoom-in"
                      style={{
                        color: `${seg.color}`,
                      }}
                    >
                      {seg.title}
                    </motion.p>
                  </motion.div>
                  <motion.div
                    className="absolute translate-y-14 flex flex-col items-center justify-center gap-1"
                    initial={{ opacity: 0, filter: 'blur(10px)' }}
                    exit={{ opacity: 0, filter: 'blur(10px)' }}
                    animate={{
                      opacity: 1,
                      filter: 'blur(0px)',
                      transition: {
                        delay: 0.2,
                      },
                    }}
                  >
                    <motion.p className="text-xl font-headings">
                      {seg.company}
                    </motion.p>
                    <motion.p className="text-black/60">
                      Worked {durationString}
                    </motion.p>
                  </motion.div>
                </Fragment>
              )}
            </AnimatePresence>
            {seg.type === 'work' && isHoverCurrentElement(idx, true) && (
              <Point
                position="end"
                date={dayjs(seg.endDate)}
                color={seg.color}
              />
            )}
          </motion.div>
        );
      })}
      {segmentHover === null && afterSegmentExist && (
        <Point position="end" date={dayjs()} />
      )}
    </motion.div>
  );
};

export default Timeline;
