import { AnimatePresence, motion } from 'framer-motion';
import { FC, useCallback, useLayoutEffect, useRef, useState } from 'react';

import { MenuItemsWrapperAnimation } from '@/ui/Menu/animations/menu-items-wrapper-animations';
import MenuItems from '@/ui/Menu/MenuItems';
import { Button } from '@components/Button';
import Kbd from '@components/Kbd';

export type MenuAlign = 'left' | 'right';

interface MenuItemsProps {
  open: boolean;
  closeMenu: () => void;
  startPosition: { x: number; y: number };
}

const VIEWPORT_PADDING = 24;

const MenuItemsWrapper: FC<MenuItemsProps> = ({
  open,
  closeMenu,
  startPosition,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuLayout, setMenuLayout] = useState<{
    x: number;
    y: number;
    align: MenuAlign;
  }>({
    x: startPosition.x,
    y: startPosition.y,
    align: 'right',
  });

  const updateMenuPosition = useCallback(() => {
    if (!menuRef.current) {
      return;
    }

    const menuWidth = menuRef.current.offsetWidth;
    const menuHeight = menuRef.current.offsetHeight;
    const activeMenuItem = menuRef.current.querySelector<HTMLElement>(
      '[data-menu-item="true"][data-active="true"]'
    );
    const activeItemOffsetTop = activeMenuItem?.offsetTop ?? menuHeight / 2;
    const activeItemOffsetLeft = activeMenuItem?.offsetLeft ?? menuWidth / 2;
    const activeItemHeight = activeMenuItem?.offsetHeight ?? 0;
    const activeItemWidth = activeMenuItem?.offsetWidth ?? 0;
    const activeItemCenter =
      activeItemOffsetTop + (activeItemHeight || menuHeight) / 2;
    const activeItemCenterX =
      activeItemOffsetLeft + (activeItemWidth || menuWidth) / 2;

    const canOpenToLeft = startPosition.x - menuWidth >= VIEWPORT_PADDING;
    const align: MenuAlign = canOpenToLeft ? 'right' : 'left';
    const preferredLeft = startPosition.x - activeItemCenterX;
    const preferredTop = startPosition.y - activeItemCenter;

    const maxLeft = Math.max(
      VIEWPORT_PADDING,
      window.innerWidth - VIEWPORT_PADDING - menuWidth
    );
    const maxTop = Math.max(
      VIEWPORT_PADDING,
      window.innerHeight - VIEWPORT_PADDING - menuHeight
    );

    setMenuLayout({
      x: Math.min(Math.max(VIEWPORT_PADDING, preferredLeft), maxLeft),
      y: Math.min(Math.max(VIEWPORT_PADDING, preferredTop), maxTop),
      align,
    });
  }, [startPosition]);

  useLayoutEffect(() => {
    if (!open) {
      return;
    }

    updateMenuPosition();

    window.addEventListener('resize', updateMenuPosition);

    return () => {
      window.removeEventListener('resize', updateMenuPosition);
    };
  }, [open, updateMenuPosition]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="top-0 left-0 z-50 absolute w-screen h-screen p-6"
          initial={MenuItemsWrapperAnimation.initial}
          animate={MenuItemsWrapperAnimation.animate}
          exit={MenuItemsWrapperAnimation.exit}
        >
          <Button className="text-black/60" onClick={closeMenu}>
            Close <Kbd>Esc</Kbd>
          </Button>
          <motion.div
            ref={menuRef}
            className="absolute"
            style={{
              left: menuLayout.x,
              top: menuLayout.y,
            }}
          >
            <MenuItems align={menuLayout.align} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MenuItemsWrapper;
