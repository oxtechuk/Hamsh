import type { ICarsHeroCategory } from "./ICarsHeroCategory";

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
  sortLabel?: string;
  onSortClick?: () => void;
  filterLabel?: string;
  onFilterClick?: () => void;
  className?: string;
}
