import type { CarDetails } from "../types/cars.types";

export interface ICompareCarSlotProps {
  slug: string;
  car: CarDetails | undefined;
  isLoading: boolean;
  showSearch: boolean;
  label: string;
  dir: string;
  onSelect: (slug: string) => void;
  onRemove: () => void;
  onShowSearch: () => void;
  onHideSearch: () => void;
}
