import React, {
  FC,
  SVGProps,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import CSS3Logo from '@public/svg/technology-logos/css3-logo';
import JavaScriptLogo from '@public/svg/technology-logos/js-logo';
import N8nLogo from '@public/svg/technology-logos/n8n-logo';
import NextJSLogo from '@public/svg/technology-logos/nextjs-logo';
import NodeJsLogo from '@public/svg/technology-logos/nodejs-logo';
import PrismaLogo from '@public/svg/technology-logos/prisma-logo';
import ReactJSLogo from '@public/svg/technology-logos/react-logo';
import TailwindLogo from '@public/svg/technology-logos/tailwindcss-logo';
import TypeScriptLogo from '@public/svg/technology-logos/typescript-logo';

import Chip from '@components/Chip';
import { TechnologyStackAnimation } from '@slides/ProfileSlide/animations/profile-card-animations';

export type LogoItem = {
  id: number;
  title: string;
  Icon?: FC<SVGProps<SVGSVGElement>>;
  iconPath?: string;
};

const LOGO_COMPONENT_REGISTRY: Record<
  string,
  FC<SVGProps<SVGSVGElement>>
> = {
  'react-logo.svg': ReactJSLogo,
  'nextjs-logo.svg': NextJSLogo,
  'typescript-logo.svg': TypeScriptLogo,
  'tailwindcss-logo.svg': TailwindLogo,
  'nodejs-logo.svg': NodeJsLogo,
  'css3-logo.svg': CSS3Logo,
  'js-logo.svg': JavaScriptLogo,
  'prisma-logo.svg': PrismaLogo,
  'n8n-logo.svg': N8nLogo,
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
  PAUSE_TAU: 1.1,
  MOMENTUM_TAU: 1.8,
  MIN_COPIES: 3,
  COPY_HEADROOM: 2,
  MAX_RELEASE_VELOCITY: 2200,
  MIN_RELEASE_VELOCITY: 40,
} as const;

const ENTRY_EFFECT_CONFIG = {
  DISTANCE: 250,
  MIN_SCALE: 0.88,
  MIN_OPACITY: 0.5,
  MAX_BRIGHTNESS: 1.12,
  MIN_SATURATION: 0.4,
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

const useEntryEdgeEffect = (
  containerRef: React.RefObject<HTMLDivElement | null>,
  trackRef: React.RefObject<HTMLDivElement | null>,
  enabled: boolean,
  isVisible: boolean,
  itemCount: number
) => {
  const trackedItemsRef = useRef<HTMLElement[]>([]);
  const lastProgressRef = useRef(new WeakMap<HTMLElement, number>());

  const refreshTrackedItems = useCallback(() => {
    const track = trackRef.current;

    trackedItemsRef.current = track
      ? Array.from(track.querySelectorAll<HTMLElement>('[data-loop-item]'))
      : [];
  }, [trackRef]);

  const resetStyles = useCallback(() => {
    trackedItemsRef.current.forEach((item) => {
      item.style.transform = '';
      item.style.opacity = '';
      item.style.filter = '';
      item.style.transformOrigin = '';
      item.style.willChange = '';
    });

    lastProgressRef.current = new WeakMap<HTMLElement, number>();
  }, []);

  const applyEntryEffect = useCallback(
    (translateX: number) => {
      if (!enabled || !isVisible) {
        return;
      }

      const prefersReducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (prefersReducedMotion) {
        resetStyles();
        return;
      }

      trackedItemsRef.current.forEach((item) => {
        const itemLeft = item.offsetLeft + translateX;
        const itemRight = itemLeft + item.offsetWidth;
        const isInsideEffectZone =
          itemRight > -ENTRY_EFFECT_CONFIG.DISTANCE &&
          itemLeft < ENTRY_EFFECT_CONFIG.DISTANCE;

        if (!isInsideEffectZone) {
          if (lastProgressRef.current.has(item)) {
            item.style.transform = '';
            item.style.opacity = '';
            item.style.filter = '';
            item.style.transformOrigin = '';
            item.style.willChange = '';
            lastProgressRef.current.delete(item);
          }
          return;
        }

        const enteredDistance = Math.max(
          0,
          Math.min(ENTRY_EFFECT_CONFIG.DISTANCE, itemRight)
        );
        const progress = enteredDistance / ENTRY_EFFECT_CONFIG.DISTANCE;
        const prevProgress = lastProgressRef.current.get(item);

        if (
          prevProgress !== undefined &&
          Math.abs(prevProgress - progress) < 0.01
        ) {
          return;
        }

        const scale =
          ENTRY_EFFECT_CONFIG.MIN_SCALE +
          (1 - ENTRY_EFFECT_CONFIG.MIN_SCALE) * progress;
        const opacity =
          ENTRY_EFFECT_CONFIG.MIN_OPACITY +
          (1 - ENTRY_EFFECT_CONFIG.MIN_OPACITY) * progress;
        const brightness =
          ENTRY_EFFECT_CONFIG.MAX_BRIGHTNESS -
          (ENTRY_EFFECT_CONFIG.MAX_BRIGHTNESS - 1) * progress;
        const saturation =
          ENTRY_EFFECT_CONFIG.MIN_SATURATION +
          (1 - ENTRY_EFFECT_CONFIG.MIN_SATURATION) * progress;

        item.style.transformOrigin = 'left center';
        item.style.transform = `scale(${scale})`;
        item.style.opacity = `${opacity}`;
        item.style.filter = `brightness(${brightness}) saturate(${saturation})`;
        item.style.willChange = 'transform, opacity, filter';
        lastProgressRef.current.set(item, progress);
      });
    },
    [enabled, isVisible, resetStyles]
  );

  useEffect(() => {
    refreshTrackedItems();
  }, [itemCount, refreshTrackedItems]);

  useEffect(() => {
    if (!enabled || !isVisible) {
      resetStyles();
    }
  }, [enabled, isVisible, resetStyles]);

  return {
    applyEntryEffect,
    refreshTrackedItems,
    resetStyles,
  };
};

const useAnimationLoop = (
  trackRef: React.RefObject<HTMLDivElement | null>,
  targetVelocity: number,
  seqWidth: number,
  isHovered: boolean,
  pauseOnHover: boolean,
  isVisible: boolean,
  onTranslateFrame?: (translateX: number) => void
) => {
  const rafRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);
  const translateRef = useRef(0);
  const velocityRef = useRef(0);
  const momentumBoostRef = useRef(0);
  const hasInitialTransformRef = useRef(false);
  const prevSeqWidthRef = useRef(0);
  const interactionRef = useRef({
    isDragging: false,
    pointerId: null as number | null,
    lastClientX: 0,
    lastTimestamp: 0,
    releaseVelocity: 0,
    resumeWhileHovered: false,
  });

  const applyTrackTransform = useCallback(() => {
    const track = trackRef.current;
    if (!track || seqWidth <= 0) {
      return;
    }

    if (!hasInitialTransformRef.current) {
      translateRef.current = -seqWidth;
      hasInitialTransformRef.current = true;
    }

    while (translateRef.current > 0) {
      translateRef.current -= seqWidth;
    }

    while (translateRef.current <= -seqWidth * 2) {
      translateRef.current += seqWidth;
    }

    track.style.transform = `translate3d(${translateRef.current}px, 0, 0)`;
  }, [seqWidth, trackRef]);

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (seqWidth <= 0 || event.button > 0) {
        return;
      }

      const container = event.currentTarget;
      container.setPointerCapture(event.pointerId);

      interactionRef.current.isDragging = true;
      interactionRef.current.pointerId = event.pointerId;
      interactionRef.current.lastClientX = event.clientX;
      interactionRef.current.lastTimestamp = performance.now();
      interactionRef.current.releaseVelocity = 0;
      interactionRef.current.resumeWhileHovered = true;
      momentumBoostRef.current = 0;
      velocityRef.current = 0;
      hasInitialTransformRef.current = seqWidth > 0;
      lastTimestampRef.current = interactionRef.current.lastTimestamp;
    },
    [seqWidth]
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (
        !interactionRef.current.isDragging ||
        interactionRef.current.pointerId !== event.pointerId
      ) {
        return;
      }

      const now = performance.now();
      const deltaX = event.clientX - interactionRef.current.lastClientX;
      const deltaTime = Math.max(
        0.001,
        (now - interactionRef.current.lastTimestamp) / 1000
      );

      interactionRef.current.lastClientX = event.clientX;
      interactionRef.current.lastTimestamp = now;
      interactionRef.current.releaseVelocity = deltaX / deltaTime;

      if (seqWidth > 0) {
        translateRef.current += deltaX;
        applyTrackTransform();
        onTranslateFrame?.(translateRef.current);
      }
    },
    [applyTrackTransform, onTranslateFrame, seqWidth]
  );

  const finishPointerInteraction = useCallback(
    (pointerId: number) => {
      if (
        !interactionRef.current.isDragging ||
        interactionRef.current.pointerId !== pointerId
      ) {
        return;
      }

      interactionRef.current.isDragging = false;
      interactionRef.current.pointerId = null;

      const clampedReleaseVelocity = Math.max(
        -ANIMATION_CONFIG.MAX_RELEASE_VELOCITY,
        Math.min(
          ANIMATION_CONFIG.MAX_RELEASE_VELOCITY,
          interactionRef.current.releaseVelocity
        )
      );

      if (
        Math.abs(clampedReleaseVelocity) < ANIMATION_CONFIG.MIN_RELEASE_VELOCITY
      ) {
        interactionRef.current.releaseVelocity = 0;
        return;
      }

      velocityRef.current = clampedReleaseVelocity;
      momentumBoostRef.current = clampedReleaseVelocity + targetVelocity;
    },
    [targetVelocity]
  );

  const handlePointerUp = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      finishPointerInteraction(event.pointerId);
    },
    [finishPointerInteraction]
  );

  const handlePointerCancel = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      finishPointerInteraction(event.pointerId);
    },
    [finishPointerInteraction]
  );

  useEffect(() => {
    if (seqWidth <= 0) {
      return;
    }

    if (!hasInitialTransformRef.current) {
      translateRef.current = -seqWidth;
      hasInitialTransformRef.current = true;
      prevSeqWidthRef.current = seqWidth;
      applyTrackTransform();
      onTranslateFrame?.(translateRef.current);
      return;
    }

    if (prevSeqWidthRef.current > 0 && prevSeqWidthRef.current !== seqWidth) {
      translateRef.current += prevSeqWidthRef.current - seqWidth;
      prevSeqWidthRef.current = seqWidth;
      applyTrackTransform();
      onTranslateFrame?.(translateRef.current);
    }
  }, [applyTrackTransform, onTranslateFrame, seqWidth]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    applyTrackTransform();
    onTranslateFrame?.(translateRef.current);

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

      if (
        !isHovered &&
        !interactionRef.current.isDragging &&
        Math.abs(momentumBoostRef.current) < 1
      ) {
        interactionRef.current.resumeWhileHovered = false;
      }

      if (!interactionRef.current.isDragging) {
        momentumBoostRef.current *= Math.exp(
          -deltaTime / ANIMATION_CONFIG.MOMENTUM_TAU
        );
      }

      const target =
        pauseOnHover && isHovered && !interactionRef.current.resumeWhileHovered
          ? 0
          : -targetVelocity;

      if (interactionRef.current.isDragging) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      const activeTau =
        pauseOnHover && isHovered && !interactionRef.current.resumeWhileHovered
          ? ANIMATION_CONFIG.PAUSE_TAU
          : ANIMATION_CONFIG.SMOOTH_TAU;
      const easingFactor = 1 - Math.exp(-deltaTime / activeTau);
      const effectiveTarget = target + momentumBoostRef.current;
      velocityRef.current +=
        (effectiveTarget - velocityRef.current) * easingFactor;

      if (seqWidth > 0) {
        translateRef.current += velocityRef.current * deltaTime;
        applyTrackTransform();
        onTranslateFrame?.(translateRef.current);
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
  }, [
    applyTrackTransform,
    isHovered,
    isVisible,
    pauseOnHover,
    seqWidth,
    targetVelocity,
    onTranslateFrame,
    trackRef,
  ]);

  return {
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerCancel,
  };
};

