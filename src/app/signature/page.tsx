'use client';

import { SlideContent } from '@/components/ui/SlideContent/SlideContent';
import { Logo } from '@/components/Logo';
import { LongPress } from '@/components/ui/Menu/LongPress';

export default function Home() {
  const handleLongPress = (): void => {
    console.log('Pressed and held for more than 2 seconds!');
  };

  return (
    <LongPress onLongPress={handleLongPress}>
      <div className="h-full w-full overflow-hidden">
        <div className="relative h-full w-full flex flex-col justify-center items-center">
          <SlideContent />
        </div>
        <div className="absolute top-full -translate-y-full left-full -translate-x-full pr-5">
          <Logo />
        </div>
      </div>
    </LongPress>
  );
}
