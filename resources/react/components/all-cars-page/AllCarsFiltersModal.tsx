import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";

import { RadioRow } from "../RadioRow";
import Select from "../Select";
import { useLanguageStore } from "../../store/language.store";
import { DEFAULT_FILTER_VALUES } from "../../interfaces/IFilterValues";

import type { IFilterValues } from "../../interfaces/IFilterValues";
import type { IAllCarsFiltersModalProps } from "../../interfaces/IAllCarsFiltersModalProps";

const MAX_PRICE = 600000;

const selectCls = [
  "h-[48px] w-full",
  "border border-[#E1E5EB]",
  "bg-white",
  "text-[13px] text-[#111827]",
  "outline-none",
  "transition duration-300",
  "focus:border-[#DDBB68]",
].join(" ");

export default function AllCarsFiltersModal({
  open,
  onClose,
  filters,
  onApply,
  brands,
  types,
  years,
}: IAllCarsFiltersModalProps) {
  const { t, i18n } = useTranslation();
  const language = useLanguageStore((s) => s.language);

  const [draft, setDraft] = useState<IFilterValues>(filters);

  useEffect(() => {
    if (open) {
      setDraft(filters);
    }
  }, [open, filters]);

  if (!open) {
    return null;
  }

  const setField = <K extends keyof IFilterValues>(
    key: K,
    value: IFilterValues[K],
  ) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setDraft({ ...DEFAULT_FILTER_VALUES, search: filters.search });
  };

  const handleApply = () => {
    onApply(draft);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      dir={i18n.dir()}
    >
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      <div className="relative flex max-h-[85vh] w-full max-w-[1040px] flex-col overflow-hidden rounded-[16px] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.2)]">
        <div className="flex items-center justify-between border-b border-[#F3F4F6] px-6 py-4">
          <h2 className="text-[17px] font-extrabold text-[#111827]">
            {t("carsSidebarFilter.title")}
          </h2>
          <button type="button" onClick={onClose} aria-label={t("carsSidebarFilter.reset")}>
            <X size={20} className="text-[#6B7280]" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {/* Brands */}
            <div className="sm:border-e sm:border-[#F3F4F6] sm:pe-6">
              <h3 className="mb-3 text-start text-[15px] font-bold text-[#111827]">
                {t("carsSidebarFilter.brands")}
              </h3>
              <div className="flex max-h-[260px] flex-col gap-2.5 overflow-y-auto pe-1">
                <RadioRow
                  label={t("carsSidebarFilter.all")}
                  active={draft.brandId === null}
                  onClick={() => setField("brandId", null)}
                />
                {brands.map((brand) => (
                  <RadioRow
                    key={brand.id}
                    label={brand.name}
                    active={draft.brandId === brand.id}
                    onClick={() => setField("brandId", brand.id)}
                  />
                ))}
              </div>
            </div>

            {/* Type + Year */}
            <div className="flex flex-col gap-6 sm:border-e sm:border-[#F3F4F6] sm:pe-6">
              {types.length > 0 && (
                <div>
                  <h3 className="mb-3 text-start text-[15px] font-bold text-[#111827]">
                    {t("carsPage.search.typeLabel")}
                  </h3>
                  <Select
                    placeholder={t("carsPage.search.typePlaceholder")}
                    value={draft.type === "all" ? "" : draft.type}
                    onChange={(value) => setField("type", value || "all")}
                    options={types.map((type) => ({
                      label: type.label,
                      value: String(type.id),
                    }))}
                    className={selectCls}
                  />
                </div>
              )}

              {years.length > 0 && (
                <div>
                  <h3 className="mb-3 text-start text-[15px] font-bold text-[#111827]">
                    {t("carsPage.search.yearLabel")}
                  </h3>
                  <Select
                    placeholder={t("carsPage.search.yearPlaceholder")}
                    value={draft.year}
                    onChange={(value) => setField("year", value)}
                    options={years.map((year) => ({
                      label: year,
                      value: year,
                    }))}
                    className={selectCls}
                  />
                </div>
              )}
            </div>

            {/* Price */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-[15px] font-bold text-[#111827]">
                  {t("carsSidebarFilter.maxPrice")}
                </h3>
                <span className="text-[13px] font-semibold text-[var(--brand-secondary-color)]">
                  {draft.priceMax.toLocaleString(language)}
                </span>
              </div>

              <input
                type="range"
                min={0}
                max={MAX_PRICE}
                step={5000}
                value={draft.priceMax}
                onChange={(e) => setField("priceMax", Number(e.target.value))}
                className="price-slider h-[4px] w-full cursor-pointer appearance-none rounded-full"
                style={{
                  background: `linear-gradient(to ${i18n.dir() === "rtl" ? "left" : "right"}, var(--brand-secondary-color) 0%, var(--brand-secondary-color) ${
                    (draft.priceMax / MAX_PRICE) * 100
                  }%, #E5E7EB ${(draft.priceMax / MAX_PRICE) * 100}%, #E5E7EB 100%)`,
                }}
              />

              <div className="mt-2 flex items-center justify-between text-[12px] text-[#9CA3AF]">
                <span>{(0).toLocaleString(language)}</span>
                <span>{MAX_PRICE.toLocaleString(language)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-[#F3F4F6] px-6 py-4">
          <button
            type="button"
            onClick={handleReset}
            className="h-[46px] flex-1 rounded-[8px] border border-[#D1D5DB] text-[14px] font-semibold text-[#374151] transition hover:bg-[#F9FAFB] sm:flex-none sm:w-[140px]"
          >
            {t("carsSidebarFilter.reset")}
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="h-[46px] flex-1 rounded-[8px] bg-[var(--brand-secondary-color)] text-[14px] font-bold text-white transition hover:brightness-110 sm:flex-none sm:w-[160px]"
          >
            {t("carsSidebarFilter.apply")}
          </button>
        </div>
      </div>
    </div>
  );
}
