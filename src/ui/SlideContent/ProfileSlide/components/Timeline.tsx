import dayjs from 'dayjs';
import { motion } from 'framer-motion';
import { FC, useCallback, useState } from 'react';

import { cn } from '@/utils/functions/mergeClasses';

const Point: FC<{ position?: 'start' | 'end' }> = ({ position }) => {
  return (
    <motion.div
      className={cn(
        'absolute top-1/2 -translate-y-1/2 size-2 rounded-full bg-accent-foreground z-10',
        position === 'start' ? 'left-0 -translate-x-1/2' : '',
        position === 'end' ? 'right-0 translate-x-1/2' : ''
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    />
  );
};

const workExperience = [
  {
    title: 'Software Engineer',
    company: 'ReactBit',
    startDate: '2020-01-01',
    endDate: '2021-12-01',
  },
  {
    title: 'Software Engineer',
    company: 'ReactBit',
    startDate: '2023-01-01',
    endDate: '2024-01-01',
  },
];

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
      type: 'work',
      width: (segmentMonths / monthSegments) * 100,
    });
  }

  if (afterSegmentExist) {
    const lastJobEnd = dayjs(workExperience.at(-1)?.endDate);
    const segmentMonths = endDate.diff(lastJobEnd, 'month');
    segments.push({
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
    <motion.div className="w-full flex items-center gap-0 relative">
      {segmentHover === null && <Point position="start" />}
      {segments.map((seg, idx) => (
        <motion.div
          key={idx}
          className={cn(
            'py-4 my-6 h-fit relative flex items-center',
            seg.type === 'work' && 'cursor-zoom-in',
            isHoverCurrentElement(idx) && 'py-10 my-0'
          )}
          onHoverStart={() => seg.type === 'work' && setSegmentHover(idx)}
          onHoverEnd={() => setSegmentHover(null)}
          style={{ width: `${seg.width}%` }}
          initial={{ width: 0 }}
          animate={{
            width: (() => {
              if (segmentHover === null) return `${seg.width}%`;
              if (segmentHover === idx) return '100%';
              return 0;
            })(),
          }}
          whileHover={seg.type === 'work' ? { width: '100%' } : undefined}
        >
          {seg.type === 'work' && isHoverCurrentElement(idx, true) && (
            <Point position="start" />
          )}
          <motion.div
            className={cn(
              'h-0.5 w-full transition-[height] ',
              seg.type === 'work' ? 'bg-accent-foreground' : 'bg-border',
              segmentHover && 'h-[2.5]'
            )}
          />
          {seg.type === 'work' && isHoverCurrentElement(idx, true) && (
            <Point position="end" />
          )}
        </motion.div>
      ))}
      {segmentHover === null && <Point position="end" />}
    </motion.div>
  );
};

export default Timeline;
