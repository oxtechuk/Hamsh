import type { ITab } from "./ICarDetailsSpecsProps";
import type { ICarDetailsRecommendationItem } from "./ICarDetailsRecommendationsProps";

export interface ICarColor {
  name: string;
  value: string;
  image?: string | null;
}

export type { ICarDetailsRecommendationItem as ICarDetailsRecommendation };

export interface ICarDetailsHeroProps {
  title: string;
  description: string;
  images: string[];
  exteriorImages?: string[];
  interiorImages?: string[];
  price: number;
  oldPrice?: number;
  monthlyInstallment: number;
  savingAmount?: number;
  minDownPayment?: number;
  rating?: string;
  views?: number;
  colors: ICarColor[];
  orderTo: string;
  financeTo?: string;
  brand?: string;
  year?: string;
  specsTabs?: ITab[];
  recommendations?: ICarDetailsRecommendationItem[];
}
