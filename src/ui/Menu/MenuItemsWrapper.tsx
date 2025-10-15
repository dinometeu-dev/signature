import { AnimatePresence, motion } from 'framer-motion';
import { FC } from 'react';

import { MenuItemsWrapperAnimation } from '@/ui/Menu/animations/menu-items-wrapper-animations';
import MenuItems from '@/ui/Menu/MenuItems';
import { Button } from '@components/Button';
import Kbd from '@components/Kbd';

interface MenuItemsProps {
  open: boolean;
  closeMenu: () => void;
  startPosition: { x: number; y: number };
}

const MenuItemsWrapper: FC<MenuItemsProps> = ({
  open,
  closeMenu,
  startPosition,
}) => {
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
            className="absolute -translate-x-full -translate-y-1/2"
            style={{
              left: startPosition.x,
              top: startPosition.y,
            }}
          >
            <MenuItems />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MenuItemsWrapper;
