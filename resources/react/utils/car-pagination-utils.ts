import type { ICarCardProps } from "../interfaces/ICarCardProps";
import type { IFilterValues } from "../interfaces/IFilterValues";

export interface ICarPaginationResult {
  totalPages: number;
  safePage: number;
  pagedCars: ICarCardProps[];
}

export function filterCarsByClientFilters(
  cars: ICarCardProps[],
  filters: IFilterValues,
): ICarCardProps[] {
  let result = cars.slice();

  if (filters.transmission !== "all") {
    result = result.filter(
      (car) => car.transmission === filters.transmission,
    );
  }

  if (filters.fuelType !== "all") {
    result = result.filter((car) => car.fuelType === filters.fuelType);
  }

  return result;
}

export function paginateCars(
  cars: ICarCardProps[],
  currentPage: number,
  pageSize: number,
): ICarPaginationResult {
  const totalPages = Math.max(1, Math.ceil(cars.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    totalPages,
    safePage,
    pagedCars: cars.slice(start, start + pageSize),
  };
}
