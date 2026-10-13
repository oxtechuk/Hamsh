import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { useTranslation } from "react-i18next";

import LazyImg from "../LazyImg";
import { APP_IMAGES, getImageUrl } from "../../constants/app-images";
import { useLanguageStore } from "../../store/language.store";
import { localize } from "../../utils/localize";

import type { CarItem } from "../../types/home.types";
import type { ICarSearchModalProps } from "../../interfaces/ICarSearchModalProps";

function normalizeSearchText(text: unknown): string {
  if (!text) return "";
  const str = typeof text === "string" ? text : String(text);
  return str
    .toLowerCase()
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/[\u064B-\u065F]/g, "") // remove tashkeel
    .trim();
}

export default function CarSearchModal({ cars, onSelect, onClose }: ICarSearchModalProps) {
  const [query, setQuery] = useState("");
  const { t, i18n } = useTranslation();
  const direction = useLanguageStore((s) => s.direction);

  const normalizedQuery = normalizeSearchText(query);

  const filtered = useMemo(() => {
    if (!normalizedQuery) return cars;

    return cars.filter((c) => {
      const carName = normalizeSearchText(localize(c.name, i18n.language));
      const rawName =
        typeof c.name === "object" ? normalizeSearchText(JSON.stringify(c.name)) : "";
      const brandName = normalizeSearchText(localize(c.brand?.name, i18n.language));
      const rawBrand =
        typeof c.brand?.name === "object" ? normalizeSearchText(JSON.stringify(c.brand?.name)) : "";
      const year = String(c.year ?? "");
      const type = normalizeSearchText(c.type ?? "");

      return (
        carName.includes(normalizedQuery) ||
        rawName.includes(normalizedQuery) ||
        brandName.includes(normalizedQuery) ||
        rawBrand.includes(normalizedQuery) ||
        year.includes(normalizedQuery) ||
        type.includes(normalizedQuery)
      );
    });
  }, [cars, normalizedQuery, i18n.language]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]">
      <div
        dir={direction}
        className="flex max-h-[90vh] w-full max-w-[540px] flex-col rounded-[20px] bg-white p-5 shadow-2xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-[17px] font-extrabold text-[#111111]">
              {t("financeCalculator.step2.chooseCarTitle")}
            </h3>
            <span className="rounded-full bg-[var(--brand-primary-color)]/10 px-2.5 py-0.5 text-[11px] font-bold text-[var(--brand-primary-color)]">
              {filtered.length}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#9CA3AF] transition hover:bg-[#F3F4F6] hover:text-[#111111]"
          >
            <X size={18} />
          </button>
        </div>

        <div className="relative mb-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("financeCalculator.step2.searchPlaceholder")}
            className="h-[46px] w-full rounded-[10px] border border-[#E5E7EB] bg-[#F9FAFB] pe-10 ps-4 text-[14px] outline-none transition focus:border-[var(--brand-primary-color)] focus:bg-white focus:ring-2 focus:ring-[var(--brand-primary-color)]/15"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute end-9 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#111111]"
            >
              <X size={14} />
            </button>
          ) : null}
          <Search
            size={16}
            className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]"
          />
        </div>

        <div className="max-h-[420px] space-y-2 overflow-y-auto pe-1">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-[13px] text-[#737C8E]">
              {t("common.noResults", "لا توجد نتائج مطابقة للبحث")}
            </div>
          ) : (
            filtered.map((car) => {
              const brandName = localize(car.brand?.name, i18n.language);
              const carName = localize(car.name, i18n.language);

              return (
                <button
                  key={car.id}
                  type="button"
                  onClick={() => {
                    onSelect(car);
                    onClose();
                  }}
                  className="flex w-full items-center gap-3 rounded-[12px] border border-[#E5E7EB] bg-white px-3 py-2.5 text-start transition duration-200 hover:border-[var(--brand-primary-color)] hover:bg-[#FCFAF5]"
                >
                  <LazyImg
                    src={getImageUrl(car.main_image) || APP_IMAGES.CAR_PLACEHOLDER}
                    alt={carName}
                    className="h-[48px] w-[68px] shrink-0 rounded-[8px] object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-bold text-[#111111]">
                      {brandName} {carName} {car.year ? `· ${car.year}` : ""}
                    </p>
                    {car.current_price ? (
                      <p className="mt-0.5 text-[12px] font-semibold text-[var(--brand-primary-color)]">
                        {car.current_price.toLocaleString(i18n.language)}{" "}
                        {t("financeCalculator.step2.riyal")}
                      </p>
                    ) : null}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
