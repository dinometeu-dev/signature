import dayjs from 'dayjs';
import { motion, MotionProps } from 'framer-motion';
import Image, { StaticImageData } from 'next/image';
import { FC } from 'react';

import { cn } from '@/utils/functions/mergeClasses';

export interface PointProps extends MotionProps {
  position: 'start' | 'end';
  date: dayjs.Dayjs;
  isStart?: boolean;
  className?: string | null;
  logo?: StaticImageData | null;
  color?: string | null;
}

const Point: FC<PointProps> = ({
  position,
  date,
  isStart,
  className,
  logo,
  color,
  onHoverStart,
}) => {
  const isCurrentDay = date.isSame(dayjs(), 'day');

  return (
    <motion.div
      style={{
        background: color ?? 'var(--border)',
      }}
      className={cn(
        'absolute top-1/2 -translate-y-1/2 w-1 h-3 rounded-full bg-accent-foreground z-10',
        position === 'start' ? 'left-0 -translate-x-1/2' : '',
        position === 'end' ? 'right-0 translate-x-1/2' : '',
        className
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {logo ? (
        <motion.div
          onHoverStart={onHoverStart}
          className={cn(
            'absolute overflow-hidden size-10 -translate-y-[calc(50%-6px)] -translate-x-[calc(50%-2px)] rounded-full p-1.5 border-[0.5px] bg-white border-border shadow-lg z-10 transition'
          )}
        >
          <Image
            src={logo}
            alt={'Company Logo'}
            className={cn('object-cover w-full h-full')}
          />
        </motion.div>
      ) : null}
      <motion.p className="absolute whitespace-nowrap -translate-x-1/2 translate-y-[calc(100%+10px)] bg-linear-(--color-date-gradient) px-5 text-center text-black/50 text-sm z-0">
        {isCurrentDay ? 'Present' : date.format(isStart ? 'YYYY' : 'MMM YYYY')}
      </motion.p>
    </motion.div>
  );
};

export default Point;
