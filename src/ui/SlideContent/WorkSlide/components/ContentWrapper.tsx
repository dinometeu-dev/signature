import { HTMLMotionProps, motion } from 'framer-motion';
import React, {
  FC,
  Fragment,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';

import { cn } from '@/utils/functions/mergeClasses';
import {
  ContentAnimations,
  TitleAnimations,
} from '@slides/WorkSlide/animations/content-wrapper-animations';
import Title from '@slides/WorkSlide/components/Title';

interface ContentWrapperProps
  extends Omit<HTMLMotionProps<'div'>, 'title' | 'children'> {
  title: string;
  children?: ReactNode;
  isActive: string | null;
  hasActiveSection?: boolean;
  showDivider?: boolean;
}

const ContentWrapper: FC<ContentWrapperProps> = ({
  className,
  children,
  title,
  onClick,
  isActive,
  hasActiveSection = false,
  showDivider = true,
  ...props
}) => {
  const currentActiveTab = isActive === title;
  const measureRef = useRef<HTMLDivElement>(null);
  const [contentWidth, setContentWidth] = useState(0);
  useEffect(() => {
    const element = measureRef.current;

    if (!element) {
      return;
    }

    const updateWidth = () => {
      setContentWidth(element.offsetWidth);
    };

    updateWidth();

    const observer =
      typeof ResizeObserver === 'undefined'
        ? null
        : new ResizeObserver(() => {
            updateWidth();
          });

    observer?.observe(element);
    window.addEventListener('resize', updateWidth);

    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', updateWidth);
    };
  }, [children]);

  return (
    <Fragment>
      <motion.div
        layout="position"
        className={cn(
          'relative flex items-center justify-center shrink-0',
          className
        )}
        animate={{
          gap: currentActiveTab ? '24px' : '0',
        }}
        {...props}
      >
        <Title
          layout="position"
          animate={{
            fontSize: currentActiveTab ? '80px' : '20px',
          }}
          onClick={onClick}
          className="text-shadow-md"
          whileHover={TitleAnimations.whileHover}
        >
          {title.charAt(0).toUpperCase() + title.slice(1)}
        </Title>

        <motion.div
          layout={false}
          className="overflow-hidden"
          initial={false}
          animate={{
            width: currentActiveTab ? contentWidth : 0,
            opacity: currentActiveTab ? 1 : 0,
          }}
          transition={
            currentActiveTab
              ? {
                  width: {
                    duration: 0.38,
                    ease: 'easeInOut' as const,
                  },
                  opacity: {
                    delay: 0.08,
                    duration: 0.2,
                    ease: 'easeOut' as const,
                  },
                }
              : {
                  opacity: {
                    duration: 0.1,
                    ease: 'easeOut' as const,
                  },
                  width: {
                    delay: 0.08,
                    duration: 0.3,
                    ease: 'easeInOut' as const,
                  },
                }
          }
          aria-hidden={!currentActiveTab}
        >
          <motion.div
            className="text-black max-w-[28rem]"
            initial={false}
            animate={
              currentActiveTab
                ? ContentAnimations.animate
                : ContentAnimations.initial
            }
            transition={
              currentActiveTab
                ? ContentAnimations.transition
                : {
                    duration: 0.08,
                    ease: 'easeOut',
                  }
            }
          >
            {children}
          </motion.div>
        </motion.div>

        <div
          ref={measureRef}
          className="absolute invisible pointer-events-none max-w-[28rem] w-max"
          aria-hidden="true"
        >
          {children}
        </div>
      </motion.div>
      {showDivider && (
        <motion.div
          className="h-px bg-white shrink-0 mx-6 origin-left shadow-md"
          initial={false}
          animate={{
            width: hasActiveSection ? 0 : 120,
            opacity: hasActiveSection ? 0 : 1,
          }}
          transition={{
            duration: 0.35,
            ease: 'easeInOut',
          }}
        />
      )}
    </Fragment>
  );
};

export default ContentWrapper;
