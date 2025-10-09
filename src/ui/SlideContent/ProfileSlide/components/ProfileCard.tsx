import dayjs from 'dayjs';
import { motion } from 'framer-motion';
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
import ReactBitLogo from '@public/svg/ReactBitLogo';

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

const ProfileCard = () => {
  return (
    <motion.div
      className="overflow-hidden w-full relative bg-gradient-to-br from-light-accent to-white border-[0.5px] border-accent rounded-3xl p-1.5 flex items-center justify-center gap-2.5"
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Image
        src={ProfileImg}
        style={{
          width: 'auto',
          height: '312px',
        }}
        className="rounded-2xl border-[0.5px] border-border-secondary-accent z-10"
        alt={'Profile Image'}
      />
      <div className="w-full h-full z-10 py-6 flex flex-col self-start gap-4 content-between">
        <StackWrapper>
          <h2 className="font-headings text-3xl">{PROFILE_CARD_NAME}</h2>
          <div className="flex items-center justify-start gap-1 flex-wrap text-[13px] text-black/60">
            {PROFILE_CARD_DESCRIPTION.map((value, index) => (
              <Fragment key={index}>
                <p>{value}</p>
                <span className="size-[3px] bg-black/60 rounded-full translate-y-1/3" />
              </Fragment>
            ))}
            <p>
              <span className="font-extrabold text-blue-text-accent">
                {dayjs().diff('2019-01-01', 'years')}+
              </span>{' '}
              yrs of experience
            </p>
          </div>
        </StackWrapper>
        <StackWrapper>
          <h2 className="font-headings text-xl">{PROFILE_TECHNOLOGY_STAK}</h2>
          <div className="flex items-center justify-start gap-1.5 flex-wrap">
            {PROFILE_TECHNOLOGY_STAK_DESCRIPTION.map(({ id, Icon, title }) => (
              <Chip key={id}>
                <Icon className="size-[14px] rounded-xs" /> {title}
              </Chip>
            ))}
          </div>
        </StackWrapper>
        <StackWrapper className="flex-row gap-3 mt-2">
          {PROFILE_SOCIALS_STACK.map(({ id, Icon, link }) => (
            <Link key={id} href={link} target={'_blank'}>
              <Button className="p-2">
                <Icon className="size-5 rounded-[3px]" />
              </Button>
            </Link>
          ))}
        </StackWrapper>
      </div>
      <ReactBitLogo className="absolute left-full -translate-x-[75%] translate-y-[5%] z-0 select-none" />
    </motion.div>
  );
};

export default ProfileCard;
