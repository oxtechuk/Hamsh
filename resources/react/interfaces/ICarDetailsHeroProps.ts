import type { ICarCardProps } from "./ICarCardProps";
import type { ICarDetailsRecommendationItem } from "./ICarDetailsRecommendationsProps";
import type { ITab } from "./ICarDetailsSpecsProps";

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
  orderTo: () => void;
  financeTo?: string;
  brand?: string;
  year?: string;
  category?: string;
  specsTabs?: ITab[];
  specs?: Record<string, string | null>;
  specifications?: Array<{ id?: number; name: string; value?: string | null }>;
  featuresList?: Array<{ id?: number; name: string; value?: string | null }>;
  recommendations?: (ICarDetailsRecommendationItem | ICarCardProps)[];
}

