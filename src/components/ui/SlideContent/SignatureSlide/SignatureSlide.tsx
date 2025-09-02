import React from 'react';
import { Slide } from '@/components/Slide';
import { AirplaneButton } from '@/components/ui/SlideContent/SignatureSlide/components/AirplaneButton';
import { SUBTITLE, TITLE } from '@/utils/constants/content';

const SignatureSlide = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((props, ref) => {
  return (
    <Slide
      ref={ref}
      className="bg-[url('/svg/Signature.svg')] bg-cover bg-position-[center_top_1em] bg-no-repeat flex flex-col justify-between items-center  overflow-visible"
      {...props}
    >
      <div className="flex flex-col items-center gap-9 text-center pt-24 z-10">
        <h1 className="font-headings text-5xl font-bold text-center leading-normal">
          {TITLE}
        </h1>
        <p className="text-base font-normal text-black-600 ">{SUBTITLE}</p>
      </div>
      <AirplaneButton className="top-1/2 -translate-y-1/4 z-50" />
      <div className="w-full flex  items-center justify-between text-[12px] text-black-400 italic">
        <div className="flex justify-center items-center gap-6 z-10">text</div>
        <div className="flex items-center justify-center gap-2 relative mr-32 z-10">
          down
        </div>
      </div>
    </Slide>
  );
});

SignatureSlide.displayName = 'SignatureSlide';

export { SignatureSlide };
