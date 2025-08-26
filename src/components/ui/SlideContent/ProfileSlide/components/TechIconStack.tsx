import React from 'react';
import IconStack from '@/components/IconStack';
import { cn } from '@/utils/functions/mergeClasses';
import { BASE_TECHNOLOGY_LOGOS } from '@/utils/constants/paths';

const icons = [
  {
    src: `${BASE_TECHNOLOGY_LOGOS}/react-logo.svg`,
    alt: 'React',
  },
  {
    src: `${BASE_TECHNOLOGY_LOGOS}/nextjs-logo.svg`,
    alt: 'Next.js',
  },
  {
    src: `${BASE_TECHNOLOGY_LOGOS}/typescript-logo.svg`,
    alt: 'TypeScript',
  },
  {
    src: `${BASE_TECHNOLOGY_LOGOS}/tailwindcss-logo.svg`,
    alt: 'Tailwind CSS',
  },
  {
    src: `${BASE_TECHNOLOGY_LOGOS}/nodejs-logo.svg`,
    alt: 'Node.js',
  },
  {
    src: `${BASE_TECHNOLOGY_LOGOS}/css3-logo.svg`,
    alt: 'CSS3',
  },
  {
    src: `${BASE_TECHNOLOGY_LOGOS}/js-logo.svg`,
    alt: 'JavaScript',
  },
];

const TechIconStack = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex justify-center items-center gap-8', className)}
    {...props}
  >
    <p>Stack</p>
    <IconStack icons={icons} />
  </div>
));

TechIconStack.displayName = 'TechIconStack';
export default TechIconStack;
