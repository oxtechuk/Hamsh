import type { ICarCardProps } from "./ICarCardProps";

export interface ICarsResultsGridProps {
  cars: ICarCardProps[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}
