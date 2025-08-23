'use client';

import React, { FC, Fragment } from 'react';
import { MenuWithContent } from '@/types/api';
import { useGetQueryParams, useSetQueryParam } from '@/utils/hooks/navigation';
import { QUERY_STATE, QUERY_WORK_ITEM } from '@/utils/constants/routes';
import { TransitionLine } from '@/components/TransitionLine';

type MenuClientProps = {
  menu: MenuWithContent[];
};

export const MenuClient: FC<MenuClientProps> = ({ menu }) => {
  const setQueryParam = useSetQueryParam();
  const getQueryParams = useGetQueryParams();

  const activeIndex = menu.findIndex(({ link }) =>
    getQueryParams(QUERY_STATE)
      ? link === getQueryParams(QUERY_STATE)
      : link === ''
  );

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-2">
      {menu?.map(({ id, title, link, content }, idx) => {
        const isActive = idx === activeIndex;
        const isAboveActive = idx === activeIndex - 1;

        return (
          <Fragment key={id}>
            <button
              onClick={() =>
                setQueryParam({
                  [QUERY_STATE]: link,
                  [QUERY_WORK_ITEM]: content[0]?.id.toString(),
                })
              }
              className={`cursor-pointer text-base font-domine transition hover:text-black-800 ${isActive ? 'text-black font-bold' : 'text-black-400 '}`}
            >
              {title}
            </button>
            {idx !== menu?.length - 1 && (
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
};
