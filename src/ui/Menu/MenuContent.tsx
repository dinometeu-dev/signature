import { ComponentProps, FC, Fragment } from 'react';

import LongPress from '@/ui/Menu/LongPress';
import MenuItemsWrapper from '@/ui/Menu/MenuItemsWrapper';
import { useMenuProvider } from '@/utils/providers/MenuProvider';

const MenuContent: FC<ComponentProps<'div'>> = ({ children }) => {
  const { menuOpen, closeMenu, openMenu, circlePosition } = useMenuProvider();

  return (
    <Fragment>
      <LongPress onLongPress={openMenu} disable={menuOpen}>
        {children}
      </LongPress>
      <MenuItemsWrapper
        open={menuOpen}
        closeMenu={closeMenu}
        startPosition={circlePosition ?? { x: 0, y: 0 }}
      />
    </Fragment>
  );
};

export default MenuContent;
