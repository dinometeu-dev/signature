import React, { Fragment, ReactNode } from 'react';
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

interface IconStackProps extends Omit<React.HTMLProps<HTMLDivElement>, 'size'> {
  size?: number;
  iconCount?: number;
  hoverScale?: number;
  showFull?: boolean;
  icons?: {
    src: string;
    alt: string;
    link?: string;
  }[];
}

const BASE_HOVER_SHADOW = '0 4px 14px rgba(0, 0, 0, 0.2)';

const IconStack = React.forwardRef<HTMLDivElement, IconStackProps>(
  (
    {
      className,
      icons,
      size = 24,
      iconCount = 4,
      hoverScale = 1.15,
      showFull,
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

    return (
      <div ref={ref} className={cn('flex', className)} {...props}>
        {showedIcons?.map(({ src, alt, link }, idx) => {
          return (
            <Tooltip key={src + alt}>
              <TooltipTrigger asChild>
                <motion.div
                  className={cn(
                    'p-1.5 bg-white shadow-sm rounded-full inline-block',
                    link && 'cursor-pointer'
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
                    link
                  )}
                </motion.div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{alt}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
        {icons!.length > iconCount && hiddenIcons && !showFull && (
          <HoverCard openDelay={300}>
            <HoverCardTrigger asChild>
              <motion.div
                className={cn(
                  'bg-sky-500 not-italic text-white shadow-sm rounded-full flex justify-center items-center cursor-pointer'
                )}
                style={{
                  minWidth: `${size + 12}px`,
                  minHeight: `${size + 12}px`,
                  zIndex: icons!.length,
                  marginLeft,
                }}
                whileHover={{
                  scale: hoverScale,
                  boxShadow: BASE_HOVER_SHADOW,
                  transition: { duration: 0.3, bounce: 0 },
                }}
              >
                +{icons!.length - iconCount}
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
                      className="rounded-full"
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
