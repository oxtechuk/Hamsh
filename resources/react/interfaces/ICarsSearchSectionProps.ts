import type { BrandInfo, FilterCategory } from "../types/home.types";

export interface ICarsSearchValues {
  search: string;
  brandId: string;
  model: string;
  year: string;
  typeId?: string;
  categoryId?: string;
}

export interface ICarsSearchSectionProps {
  title?: string;
  brands?: BrandInfo[];
  models?: string[];
  years?: (string | { year: string | number } | number)[];
  types?: FilterCategory[];
  categories?: FilterCategory[];
  onSearch: (values: ICarsSearchValues) => void;
  onReset?: () => void;
  className?: string;
  isSearching?: boolean;
}
