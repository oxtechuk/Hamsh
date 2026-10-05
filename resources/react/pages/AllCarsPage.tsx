import { useState } from "react";
import { useTranslation } from "react-i18next";
import AllCarsHero from "../components/all-cars-page/AllCarsHero";
import AllCarsFiltersModal from "../components/all-cars-page/AllCarsFiltersModal";
import CarsResultsGrid from "../components/all-cars-page/CarsResultsGrid";
import EmptyCarsState from "../components/all-cars-page/EmptyCarsState";
import AllCarsPageSkeleton from "../components/AllCarsPageSkeleton";
import { useAllCars } from "../hooks/useAllCars";
import { useCarsFilter } from "../hooks/useCarsFilter";
import { useSEO } from "../utils/useSEO";

const PAGE_SIZE = 12;

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
        allCars,
        totalCars,
        totalPages,
        filterBrands,
        filterTypes,
        filterYears,
        isPending,
    } = useAllCars({
        filters,
        currentPage,
        offerId,
        buildQueryParams,
        pageSize: PAGE_SIZE,
    });

    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 350, behavior: "smooth" });
    };

    if (isPending) {
        return <AllCarsPageSkeleton />;
    }

    const safePage = Math.min(Math.max(1, currentPage), totalPages || 1);

    return (
        <main dir={i18n.dir()}>
            <AllCarsHero
                eyebrow={t("allCarsPage.eyebrow")}
                title={t("allCarsPage.title")}
                countText={t("allCarsPage.countText", {
                    count: totalCars,
                })}
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
                    {(filters.brandId !== null || Boolean(filters.model)) && (
                        <div className="mb-6 flex flex-wrap items-center gap-2">
                            {filters.brandId !== null && (
                                <div className="flex items-center gap-2">
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

                            {Boolean(filters.model) && (
                                <div className="flex items-center gap-2">
                                    <span className="text-[13px] text-[#6B7280]">
                                        {t("carsSearch.model", "الموديل")}:
                                    </span>
                                    <span className="inline-flex items-center gap-2 rounded-full border border-[#D1D5DB] bg-[#F3F4F6] px-3.5 py-1 text-[13px] font-bold text-[#111827]">
                                        {filters.model}
                                        <button
                                            type="button"
                                            onClick={() => handleFilterChange({ ...filters, model: "" })}
                                            className="cursor-pointer text-[#6B7280] transition hover:text-red-600"
                                            title={t("carsSidebarFilter.reset")}
                                        >
                                            ✕
                                        </button>
                                    </span>
                                </div>
                            )}
                        </div>
                    )}

                    {allCars.length > 0 ? (
                        <CarsResultsGrid
                            cars={allCars}
                            currentPage={safePage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
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
