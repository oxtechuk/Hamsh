import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { APP_IMAGES, getImageUrl } from "../constants/app-images";
import HomeHero from "../components/HomeHero";
import FeaturedCarsSection from "../components/FeaturedCarsSection";
import BudgetCarsSection from "../components/BudgetCarsSection";
import { getHomePageData, getBrands, getCars } from "../services/api";
import { useLanguageStore } from "../store/language.store";
import type { HomeCarItem, BrandInfo } from "../types/home.types";
import type { CarCardProps } from "../components/CarCard";
import { formatPrice } from "../utils/format";
import { localize } from "../utils/localize";
import { useSEO } from "../utils/useSEO";
import type { IBrandCardProps } from "../interfaces/IBrandCardProps";
import type { IBudgetRange } from "../interfaces/IBudgetRange";
import type { CarsListResponse } from "../types/cars.types";
import PurchaseExperienceSection from "../components/PurchaseExperienceSection";
import BrandsCarousel from "../components/BrandsCarousel";
import CarsSearchSection from "../components/CarsSearchSection";
import HomeOffersSection from "../components/HomeOffersSection";
import type { IHomeOfferSlide } from "../interfaces/IHomeOfferSlide";

const homeOffers: IHomeOfferSlide[] = [
  {
    id: "home-offer-1",
    image: APP_IMAGES.HOME_OFFERS_SECTION,
    buttonText: "استعرض السيارات",
    buttonTo: "/cars",
  },
  {
    id: "home-offer-2",
    image: APP_IMAGES.OFFER1,
    buttonText: "اكتشف العروض",
    buttonTo: "/offers",
  },
  {
    id: "home-offer-3",
    image: APP_IMAGES.OFFER_HERO_PLACEHOLDER,
    buttonText: "اكتشف العروض",
    buttonTo: "/offers",
  },
  {
    id: "home-offer-4",
    image: APP_IMAGES.ALL_CARS_OFFER_IMAGE,
    buttonText: "استعرض السيارات",
    buttonTo: "/cars",
  },
];

function RiyalLabel({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center gap-1">
      <span>{text}</span>
      <span
        aria-label="ريال"
        className="inline-block h-[13px] w-[13px] shrink-0"
        style={{
          backgroundColor: "currentColor",
          WebkitMask: `url(${APP_IMAGES.RIYAL}) center / contain no-repeat`,
          mask: `url(${APP_IMAGES.RIYAL}) center / contain no-repeat`,
        }}
      />
    </span>
  );
}

function mapHomeCarToCardProps(
  car: HomeCarItem,
  lang: string,
): CarCardProps | null {
  try {
    const slug = car.slug?.trim();
    if (!slug) return null;

    const getSpec = (label: string): string => {
      if (!car.specs) return "";
      if (Array.isArray(car.specs)) {
        const found = car.specs.find((s) => s.label === label);
        return found?.value ?? "";
      }
      const keyMap: Record<string, string> = {
        "Fuel Type": "fuel",
        Transmission: "gearbox",
        seats: "seats",
      };
      const key = keyMap[label];
      const v = key ? (car.specs as Record<string, unknown>)[key] : undefined;
      return typeof v === "string" ? v : "";
    };

    return {
      id: car.id,
      image: getImageUrl(car.main_image) || APP_IMAGES.CAR_PLACEHOLDER,
      brand: localize(car.brand?.name, lang),
      name: localize(car.name, lang),
      year: String(car.year ?? ""),
      type: car.type ?? "",
      fuelType: getSpec("Fuel Type") || car.fuel_type || "",
      transmission: getSpec("Transmission") || car.transmission || "",
      seats: getSpec("seats") || car.seats || "",
      oldPrice:
        car.savings > 0
          ? formatPrice(car.cash_price, "var(--brand-primary-color)", lang)
          : undefined,
      price: formatPrice(
        car.current_price || car.cash_price,
        "var(--brand-primary-color)",
        lang,
      ),
      monthlyPrice: formatPrice(
        car.min_installment ?? 0,
        "var(--brand-secondary-color)",
        lang,
      ),
      detailsTo: `/cars/${slug}`,
      badgeText:
        typeof car.highlight === "string"
          ? car.highlight
          : (car.highlight?.text ?? car.highlight?.text_ar ?? undefined),
      badgeColor:
        typeof car.highlight === "object"
          ? (car.highlight?.color ?? undefined)
          : undefined,
    };
  } catch {
    return null;
  }
}

function mapBrandToCardProps(brand: BrandInfo, lang: string): IBrandCardProps {
  return {
    id: brand.id,
    name: localize(brand.name, lang),
    logo: getImageUrl(brand.logo) || APP_IMAGES.BRAND_PLACEHOLDER,
  };
}

