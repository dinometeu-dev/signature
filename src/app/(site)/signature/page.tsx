import { Logo } from '@/components/Logo';
import { getPublicPortfolioContent } from '@/lib/content/public';
import MenuContent from '@/ui/Menu/MenuContent';
import { SlideContent } from '@/ui/SlideContent/SlideContent';

export default async function Home() {
  const portfolioContent = await getPublicPortfolioContent();

  return (
    <MenuContent>
      <div className="flex h-screen w-full items-center justify-center overflow-hidden">
        <SlideContent portfolioContent={portfolioContent} />
        <div className="absolute top-full left-full -translate-x-full -translate-y-full pr-5">
          <Logo />
        </div>
      </div>
    </MenuContent>
  );
}
