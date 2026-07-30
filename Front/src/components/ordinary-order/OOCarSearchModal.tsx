import { Search, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "../../store/language.store";
import { useCarSearch } from "../../hooks/useCarSearch";
import { getImageUrl, APP_IMAGES } from "../../constants/app-images";
import LazyImg from "../LazyImg";
import type { IOOCarSearchModalProps } from "../../interfaces/IOOCarSearchModalProps";

export default function OOCarSearchModal({ onSelect, onClose }: IOOCarSearchModalProps) {
  const { t } = useTranslation();
  const direction = useLanguageStore((s) => s.direction);
  const { searchQuery, setSearchQuery, searchResults, searching } =
    useCarSearch(true);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div
        dir={direction}
        className="w-full max-w-[500px] rounded-[16px] bg-white p-5 shadow-xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-[16px] font-extrabold text-[#111111]">
            {t("ordinaryOrder.step2.modalTitle", "اختر سيارة")}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-[#9CA3AF] hover:text-[#111111]"
          >
            <X size={20} />
          </button>
        </div>

        <div className="relative mb-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("ordinaryOrder.step2.searchPlaceholder", "ابحث باسم السيارة أو الماركة...")}
            className="h-[46px] w-full rounded-[8px] border border-[#E5E7EB] bg-[#F9FAFB] pe-10 px-4 text-[14px] outline-none focus:border-[#C5232B] focus:ring-2 focus:ring-[#C5232B]/10"
          />
          <Search
            size={15}
            className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]"
          />
        </div>

        <div className="max-h-[340px] space-y-2 overflow-y-auto pe-1">
          {searching ? (
            <div className="flex justify-center py-6">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#E5E7EB] border-t-[#C5232B]" />
            </div>
          ) : (
            searchResults.map((car) => (
              <button
                key={car.id}
                type="button"
                onClick={() => { onSelect(car); onClose(); }}
                className="flex w-full items-center gap-3 rounded-[10px] border border-[#E5E7EB] bg-white px-3 py-2.5 text-end transition hover:border-[#C5232B]/40"
              >
                <LazyImg
                  src={getImageUrl(car.main_image) || APP_IMAGES.CAR_PLACEHOLDER}
                  alt={car.name}
                  className="h-[44px] w-[60px] shrink-0 rounded-[6px] object-cover"
                />
                <div className="flex-1">
                  <p className="text-[13px] font-bold text-[#111111]">
                    {car.brand?.name} {car.name} {car.year}
                  </p>
                  {car.current_price ? (
                    <p className="text-[12px] text-[#C5232B]">
                      {car.current_price.toLocaleString()} ر.س
                    </p>
                  ) : null}
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
