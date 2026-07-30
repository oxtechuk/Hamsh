import type { CarItem } from "../types/home.types";

export interface IOOCarGridCardProps {
  car: CarItem;
  selected: boolean;
  onSelect: () => void;
}
