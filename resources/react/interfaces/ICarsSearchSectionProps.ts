import type { BrandInfo, FilterCategory } from "../types/home.types";

export interface ICarsSearchValues {
  search: string;
  brandId: string;
  typeId: string;
  categoryId: string;
  year: string;
}

export interface ICarsSearchSectionProps {
  title?: string;
  brands?: BrandInfo[];
  types?: FilterCategory[];
  categories?: FilterCategory[];
  years?: (string | { year: string })[];
  onSearch: (values: ICarsSearchValues) => void;
  onReset?: () => void;
  className?: string;
  isSearching?: boolean;
}
