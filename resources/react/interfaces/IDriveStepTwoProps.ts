import type { CarItem } from "../types/home.types";

export interface IDriveStepTwoProps {
  cars: CarItem[];
  isLoading?: boolean;
  selectedCar: CarItem | null;
  onCarSelect: (car: CarItem) => void;
  onBack: () => void;
  onSubmit: () => void;
  submitting?: boolean;
}
