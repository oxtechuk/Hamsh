import type { CarDetails } from "../types/cars.types";
import type { ICarHighlightResult } from "./ICarHighlightResult";

export interface ICarDetailsModalGalleryProps {
  car: CarDetails;
  images: string[];
  activeImage: number;
  badge?: ICarHighlightResult;
  onSelectImage: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
}
