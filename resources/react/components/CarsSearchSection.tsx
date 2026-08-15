import { Search, SlidersHorizontal } from "lucide-react";
import { useTranslation } from "react-i18next";

interface CarsSearchSectionProps {
  title?: string;
  searchValue: string;
  onSearchValueChange: (value: string) => void;
  onSearch: () => void;
  onFiltersClick?: () => void;
  placeholder?: string;
  searchButtonText?: string;
  filtersButtonText?: string;
  className?: string;
  isSearching?: boolean;
}

export default function CarsSearchSection({
  title,
  searchValue,
  onSearchValueChange,
  onSearch,
  onFiltersClick,
  placeholder,
  searchButtonText,
  filtersButtonText,
  className = "",
  isSearching = false,
}: CarsSearchSectionProps) {
  const { t, i18n } = useTranslation();

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    onSearch();
  };

  return (
    <section
      dir={i18n.dir()}
      className={`w-full bg-white py-10 sm:py-12 lg:py-14 ${className}`}
    >
      <div className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-[25px] font-extrabold leading-tight text-[#151A2A] sm:text-[30px]">
          {title ??
            t(
              "carsPage.search.title",
              "إبحث عن سيارتك المثالية",
            )}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="mt-8 flex flex-col gap-3 lg:flex-row"
        >
          {/* Search input */}
          <div className="relative min-w-0 flex-1">
            <Search
              size={18}
              strokeWidth={1.7}
              className="pointer-events-none absolute end-5 top-1/2 -translate-y-1/2 text-[#778097]"
            />

            <input
              type="search"
              value={searchValue}
              onChange={(event) =>
                onSearchValueChange(
                  event.target.value,
                )
              }
              placeholder={
                placeholder ??
                t(
                  "carsPage.search.placeholder",
                  "ابحث عن سيارة بالاسم، العلامة التجارية، الموديل، أو المواصفات...",
                )
              }
              className={[
                "h-[56px] w-full",
                "border border-[#E1E5EB]",
                "bg-white px-5 pe-14",
                "text-[14px] text-[#151A2A]",
                "outline-none",
                "placeholder:text-[#8B92A2]",
                "transition duration-300",
                "focus:border-[#DDBB68]",
                "focus:ring-2 focus:ring-[#DDBB68]/15",
              ].join(" ")}
            />
          </div>

          {/* Search */}
          <button
            type="submit"
            disabled={isSearching}
            className={[
              "flex h-[56px] min-w-[165px]",
              "items-center justify-center",
              "bg-[#E1BF6B] px-7",
              "text-[15px] font-bold text-[#151A2A]",
              "transition duration-300",
              "hover:bg-[#D4AD4F]",
              "disabled:cursor-not-allowed",
              "disabled:opacity-60",
            ].join(" ")}
          >
            {isSearching
              ? t(
                  "carsPage.search.searching",
                  "جاري البحث...",
                )
              : searchButtonText ??
                t(
                  "carsPage.search.button",
                  "بحث",
                )}
          </button>

          {/* Filters */}
          <button
            type="button"
            onClick={onFiltersClick}
            className={[
              "flex h-[56px] min-w-[120px]",
              "items-center justify-center gap-3",
              "border border-[#172139]",
              "bg-white px-6",
              "text-[14px] font-semibold text-[#172139]",
              "transition duration-300",
              "hover:bg-[#172139]",
              "hover:text-white",
            ].join(" ")}
          >
            <SlidersHorizontal
              size={17}
              strokeWidth={1.7}
            />

            {filtersButtonText ??
              t(
                "carsPage.search.filters",
                "الفلاتر",
              )}
          </button>
        </form>
      </div>
    </section>
  );
}