import { useTranslation } from "react-i18next";
import { formatPrice } from "../utils/format";
import { localize } from "../utils/localize";
import { useLanguageStore } from "../store/language.store";
import type { IFilterContentProps } from "../interfaces/IFilterContentProps";
import { RadioRow } from "./RadioRow";
import { PillButton } from "./PillButton";

const MAX_PRICE = 600000;

export function FilterContent({
  brands,
  transmissions,
  filters,
  setFilter,
  onReset,
}: Omit<IFilterContentProps, "fuelTypes">) {
  const { t, i18n } = useTranslation();
  const language = useLanguageStore((s) => s.language);

  return (
    <div
      dir={i18n.dir()}
      className="rounded-[16px] border border-[#E5E7EB] bg-white p-5 shadow-[0_2px_16px_rgba(0,0,0,0.06)]"
    >
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-[18px] font-extrabold text-[#111827]">
          {t("carsSidebarFilter.title")}
        </h2>
        <button
          type="button"
          onClick={onReset}
          className="text-[13px] font-medium text-[var(--brand-secondary-color)] hover:underline"
        >
          {t("carsSidebarFilter.reset")}
        </button>
      </div>

      <div className="mb-5 border-b border-[#F3F4F6] pb-5">
        <h3 className="mb-3 text-start text-[15px] font-bold text-[#111827]">
          {t("carsSidebarFilter.brands")}
        </h3>
        <div className="flex flex-col gap-2.5">
          <RadioRow
            label={t("carsSidebarFilter.all")}
            active={filters.brandId === null}
            onClick={() => setFilter("brandId", null)}
          />
          {brands.map((brand) => (
            <RadioRow
              key={brand.id}
              label={localize(brand.name, language)}
              active={filters.brandId === brand.id}
              onClick={() => setFilter("brandId", brand.id)}
            />
          ))}
        </div>
      </div>

      <div className="mb-5 border-b border-[#F3F4F6] pb-5">
        <h3 className="mb-3 text-start text-[15px] font-bold text-[#111827]">
          {t("carsSidebarFilter.carType")}
        </h3>
        <div className="flex flex-wrap gap-2">
          <PillButton
            label={t("carsSidebarFilter.all")}
            active={filters.type === "all" || !filters.type}
            onClick={() => setFilter("type", "all")}
          />
          {transmissions.map((item) => (
            <PillButton
              key={item}
              label={item}
              active={filters.transmission === item}
              onClick={() =>
                setFilter(
                  "transmission",
                  filters.transmission === item ? "all" : item,
                )
              }
            />
          ))}
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-[15px] font-bold text-[#111827]">
            {t("carsSidebarFilter.maxPrice")}
          </h3>
          <span className="text-[13px] font-semibold text-[var(--brand-secondary-color)]">
            {formatPrice(filters.priceMax, "var(--brand-secondary-color)")}
          </span>
        </div>

        <input
          type="range"
          min={0}
          max={MAX_PRICE}
          step={5000}
          value={filters.priceMax}
          onChange={(e) => setFilter("priceMax", Number(e.target.value))}
          className="price-slider h-[4px] w-full cursor-pointer appearance-none rounded-full"
          style={{
            background: `linear-gradient(to ${i18n.dir() === "rtl" ? "left" : "right"}, var(--brand-secondary-color) 0%, var(--brand-secondary-color) ${
              (filters.priceMax / MAX_PRICE) * 100
            }%, #E5E7EB ${(filters.priceMax / MAX_PRICE) * 100}%, #E5E7EB 100%)`,
          }}
        />

        <div className="mt-2 flex items-center justify-between text-[12px] text-[#9CA3AF]">
          <span>{(0).toLocaleString()}</span>
          <span>{MAX_PRICE.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
