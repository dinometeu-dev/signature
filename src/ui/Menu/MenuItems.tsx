import { AnimatePresence, motion } from 'framer-motion';

import { useMenus } from '@/lib/api/menu';
import { QUERY_SLIDE } from '@/utils/constants/routes';
import { cn } from '@/utils/functions/mergeClasses';
import { useGetQueryParams, useSetQueryParam } from '@/utils/hooks/navigation';
import { useMenuProvider } from '@/utils/providers/MenuProvider';

const MenuItems = () => {
  const { menus, isLoading } = useMenus();
  const getQuery = useGetQueryParams();
  const setQuery = useSetQueryParam();
  const currentSlide = getQuery(QUERY_SLIDE);

  const { closeMenu } = useMenuProvider();

  const handleItemClick = (link: string) => {
    setQuery(QUERY_SLIDE, link);
    closeMenu();
  };

  return (
    <div className="flex flex-col gap-6 items-end justify-center overflow-hidden pb-[10px] pl-[20px]">
      {isLoading
        ? Array.from({ length: 4 }).map((_, index) => (
            <motion.div
              key={index}
              className="h-10 bg-black/5 rounded-lg animate-pulse"
              style={{
                width: Math.random() * 200 + 100,
              }}
            />
          ))
        : menus?.map(({ title, id, link }) => (
            <div
              key={id}
              className="relative "
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
                    initial={{ height: 0 }}
                    animate={{ height: 16 }}
                    exit={{
                      translateX: '100%',
                    }}
                    transition={{
                      duration: 0.5,
                    }}
                  />
                )}
              </AnimatePresence>
            </div>
          ))}
    </div>
  );
};

export default MenuItems;
