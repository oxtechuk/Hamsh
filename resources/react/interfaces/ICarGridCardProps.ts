import type { CarItem } from "../types/home.types";

export interface ICarGridCardProps {
  car: CarItem;
  selected: boolean;
  onSelect: () => void;
}
