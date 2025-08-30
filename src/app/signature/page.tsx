import { SlideContent } from '@/components/ui/SlideContent/SlideContent';
import { Logo } from '@/components/Logo';
import { Menu } from '@/components/ui/Menu/Menu';

export default function Home() {
  return (
    <div className="h-full w-full grid grid-cols-(--grid-template-cols-main-layout) overflow-hidden">
      <Menu />
      <div className="relative h-full w-full flex flex-col justify-center items-center">
        <SlideContent />
      </div>
      <div className="flex justify-end items-end px-8">
        <Logo />
      </div>
    </div>
  );
}
