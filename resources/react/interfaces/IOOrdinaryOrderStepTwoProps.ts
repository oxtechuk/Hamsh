import type { CarItem } from "../types/home.types";

export interface IOOrdinaryOrderStepTwoProps {
  initialCar: CarItem | null;
  selected: CarItem | null;
  onSelect: (car: CarItem) => void;
  onSubmit: () => void;
  onBack: () => void;
  submitting: boolean;
}
