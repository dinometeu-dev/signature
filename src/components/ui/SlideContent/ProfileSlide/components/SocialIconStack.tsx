import React from 'react';
import { cn } from '@/utils/functions/mergeClasses';
import IconStack from '@/components/IconStack';
import { BASE_SOCIAL_LOGOS } from '@/utils/constants/paths';
import { useSocialLinks } from '@/lib/api/socialLink';

const SocialIconStack = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { socialLinks, isLoading } = useSocialLinks();

  return (
    <div
      ref={ref}
      className={cn('flex justify-center items-center gap-8', className)}
      {...props}
    >
      <p>Socials</p>
      <IconStack
        isLoading={isLoading}
        icons={socialLinks?.map(({ url, alt, iconPath }) => ({
          url,
          alt,
          src: `${BASE_SOCIAL_LOGOS}/${iconPath}`,
        }))}
        showFull
      />
    </div>
  );
});

SocialIconStack.displayName = 'SocialIconStack';
export default SocialIconStack;
