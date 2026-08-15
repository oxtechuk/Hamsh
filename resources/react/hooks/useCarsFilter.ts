import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import type { IFilterValues } from "../interfaces/IFilterValues";
import { DEFAULT_FILTER_VALUES } from "../interfaces/IFilterValues";
import type { ICarsQueryParams } from "../interfaces/ICarsQueryParams";

export function useCarsFilter() {
  const [searchParams] = useSearchParams();
  const offerId = searchParams.get("offerId");

  const initialFilters = useMemo<IFilterValues>(() => {
    const brands = searchParams.get("brands[]");
    const type = searchParams.get("type");
    const categoryId = searchParams.get("category_id");
    const year = searchParams.get("year");
    const q = searchParams.get("q");

    if (!brands && !type && !categoryId && !year && !q) {
      return DEFAULT_FILTER_VALUES;
    }

    return {
      ...DEFAULT_FILTER_VALUES,
      brandId: brands ? Number(brands) : null,
      type: type ?? "all",
      categoryId: categoryId ? Number(categoryId) : null,
      year: year ?? "",
      search: q ?? "",
    };
  }, [searchParams]);

  const [filters, setFilters] = useState<IFilterValues>(initialFilters);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setFilters(initialFilters);
    setCurrentPage(1);
  }, [initialFilters]);

  function buildQueryParams(): ICarsQueryParams {
    const params: ICarsQueryParams = {};

    if (filters.brandId !== null) {
      params.brands = [filters.brandId];
    }
    if (filters.type !== "all") {
      params.type = Number(filters.type);
    }
    if (filters.categoryId !== null) {
      params.category_id = filters.categoryId;
    }
    if (filters.year) {
      params.year = filters.year;
    }
    if (filters.priceMin > 0) {
      params.min_price = filters.priceMin;
    }
    if (filters.priceMax < 200000) {
      params.max_price = filters.priceMax;
    }
    if (filters.search) {
      params.q = filters.search;
    }
    if (offerId) {
      params.offer_id = Number(offerId);
    }

    return params;
  }

  const handleFilterChange = (newFilters: IFilterValues) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  return {
    filters,
    setFilters,
    currentPage,
    setCurrentPage,
    offerId,
    buildQueryParams,
    handleFilterChange,
  };
}
