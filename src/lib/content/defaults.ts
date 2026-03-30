import type {
  ExperienceBlockDto,
  ProfileContentDto,
  PublicPortfolioContent,
  SignatureContentDto,
  TechnologyDto,
  WorkItemDto,
} from '@/lib/content/types';

const now = new Date().toISOString();

export const DEFAULT_SIGNATURE_CONTENT: SignatureContentDto = {
  id: 1,
  title: 'Web developer making future via keyboard',
  subtitle:
    'Years of experience in the web industry with a focus on product quality and usability',
  createdAt: now,
  updatedAt: now,
};

export const DEFAULT_PROFILE_CONTENT: ProfileContentDto = {
  id: 1,
  title: 'Shall we get acquainted?',
  description:
    "Hi!\n I'm Dmitri, a **web developer** from Chisinau. I specialize in **Frontend Engineering** focusing on building **high quality** web experiences through **clean code.**",
  createdAt: now,
  updatedAt: now,
};

export const DEFAULT_TECHNOLOGIES: TechnologyDto[] = [
  { id: 1, name: 'React JS', iconPath: 'react-logo.svg', sortOrder: 0, createdAt: now, updatedAt: now },
  { id: 2, name: 'NextJs', iconPath: 'nextjs-logo.svg', sortOrder: 1, createdAt: now, updatedAt: now },
  { id: 3, name: 'TypeScript', iconPath: 'typescript-logo.svg', sortOrder: 2, createdAt: now, updatedAt: now },
  { id: 4, name: 'Tailwind CSS', iconPath: 'tailwindcss-logo.svg', sortOrder: 3, createdAt: now, updatedAt: now },
  { id: 5, name: 'Node.js', iconPath: 'nodejs-logo.svg', sortOrder: 4, createdAt: now, updatedAt: now },
  { id: 6, name: 'CSS3', iconPath: 'css3-logo.svg', sortOrder: 5, createdAt: now, updatedAt: now },
  { id: 7, name: 'JavaScript', iconPath: 'js-logo.svg', sortOrder: 6, createdAt: now, updatedAt: now },
  { id: 8, name: 'Prisma', iconPath: 'prisma-logo.svg', sortOrder: 7, createdAt: now, updatedAt: now },
  { id: 9, name: 'n8n', iconPath: 'n8n-logo.svg', sortOrder: 8, createdAt: now, updatedAt: now },
];

export const DEFAULT_EXPERIENCE_BLOCKS: ExperienceBlockDto[] = [
  {
    id: 1,
    companyName: 'Amigo Car',
    iconPath: '/experience-logos/amigo-car-logo.png',
    alt: 'Amigo Car logo',
    location: 'Chisinau, Moldova',
    description: 'Amigo Car is a car rental company based in Chisinau, Moldova.',
    officialLink: 'https://www.amigocar.md/',
    experienceHistory:
      'AmigoCar was my first experience in web development where I built interfaces using HTML, SASS, and JavaScript.',
    color: '#009DFF',
    sortOrder: 0,
    createdAt: now,
    updatedAt: now,
    periods: [
      {
        id: 1,
        position: 'Frontend Developer',
        startDate: '2019-06-01T00:00:00.000Z',
        endDate: '2021-10-01T00:00:00.000Z',
        sortOrder: 0,
        createdAt: now,
        updatedAt: now,
      },
    ],
  },
  {
    id: 2,
    companyName: 'Lukoil',
    iconPath: '/experience-logos/lukoil-logo.png',
    alt: 'Lukoil logo',
    location: 'Chisinau, Moldova',
    description:
      'Lukoil is a major oil and gas company with global operations.',
    officialLink: 'https://www.lukoil.md/',
    experienceHistory:
      'At Lukoil, I worked as a product designer on a mobile application and related visual assets.',
    color: '#ED1B34',
    sortOrder: 1,
    createdAt: now,
    updatedAt: now,
    periods: [
      {
        id: 2,
        position: 'Product Designer',
        startDate: '2021-11-01T00:00:00.000Z',
        endDate: '2022-05-01T00:00:00.000Z',
        sortOrder: 0,
        createdAt: now,
        updatedAt: now,
      },
    ],
  },
  {
    id: 3,
    companyName: 'Insomniac Design',
    iconPath: '/experience-logos/insomniac-logo.png',
    alt: 'Insomniac Design logo',
    location: 'Washington, DC',
    description:
      'Insomniac Design is a Washington, DC based digital agency specializing in branding, web, and product design.',
    officialLink: 'https://www.insomniacdesign.com/',
    experienceHistory:
      'At Insomniac Design, I built full-fledged web applications, admin panels, and technical product solutions.',
    color: '#F70B6D',
    sortOrder: 2,
    createdAt: now,
    updatedAt: now,
    periods: [
      {
        id: 3,
        position: 'Front End Developer',
        startDate: '2022-12-01T00:00:00.000Z',
        endDate: '2026-03-01T00:00:00.000Z',
        sortOrder: 0,
        createdAt: now,
        updatedAt: now,
      },
    ],
  },
  {
    id: 4,
    companyName: 'Ruby Labs',
    iconPath: '/experience-logos/ruby-labs-logo.png',
    alt: 'Ruby Labs logo',
    location: 'Remote',
    description:
      'Ruby Labs is a digital product company focused on shipping polished consumer experiences.',
    officialLink: 'https://rubylabs.com/',
    experienceHistory:
      'Ruby Labs is where I continue to sharpen product thinking, frontend execution, and systems-level quality.',
    color: '#082668',
    sortOrder: 3,
    createdAt: now,
    updatedAt: now,
    periods: [
      {
        id: 4,
        position: 'UI/UX Developer',
        startDate: '2026-03-01T00:00:00.000Z',
        endDate: null,
        sortOrder: 0,
        createdAt: now,
        updatedAt: now,
      },
    ],
  },
];

