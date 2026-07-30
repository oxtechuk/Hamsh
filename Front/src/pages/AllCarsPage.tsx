import { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import AllCarsSearchBar from "../components/AllCarsSearchBar";
import CarsSidebarFilter from "../components/CarsSidebarFilter";
import CarsResultsGrid from "../components/CarsResultsGrid";
import PageBreadcrumbHeader from "../components/PageBreadcrumbHeader";
import { getCars } from "../services/api/cars.service";
import { useLanguageStore } from "../store/language.store";
import { mapCarToCardProps, unique } from "../utils/car-mappers";
import { useSEO } from "../utils/useSEO";
import type { FilterValues, CarsQueryParams } from "../types/cars.types";
import { DEFAULT_FILTER_VALUES } from "../types/cars.types";
import type { CarCardProps } from "../components/CarCard";

const PAGE_SIZE = 6;

export default function AllCarsPage() {
  const { t } = useTranslation();
  useSEO(t("nav.cars"), t("allCarsHero.description"));
  const language = useLanguageStore((s) => s.language);
  const [searchParams] = useSearchParams();
  const offerId = searchParams.get("offerId");

  const initialFilters = useMemo<FilterValues>(() => {
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

  const [filters, setFilters] = useState<FilterValues>(initialFilters);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setFilters(initialFilters);
    setCurrentPage(1);
  }, [initialFilters]);

  function buildParams(): CarsQueryParams {
    const params: CarsQueryParams = {};

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

  const { data: carsResponse } = useQuery({
    queryKey: ["cars-data", language, filters, currentPage, offerId],
    queryFn: () => getCars(buildParams()),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const allCars = useMemo(() => {
    if (carsResponse) {
      return carsResponse.data
        .map((car) => mapCarToCardProps(car, language))
        .filter(Boolean) as CarCardProps[];
    }

    return [];
  }, [carsResponse, language]);

  const sidebarData = useMemo(() => {
    const transmissions = unique(
      allCars.map((c) => c.transmission).filter((v): v is string => Boolean(v)),
    );
    return { transmissions };
  }, [allCars]);

  const filteredCars = useMemo(() => {
    let result = allCars.slice();

    if (filters.transmission !== "all") {
      result = result.filter(
        (c) => c.transmission === filters.transmission,
      );
    }
    if (filters.fuelType !== "all") {
      result = result.filter((c) => c.fuelType === filters.fuelType);
    }

    return result;
  }, [allCars, filters]);

  const totalPages = Math.max(1, Math.ceil(filteredCars.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const pagedCars = filteredCars.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  const handleFilterChange = (newFilters: FilterValues) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  return (
    <main>
      <PageBreadcrumbHeader
        title={t("pageTitles.allCars")}
        breadcrumbs={[
          { label: t("nav.home"), to: "/" },
          { label: t("pageTitles.allCarsBreadcrumb") },
        ]}
      />
      <section className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8 lg:flex lg:items-start lg:gap-6">
        <CarsSidebarFilter
          transmissions={sidebarData.transmissions}
          fuelTypes={[]}
          filters={filters}
          onFilterChange={handleFilterChange}
        />

        <div className="min-w-0 flex-1">
          <AllCarsSearchBar
            resultCount={filteredCars.length}
          />

          {pagedCars.length > 0 ? (
            <CarsResultsGrid
              cars={pagedCars}
              currentPage={safePage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          ) : (
            <div className="py-20 text-center">
              <p className="text-lg font-medium text-gray-400">
                {t("allCarsPage.noCarsMatch")}
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
