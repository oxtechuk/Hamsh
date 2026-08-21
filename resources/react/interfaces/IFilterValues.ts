export type SortValue = "" | "price_asc" | "price_desc" | "year_desc" | "year_asc";

export interface IFilterValues {
  brandId: number | null;
  type: string;
  categoryId: number | null;
  year: string;
  priceMin: number;
  priceMax: number;
  engine: string;
  transmission: string;
  fuelType: string;
  search: string;
  sort: SortValue;
}

export const DEFAULT_FILTER_VALUES: IFilterValues = {
  brandId: null,
  type: "all",
  categoryId: null,
  year: "",
  priceMin: 0,
  priceMax: 200000,
  engine: "all",
  transmission: "all",
  fuelType: "all",
  search: "",
  sort: "",
};
