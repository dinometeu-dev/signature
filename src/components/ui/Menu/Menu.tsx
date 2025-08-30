'use client';

import React, { Fragment, useState } from 'react';
import { useGetQueryParams, useSetQueryParam } from '@/utils/hooks/navigation';
import { QUERY_STATE, QUERY_WORK_ITEM } from '@/utils/constants/routes';
import { TransitionLine } from '@/components/TransitionLine';
import { useSlideStack } from '@/utils/providers/SlideStackProvider';
import { cn } from '@/utils/functions/mergeClasses';
import { useMenus } from '@/lib/api/menu';

const Menu = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { menus } = useMenus();

  console.log(menus);

  const { setActiveSlideByAriaLabel } = useSlideStack();

  const setQueryParam = useSetQueryParam();
  const getQueryParams = useGetQueryParams();

  const activeIndex = menus?.find(({ link }) =>
    getQueryParams(QUERY_STATE)
      ? link === getQueryParams(QUERY_STATE)
      : link === ''
  );

  const [activeMenuItem, setActiveMenuItem] = useState(activeIndex?.id ?? 0);

  const handleClick = (link: string, id: number, contentId?: string) => {
    setActiveSlideByAriaLabel(link, contentId);
    setActiveMenuItem(id);
    setQueryParam({
      [QUERY_STATE]: link,
      [QUERY_WORK_ITEM]: contentId,
    });
  };

  return (
    <div
      ref={ref}
      className={cn(
        'w-full h-full flex flex-col items-center justify-center gap-2',
        className
      )}
      {...props}
    >
      {menus?.map(({ id, title, link, content }, idx) => {
        const isActive = id === activeMenuItem;
        const isAboveActive = id === activeMenuItem - 1;

        return (
          <Fragment key={id}>
            <button
              onClick={() => handleClick(link, id, content[0]?.id.toString())}
              className={`cursor-pointer text-base font-headings transition hover:text-black-800 ${isActive ? 'text-black font-bold' : 'text-black-400 '}`}
            >
              {title}
            </button>
            {idx !== menus?.length - 1 && (
              <TransitionLine
                isActiveFromTop={isAboveActive}
                isActiveFromBottom={isActive}
              />
            )}
          </Fragment>
        );
      })}
    </div>
  );
});

Menu.displayName = 'Menu';
export { Menu };
