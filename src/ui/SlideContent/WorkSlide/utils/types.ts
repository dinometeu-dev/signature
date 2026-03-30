export type WorkItemProps = {
  id: number;
  title: string;
  details: {
    overview: string;
    problem: string;
    impact: string;
    gallery: {
      id: number;
      imageUrl: string;
      alt: string;
    }[];
    links: {
      id: number;
      url: string;
      label: string;
      iconPath: string | null;
    }[];
  };
};
