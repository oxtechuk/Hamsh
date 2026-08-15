import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import AllCarsSearchBar from "../components/AllCarsSearchBar";
import CarsResultsGrid from "../components/CarsResultsGrid";
import { getCars, getCarsMeta } from "../services/api/cars.service";
import { useLanguageStore } from "../store/language.store";
import { mapCarToCardProps } from "../utils/car-mappers";
import { useSEO } from "../utils/useSEO";
import type { CarCardProps } from "../components/CarCard";
import AllCarsHero from "../components/all-cars-pagee/AllCarsHero";
import { useCarsFilter } from "../hooks/useCarsFilter";
import { filterStaticCars } from "../utils/car-filter-utils";
import type { ICarsHeroCategory } from "../interfaces/ICarsHeroCategory";

const PAGE_SIZE = 6;

export default function AllCarsPage() {
    const { t, i18n } = useTranslation();
    useSEO(t("nav.cars"), t("allCarsHero.description"));
    const language = useLanguageStore((s) => s.language);

    const {
        filters,
        currentPage,
        setCurrentPage,
        offerId,
        buildQueryParams,
        handleFilterChange,
    } = useCarsFilter();

    const { data: carsMeta } = useQuery({
        queryKey: ["cars-meta", language],
        queryFn: getCarsMeta,
        staleTime: 5 * 60 * 1000,
    });

    const heroCategories = useMemo<ICarsHeroCategory[]>(() => {
        const defaultAll: ICarsHeroCategory = {
            label: t("allCarsPage.allCategories", "الكل"),
            value: "all",
        };

        if (!carsMeta?.filter_categories || carsMeta.filter_categories.length === 0) {
            return [defaultAll];
        }

        const dynamicCategories = carsMeta.filter_categories.map((cat) => ({
            label: cat.name,
            value: String(cat.id),
        }));

        return [defaultAll, ...dynamicCategories];
    }, [carsMeta, t]);

    const { data: carsResponse } = useQuery({
        queryKey: ["cars-data", language, filters, currentPage, offerId],
        queryFn: () => getCars(buildQueryParams()),
        staleTime: 5 * 60 * 1000,
        retry: 1,
    });

    const allCars = useMemo(() => {
        let rawCars = carsResponse?.data;
        const isUsingStatic = !rawCars || rawCars.length === 0;

        if (isUsingStatic) {
            rawCars = filterStaticCars(filters);
        }

        return (rawCars || [])
            .map((car) => mapCarToCardProps(car, language))
            .filter(Boolean) as CarCardProps[];
    }, [carsResponse, language, filters]);

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

    return (
        <main dir={i18n.dir()}>
            <AllCarsHero
                eyebrow={t("allCarsPage.eyebrow", "معرض السيارات")}
                title={t("allCarsPage.title", "اكتشف مجموعتنا")}
                countText={t("allCarsPage.countText", {
                    count: filteredCars.length,
                    defaultValue: `${filteredCars.length} سيارة متاحة`,
                })}
                categories={heroCategories}
                activeCategory={
                    filters.categoryId !== null ? String(filters.categoryId) : "all"
                }
                onCategoryChange={(val) =>
                    handleFilterChange({
                        ...filters,
                        categoryId: val === "all" ? null : Number(val),
                    })
                }
                searchValue={filters.search}
                onSearchChange={(val) =>
                    handleFilterChange({ ...filters, search: val })
                }
                onSearch={() => {
                    // search action
                }}
                sortLabel={t("carsPage.sort.label", "ترتيب حسب")}
                filterLabel={t("carsPage.filters", "الفلاتر")}
            />
            <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <div className="min-w-0 flex-1">
                    <AllCarsSearchBar resultCount={filteredCars.length} />

                    {pagedCars.length > 0 ? (
                        <CarsResultsGrid
                            cars={pagedCars}
                            currentPage={safePage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    ) : (
                        <div className="py-20 text-center">
                            <p className="text-lg font-medium text-[#9CA3AF]">
                                {t("allCarsPage.noCarsMatch", "لا توجد سيارات مطابقة للبحث")}
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
