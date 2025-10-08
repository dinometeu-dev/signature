'use client';

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
  useCallback,
  useEffect,
} from 'react';

type CirclePosition = { x: number; y: number } | null;

type MenuProviderContextType = {
  circlePosition: CirclePosition;
  setCirclePosition: (pos: CirclePosition) => void;
  clearCirclePosition: () => void;
  menuOpen: boolean;
  openMenu: () => void;
  closeMenu: () => void;
};

const MenuProviderContext = createContext<MenuProviderContextType | undefined>(
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
  }, []);

  const value = useMemo<MenuProviderContextType>(
    () => ({
      circlePosition,
      setCirclePosition,
      clearCirclePosition,
      menuOpen,
      openMenu,
      closeMenu,
    }),
    [
      circlePosition,
      setCirclePosition,
      clearCirclePosition,
      menuOpen,
      openMenu,
      closeMenu,
    ]
  );

  return (
    <MenuProviderContext.Provider value={value}>
      {children}
    </MenuProviderContext.Provider>
  );
}

export function useMenuProvider() {
  const context = useContext(MenuProviderContext);
  if (context === undefined) {
    throw new Error(
      'useLongPressContext must be used within a LongPressProvider'
    );
  }
  return context;
}
