import { AnimatePresence, motion } from 'framer-motion';
import { FC } from 'react';

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
          initial={{
            opacity: 0,
            backdropFilter: 'blur(0px)',
            background: 'rgba(255, 255, 255, 0)',
          }}
          animate={{
            opacity: 1,
            backdropFilter: 'blur(20px)',
            background: 'rgba(255, 255, 255, 0.6)',
          }}
          exit={{
            opacity: 0,
            backdropFilter: 'blur(0px)',
            background: 'rgba(255, 255, 255, 0)',
            transition: {
              delay: 0.2,
            },
          }}
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
