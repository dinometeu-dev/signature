import React from 'react';
import { cn } from '@/utils/functions/mergeClasses';
import IconStack from '@/components/IconStack';
import { BASE_SOCIAL_LOGOS } from '@/utils/constants/paths';

const icons = [
  {
    src: `${BASE_SOCIAL_LOGOS}/github-logo.svg`,
    alt: 'GitHub',
    link: 'https://github.com/petr-marek',
  },
  {
    src: `${BASE_SOCIAL_LOGOS}/linkedin-logo.svg`,
    alt: 'LinkedIn',
    link: 'https://github.com/petr-marek',
  },
  {
    src: `${BASE_SOCIAL_LOGOS}/telegram-logo.svg`,
    alt: 'Telegram',
    link: 'https://github.com/petr-marek',
  },
  {
    src: `${BASE_SOCIAL_LOGOS}/instagram-logo.svg`,
    alt: 'Instagram',
    link: 'https://github.com/petr-marek',
  },
  {
    src: `${BASE_SOCIAL_LOGOS}/facebook-logo.svg`,
    alt: 'Facebook',
    link: 'https://github.com/petr-marek',
  },
];

const SocialIconStack = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex justify-center items-center gap-8', className)}
    {...props}
  >
    <p>Socials</p>
    <IconStack icons={icons} showFull />
  </div>
));

SocialIconStack.displayName = 'SocialIconStack';
export default SocialIconStack;