export const Loop = React.memo<LogoLoopProps>(
  ({
    logos,
    speed = 120,
    direction = 'left',
    gap = 32,
    pauseOnHover = true,
    fadeOut = false,
    fadeOutColor = '#ffffff',
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
      const sequenceWidth = seqRef.current?.scrollWidth ?? 0;

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
        setCopyCount((prev) => (prev === nextCopyCount ? prev : nextCopyCount));
      }
    }, []);

    useResizeObserver(updateDimensions, containerRef, seqRef);

    const { applyEntryEffect } = useEntryEdgeEffect(
      containerRef,
      trackRef,
      fadeOut,
      isDocumentVisible,
      copyCount * logos.length
    );

    const {
      handlePointerCancel,
      handlePointerDown,
      handlePointerMove,
      handlePointerUp,
    } = useAnimationLoop(
      trackRef,
      targetVelocity,
      seqWidth,
      isHovered,
      pauseOnHover,
      isDocumentVisible,
      applyEntryEffect
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
      ({ id, Icon, iconPath, title }: LogoItem, idx: number) => {
        const ResolvedIcon = Icon ?? (iconPath ? LOGO_COMPONENT_REGISTRY[iconPath] : undefined);

        return (
          <li
            className={cx(
              'mr-[var(--logoloop-gap)]',
              scaleOnHover && 'overflow-visible group/item'
            )}
            key={id}
            data-loop-item
          >
            <Chip
              initial={TechnologyStackAnimation.initial}
              animate={TechnologyStackAnimation.animate}
              transition={{
                delay: 0.05 * idx + 0.5,
                ...TechnologyStackAnimation.transition,
              }}
            >
              {ResolvedIcon ? (
                <ResolvedIcon className="loop-chip-icon size-14 rounded-2xl" />
              ) : iconPath ? (
                <img
                  src={iconPath.startsWith('/') || iconPath.startsWith('http') ? iconPath : `/svg/technology-logos/${iconPath}`}
                  alt={title}
                  className="loop-chip-icon size-14 rounded-2xl object-contain"
                />
              ) : null}{' '}
              {title}
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
        ['--logoloop-fadeColor' as string]: fadeOutColor,
        ...cssVariables,
        ...style,
      }),
      [cssVariables, fadeOutColor, style]
    );
    return (
      <div
        ref={containerRef}
        className={rootClasses}
        style={containerStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onPointerCancel={handlePointerCancel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
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
            'cursor-grab active:cursor-grabbing',
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
