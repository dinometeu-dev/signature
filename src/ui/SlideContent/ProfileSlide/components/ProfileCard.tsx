import dayjs from 'dayjs';
import { HTMLMotionProps, motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ComponentProps, FC, Fragment } from 'react';

import {
  PROFILE_CARD_DESCRIPTION,
  PROFILE_CARD_NAME,
  PROFILE_SOCIALS_STACK,
  PROFILE_TECHNOLOGY_STAK,
  PROFILE_TECHNOLOGY_STAK_DESCRIPTION,
} from '@/utils/constants/content';
import { cn } from '@/utils/functions/mergeClasses';
import { Button } from '@components/Button';
import Chip from '@components/Chip';
import ProfileImg from '@public/ProfileImg.png';
import {
  ProfileCardAnimation,
  SocialLinksAnimation,
  TechnologyStackAnimation,
} from '@slides/ProfileSlide/animations/profile-card-animations';

const StackWrapper: FC<ComponentProps<'div'>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn('flex flex-col gap-1.5 items-start', className)}
      {...props}
    >
      {children}
    </div>
  );
};

const ProfileCard: FC<HTMLMotionProps<'div'>> = ({ className, ...props }) => {
  return (
    <motion.div
      className={cn(
        'overflow-hidden w-full h-full relative bg-gradient-to-br from-light-accent to-white border-[0.5px] border-accent rounded-3xl flex items-center justify-center gap-3',
        className
      )}
      initial={ProfileCardAnimation.initial}
      animate={ProfileCardAnimation.animate}
      transition={ProfileCardAnimation.transition}
      {...props}
    >
      <Image
        src={ProfileImg}
        style={{
          width: 'auto',
          height: '100%',
        }}
        className="z-10 select-none"
        alt={'Profile Image'}
      />
      <div className="w-full h-full z-10 py-6 flex flex-col justify-between">
        <div className="flex flex-col gap-4">
          <StackWrapper>
            <h2 className="font-headings text-3xl">{PROFILE_CARD_NAME}</h2>
            <div className="flex items-center justify-start gap-2 flex-wrap text-sm text-black/60">
              {PROFILE_CARD_DESCRIPTION.map((value, index) => (
                <Fragment key={index}>
                  <p>{value}</p>
                  <span className="size-[3px] bg-black/60 rounded-full translate-y-1/3" />
                </Fragment>
              ))}
              <p>
                <span className="font-bold text-black">
                  {dayjs().diff('2019-01-01', 'years')}+
                </span>{' '}
                yrs of experience
              </p>
            </div>
          </StackWrapper>
          <StackWrapper>
            <h2 className="font-headings text-xl">{PROFILE_TECHNOLOGY_STAK}</h2>
            <div className="flex items-center justify-start gap-1.5 flex-wrap">
              {PROFILE_TECHNOLOGY_STAK_DESCRIPTION.map(
                ({ id, Icon, title }, idx) => (
                  <Chip
                    key={id}
                    initial={TechnologyStackAnimation.initial}
                    animate={TechnologyStackAnimation.animate}
                    transition={{
                      delay: 0.05 * idx + 0.5,
                      ...TechnologyStackAnimation.transition,
                    }}
                  >
                    <Icon className="size-[16px] rounded-xs" /> {title}
                  </Chip>
                )
              )}
            </div>
          </StackWrapper>
        </div>
        <StackWrapper className="flex-row gap-3 mt-2">
          {PROFILE_SOCIALS_STACK.map(({ id, Icon, link }, idx) => (
            <motion.div
              key={id}
              initial={SocialLinksAnimation.initial}
              animate={SocialLinksAnimation.animate}
              transition={{
                delay: 0.05 * idx + 0.2,
                ...SocialLinksAnimation.transition,
              }}
            >
              <Link href={link} target={'_blank'}>
                <Button className="p-2">
                  <Icon className="size-5 rounded-[3px] " />
                </Button>
              </Link>
            </motion.div>
          ))}
        </StackWrapper>
      </div>
    </motion.div>
  );
};

export default ProfileCard;
