import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { SlidersHorizontal, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getBrands } from "../services/api/cars.service";
import type { FilterValues } from "../types/cars.types";
import type { ICarsSidebarFilterProps } from "../interfaces/ICarsSidebarFilterProps";
import type { IFilterContentProps } from "../interfaces/IFilterContentProps";
import { FilterContent } from "./FilterContent";

const MAX_PRICE = 600000;

export default function CarsSidebarFilter({
  brands: brandsProp,
  transmissions,
  fuelTypes,
  filters,
  onFilterChange,
}: ICarsSidebarFilterProps) {
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.brandId !== null) count++;
    if (filters.transmission !== "all") count++;
    if (filters.fuelType !== "all") count++;
    if (filters.priceMax < MAX_PRICE) count++;
    return count;
  }, [filters]);

  const { data: fetchedBrands } = useQuery({
    queryKey: ["brands"],
    queryFn: getBrands,
  });

  const brands = brandsProp ?? fetchedBrands ?? [];

  const setFilter = <K extends keyof FilterValues>(key: K, value: FilterValues[K]) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const handleReset = () => {
    onFilterChange({
      brandId: null,
      type: "all",
      categoryId: null,
      year: "",
      priceMin: 0,
      priceMax: MAX_PRICE,
      engine: "all",
      transmission: "all",
      fuelType: "all",
      search: filters.search,
    });
  };

  const filterContentProps: IFilterContentProps = {
    brands,
    transmissions,
    fuelTypes,
    filters,
    setFilter,
    onReset: handleReset,
  };

  return (
    <>
      {/* Mobile toggle */}
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="flex w-full items-center justify-center gap-2 rounded-[12px] border border-[#D1D5DB] bg-white px-4 py-3 text-[14px] font-semibold text-[#111827] shadow-sm"
        >
          <SlidersHorizontal size={17} className="text-[var(--brand-secondary-color)]" />
          <span>{t("carsSidebarFilter.mobileToggle")}</span>
          {activeFilterCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--brand-secondary-color)] px-1 text-[11px] font-bold text-white">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile drawer — anchored to the inline-end (right in RTL) */}
      <div
        className={[
          "fixed bottom-0 top-0 z-50",
          "w-[88vw] max-w-[380px]",
          "overflow-y-auto bg-white shadow-2xl",
          "transition-transform duration-300 lg:hidden",
          "end-0",
          mobileOpen ? "translate-x-0" : "rtl:-translate-x-full ltr:translate-x-full",
        ].join(" ")}
      >
        <div className="flex items-center justify-between border-b border-[#F3F4F6] px-5 py-4">
          <button type="button" onClick={() => setMobileOpen(false)}>
            <X size={20} className="text-[#6B7280]" />
          </button>
          <span className="text-[17px] font-extrabold text-[#111827]">
            {t("carsSidebarFilter.title")}
          </span>
        </div>
        <div className="p-5">
          <FilterContent {...filterContentProps} />
        </div>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden w-[320px] shrink-0 lg:block">
        <FilterContent {...filterContentProps} />
      </aside>
    </>
  );
}
