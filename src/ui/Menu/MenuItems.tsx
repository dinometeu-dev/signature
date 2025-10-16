import { AnimatePresence, motion } from 'framer-motion';

import { MenuItemsLineAnimations } from '@/ui/Menu/animations/menu-items-animations';
import { MENU_ITEMS } from '@/ui/Menu/utils/content';
import { QUERY_SLIDE } from '@/utils/constants/routes';
import { cn } from '@/utils/functions/mergeClasses';
import { useGetQueryParams } from '@/utils/hooks/navigation';
import { useMenuProvider } from '@/utils/providers/MenuProvider';
import {
  SlideNameType,
  useSlideStack,
} from '@/utils/providers/SlideStackProvider';

const MenuItems = () => {
  const isLoading = false;
  const getQuery = useGetQueryParams();
  const currentSlide = getQuery(QUERY_SLIDE);
  const { setSlideStack } = useSlideStack();

  const { closeMenu } = useMenuProvider();

  const handleItemClick = (link: SlideNameType) => {
    if (!link) return;

    setSlideStack(link);
    closeMenu();
  };

  return (
    <div className="flex flex-col gap-6 items-end justify-center overflow-hidden pb-[10px] pl-[20px] ">
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
                    className="absolute w-[calc(100%+20px)] h-4 bg-red-accent -translate-y-2/3 -translate-x-[20px]"
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
