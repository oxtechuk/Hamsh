import type { IBudgetRange } from "./IBudgetRange";

export interface IBudgetCarsRangeFiltersProps {
  ranges: IBudgetRange[];
  activeRange?: string;
  onRangeChange?: (value: string) => void;
}
