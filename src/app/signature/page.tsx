'use client';

import { Logo } from '@/components/Logo';
import MenuContent from '@/ui/Menu/MenuContent';
import { SlideContent } from '@/ui/SlideContent/SlideContent';

export default function Home() {
  return (
    <MenuContent>
      <div className="h-full w-full overflow-hidden flex items-center justify-center">
        <SlideContent />
        <div className="absolute top-full -translate-y-full left-full -translate-x-full pr-5">
          <Logo />
        </div>
      </div>
    </MenuContent>
  );
}
