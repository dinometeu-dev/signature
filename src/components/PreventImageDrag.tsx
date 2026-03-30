'use client';

import { useEffect } from 'react';

const IMAGE_SELECTOR = 'img';

const PreventImageDrag = () => {
  useEffect(() => {
    const handleDragStart = (event: DragEvent) => {
      const target = event.target;

      if (target instanceof Element && target.closest(IMAGE_SELECTOR)) {
        event.preventDefault();
      }
    };

    document.addEventListener('dragstart', handleDragStart, true);

    return () => {
      document.removeEventListener('dragstart', handleDragStart, true);
    };
  }, []);

  return null;
};

export default PreventImageDrag;
