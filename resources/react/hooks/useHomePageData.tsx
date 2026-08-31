import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { getHomePageData, getBrands, getCars } from "../services/api";
import { useLanguageStore } from "../store/language.store";
import { APP_IMAGES, getImageUrl } from "../constants/app-images";
import { localize } from "../utils/localize";
import { mapHomeCarToCardProps, mapBrandToCardProps } from "../utils/homeMappers";

import RiyalLabel from "../components/RiyalLabel";

import type { HomeCarItem } from "../types/home.types";
import type { ICarCardProps } from "../interfaces/ICarCardProps";
import type { IBudgetRange } from "../interfaces/IBudgetRange";
import type { CarsListResponse } from "../types/cars.types";
import type { ICarsSearchValues } from "../interfaces/ICarsSearchSectionProps";
import type { IHomeOfferSlide } from "../interfaces/IHomeOfferSlide";

function getFallbackHomeOffers(t: (key: string) => string): IHomeOfferSlide[] {
  return [
    {
      id: "home-offer-1",
      image: APP_IMAGES.HOME_OFFERS_SECTION,
      buttonText: t("homeOffers.browseCars"),
      buttonTo: "/cars",
    },
    {
      id: "home-offer-2",
      image: APP_IMAGES.OFFER1,
      buttonText: t("homeOffers.discoverOffers"),
      buttonTo: "/offers",
    },
    {
      id: "home-offer-3",
      image: APP_IMAGES.OFFER_HERO_PLACEHOLDER,
      buttonText: t("homeOffers.discoverOffers"),
      buttonTo: "/offers",
    },
    {
      id: "home-offer-4",
      image: APP_IMAGES.ALL_CARS_OFFER_IMAGE,
      buttonText: t("homeOffers.browseCars"),
      buttonTo: "/cars",
    },
  ];
}

export function useHomePageData() {
  const { t } = useTranslation();
  const language = useLanguageStore((s) => s.language);
  const navigate = useNavigate();

  const [brandSearch, setBrandSearch] = useState("");
  const [brandTypeId, setBrandTypeId] = useState("");
  const [activeBudgetRange, setActiveBudgetRange] = useState<string>("");

  const { data, isLoading } = useQuery({
    queryKey: ["home-data", language],
    queryFn: getHomePageData,
  });

  const { data: searchedBrands } = useQuery({
    queryKey: ["brands-search", brandSearch, brandTypeId, language],
    queryFn: () => getBrands(brandSearch || undefined, brandTypeId || undefined),
    enabled: Boolean(brandSearch || brandTypeId),
    staleTime: 2 * 60 * 1000,
  });

  const latestCars = useMemo(
    () =>
      (data?.featured_cars ?? [])
        .map((car) => mapHomeCarToCardProps(car, language))
        .filter(Boolean) as ICarCardProps[],
    [data?.featured_cars, language],
  );

  const highlightedCars = useMemo(
    () =>
      (data?.highlighted_cars ?? [])
        .map((car) => mapHomeCarToCardProps(car, language))
        .filter(Boolean) as ICarCardProps[],
    [data?.highlighted_cars, language],
  );

  const homeOffers = useMemo(() => {
    const offers = data?.active_offers ?? [];
    if (!offers.length) return getFallbackHomeOffers(t);

    return offers.map((offer) => ({
      id: offer.id,
      image: getImageUrl(offer.image) || APP_IMAGES.HOME_OFFERS_SECTION,
      alt: offer.title,
      buttonText: t("homeOffers.viewOffer"),
      buttonTo: `/cars?offerId=${offer.id}`,
    })) as IHomeOfferSlide[];
  }, [data?.active_offers, t]);

  const brands = useMemo(
    () =>
      ((brandSearch || brandTypeId ? searchedBrands : data?.brands) ?? []).map(
        (brand) => mapBrandToCardProps(brand, language),
      ),
    [brandSearch, brandTypeId, searchedBrands, data?.brands, language],
  );

  const brandCategories = useMemo(
    () =>
      (data?.filter_brand_types ?? []).map((type) => ({
        label: localize(type.name, language),
        value: String(type.id),
      })),
    [data?.filter_brand_types, language],
  );

  const priceRanges: IBudgetRange[] = useMemo(
    () =>
      (data?.filter_prices ?? []).map((p) => ({
        label: (
          <RiyalLabel
            text={
              p.max
                ? `${p.min.toLocaleString()} - ${p.max.toLocaleString()}`
                : `${p.min.toLocaleString()}+`
            }
          />
        ),
        value: p.max == null ? `${p.min}-plus` : `${p.min}-${p.max}`,
        min: p.min,
        max: p.max,
        count: p.count,
      })),
    [data?.filter_prices],
  );

  const { data: budgetCarsData } = useQuery<CarsListResponse>({
    queryKey: ["budget-cars", activeBudgetRange, language],
    queryFn: () => {
      const range = priceRanges.find((r) => r.value === activeBudgetRange);
      if (!range) {
        return {
          data: [],
          meta: { current_page: 1, last_page: 1, per_page: 0, total: 0 },
        };
      }
      return getCars({
        min_price: range.min,
        max_price: range.max ?? undefined,
      });
    },
    enabled: !!activeBudgetRange,
    staleTime: 5 * 60 * 1000,
  });

  const budgetCars = useMemo(() => {
    if (activeBudgetRange && budgetCarsData?.data) {
      return budgetCarsData.data
        .map((car) => mapHomeCarToCardProps(car as unknown as HomeCarItem, language))
        .filter(Boolean) as ICarCardProps[];
    }
    return highlightedCars;
  }, [activeBudgetRange, budgetCarsData, highlightedCars, language]);

  const handleSearch = (values: ICarsSearchValues) => {
    const params = new URLSearchParams();

    if (values.search?.trim()) {
      params.set("search", values.search.trim());
      params.set("q", values.search.trim());
    }
    if (values.brandId) {
      params.set("brands[]", values.brandId);
    }
    if (values.model) {
      params.set("model", values.model);
    }
    if (values.year) {
      params.set("year", values.year);
    }
    if (values.typeId) {
      params.set("type", values.typeId);
    }
    if (values.categoryId) {
      params.set("category_id", values.categoryId);
    }

    navigate(`/cars?${params.toString()}`);
  };

  return {
    data,
    isLoading,
    latestCars,
    highlightedCars,
    homeOffers,
    brands,
    brandCategories,
    priceRanges,
    budgetCars,
    brandSearch,
    brandTypeId,
    setBrandTypeId,
    setBrandSearch,
    activeBudgetRange,
    setActiveBudgetRange,
    handleSearch,
  };
}
