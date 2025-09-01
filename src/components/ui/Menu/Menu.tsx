'use client';

import React, { FC, Fragment, useEffect, useState } from 'react';
import { useGetQueryParams, useSetQueryParam } from '@/utils/hooks/navigation';
import { QUERY_STATE, QUERY_WORK_ITEM } from '@/utils/constants/routes';
import { TransitionLine } from '@/components/TransitionLine';
import { useSlideStack } from '@/utils/providers/SlideStackProvider';
import { cn } from '@/utils/functions/mergeClasses';
import { useMenus } from '@/lib/api/menu';
import { QUERY_STATE_WORKS } from '@/utils/constants/paths';
import Skeleton from '@/components/Skeleton';

const Wrapper = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'w-full h-full flex flex-col items-center justify-center gap-2',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

const MenuLoading: FC<{ isLoading: boolean }> = () => {
  const arrayOfElements = Array.from({ length: 4 });

  return arrayOfElements.map((_, idx) => (
    <Fragment key={idx}>
      <Skeleton className={`h-[18px] w-24 rounded-full`} />
      {idx !== arrayOfElements?.length - 1 && (
        <Skeleton className={`h-3 w-1 rounded-full`} />
      )}
    </Fragment>
  ));
};

const Menu = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { menus, isLoading } = useMenus();

  const { setActiveSlideByAriaLabel } = useSlideStack();

  const setQueryParam = useSetQueryParam();
  const getQueryParams = useGetQueryParams();

  const [activeMenuItem, setActiveMenuItem] = useState(0);

  const handleClick = (link: string, id: number, contentId?: string) => {
    setActiveSlideByAriaLabel(link, contentId);
    setActiveMenuItem(id);
    setQueryParam({
      [QUERY_STATE]: link,
      [QUERY_WORK_ITEM]: contentId,
    });
  };

  useEffect(() => {
    const activeItem = menus?.find(({ link }) =>
      getQueryParams(QUERY_STATE)
        ? link === getQueryParams(QUERY_STATE)
        : link === ''
    );

    if (activeItem) {
      setActiveMenuItem(activeItem.id);
    }
  }, [getQueryParams(QUERY_STATE), menus]);

  if (isLoading) {
    return (
      <Wrapper ref={ref} className={className} {...props}>
        <MenuLoading isLoading={isLoading} />
      </Wrapper>
    );
  }

  return (
    <Wrapper ref={ref} className={className} {...props}>
      {menus?.map(({ id, title, link, content }, idx) => {
        const isActive = id === activeMenuItem;
        const isAboveActive = id === activeMenuItem - 1;

        if (link === QUERY_STATE_WORKS && !content?.length) return null;

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
    </Wrapper>
  );
});

Menu.displayName = 'Menu';
Wrapper.displayName = 'MenuWrapper';
export { Menu };
