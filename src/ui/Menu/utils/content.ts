import { QUERY_SLIDE_VALUES } from '@/utils/constants/paths';

export const MENU_ITEMS = [
  {
    id: 1,
    title: 'Signature',
    link: QUERY_SLIDE_VALUES.SIGNATURE,
  },
  {
    id: 2,
    title: 'Profile',
    link: QUERY_SLIDE_VALUES.PROFILE,
  },
  {
    id: 3,
    title: 'Works',
    link: QUERY_SLIDE_VALUES.WORKS,
  },
  {
    id: 4,
    title: 'Contact',
    link: QUERY_SLIDE_VALUES.CONTACT,
  },
] as const;
