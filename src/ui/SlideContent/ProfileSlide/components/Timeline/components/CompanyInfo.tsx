import { motion, MotionProps } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { FC } from 'react';
import Markdown from 'react-markdown';

import { cn } from '@/utils/functions/mergeClasses';
import { CompanyInfoAnimation } from '@slides/ProfileSlide/animations/company-info-animations';
import { CompanyType } from '@slides/ProfileSlide/components/Timeline/utils/types';

type CompanyInfoProps = MotionProps &
  CompanyType & {
    className?: string;
  };

const CompanyInfo: FC<CompanyInfoProps> = ({
  className,
  title,
  officialLink,
  description,
  experienceHistory,

  ...props
}) => {
  return (
    <motion.div
      className={cn(className, 'absolute max-w-2xl flex flex-col gap-2 z-50')}
      {...props}
    >
      <motion.div
        className="ml-2 p-6 w-full backdrop-blur-md shadow-xl rounded-2xl border-[0.5px] border-black/10 flex flex-col gap-2 bg-gradient-to-tr from-white/80 to-white/60"
        initial={CompanyInfoAnimation.initial}
        animate={CompanyInfoAnimation.animate}
        transition={{ delay: 0.7 }}
      >
        <h3 className="text-2xl font-medium font-headings underline">
          <Link
            href={officialLink ?? ''}
            target={'_blank'}
            className="flex gap-2 items-center"
          >
            {title}
            <ExternalLink className="size-5" />
          </Link>
        </h3>

        <p className="text-black/60">{description}</p>
        <span className="h-px w-full rounded-full bg-black/15" />
        <span className="text-lg">
          <Markdown>{experienceHistory}</Markdown>
        </span>
      </motion.div>
      <motion.div
        className=" ml-5 size-6 mt-1 bg-white/80 backdrop-blur-md shadow-lg border-[0.5px] border-black/5 rounded-full"
        initial={CompanyInfoAnimation.initial}
        animate={CompanyInfoAnimation.animate}
        transition={{ delay: 0.6 }}
      />
      <motion.div
        className=" ml-3 mt-0.5 size-3.5 bg-white/80 backdrop-blur-md shadow-sm  border-[0.5px] border-black/5 rounded-full"
        initial={CompanyInfoAnimation.initial}
        animate={CompanyInfoAnimation.animate}
        transition={{ delay: 0.5 }}
      />
      <motion.div
        className=" size-2 bg-white/80 backdrop-blur-md shadow-sm border-[0.5px] border-black/5 rounded-full"
        initial={CompanyInfoAnimation.initial}
        animate={CompanyInfoAnimation.animate}
        transition={{ delay: 0.4 }}
      />
    </motion.div>
  );
};

export default CompanyInfo;
