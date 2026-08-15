import type { CarItem } from "../types/home.types";

export interface IStepTwoCarSelectionProps {
  cars: CarItem[];
  selectedCarId: number;
  onCarSelect: (car: CarItem) => void;
  onNext: () => void;
  onBack: () => void;
  isLoading?: boolean;
}
