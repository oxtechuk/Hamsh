import { useState } from "react";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

import CarGridCard from "./CarGridCard";
import CarSearchModal from "./CarSearchModal";
import StepTwoSkeleton from "./StepTwoSkeleton";
import LazyImg from "../LazyImg";

import { APP_IMAGES, getImageUrl } from "../../constants/app-images";
import { useLanguageStore } from "../../store/language.store";

import type { CarItem } from "../../types/home.types";
import type { IStepTwoCarSelectionProps } from "../../interfaces/IStepTwoCarSelectionProps";

const cardCls = [
  "flex items-center gap-3",
  "rounded-[12px] border border-[#E5E7EB] bg-white px-4 py-3",
  "transition",
].join(" ");

export default function StepTwoCarSelection({
  cars,
  selectedCarId,
  onCarSelect,
  onNext,
  onBack,
  isLoading = false,
}: IStepTwoCarSelectionProps) {
  const { t } = useTranslation();
  const direction = useLanguageStore((s) => s.direction);
  const [activeId, setActiveId] = useState(selectedCarId || cars[0]?.id || 0);
  const [showModal, setShowModal] = useState(false);

  const activeCar = cars.find((c) => c.id === activeId) ?? cars[0] ?? null;
  const recommendations = cars.filter((c) => c.id !== activeId).slice(0, 4);

  const handleSelect = (car: CarItem) => {
    setActiveId(car.id);
    onCarSelect(car);
  };

  if (isLoading) return <StepTwoSkeleton />;

  return (
    <>
      {showModal && (
        <CarSearchModal
          cars={cars}
          onSelect={(car) => {
            handleSelect(car);
            setShowModal(false);
          }}
          onClose={() => setShowModal(false)}
        />
      )}

      <div
        dir={direction}
        className="mx-auto w-full max-w-[600px] rounded-[16px] border border-[#E7E7E7] bg-white px-6 py-8 shadow-sm"
      >
        <h2 className="mb-2 text-start text-[26px] font-extrabold text-[#111111]">
          {t("financeCalculator.step2.chooseCarTitle", "اختر السيارة")}
        </h2>

        <div>
          <p className="mb-0 pb-5 text-start text-[13px] text-[#9CA3AF]">
            {t(
              "financeCalculator.step2.chooseCarDescription",
              "السيارة التي اخترتها",
            )}
          </p>

          {activeCar ? (
            <div
              className={`${cardCls} border-[var(--brand-secondary-color)] ring-2 ring-[var(--brand-secondary-color)]/15`}
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
                  <p className="text-[12px] text-[var(--brand-secondary-color)]">
                    {activeCar.current_price.toLocaleString()} ر.س
                  </p>
                ) : null}
              </div>

              <span className="h-[10px] w-[10px] shrink-0 rounded-full bg-[var(--brand-secondary-color)]" />
            </div>
          ) : (
            <div
              className={`${cardCls} border-dashed border-[#D1D5DB] justify-center text-[13px] text-[#9CA3AF]`}
            >
              {t("financeCalculator.step2.selectCar", "اختر سيارة")}
            </div>
          )}
        </div>

        {recommendations.length > 0 && (
          <div className="mt-6">
            <p className="mb-2 text-start text-[13px] text-[#9CA3AF]">
              {t(
                "financeCalculator.step2.recommendedCars",
                "سيارات أخرى من ترشيحنا",
              )}
            </p>
            <div className="grid grid-cols-2 gap-3">
              {recommendations.map((car) => (
                <CarGridCard
                  key={car.id}
                  car={car}
                  selected={activeId === car.id}
                  onSelect={() => handleSelect(car)}
                />
              ))}

              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="flex items-center justify-start gap-3 rounded-[12px] border border-dashed border-[#E5E7EB] bg-[#FFF5F5] px-4 py-3 transition hover:border-[var(--brand-secondary-color)]/40"
              >
                <div className="flex-1 text-start">
                  <p className="text-[11px] text-[#9CA3AF]">
                    {t("financeCalculator.step2.otherCars", "إختار سيارتك")}
                  </p>
                  <p className="text-[13px] font-bold text-[#111111]">
                    {t(
                      "financeCalculator.step2.chooseAnotherCar",
                      "إختار سيارة أخرى من سيارتنا",
                    )}
                  </p>
                </div>
                <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[8px] bg-[#FFE4E4]">
                  <Plus
                    size={18}
                    className="text-[var(--brand-secondary-color)]"
                  />
                </div>
              </button>
            </div>
          </div>
        )}

        <div className="mt-6 flex items-center gap-4">
          <button
            type="button"
            onClick={onBack}
            className="flex h-[52px] flex-1 items-center justify-center rounded-[8px] border border-[#D1D5DB] text-[15px] font-bold text-[#000000] transition hover:text-[var(--brand-secondary-color)]"
          >
            {t("financeCalculator.step2.backButton", "رجوع")}
          </button>
          <button
            type="button"
            onClick={() => {
              if (activeCar) {
                onCarSelect(activeCar);
                onNext();
              }
            }}
            disabled={!activeCar}
            className="flex h-[52px] flex-1 items-center justify-center gap-2 rounded-[8px] bg-[var(--brand-secondary-color)] text-[15px] font-bold text-white transition hover:bg-[#A91D24] disabled:opacity-40"
          >
            {t("financeCalculator.step2.nextButton", "التالي — الحاسبة")}
          </button>
        </div>
      </div>
    </>
  );
}
