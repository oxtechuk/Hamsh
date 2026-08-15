import type { ReactNode } from "react";
import type { ICarCardProps } from "./ICarCardProps";

export interface ICarDetailsRecommendationItem {
  id: string | number;
  name: string;
  image: string;
  price: ReactNode;
  detailsTo: string;
}

export interface ICarDetailsRecommendationsProps {
  title?: string;
  cars?: (ICarDetailsRecommendationItem | ICarCardProps)[];
  maxItems?: number;
}
