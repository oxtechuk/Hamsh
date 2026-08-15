import { useState } from "react";
import { Check, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

import CarSearchModal from "./CarSearchModal";
import StepTwoSkeleton from "./StepTwoSkeleton";
import LazyImg from "../LazyImg";

import {
  APP_IMAGES,
  getImageUrl,
} from "../../constants/app-images";

import { useLanguageStore } from "../../store/language.store";

import type { CarItem } from "../../types/home.types";
import type { IStepTwoCarSelectionProps } from "../../interfaces/IStepTwoCarSelectionProps";

export default function StepTwoCarSelection({
  cars,
  selectedCarId,
  onCarSelect,
  onNext,
  onBack,
  isLoading = false,
}: IStepTwoCarSelectionProps) {
  const { t } = useTranslation();

  const direction = useLanguageStore(
    (state) => state.direction,
  );

  const [activeId, setActiveId] =
    useState<number>(selectedCarId || 0);

  const [showModal, setShowModal] =
    useState(false);

  const activeCar =
    cars.find(
      (car) => car.id === activeId,
    ) ?? null;

  const handleSelect = (
    car: CarItem,
  ) => {
    setActiveId(car.id);
    onCarSelect(car);
  };

  if (isLoading) {
    return <StepTwoSkeleton />;
  }

  return (
    <>
      {showModal && (
        <CarSearchModal
          cars={cars}
          onSelect={(car) => {
            handleSelect(car);
            setShowModal(false);
          }}
          onClose={() =>
            setShowModal(false)
          }
        />
      )}

      <section
        dir={direction}
        className="w-full"
      >
        {/* Title */}
        <h2
          className={[
            "text-start",
            "text-[26px] font-extrabold",
            "leading-tight",
            "text-[#20283A]",
            "sm:text-[30px]",
          ].join(" ")}
        >
          {t(
            "financeCalculator.step2.chooseCarTitle",
            "اختر سيارتك",
          )}
        </h2>

        <p className="mt-4 text-start text-[12px] text-[#59647A]">
          {activeCar
            ? t(
                "financeCalculator.step2.selectedCar",
                "السيارة التي اخترتها",
              )
            : t(
                "financeCalculator.step2.selectCar",
                "اختر سيارتك",
              )}
        </p>

        {/* Selected / choose car */}
        <div className="mt-5">
          {activeCar ? (
            <SelectedCarRow
              car={activeCar}
              onClick={() =>
                setShowModal(true)
              }
            />
          ) : (
            <button
              type="button"
              onClick={() =>
                setShowModal(true)
              }
              className={[
                "flex min-h-[72px] w-full",
                "items-center justify-between gap-4",
                "border border-[#E7E0D4]",
                "bg-white px-5",
                "text-start",
                "shadow-[0_6px_18px_rgba(48,58,84,0.04)]",
                "transition duration-300",
                "hover:border-[var(--brand-primary-color)]",
              ].join(" ")}
            >
              <div>
                <p className="text-[11px] text-[#737C8E]">
                  {t(
                    "financeCalculator.step2.otherCars",
                    "إختر سيارتك",
                  )}
                </p>

                <p className="mt-1 text-[13px] font-bold text-[#20283A]">
                  {t(
                    "financeCalculator.step2.chooseAnotherCar",
                    "إختر سيارة أخرى من سياراتنا",
                  )}
                </p>
              </div>

              <span
                className={[
                  "flex h-[42px] w-[42px]",
                  "shrink-0 items-center justify-center",
                  "rounded-[6px]",
                  "bg-[var(--brand-primary-color)]/15",
                  "text-[var(--brand-primary-color)]",
                ].join(" ")}
              >
                <Plus
                  size={21}
                  strokeWidth={1.8}
                />
              </span>
            </button>
          )}
        </div>

        {/* Actions */}
        <div className="mt-7 grid grid-cols-[0.85fr_1.65fr] gap-3">
          <button
            type="button"
            onClick={onBack}
            className={[
              "flex h-[52px]",
              "items-center justify-center",
              "border border-[#D8D9DC]",
              "bg-white",
              "px-5",
              "text-[13px] font-medium",
              "text-[#303A54]",
              "transition duration-300",
              "hover:border-[#303A54]",
            ].join(" ")}
          >
            {t(
              "financeCalculator.step2.backButton",
              "السابق",
            )}
          </button>

          <button
            type="button"
            disabled={!activeCar}
            onClick={() => {
              if (!activeCar) {
                return;
              }

              onCarSelect(activeCar);
              onNext();
            }}
            className={[
              "flex h-[52px]",
              "items-center justify-center",
              "bg-[var(--brand-primary-color)]",
              "px-6",
              "text-[13px] font-bold",
              "text-[#20283A]",
              "transition duration-300",
              "hover:brightness-95",
              "disabled:cursor-not-allowed",
              "disabled:opacity-40",
            ].join(" ")}
          >
            {t(
              "financeCalculator.step2.nextButton",
              "التالي ←",
            )}
          </button>
        </div>
      </section>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Selected car                                                               */
/* -------------------------------------------------------------------------- */

interface SelectedCarRowProps {
  car: CarItem;
  onClick: () => void;
}

function SelectedCarRow({
  car,
  onClick,
}: SelectedCarRowProps) {
  const { i18n } = useTranslation();

  const image =
    getImageUrl(
      car.main_image,
    ) ||
    APP_IMAGES.CAR_PLACEHOLDER;

  const brand =
    typeof car.brand?.name ===
    "string"
      ? car.brand.name
      : "";

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex min-h-[78px] w-full",
        "items-center justify-between gap-4",
        "border border-[var(--brand-primary-color)]",
        "bg-white px-4 py-3",
        "text-start",
        "shadow-[0_6px_18px_rgba(48,58,84,0.04)]",
        "transition duration-300",
        "hover:bg-[#FCFAF5]",
      ].join(" ")}
    >
      {/* Car */}
      <div className="flex min-w-0 items-center gap-4">
        <LazyImg
          src={image}
          alt={car.name}
          className="h-[52px] w-[78px] shrink-0 object-cover"
        />

        <div className="min-w-0">
          <p className="truncate text-[13px] font-bold text-[#20283A]">
            {car.name}
          </p>

          <p className="mt-1 text-[10px] text-[#737C8E]">
            {brand}
            {car.year
              ? ` · ${car.year}`
              : ""}
          </p>
        </div>
      </div>

      {/* Price */}
      <div className="flex shrink-0 items-center gap-3">
        {car.current_price && (
          <span className="text-[13px] font-bold text-[var(--brand-primary-color)]">
            {car.current_price.toLocaleString(
              i18n.language,
            )}{" "}
            ر.س
          </span>
        )}

        <span
          className={[
            "flex h-[22px] w-[22px]",
            "items-center justify-center",
            "text-[var(--brand-primary-color)]",
          ].join(" ")}
        >
          <Check
            size={15}
            strokeWidth={2}
          />
        </span>
      </div>
    </button>
  );
}