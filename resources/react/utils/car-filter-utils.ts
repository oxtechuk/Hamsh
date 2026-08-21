import type { IFilterValues } from "../interfaces/IFilterValues";
import type { CarItem } from "../types/home.types";
import { STATIC_CARS } from "../data/cars-static-data";

export function filterStaticCars(filters: IFilterValues): CarItem[] {
  const filtered = STATIC_CARS.filter((car) => {
    if (filters.brandId !== null && car.brand?.id !== filters.brandId) {
      return false;
    }
    if (filters.categoryId !== null && car.category?.id !== filters.categoryId) {
      return false;
    }
    if (filters.type !== "all" && car.type !== filters.type) {
      return false;
    }
    if (filters.year && String(car.year) !== filters.year) {
      return false;
    }
    if (
      filters.priceMin > 0 &&
      (car.current_price ?? car.cash_price) < filters.priceMin
    ) {
      return false;
    }
    if (
      filters.priceMax < 600000 &&
      (car.current_price ?? car.cash_price) > filters.priceMax
    ) {
      return false;
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const matchName = car.name.toLowerCase().includes(q);
      const matchBrand = car.brand?.name?.toLowerCase().includes(q);
      if (!matchName && !matchBrand) return false;
    }
    return true;
  });

  const price = (car: CarItem) => car.current_price ?? car.cash_price;

  switch (filters.sort) {
    case "price_asc":
      return [...filtered].sort((a, b) => price(a) - price(b));
    case "price_desc":
      return [...filtered].sort((a, b) => price(b) - price(a));
    case "year_desc":
      return [...filtered].sort((a, b) => Number(b.year) - Number(a.year));
    case "year_asc":
      return [...filtered].sort((a, b) => Number(a.year) - Number(b.year));
    default:
      return filtered;
  }
}