export const DEFAULT_WORK_ITEMS: WorkItemDto[] = [
  {
    id: 1,
    title: 'Signature',
    overview:
      'I built Signature to be my living autograph on the web, a portfolio where craft, motion, and personality meet.',
    problem:
      'The challenge was to avoid a generic portfolio and instead create a web experience that feels unmistakably personal while staying usable.',
    impact:
      'Signature became a canvas for my technical taste and a clear expression of how I think about product quality, interaction, and identity.',
    isArchived: false,
    iconPath: '/svg/Signature.svg',
    menuId: 0,
    sortOrder: 0,
    createdAt: now,
    updatedAt: now,
    galleryImages: [],
    links: [],
  },
  {
    id: 2,
    title: 'Magic Math',
    overview:
      'Magic Math is a playful concept project focused on accessible interaction design and polished frontend execution.',
    problem:
      'The main difficulty was to make the experience feel engaging and clear without overwhelming the user with unnecessary complexity.',
    impact:
      'The project helped sharpen animation, interaction, and information hierarchy decisions for content-driven interfaces.',
    isArchived: false,
    iconPath: '',
    menuId: 0,
    sortOrder: 1,
    createdAt: now,
    updatedAt: now,
    galleryImages: [],
    links: [],
  },
  {
    id: 3,
    title: 'Amigo Car',
    overview:
      'Amigo Car is a real-world project where I translated business needs into a practical and maintainable frontend experience.',
    problem:
      'The product needed trustworthy presentation, clear booking-oriented communication, and an implementation that could evolve with the business.',
    impact:
      'It gave me foundational production experience and shaped how I approach real client constraints and shipping quality.',
    isArchived: false,
    iconPath: '/works/AmigoCarImage.png',
    menuId: 0,
    sortOrder: 2,
    createdAt: now,
    updatedAt: now,
    galleryImages: [
      {
        id: 1,
        imageUrl: '/works/AmigoCarImage.png',
        alt: 'Amigo Car preview',
        sortOrder: 0,
        workItemId: 3,
        createdAt: now,
        updatedAt: now,
      },
    ],
    links: [],
  },
];

export const DEFAULT_PORTFOLIO_CONTENT: PublicPortfolioContent = {
  signature: {
    title: DEFAULT_SIGNATURE_CONTENT.title,
    subtitle: DEFAULT_SIGNATURE_CONTENT.subtitle,
  },
  profile: {
    title: DEFAULT_PROFILE_CONTENT.title,
    description: DEFAULT_PROFILE_CONTENT.description,
    technologies: DEFAULT_TECHNOLOGIES.map((technology) => ({
      id: technology.id,
      title: technology.name,
      iconPath: technology.iconPath,
    })),
    experience: DEFAULT_EXPERIENCE_BLOCKS.flatMap((block) =>
      block.periods.map((period) => ({
        id: period.id,
        title: period.position,
        company: {
          title: block.companyName,
          logoPath: block.iconPath,
          officialLink: block.officialLink || null,
          description: block.description || null,
          experienceHistory: block.experienceHistory || null,
        },
        color: block.color,
        startDate: period.startDate,
        endDate: period.endDate,
      }))
    ),
  },
  works: DEFAULT_WORK_ITEMS.map((workItem) => ({
    id: workItem.id,
    title: workItem.title,
    details: {
      overview: workItem.overview,
      problem: workItem.problem,
      impact: workItem.impact,
      gallery: workItem.galleryImages.map((image) => ({
        id: image.id,
        imageUrl: image.imageUrl,
        alt: image.alt,
      })),
      links: workItem.links.map((link) => ({
        id: link.id,
        url: link.url,
        label: link.label || 'Link',
        iconPath: link.iconPath || null,
      })),
    },
  })),
};
