import { useState } from "react";
import { useTranslation } from "react-i18next";
import AllCarsHero from "../components/all-cars-page/AllCarsHero";
import AllCarsSearchBar from "../components/all-cars-page/AllCarsSearchBar";
import AllCarsFiltersModal from "../components/all-cars-page/AllCarsFiltersModal";
import CarsResultsGrid from "../components/all-cars-page/CarsResultsGrid";
import EmptyCarsState from "../components/all-cars-page/EmptyCarsState";
import AllCarsPageSkeleton from "../components/AllCarsPageSkeleton";
import { useAllCars } from "../hooks/useAllCars";
import { useCarsFilter } from "../hooks/useCarsFilter";
import { useCarsPagination } from "../hooks/useCarsPagination";
import { useSEO } from "../utils/useSEO";

const PAGE_SIZE = 6;

export default function AllCarsPage() {
    const { t, i18n } = useTranslation();
    useSEO(t("nav.cars"), t("allCarsHero.description"));

    const {
        filters,
        currentPage,
        setCurrentPage,
        offerId,
        buildQueryParams,
        handleFilterChange,
    } = useCarsFilter();

    const {
        heroCategories,
        allCars,
        filterBrands,
        filterTypes,
        filterYears,
        isPending,
    } = useAllCars({
        filters,
        currentPage,
        offerId,
        buildQueryParams,
    });

    const { filteredCars, totalPages, safePage, pagedCars } = useCarsPagination(
        allCars,
        filters,
        currentPage,
        PAGE_SIZE,
    );

    const [isFilterOpen, setIsFilterOpen] = useState(false);

    if (isPending) {
        return <AllCarsPageSkeleton />;
    }

    return (
        <main dir={i18n.dir()}>
            <AllCarsHero
                eyebrow={t("allCarsPage.eyebrow")}
                title={t("allCarsPage.title")}
                countText={t("allCarsPage.countText", {
                    count: filteredCars.length,
                })}
                categories={heroCategories}
                activeCategory={
                    filters.categoryId !== null
                        ? String(filters.categoryId)
                        : "all"
                }
                onCategoryChange={(value) =>
                    handleFilterChange({
                        ...filters,
                        categoryId: value === "all" ? null : Number(value),
                    })
                }
                searchValue={filters.search}
                onSearchChange={(value) =>
                    handleFilterChange({ ...filters, search: value })
                }
                sortValue={filters.sort}
                onSortChange={(value) =>
                    handleFilterChange({ ...filters, sort: value })
                }
                filterLabel={t("carsPage.filters")}
                onFilterClick={() => setIsFilterOpen(true)}
            />
            <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="min-w-0 flex-1">
                    {filters.brandId !== null && (
                        <div className="mb-6 flex items-center gap-2">
                            <span className="text-[13px] text-[#6B7280]">
                                {t("carsSidebarFilter.brands")}:
                            </span>
                            <span className="inline-flex items-center gap-2 rounded-full border border-[#D1D5DB] bg-[#F3F4F6] px-3.5 py-1 text-[13px] font-bold text-[#111827]">
                                {filterBrands.find((b) => b.id === filters.brandId)?.name || t("carsSidebarFilter.brands")}
                                <button
                                    type="button"
                                    onClick={() => handleFilterChange({ ...filters, brandId: null })}
                                    className="cursor-pointer text-[#6B7280] transition hover:text-red-600"
                                    title={t("carsSidebarFilter.reset")}
                                >
                                    ✕
                                </button>
                            </span>
                        </div>
                    )}

                    {pagedCars.length > 0 ? (
                        <CarsResultsGrid
                            cars={pagedCars}
                            currentPage={safePage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    ) : (
                        <EmptyCarsState />
                    )}
                </div>
            </section>

            <AllCarsFiltersModal
                open={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                filters={filters}
                onApply={handleFilterChange}
                brands={filterBrands}
                types={filterTypes}
                years={filterYears}
            />
        </main>
    );
}
