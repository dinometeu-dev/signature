'use client';

import { AnimatePresence, motion } from 'framer-motion';

import { MenuAlign } from '@/ui/Menu/MenuItemsWrapper';
import { MenuItemsLineAnimations } from '@/ui/Menu/animations/menu-items-animations';
import { MENU_ITEMS } from '@/ui/Menu/utils/content';
import { QUERY_SLIDE } from '@/utils/constants/routes';
import { cn } from '@/utils/functions/mergeClasses';
import { useGetQueryParams } from '@/utils/hooks/navigation';
import { useMenuState } from '@/utils/providers/MenuProvider';
import {
  SlideNameType,
  useSlideStack,
} from '@/utils/providers/SlideStackProvider';

type MenuItemsProps = {
  align?: MenuAlign;
};

const MenuItems = ({ align = 'right' }: Readonly<MenuItemsProps>) => {
  const isLoading = false;
  const getQuery = useGetQueryParams();
  const currentSlide = getQuery(QUERY_SLIDE);
  const { setSlideStack } = useSlideStack();

  const { closeMenu } = useMenuState();

  const handleItemClick = (link: SlideNameType) => {
    if (!link) return;

    setSlideStack(link);
    closeMenu();
  };

  return (
    <div
      className={cn(
        'flex flex-col gap-6 justify-center overflow-hidden pb-[10px]',
        align === 'right' ? 'items-end pl-[20px]' : 'items-start pr-[20px]'
      )}
    >
      {isLoading
        ? Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-10 bg-black/5 rounded-lg animate-pulse"
              style={{
                width: Math.random() * 200 + 100,
              }}
            />
          ))
        : MENU_ITEMS?.map(({ title, id, link }) => (
            <div
              key={id}
              className="relative select-none"
              data-menu-item="true"
              data-active={currentSlide === link ? 'true' : 'false'}
              onClick={() => handleItemClick(link)}
            >
              <h2
                className={cn(
                  'relative text-4xl font-headings font-medium cursor-pointer hover:blur-none hover:text-black transition z-10',
                  currentSlide !== link && 'blur-[2px] text-black/60'
                )}
              >
                {title}
              </h2>
              <AnimatePresence>
                {currentSlide === link && (
                  <motion.span
                    className={cn(
                      'absolute h-4 w-[calc(100%+20px)] -translate-y-2/3 bg-red-accent',
                      align === 'right'
                        ? 'right-0 -translate-x-[20px]'
                        : 'left-0'
                    )}
                    initial={MenuItemsLineAnimations.initial}
                    animate={MenuItemsLineAnimations.animate}
                    exit={MenuItemsLineAnimations.exit}
                    transition={MenuItemsLineAnimations.transition}
                  />
                )}
              </AnimatePresence>
            </div>
          ))}
    </div>
  );
};

export default MenuItems;
