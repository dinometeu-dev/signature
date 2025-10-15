import AmigoCarLogo from '@public/experience-logos/amigo-car-logo.png';
import EvPointLogo from '@public/experience-logos/ev-point-logo.png';
import InsomniacDesign from '@public/experience-logos/insomniac-logo.png';
import LukoilLogo from '@public/experience-logos/lukoil-logo.png';
import { ExperiencePeriodType } from '@slides/ProfileSlide/components/Timeline/utils/types';

export const workExperience: ExperiencePeriodType[] = [
  {
    title: 'Frontend Developer',
    company: {
      title: 'Amigo Car',
      logo: AmigoCarLogo,
      officialLink: 'https://www.amigocar.md/',
      description:
        'Amigo Car is a car rental company based in Chisinau, Moldova.',
      experienceHistory:
        'AmigoCar is my first experience in web development. There, I developed a web application using `HTML`, `SASS`, and `JavaScript/Jquery`. You can learn more about the project here',
    },
    color: '#009DFF',
    startDate: '2019-06',
    endDate: '2021-10',
  },
  {
    title: 'Product Designer',
    company: {
      title: 'Lukoil',
      logo: LukoilLogo,
      officialLink: 'https://www.lukoil.md/',
      description:
        'Lukoil is a major Russian vertically integrated oil and gas company with global operations.',
      experienceHistory:
        'At Lukoil, I had the privilege of serving as the lead designer for a mobile application for the Republic of Moldova. During my tenure, I created a comprehensive design with icon illustrations in Figma and various advertising posters in Photoshop',
    },
    startDate: '2021-11',
    color: '#ED1B34',
    endDate: '2022-05',
  },
  {
    title: 'Technical Support Specialist',
    company: {
      title: 'EvPoint',
      officialLink: 'https://www.evpoint.md/',
      logo: EvPointLogo,
      description:
        'EVPoint is a Moldova-based company providing EV charging networks and automated parking solutions across Eastern Europe.',
      experienceHistory:
        'EvPoint is a young Moldovan company where I provided technical assistance on the subject of tamping technologies and processes.',
    },

    color: '#1FBD8D',
    startDate: '2022-07',
    endDate: '2022-10',
  },
  {
    title: 'Front End Developer',
    company: {
      title: 'Insomniac Design',
      officialLink: 'https://www.insomniacdesign.com/',
      logo: InsomniacDesign,
      description:
        'Insomniac Design is a Washington, DC–based digital agency specializing in branding, web, and product design.',
      experienceHistory:
        'Here, I developed complex, full-fledged web applications such as admin panels, integrated a knowledge base into an AI model via n8n, developed complex technical solutions, and much more that greatly expanded my technical skills.',
    },
    color: '#F70B6D',
    startDate: '2022-12',
    endDate: new Date(),
  },
];

export const emptyData: ExperiencePeriodType = {
  title: null,
  company: {
    title: null,
    description: null,
    officialLink: null,
    experienceHistory: null,
    logo: null,
  },
  startDate: null,
  color: null,
  endDate: null,
};
