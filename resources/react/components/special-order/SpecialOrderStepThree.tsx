import type { FormEvent } from "react";
import { useTranslation } from "react-i18next";

import { useLanguageStore } from "../../store/language.store";

import type {
  ISpecialOrderPersonalInfo,
  ISpecialOrderCarDetails,
} from "../../interfaces/ISpecialOrderTypes";

interface ISpecialOrderStepThreeProps {
  personal: ISpecialOrderPersonalInfo;
  car: ISpecialOrderCarDetails;
  onBack: () => void;
  onSubmit: () => void;
  submitting: boolean;

  // Optional if you move budget into Step 2
  budget?: string;
}

export default function SpecialOrderStepThree({
  personal,
  car,
  budget,
  onBack,
  onSubmit,
  submitting,
}: ISpecialOrderStepThreeProps) {
  const { t } = useTranslation();

  const direction = useLanguageStore(
    (state) => state.direction,
  );

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    onSubmit();
  };

  const rows = [
    {
      label: t(
        "specialOrder.step3.review.name",
        "الاسم",
      ),
      value: personal.fullName,
    },
    {
      label: t(
        "specialOrder.step3.review.phone",
        "الجوال",
      ),
      value: personal.phone,
    },
    {
      label: t(
        "specialOrder.step3.review.city",
        "المدينة",
      ),
      value: personal.city,
    },
    {
      label: t(
        "specialOrder.step3.review.brand",
        "العلامة",
      ),
      value: car.brand,
    },
    {
      label: t(
        "specialOrder.step3.review.model",
        "الطراز",
      ),
      value: car.model,
    },
    {
      label: t(
        "specialOrder.step3.review.color",
        "اللون",
      ),
      value: car.color,
    },
    {
      label: t(
        "specialOrder.step3.review.budget",
        "الميزانية",
      ),
      value: budget,
    },
    {
      label: t(
        "specialOrder.step3.review.year",
        "سنة الطراز",
      ),
      value: car.year,
    },
  ];

  return (
    <section
      dir={direction}
      className="w-full"
    >
      {/* Title */}
      <h2
        className={[
          "text-start",
          "text-[27px] font-extrabold",
          "leading-tight",
          "text-[#20283A]",
          "sm:text-[30px]",
        ].join(" ")}
      >
        {t(
          "specialOrder.step3.title",
          "مراجعة الطلب",
        )}
      </h2>

      <form
        onSubmit={handleSubmit}
        className="mt-8"
      >
        {/* Review card */}
        <div
          className={[
            "bg-white",
            "px-6 py-3",
            "shadow-[0_7px_20px_rgba(48,58,84,0.06)]",
            "sm:px-7",
          ].join(" ")}
        >
          {rows.map((row, index) => (
            <ReviewRow
              key={row.label}
              label={row.label}
              value={row.value}
              last={index === rows.length - 1}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="mt-7 grid grid-cols-[0.8fr_1.8fr] gap-3">
          <button
            type="button"
            onClick={onBack}
            className={[
              "flex h-[52px]",
              "items-center justify-center",
              "bg-white",
              "px-5",
              "text-[13px] font-medium",
              "text-[#303A54]",
              "shadow-[0_4px_14px_rgba(48,58,84,0.04)]",
              "transition duration-300",
              "hover:bg-[#FAFAF8]",
            ].join(" ")}
          >
            {t(
              "specialOrder.step3.edit",
              "تعديل",
            )}
          </button>

          <button
            type="submit"
            disabled={submitting}
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
              "disabled:opacity-50",
            ].join(" ")}
          >
            {submitting
              ? t(
                  "specialOrder.step3.submitting",
                  "جارٍ الإرسال...",
                )
              : t(
                  "specialOrder.step3.submit",
                  "إرسال الطلب",
                )}
          </button>
        </div>
      </form>
    </section>
  );
}

interface ReviewRowProps {
  label: string;
  value?: string | number | null;
  last?: boolean;
}

function ReviewRow({
  label,
  value,
  last = false,
}: ReviewRowProps) {
  const displayValue =
    value !== undefined &&
    value !== null &&
    String(value).trim()
      ? String(value)
      : "—";

  return (
    <div
      className={[
        "flex min-h-[48px]",
        "items-center justify-between",
        "gap-6",
        !last
          ? "border-b border-[#ECE8DF]"
          : "",
      ].join(" ")}
    >
      <span className="shrink-0 text-[11px] text-[#687084]">
        {label}
      </span>

      <span className="min-w-0 text-end text-[12px] font-medium text-[#20283A]">
        {displayValue}
      </span>
    </div>
  );
}