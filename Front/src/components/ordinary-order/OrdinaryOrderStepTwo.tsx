import { useState } from "react";
import { Plus, Send } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "../../store/language.store";
import { useCarSearch } from "../../hooks/useCarSearch";
import OOCarGridCard from "./OOCarGridCard";
import OOCarSearchModal from "./OOCarSearchModal";
import { getImageUrl, APP_IMAGES } from "../../constants/app-images";
import LazyImg from "../LazyImg";
import type { IOOrdinaryOrderStepTwoProps } from "../../interfaces/IOOrdinaryOrderStepTwoProps";

const cardCls = [
  "flex items-center gap-3",
  "rounded-[12px] border border-[#E5E7EB] bg-white px-4 py-3",
  "transition",
].join(" ");

export default function OrdinaryOrderStepTwo({
  initialCar,
  selected,
  onSelect,
  onSubmit,
  onBack,
  submitting,
}: IOOrdinaryOrderStepTwoProps) {
  const { t } = useTranslation();
  const direction = useLanguageStore((s) => s.direction);
  const [showModal, setShowModal] = useState(false);

  const { searchResults: allCars } = useCarSearch(true);
  const recommendations = allCars
    .filter((c) => c.id !== (selected ?? initialCar)?.id)
    .slice(0, 4);

  const activeCar = selected ?? initialCar;

  return (
    <>
      {showModal && (
        <OOCarSearchModal
          onSelect={onSelect}
          onClose={() => setShowModal(false)}
        />
      )}

      <div
        dir={direction}
        className="mx-auto w-full max-w-[600px] rounded-[16px] border border-[#E7E7E7] bg-white px-6 py-8 shadow-sm"
      >
        <h2 className="mb-2 text-start text-[26px] font-extrabold text-[#111111]">
          {t("ordinaryOrder.step2.title", "اختر السيارة")}
        </h2>

        <div>
          <p className="mb-0 pb-5 text-start text-[13px] text-[#9CA3AF]">
            {t("ordinaryOrder.step2.selectedLabel", "السيارة التي اخترتها")}
          </p>

          {activeCar ? (
            <div
              className={`${cardCls} border-[#C5232B] ring-2 ring-[#C5232B]/15`}
            >
              <LazyImg
                src={
                  getImageUrl(activeCar.main_image) ||
                  APP_IMAGES.CAR_PLACEHOLDER
                }
                alt={activeCar.name}
                className="h-[52px] w-[68px] shrink-0 rounded-[8px] object-cover"
              />

              <div className="flex-1 text-start">
                <p className="text-[14px] font-extrabold text-[#111111]">
                  {activeCar.name}
                </p>
                {activeCar.current_price ? (
                  <p className="text-[12px] text-[#C5232B]">
                    {activeCar.current_price.toLocaleString()} ر.س
                  </p>
                ) : null}
              </div>

              <span className="h-[10px] w-[10px] shrink-0 rounded-full bg-[#C5232B]" />
            </div>
          ) : (
            <div
              className={`${cardCls} border-dashed border-[#D1D5DB] justify-center text-[13px] text-[#9CA3AF]`}
            >
              {t("ordinaryOrder.step2.notSelected", "لم تختر سيارة بعد")}
            </div>
          )}
        </div>

        {recommendations.length > 0 && (
          <div className="mt-6">
            <p className="mb-2 text-start text-[13px] text-[#9CA3AF]">
              {t(
                "ordinaryOrder.step2.recommendations",
                "سيارات أخرى من ترشيحنا",
              )}
            </p>
            <div className="grid grid-cols-2 gap-3">
              {recommendations.map((car) => (
                <OOCarGridCard
                  key={car.id}
                  car={car}
                  selected={activeCar?.id === car.id}
                  onSelect={() => onSelect(car)}
                />
              ))}

              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="flex items-center justify-start gap-3 rounded-[12px] border border-dashed border-[#E5E7EB] bg-[#FFF5F5] px-4 py-3 transition hover:border-[#C5232B]/40"
              >
                <div className="flex-1 text-start">
                  <p className="text-[11px] text-[#9CA3AF]">
                    {t("ordinaryOrder.step2.browseMoreLabel", "إختار سيارتك")}
                  </p>
                  <p className="text-[13px] font-bold text-[#111111]">
                    {t(
                      "ordinaryOrder.step2.browseMore",
                      "إختار سيارة أخرى من سيارتنا",
                    )}
                  </p>
                </div>
                <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[8px] bg-[#FFE4E4]">
                  <Plus size={18} className="text-[#C5232B]" />
                </div>
              </button>
            </div>
          </div>
        )}

        <div className="mt-6 flex items-center gap-4">
          <button
            type="button"
            onClick={onBack}
            className="flex h-[52px] flex-1 items-center justify-center rounded-[8px] border border-[#D1D5DB] text-[15px] !font-bold text-[#374151] transition hover:text-[#C5232B]"
          >
            {t("ordinaryOrder.step2.backButton", "رجوع")}
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={!activeCar || submitting}
            className="flex h-[52px] flex-1 items-center justify-center gap-2 rounded-[8px] bg-[var(--brand-secondary-color)] text-[15px] !font-bold text-white transition hover:bg-[#A91D24] disabled:opacity-40"
          >
            <Send
              size={16}
              className={direction === "rtl" ? "rotate-180" : ""}
            />
            {submitting
              ? t("ordinaryOrder.step2.submitting", "جارٍ الإرسال...")
              : t("ordinaryOrder.step2.submit", "إرسال الطلب")}
          </button>
        </div>
      </div>
    </>
  );
}
