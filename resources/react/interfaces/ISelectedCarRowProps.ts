import type { CarItem } from "../types/home.types";

export interface ISelectedCarRowProps {
  car: CarItem;
  onClick: () => void;
}
