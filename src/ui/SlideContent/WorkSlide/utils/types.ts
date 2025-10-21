export type WorkItemProps = {
  id: number;
  title: string;
  details: {
    overview: string;
    problem: string;
    impact: string;
    gallery: string[];
  };
};
