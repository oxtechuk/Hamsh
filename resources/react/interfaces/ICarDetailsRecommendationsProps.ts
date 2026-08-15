import type { ReactNode } from "react";

export interface ICarDetailsRecommendationItem {
  id: string | number;
  name: string;
  image: string;
  price: ReactNode;
  detailsTo: string;
}

export interface ICarDetailsRecommendationsProps {
  title?: string;
  cars: ICarDetailsRecommendationItem[];
  maxItems?: number;
}
