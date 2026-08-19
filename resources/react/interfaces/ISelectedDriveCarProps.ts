import type { CarItem } from "../types/home.types";

export interface ISelectedDriveCarProps {
  car: CarItem;
  onClick: () => void;
}
