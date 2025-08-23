import React, { useEffect, useState } from 'react';
import MagnetBox from '@/components/MagnetBox';
import { cn } from '@/utils/functions/mergeClasses';
import { motion } from 'framer-motion';
import Image from 'next/image';

const SOCIAL_LINKS = [
  {
    name: 'GitHub',
    href: 'https://github.com/petr-marek/react-bits',
    icon: '/social-logos/github-mark.png',
    rounded: 'rounded-full',
  },
  {
    name: 'Telegram',
    href: 'https://www.linkedin.com/in/petr-marek-8888881b1/',
    icon: '/social-logos/telegram-logo.svg',
    rounded: 'rounded-full',
  },
  {
    name: 'Instagram',
    href: 'https://www.linkedin.com/in/petr-marek-8888881b1/',
    icon: '/social-logos/instagram-logo.png',
    rounded: 'rounded-4xl',
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/in/petr-marek-8888881b1/',
    icon: '/social-logos/linkedin-logo.svg',
    rounded: 'rounded-2xl',
  },
  {
    name: 'Facebook',
    href: 'https://www.linkedin.com/in/petr-marek-8888881b1/',
    icon: '/social-logos/facebook-logo.svg',
    rounded: 'rounded-full',
  },
];

const SocialLinks = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const [socialLinks, setSocialLinks] = useState<
    ((typeof SOCIAL_LINKS)[number] & { initialY: number; initialX: number })[]
  >([]);

  useEffect(() => {
    setSocialLinks(
      SOCIAL_LINKS.map((item) => ({
        ...item,
        initialY: -30 + Math.floor(Math.random() * 7) * 10,
        initialX: -60 + Math.floor(Math.random() * 13) * 10,
      }))
    );
  }, []);

  return (
    <div
      ref={ref}
      className={cn('w-full flex justify-between z-20', className)}
      {...props}
    >
      {socialLinks.map(({ name, href, rounded, initialY, initialX, icon }) => (
        <motion.div
          key={name}
          className={
            'blur-xl saturate-50 opacity-80 hover:opacity-100 hover:filter-none hover:scale-125 transition-all duration-300'
          }
          initial={{ y: initialY, x: initialX }}
        >
          <MagnetBox
            padding={100}
            magnetStrength={2}
            innerClassName={cn('p-6 ', rounded)}
          >
            <a href={href} target="_blank" rel="noreferrer">
              <Image src={icon} alt={name} width={64} height={64} />
            </a>
          </MagnetBox>
        </motion.div>
      ))}
    </div>
  );
});

SocialLinks.displayName = 'SocialeLinks';
export default SocialLinks;
