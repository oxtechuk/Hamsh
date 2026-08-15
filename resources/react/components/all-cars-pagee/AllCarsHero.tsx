import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { IAllCarsHeroProps } from "../../interfaces/IAllCarsHeroProps";

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

  sortLabel,
  onSortClick,

  filterLabel,
  onFilterClick,

  className = "",
}: IAllCarsHeroProps) {
  const { t, i18n } = useTranslation();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch?.();
  };

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
                placeholder={t(
                  "carsPage.search.placeholder",
                  "ابحث عن سيارة...",
                )}
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
            <button
              type="button"
              onClick={onSortClick}
              className={[
                "flex h-[56px] min-w-[150px]",
                "items-center justify-center gap-2",
                "border-t border-[#ECECEC]",
                "bg-white px-5",
                "text-[13px] font-medium text-[#303A54]",
                "transition hover:bg-[#F8F8F8]",
                "lg:border-s lg:border-t-0",
              ].join(" ")}
            >
              <ChevronDown size={16} strokeWidth={1.7} />

              {sortLabel ?? t("carsPage.sort.label", "ترتيب حسب")}
            </button>

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

              {filterLabel ?? t("carsPage.filters", "الفلاتر")}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

