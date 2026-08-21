import { useEffect, useRef, useState } from "react";
import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { IAllCarsHeroProps } from "../../interfaces/IAllCarsHeroProps";
import type { SortValue } from "../../interfaces/IFilterValues";

const SORT_OPTIONS: { value: SortValue; labelKey: string }[] = [
  { value: "", labelKey: "carsPage.sort.options.latest" },
  { value: "price_asc", labelKey: "carsPage.sort.options.priceAsc" },
  { value: "price_desc", labelKey: "carsPage.sort.options.priceDesc" },
  { value: "year_desc", labelKey: "carsPage.sort.options.yearDesc" },
  { value: "year_asc", labelKey: "carsPage.sort.options.yearAsc" },
];

export default function AllCarsHero({
  eyebrow,
  title,
  countText,

  categories,
  activeCategory,
  onCategoryChange,

  searchValue,
  onSearchChange,
  onSearch,

  sortValue,
  onSortChange,

  filterLabel,
  onFilterClick,

  className = "",
}: IAllCarsHeroProps) {
  const { t, i18n } = useTranslation();
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch?.();
  };

  const activeSortOption =
    SORT_OPTIONS.find((option) => option.value === sortValue) ?? SORT_OPTIONS[0];

  useEffect(() => {
    if (!sortOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setSortOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sortOpen]);

  return (
    <section dir={i18n.dir()} className={`w-full bg-[#1A1F2E] ${className}`}>
      {/* Hero content */}
      <div className="mx-auto max-w-[1440px] px-4 pt-8 sm:px-6 sm:pt-10 lg:px-8 lg:pt-12">
        <div className="flex min-h-[145px] items-start justify-start">
          <div className="max-w-[460px] text-start">
            {eyebrow && (
              <p className="text-[12px] font-medium text-[var(--brand-primary-color)]">
                {eyebrow}
              </p>
            )}

            <h1 className="mt-3 text-[30px] font-extrabold leading-tight text-white sm:text-[36px]">
              {title}
            </h1>

            {countText && (
              <p className="mt-4 text-[13px] text-white/55">{countText}</p>
            )}
          </div>
        </div>
      </div>

      {/* Filters bar */}
      <div className="border-t border-white/[0.04] bg-white">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-stretch">
            {/* Categories */}
            <div className="flex min-w-0 flex-1 overflow-x-auto">
              {categories.map((category) => {
                const isActive = category.value === activeCategory;

                return (
                  <button
                    key={category.value}
                    type="button"
                    onClick={() => onCategoryChange?.(category.value)}
                    className={[
                      "flex h-[56px] min-w-[82px] items-center justify-center",
                      "border-s border-[#ECECEC] px-5",
                      "text-[13px] font-medium",
                      "transition duration-300",
                      isActive
                        ? [
                            "bg-[#303A54]",
                            "text-[var(--brand-primary-color)]",
                          ].join(" ")
                        : [
                            "bg-white",
                            "text-[#303A54]",
                            "hover:bg-[#F8F8F8]",
                          ].join(" "),
                    ].join(" ")}
                  >
                    {category.label}
                  </button>
                );
              })}
            </div>

            {/* Search */}
            <form
              onSubmit={handleSubmit}
              className="relative min-w-0 flex-1 border-t border-[#ECECEC] px-10 lg:border-s lg:border-t-0"
            >
              <Search
                size={17}
                strokeWidth={1.7}
                className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-[#6F7890]"
              />

              <input
                type="search"
                value={searchValue}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder={t("carsPage.search.placeholder")}
                className={[
                  "h-[56px] w-full",
                  "bg-white px-4 pe-12",
                  "text-[13px] text-[#303A54]",
                  "outline-none",
                  "placeholder:text-[#9A9EAA]",
                ].join(" ")}
              />
            </form>

            {/* Sort */}
            <div ref={sortRef} className="relative min-w-[150px]">
              <button
                type="button"
                onClick={() => setSortOpen((open) => !open)}
                className={[
                  "flex h-[56px] w-full min-w-[150px]",
                  "items-center justify-center gap-2",
                  "border-t border-[#ECECEC]",
                  "bg-white px-5",
                  "text-[13px] font-medium text-[#303A54]",
                  "transition hover:bg-[#F8F8F8]",
                  "lg:border-s lg:border-t-0",
                ].join(" ")}
              >
                <ChevronDown
                  size={16}
                  strokeWidth={1.7}
                  className={`transition-transform duration-150 ${sortOpen ? "rotate-180" : ""}`}
                />

                {t(activeSortOption.labelKey)}
              </button>

              {sortOpen && (
                <div
                  className={[
                    "absolute top-full z-30 mt-1 w-[220px]",
                    "border border-[#ECECEC] bg-white shadow-lg",
                    i18n.dir() === "rtl" ? "start-0" : "end-0",
                  ].join(" ")}
                >
                  {SORT_OPTIONS.map((option) => (
                    <button
                      key={option.value || "latest"}
                      type="button"
                      onClick={() => {
                        onSortChange(option.value);
                        setSortOpen(false);
                      }}
                      className={[
                        "block w-full px-4 py-2.5 text-start text-[13px] transition hover:bg-[#F8F8F8]",
                        option.value === sortValue
                          ? "font-bold text-[var(--brand-secondary-color)]"
                          : "text-[#303A54]",
                      ].join(" ")}
                    >
                      {t(option.labelKey)}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Filters */}
            <button
              type="button"
              onClick={onFilterClick}
              className={[
                "flex h-[56px] min-w-[110px]",
                "items-center justify-center gap-2",
                "bg-[var(--brand-primary-color)]",
                "px-5",
                "text-[13px] font-bold text-[#303A54]",
                "transition hover:brightness-95",
              ].join(" ")}
            >
              <SlidersHorizontal size={17} strokeWidth={1.8} />

              {filterLabel ?? t("carsPage.filters")}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
