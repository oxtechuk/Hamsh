import type { BrandInfo } from "../types/home.types";
import type { IFilterValues } from "./IFilterValues";

export interface IAllCarsFilterType {
  id: number;
  slug: string;
  label: string;
}

export interface IAllCarsFiltersModalProps {
  open: boolean;
  onClose: () => void;
  filters: IFilterValues;
  onApply: (filters: IFilterValues) => void;
  brands: BrandInfo[];
  types: IAllCarsFilterType[];
  years: string[];
}
