'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  ReactNode,
  useState,
} from 'react';

type CirclePosition = { x: number; y: number } | null;

type MenuStateContextValue = {
  menuOpen: boolean;
  openMenu: () => void;
  closeMenu: () => void;
};

type MenuPositionContextValue = {
  circlePosition: CirclePosition;
  setCirclePosition: (pos: CirclePosition) => void;
  clearCirclePosition: () => void;
};

const MenuStateContext = createContext<MenuStateContextValue | undefined>(
  undefined
);
const MenuPositionContext = createContext<MenuPositionContextValue | undefined>(
  undefined
);

type MenuProviderProps = {
  children: ReactNode;
};

export function MenuProvider({ children }: Readonly<MenuProviderProps>) {
  const [circlePosition, setCirclePosition] = useState<CirclePosition>(null);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const clearCirclePosition = useCallback(() => setCirclePosition(null), []);
  const openMenu = useCallback(() => setMenuOpen(true), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeMenu();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeMenu]);

  const menuStateValue = useMemo<MenuStateContextValue>(
    () => ({
      menuOpen,
      openMenu,
      closeMenu,
    }),
    [closeMenu, menuOpen, openMenu]
  );

  const menuPositionValue = useMemo<MenuPositionContextValue>(
    () => ({
      circlePosition,
      setCirclePosition,
      clearCirclePosition,
    }),
    [circlePosition, clearCirclePosition]
  );

  return (
    <MenuStateContext.Provider value={menuStateValue}>
      <MenuPositionContext.Provider value={menuPositionValue}>
        {children}
      </MenuPositionContext.Provider>
    </MenuStateContext.Provider>
  );
}

export function useMenuState() {
  const context = useContext(MenuStateContext);
  if (context === undefined) {
    throw new Error('useMenuState must be used within a MenuProvider');
  }
  return context;
}

export function useMenuPosition() {
  const context = useContext(MenuPositionContext);
  if (context === undefined) {
    throw new Error('useMenuPosition must be used within a MenuProvider');
  }
  return context;
}