export default function Home() {
  const { t } = useTranslation();
  useSEO(t("nav.home"), t("hero.description"));
  const language = useLanguageStore((s) => s.language);
  const [brandSearch] = useState("");
  const [activeBudgetRange, setActiveBudgetRange] = useState<string>("");
  const [search, setSearch] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["home-data", language],
    queryFn: getHomePageData,
  });

  const { data: searchedBrands } = useQuery({
    queryKey: ["brands-search", brandSearch, language],
    queryFn: () => getBrands(brandSearch || undefined),
    staleTime: 2 * 60 * 1000,
  });

  const latestCars = useMemo(
    () =>
      (data?.featured_cars ?? [])
        .map((car) => mapHomeCarToCardProps(car, language))
        .filter(Boolean) as CarCardProps[],
    [data?.featured_cars, language],
  );

  const highlightedCars = useMemo(
    () =>
      (data?.highlighted_cars ?? [])
        .map((car) => mapHomeCarToCardProps(car, language))
        .filter(Boolean) as CarCardProps[],
    [data?.highlighted_cars, language],
  );

  const brands = useMemo(
    () =>
      ((brandSearch ? searchedBrands : data?.brands) ?? []).map((brand) =>
        mapBrandToCardProps(brand, language),
      ),
    [brandSearch, searchedBrands, data?.brands, language],
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
        .map((car) =>
          mapHomeCarToCardProps(car as unknown as HomeCarItem, language),
        )
        .filter(Boolean) as CarCardProps[];
    }
    return highlightedCars;
  }, [activeBudgetRange, budgetCarsData, highlightedCars, language]);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--brand-primary-color)] border-t-transparent" />
      </div>
    );
  }

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (search.trim()) {
      params.set("q", search.trim());
    }

    console.log(params.toString());

    // Fetch cars or update URL here.
  };

  return (
    <>
      <HomeHero
        videoSrc="/videos/home-hero.mp4"
        videoPoster="/images/home/video-poster.jpg"
        slides={
          data?.hero_slides?.length
            ? data.hero_slides.map((slide, index) => ({
                id: index,
                image: getImageUrl(slide.image) || APP_IMAGES.CAR_PLACEHOLDER,
                detailsTo: slide.link || undefined,
              }))
            : [
                {
                  id: 0,
                  image: APP_IMAGES.HOME_HERO,
                },
              ]
        }
        titlePrefix={
          data?.hero?.title?.text || t("hero.titlePrefix", "امتلك سيارتك بثقة،")
        }
        titleHighlight={
          data?.hero?.title?.badge ||
          t("hero.titleHighlight", "وتمويل يناسب طموحك.")
        }
        description={data?.hero?.description || undefined}
        browseButtonText={
          data?.hero?.button_1?.text ||
          t("hero.browseButton", "استعرض السيارات")
        }
        calculatorButtonText={
          data?.hero?.button_2?.text ||
          t("hero.calculatorButton", "احسب تمويلك")
        }
        calculatorButtonTo={data?.hero?.button_2?.url || "/finance-calculator"}
      />

      <BrandsCarousel brands={brands}></BrandsCarousel>

      <CarsSearchSection
        searchValue={search}
        onSearchValueChange={setSearch}
        onSearch={handleSearch}
        onFiltersClick={() => setFiltersOpen(true)}
      />

      {filtersOpen && <div>{/* Filters drawer or modal */}</div>}

      <FeaturedCarsSection
        titleBlue={
          data?.page_sections?.featured_cars?.title?.trim() ||
          t("featuredCars.titleBlue")
        }
        buttonText={
          data?.page_sections?.featured_cars?.button_text?.trim() ||
          t("featuredCars.buttonText")
        }
        buttonTo="/cars"
        cars={latestCars}
      />

      <PurchaseExperienceSection
        features={
          data?.hero?.features?.length
            ? data.hero.features.map((f, i) => ({
                id: f.icon || String(i),
                title: f.title,
                description: f.description,
                icon: f.icon,
              }))
            : undefined
        }
      />

      {homeOffers.length > 0 && (
        <HomeOffersSection slides={homeOffers} autoPlay interval={5000} />
      )}

      <BudgetCarsSection
        titleBlue={
          data?.page_sections?.budget?.title?.trim() ||
          t("budgetCars.titleBlue")
        }
        description={
          data?.page_sections?.budget?.description?.trim() ||
          t("budgetCars.description")
        }
        buttonText={
          data?.page_sections?.budget?.button_text?.trim() ||
          t("budgetCars.buttonText")
        }
        buttonTo="/cars"
        cars={budgetCars}
        ranges={priceRanges}
        activeRange={activeBudgetRange}
        onRangeChange={setActiveBudgetRange}
      />
    </>
  );
}
