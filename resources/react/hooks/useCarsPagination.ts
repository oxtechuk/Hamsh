import { useMemo } from "react";
import type { ICarCardProps } from "../interfaces/ICarCardProps";
import type { IFilterValues } from "../interfaces/IFilterValues";
import {
  filterCarsByClientFilters,
  paginateCars,
} from "../utils/car-pagination-utils";

interface IUseCarsPaginationResult {
  filteredCars: ICarCardProps[];
  totalPages: number;
  safePage: number;
  pagedCars: ICarCardProps[];
}

export function useCarsPagination(
  cars: ICarCardProps[],
  filters: IFilterValues,
  currentPage: number,
  pageSize: number,
): IUseCarsPaginationResult {
  return useMemo(() => {
    const filteredCars = filterCarsByClientFilters(cars, filters);
    const { totalPages, safePage, pagedCars } = paginateCars(
      filteredCars,
      currentPage,
      pageSize,
    );

    return { filteredCars, totalPages, safePage, pagedCars };
  }, [cars, filters, currentPage, pageSize]);
}
