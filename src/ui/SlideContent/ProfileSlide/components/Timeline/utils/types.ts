import dayjs from 'dayjs';
import { MotionProps } from 'framer-motion';

export type CompanyType = {
  title: string | null;
  logoPath: string | null;
  officialLink: string | null;
  description: string | null;
  experienceHistory: string | null;
};

export type ExperiencePeriodType = {
  title: string | null;
  company: CompanyType;
  color: string | null;
  startDate: string | Date | null;
  endDate: string | Date | null;
};

export interface PointProps extends MotionProps {
  position: 'start' | 'end';
  date: dayjs.Dayjs;
  isStart?: boolean;
  className?: string | null;
  logo?: string | null;
  color?: string | null;
}
