import type { ICarCardProps } from "./ICarCardProps";

export interface IFeaturedCarsSectionProps {
  titleBlue: string;
  buttonText: string;
  buttonTo: string;
  cars: ICarCardProps[];
  backgroundImage?: string;
  className?: string;
  itemsPerPage?: number;
  emptyMessage?: string;
}
