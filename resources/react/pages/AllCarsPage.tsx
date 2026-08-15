import { useTranslation } from "react-i18next";
import AllCarsHero from "../components/all-cars-page/AllCarsHero";
import AllCarsSearchBar from "../components/all-cars-page/AllCarsSearchBar";
import CarsResultsGrid from "../components/all-cars-page/CarsResultsGrid";
import EmptyCarsState from "../components/all-cars-page/EmptyCarsState";
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

    const { heroCategories, allCars } = useAllCars({
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
                    filters.categoryId !== null ? String(filters.categoryId) : "all"
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
                sortLabel={t("carsPage.sort.label")}
                filterLabel={t("carsPage.filters")}
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
                        <EmptyCarsState />
                    )}
                </div>
            </section>
        </main>
    );
}
