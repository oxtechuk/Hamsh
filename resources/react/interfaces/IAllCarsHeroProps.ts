import type { ICarsHeroCategory } from "./ICarsHeroCategory";
import type { SortValue } from "./IFilterValues";

export interface IAllCarsHeroProps {
  eyebrow?: string;
  title?: string;
  countText?: string;
  categories: ICarsHeroCategory[];
  activeCategory: string;
  onCategoryChange?: (value: string) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearch?: () => void;
  sortValue: SortValue;
  onSortChange: (value: SortValue) => void;
  filterLabel?: string;
  onFilterClick?: () => void;
  className?: string;
}
