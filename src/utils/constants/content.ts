import dayjs from 'dayjs';

import FacebookLogo from '@public/svg/social-logos/facebook-logo.svg';
import GitHubLogo from '@public/svg/social-logos/github-logo.svg';
import LinkedInLogo from '@public/svg/social-logos/linkedin-logo.svg';
import TelegramLogo from '@public/svg/social-logos/telegram-logo.svg';
import UpWorkLogo from '@public/svg/social-logos/upwork-logo.svg';
import CSS3Logo from '@public/svg/technology-logos/css3-logo.svg';
import JavaScriptLogo from '@public/svg/technology-logos/js-logo.svg';
import n8nLogo from '@public/svg/technology-logos/n8n-logo.svg';
import NextJSLogo from '@public/svg/technology-logos/nextjs-logo.svg';
import NodeJsLogo from '@public/svg/technology-logos/nodejs-logo.svg';
import PrismaLogo from '@public/svg/technology-logos/prisma-logo.svg';
import ReactJSLogo from '@public/svg/technology-logos/react-logo.svg';
import TailwindLogo from '@public/svg/technology-logos/tailwindcss-logo.svg';
import TypeScriptLogo from '@public/svg/technology-logos/typescript-logo.svg';

export const TITLE = 'Web developer making future via keyboard';
export const SUBTITLE =
  'Years of experience in the web industry with a focus on product quality and usability';

export const PROFILE_TITLE = 'Shall we get acquainted?';
export const PROFILE_DESCRIPTION = [
  "I'm a",
  'web developer',
  'from Chisinau. I specialize in',
  'Frontend Engineering',
  'focusing on building',
  'high quality',
  'web experiences through',
  'clean code.',
];

export const PROFILE_WORK_EXPERIENCE_TITLE = 'Work experience';

export const PROFILE_CARD_NAME = 'Petrov Dmitri';
export const PROFILE_CARD_DESCRIPTION = [
  `${dayjs().diff('2003-03-18', 'years')} yrs`,
  'Front End Developer',
];

export const PROFILE_TECHNOLOGY_STAK = 'Technology stack';
export const PROFILE_TECHNOLOGY_STAK_DESCRIPTION = [
  {
    id: 1,
    title: 'React JS',
    icon: ReactJSLogo,
  },
  {
    id: 2,
    title: 'NextJs',
    icon: NextJSLogo,
  },
  {
    id: 3,
    title: 'TypeScript',
    icon: TypeScriptLogo,
  },
  {
    id: 4,
    title: 'Tailwind CSS',
    icon: TailwindLogo,
  },
  {
    id: 5,
    title: 'Node.js',
    icon: NodeJsLogo,
  },
  {
    id: 6,
    title: 'CSS3',
    icon: CSS3Logo,
  },
  {
    id: 7,
    title: 'JavaScript',
    icon: JavaScriptLogo,
  },
  {
    id: 8,
    title: 'Prisma',
    icon: PrismaLogo,
  },
  {
    id: 9,
    title: 'n8n',
    icon: n8nLogo,
  },
];

export const PROFILE_SOCIALS_STACK = [
  {
    id: 1,
    title: 'LinkedIn',
    Icon: LinkedInLogo,
    link: 'https://www.linkedin.com/in/petrov-dmitri-3b6502267/',
  },
  {
    id: 2,
    title: 'UpWork',
    Icon: UpWorkLogo,
    link: 'https://www.upwork.com/freelancers/~015571be1cdfece9be?mp_source=share',
  },
  {
    id: 3,
    title: 'GitHub',
    Icon: GitHubLogo,
    link: 'https://github.com/dinometeu-dev',
  },
  {
    id: 4,
    title: 'Telegram',
    Icon: TelegramLogo,
    link: 'https://t.me/feedborn',
  },
  {
    id: 5,
    title: 'Facebook',
    Icon: FacebookLogo,
    link: 'https://www.facebook.com/dinometeu',
  },
];

export const PROFILE_WORK_EXPERIENCE = 'Work Experience';
export const PROFILE_WHO_I_AM = 'Who I am?';
export const PROFILE_CERTIFICATES = 'Certificates';
