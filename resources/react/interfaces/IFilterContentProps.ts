import type { BrandInfo } from "../types/home.types";
import type { FilterValues } from "../types/cars.types";

export interface IFilterContentProps {
  brands: BrandInfo[];
  transmissions: string[];
  fuelTypes: string[];
  filters: FilterValues;
  setFilter: <K extends keyof FilterValues>(key: K, value: FilterValues[K]) => void;
  onReset: () => void;
}
