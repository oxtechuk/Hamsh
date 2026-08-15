import type { CarItem } from "../types/home.types";

export interface IOOCarSearchModalProps {
  onSelect: (car: CarItem) => void;
  onClose: () => void;
}
