export interface IAboutStatItem {
  id: string | number;
  value: string;
  label: string;
  description: string;
}

export interface IAboutStatsSectionProps {
  stats: IAboutStatItem[];
  className?: string;
}
