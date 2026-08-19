import type { CarItem } from "../types/home.types";

export interface ICarSearchModalProps {
  cars: CarItem[];
  onSelect: (car: CarItem) => void;
  onClose: () => void;
}
