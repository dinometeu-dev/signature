import React, {
  FC,
  SVGProps,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import Chip from '@components/Chip';
import { TechnologyStackAnimation } from '@slides/ProfileSlide/animations/profile-card-animations';

export type LogoItem = {
  id: number;
  title: string;
  Icon: FC<SVGProps<SVGSVGElement>>;
};

export interface LogoLoopProps {
  logos: LogoItem[];
  speed?: number;
  direction?: 'left' | 'right';
  width?: number | string;
  logoHeight?: number;
  gap?: number;
  pauseOnHover?: boolean;
  fadeOut?: boolean;
  fadeOutColor?: string;
  scaleOnHover?: boolean;
  ariaLabel?: string;
  className?: string;
  style?: React.CSSProperties;
}

const ANIMATION_CONFIG = {
  SMOOTH_TAU: 0.25,
  MIN_COPIES: 2,
  COPY_HEADROOM: 2,
} as const;

const cx = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(' ');

const useDocumentVisibility = () => {
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof document === 'undefined') {
      return true;
    }

    return !document.hidden;
  });

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return isVisible;
};

const useResizeObserver = (
  callback: () => void,
  containerRef: React.RefObject<Element | null>,
  sequenceRef: React.RefObject<Element | null>
) => {
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    if (!window.ResizeObserver) {
      const handleResize = () => callback();
      window.addEventListener('resize', handleResize);
      callback();
      return () => window.removeEventListener('resize', handleResize);
    }

    const observer = new ResizeObserver(callback);

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    if (sequenceRef.current) {
      observer.observe(sequenceRef.current);
    }

    callback();

    return () => {
      observer.disconnect();
    };
  }, [callback, containerRef, sequenceRef]);
};

const useAnimationLoop = (
  trackRef: React.RefObject<HTMLDivElement | null>,
  targetVelocity: number,
  seqWidth: number,
  isHovered: boolean,
  pauseOnHover: boolean,
  isVisible: boolean
) => {
  const rafRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);
  const offsetRef = useRef(0);
  const velocityRef = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (seqWidth > 0) {
      offsetRef.current =
        ((offsetRef.current % seqWidth) + seqWidth) % seqWidth;
      track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
    }

    if (prefersReduced) {
      track.style.transform = 'translate3d(0, 0, 0)';
      return () => {
        lastTimestampRef.current = null;
      };
    }

    if (!isVisible) {
      return () => {
        lastTimestampRef.current = null;
      };
    }

    const animate = (timestamp: number) => {
      lastTimestampRef.current ??= timestamp;

      const deltaTime =
        Math.max(0, timestamp - lastTimestampRef.current) / 1000;
      lastTimestampRef.current = timestamp;

      const target = pauseOnHover && isHovered ? 0 : targetVelocity;

      const easingFactor =
        1 - Math.exp(-deltaTime / ANIMATION_CONFIG.SMOOTH_TAU);
      velocityRef.current += (target - velocityRef.current) * easingFactor;

      if (seqWidth > 0) {
        let nextOffset = offsetRef.current + velocityRef.current * deltaTime;
        nextOffset = ((nextOffset % seqWidth) + seqWidth) % seqWidth;
        offsetRef.current = nextOffset;

        const translateX = -offsetRef.current;
        track.style.transform = `translate3d(${translateX}px, 0, 0)`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      lastTimestampRef.current = null;
    };
  }, [trackRef, targetVelocity, seqWidth, isHovered, pauseOnHover, isVisible]);
};

