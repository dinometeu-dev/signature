import React, { FC, Fragment, ReactNode } from 'react';
import { cn } from '@/utils/functions/mergeClasses';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/tooltip';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/hover-card';
import Link from 'next/link';
import Skeleton from '@/components/Skeleton';

interface IconStackProps extends Omit<React.HTMLProps<HTMLDivElement>, 'size'> {
  size?: number;
  iconCount?: number;
  hoverScale?: number;
  showFull?: boolean;
  isLoading?: boolean;
  icons?: {
    src: string;
    alt: string;
    url?: string;
  }[];
}

const BASE_HOVER_SHADOW = '0 4px 14px rgba(0, 0, 0, 0.2)';

const LoadingIconStack: FC<{ size: number; marginLeft: string }> = ({
  size,
  marginLeft,
}) => {
  return [...Array(4)].map((_, idx) => (
    <Skeleton
      key={idx}
      className="rounded-full"
      style={{
        marginLeft: marginLeft,
        width: size + 12,
        height: size + 12,
      }}
    />
  ));
};

const IconStack = React.forwardRef<HTMLDivElement, IconStackProps>(
  (
    {
      className,
      icons,
      size = 24,
      iconCount = 4,
      hoverScale = 1.15,
      showFull,
      isLoading,
      ...props
    },
    ref
  ) => {
    const hoverX = -(size / 5);
    const marginLeft = `-${size / 1.6}px`;

    const showedIcons = showFull ? icons : icons?.slice(0, iconCount);
    const hiddenIcons = icons?.slice(iconCount);

    const setLink = (children: ReactNode, link?: string) => {
      if (link) {
        return (
          <Link href={link} target="_blank" rel="noreferrer">
            {children}
          </Link>
        );
      }
      return children;
    };

    if (isLoading && !showedIcons) {
      return (
        <div ref={ref} className={cn('flex', className)} {...props}>
          <LoadingIconStack size={size} marginLeft={marginLeft} />
        </div>
      );
    }

    return (
      <div ref={ref} className={cn('flex', className)} {...props}>
        {showedIcons?.map(({ src, alt, url }, idx) => {
          return (
            <Tooltip key={src + alt}>
              <TooltipTrigger asChild>
                <motion.div
                  className={cn(
                    'p-1.5 bg-white shadow-sm rounded-full inline-block',
                    url && 'cursor-pointer'
                  )}
                  style={{
                    zIndex: idx,
                    marginLeft,
                  }}
                  whileHover={{
                    zIndex: icons!.length + 1,
                    y: hoverX,
                    scale: hoverScale,
                    boxShadow: BASE_HOVER_SHADOW,
                    transition: { duration: 0.3, bounce: 0 },
                  }}
                >
                  {setLink(
                    <Image
                      src={src}
                      alt={alt}
                      width={size}
                      height={size}
                      className="rounded-full"
                    />,
                    url
                  )}
                </motion.div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{alt}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
        {icons && icons.length > iconCount && hiddenIcons && !showFull && (
          <HoverCard openDelay={300}>
            <HoverCardTrigger asChild>
              <motion.div
                className={cn(
                  'bg-sky-500 not-italic text-white shadow-sm rounded-full flex justify-center items-center cursor-pointer'
                )}
                style={{
                  minWidth: `${size + 12}px`,
                  minHeight: `${size + 12}px`,
                  zIndex: icons.length,
                  marginLeft,
                }}
                whileHover={{
                  scale: hoverScale,
                  boxShadow: BASE_HOVER_SHADOW,
                  transition: { duration: 0.3, bounce: 0 },
                }}
              >
                +{hiddenIcons.length}
              </motion.div>
            </HoverCardTrigger>
            <HoverCardContent className="w-fit flex flex-col gap-2 items-start">
              {hiddenIcons?.map(({ src, alt }, idx) => (
                <Fragment key={src + alt}>
                  <div className="flex items-center gap-2 p-1">
                    <Image
                      src={src}
                      alt={alt}
                      width={size}
                      height={size}
                      className="rounded-xs"
                    />
                    <p>{alt}</p>
                  </div>
                  {idx !== hiddenIcons.length - 1 && (
                    <div className="w-full h-px bg-gradient-to-r from-black/20 to-transparent" />
                  )}
                </Fragment>
              ))}
            </HoverCardContent>
          </HoverCard>
        )}
      </div>
    );
  }
);

IconStack.displayName = 'IconStack';
export default IconStack;
