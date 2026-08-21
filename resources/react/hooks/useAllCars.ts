import { useMemo } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { getCars, getCarsMeta } from "../services/api/cars.service";
import { filterStaticCars } from "../utils/car-filter-utils";
import { mapCarToCardProps } from "../utils/car-mappers";
import { localize } from "../utils/localize";
import { useLanguageStore } from "../store/language.store";
import type { ICarCardProps } from "../interfaces/ICarCardProps";
import type { ICarsHeroCategory } from "../interfaces/ICarsHeroCategory";
import type { ICarsQueryParams } from "../interfaces/ICarsQueryParams";
import type { IFilterValues } from "../interfaces/IFilterValues";

interface IUseAllCarsParams {
  filters: IFilterValues;
  currentPage: number;
  offerId: string | null;
  buildQueryParams: () => ICarsQueryParams;
}

export function useAllCars({
  filters,
  currentPage,
  offerId,
  buildQueryParams,
}: IUseAllCarsParams) {
  const { t } = useTranslation();
  const language = useLanguageStore((s) => s.language);

  const { data: carsMeta } = useQuery({
    queryKey: ["cars-meta", language],
    queryFn: getCarsMeta,
    staleTime: 5 * 60 * 1000,
  });

  const heroCategories = useMemo<ICarsHeroCategory[]>(() => {
    const defaultAll: ICarsHeroCategory = {
      label: t("allCarsPage.allCategories") as string,
      value: "all",
    };

    if (!carsMeta?.filter_categories || carsMeta.filter_categories.length === 0) {
      return [defaultAll];
    }

    const dynamicCategories = carsMeta.filter_categories.map((category) => ({
      label: localize(category.name, language),
      value: String(category.id),
    }));

    return [defaultAll, ...dynamicCategories];
  }, [carsMeta, t]);

  const filterBrands = useMemo(
    () => carsMeta?.filter_brands ?? [],
    [carsMeta],
  );

  const filterTypes = useMemo(
    () =>
      (carsMeta?.filter_types ?? []).map((type) => ({
        id: type.id,
        slug: type.slug,
        label: localize(type.name, language),
      })),
    [carsMeta, language],
  );

  const filterYears = useMemo(
    () => carsMeta?.filter_years ?? [],
    [carsMeta],
  );

  const { data: carsResponse, isPending: isCarsPending } = useQuery({
    queryKey: ["cars-data", language, filters, currentPage, offerId],
    queryFn: () => getCars(buildQueryParams()),
    staleTime: 5 * 60 * 1000,
    retry: 1,
    placeholderData: keepPreviousData,
  });

  const allCars = useMemo<ICarCardProps[]>(() => {
    let rawCars = carsResponse?.data;
    const isUsingStatic = !rawCars || rawCars.length === 0;

    if (isUsingStatic) {
      rawCars = filterStaticCars(filters);
    }

    return (rawCars || [])
      .map((car) => mapCarToCardProps(car, language))
      .filter(Boolean) as ICarCardProps[];
  }, [carsResponse, language, filters]);

  return {
    heroCategories,
    allCars,
    filterBrands,
    filterTypes,
    filterYears,
    isPending: isCarsPending,
  };
}