export const Loop = React.memo<LogoLoopProps>(
  ({
    logos,
    speed = 120,
    direction = 'left',
    gap = 32,
    pauseOnHover = true,
    fadeOut = false,
    scaleOnHover = false,
    className,
    style,
  }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const seqRef = useRef<HTMLUListElement>(null);

    const [seqWidth, setSeqWidth] = useState<number>(0);
    const [copyCount, setCopyCount] = useState<number>(
      ANIMATION_CONFIG.MIN_COPIES
    );
    const [isHovered, setIsHovered] = useState<boolean>(false);
    const isDocumentVisible = useDocumentVisibility();

    const targetVelocity = useMemo(() => {
      const magnitude = Math.abs(speed);
      const directionMultiplier = direction === 'left' ? 1 : -1;
      const speedMultiplier = speed < 0 ? -1 : 1;
      return magnitude * directionMultiplier * speedMultiplier;
    }, [speed, direction]);

    const updateDimensions = useCallback(() => {
      const containerWidth = containerRef.current?.clientWidth ?? 0;
      const sequenceWidth =
        seqRef.current?.getBoundingClientRect?.()?.width ?? 0;

      if (sequenceWidth > 0) {
        const nextSeqWidth = Math.ceil(sequenceWidth);
        const copiesNeeded =
          Math.ceil(containerWidth / sequenceWidth) +
          ANIMATION_CONFIG.COPY_HEADROOM;
        const nextCopyCount = Math.max(
          ANIMATION_CONFIG.MIN_COPIES,
          copiesNeeded
        );

        setSeqWidth((prev) => (prev === nextSeqWidth ? prev : nextSeqWidth));
        setCopyCount((prev) =>
          prev === nextCopyCount ? prev : nextCopyCount
        );
      }
    }, []);

    useResizeObserver(updateDimensions, containerRef, seqRef);

    useAnimationLoop(
      trackRef,
      targetVelocity,
      seqWidth,
      isHovered,
      pauseOnHover,
      isDocumentVisible
    );

    const cssVariables = useMemo(
      () => ({ '--logoloop-gap': `${gap}px` }) as React.CSSProperties,
      [gap]
    );

    const rootClasses = useMemo(
      () =>
        cx(
          'relative overflow-x-hidden group',
          '[--logoloop-gap:32px]',
          '[--logoloop-logoHeight:28px]',
          '[--logoloop-fadeColorAuto:#ffffff]',
          'dark:[--logoloop-fadeColorAuto:#0b0b0b]',
          scaleOnHover && 'py-[calc(var(--logoloop-logoHeight)*0.1)]',
          className
        ),
      [scaleOnHover, className]
    );

    const handleMouseEnter = useCallback(() => {
      if (pauseOnHover) setIsHovered(true);
    }, [pauseOnHover]);

    const handleMouseLeave = useCallback(() => {
      if (pauseOnHover) setIsHovered(false);
    }, [pauseOnHover]);

    const renderLogoItem = useCallback(
      ({ id, Icon, title }: LogoItem, idx: number) => {
        return (
          <li
            className={cx(
              'mr-[var(--logoloop-gap)]',
              scaleOnHover && 'overflow-visible group/item'
            )}
            key={id}
          >
            <Chip
              initial={TechnologyStackAnimation.initial}
              animate={TechnologyStackAnimation.animate}
              transition={{
                delay: 0.05 * idx + 0.5,
                ...TechnologyStackAnimation.transition,
              }}
            >
              <Icon className="size-14 rounded-2xl" /> {title}
            </Chip>
          </li>
        );
      },
      [scaleOnHover]
    );

    const logoLists = useMemo(
      () =>
        Array.from({ length: copyCount }, (_, copyIndex) => (
          <ul
            className="flex items-center"
            key={`copy-${copyIndex}`}
            aria-hidden={copyIndex > 0}
            ref={copyIndex === 0 ? seqRef : undefined}
          >
            {logos.map((item, itemIndex) => renderLogoItem(item, itemIndex))}
          </ul>
        )),
      [copyCount, logos, renderLogoItem]
    );

    const containerStyle = useMemo(
      (): React.CSSProperties => ({
        width: '100%',
        ...cssVariables,
        ...style,
      }),
      [cssVariables, style]
    );

    return (
      <div
        ref={containerRef}
        className={rootClasses}
        style={containerStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {fadeOut && (
          <div
            aria-hidden
            className={cx(
              'pointer-events-none absolute inset-y-0 left-0 z-[1]',
              'w-[clamp(24px,8%,120px)]',
              'bg-[linear-gradient(to_right,var(--logoloop-fadeColor,var(--logoloop-fadeColorAuto))_0%,rgba(0,0,0,0)_100%)]'
            )}
          />
        )}

        <div
          className={cx(
            'flex w-max will-change-transform select-none',
            'motion-reduce:transform-none'
          )}
          ref={trackRef}
        >
          {logoLists}
        </div>
      </div>
    );
  }
);

Loop.displayName = 'LogoLoop';

export default Loop;
