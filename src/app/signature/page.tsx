'use client';

import { Logo } from '@/components/Logo';
import { LongPress } from '@/ui/Menu/LongPress';
import { SlideContent } from '@/ui/SlideContent/SlideContent';

export default function Home() {
  const handleLongPress = (): void => {
    console.log('Pressed and held for more than 2 seconds!');
  };

  return (
    <LongPress onLongPress={handleLongPress}>
      <div className="h-full w-full overflow-hidden flex items-center justify-center">
        <SlideContent />
        <div className="absolute top-full -translate-y-full left-full -translate-x-full pr-5">
          <Logo />
        </div>
      </div>
    </LongPress>
  );
}
