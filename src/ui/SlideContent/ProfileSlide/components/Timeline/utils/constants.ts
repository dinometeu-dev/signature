import AmigoCarLogo from '@public/experience-logos/amigo-car-logo.png';
import EvPointLogo from '@public/experience-logos/ev-point-logo.png';
import InsomniacDesign from '@public/experience-logos/insomniac-logo.png';
import LukoilLogo from '@public/experience-logos/lukoil-logo.png';

export const workExperience = [
  {
    title: 'Frontend Developer',
    company: 'Amigo Car',
    logo: AmigoCarLogo,
    color: '#009DFF',
    startDate: '2019-06',
    endDate: '2021-10',
    subExperience: [],
  },
  {
    title: 'Product Designer',
    company: 'Lukoil',
    logo: LukoilLogo,
    startDate: '2021-11',
    color: '#ED1B34',
    endDate: '2022-05',
    subExperience: [],
  },
  {
    title: 'Technical Support Specialist',
    company: 'EvPoint',
    logo: EvPointLogo,
    color: '#1FBD8D',
    startDate: '2022-07',
    endDate: '2022-10',
    subExperience: [],
  },
  {
    title: 'Front End Developer',
    company: 'Insomniac Design',
    logo: InsomniacDesign,
    color: '#F70B6D',
    startDate: '2022-12',
    endDate: new Date(),
  },
];

export const emptyData = {
  title: null,
  company: null,
  startDate: null,
  logo: null,
  color: null,
  endDate: null,
};
