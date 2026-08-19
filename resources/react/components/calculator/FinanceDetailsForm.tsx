import { useMemo, type CSSProperties } from "react";
import { useTranslation } from "react-i18next";
import { TERM_OPTIONS } from "../../constants/calculator.constants";
import { useLanguageStore } from "../../store/language.store";
import LazyImg from "../LazyImg";
import { fmt } from "../../utils/format";
import type { IFinanceDetailsFormProps } from "../../interfaces/IFinanceDetailsFormProps";

const DOWN_PAYMENT_MIN = 10;
const DOWN_PAYMENT_MAX = 40;

const fieldCls = [
  "h-[48px] w-full",
  "rounded-[8px] border border-[#E5E7EB]",
  "bg-[#F9FAFB] px-4",
  "text-[14px] text-[#111111]",
  "outline-none placeholder:text-[#9CA3AF]",
  "transition focus:border-[var(--brand-primary-color)] focus:ring-2 focus:ring-[var(--brand-primary-color)]/10",
].join(" ");

export default function FinanceDetailsForm({
  selectedCar,
  carPrice,
  downPaymentPercent,
  setDownPaymentPercent,
  term,
  setTerm,
  monthlyIncome,
  setMonthlyIncome,
  monthlyObligations,
  setMonthlyObligations,
  riyal,
}: IFinanceDetailsFormProps) {
  const { t } = useTranslation();
  const direction = useLanguageStore((s) => s.direction);

  const isRtl = direction === "rtl";
  const downPayment = Math.round((carPrice * downPaymentPercent) / 100);

  const sliderProgress = useMemo(
    () =>
      ((downPaymentPercent - DOWN_PAYMENT_MIN) /
        (DOWN_PAYMENT_MAX - DOWN_PAYMENT_MIN)) *
      100,
    [downPaymentPercent],
  );

  return (
    <div className="rounded-[16px] border border-[#E7E7E7] bg-white px-6 py-7 shadow-sm">
      <h2 className="text-start text-[22px] font-extrabold text-[#111111]">
        {t("financeCalculator.step3.financeDetails")}
      </h2>

      <div className="mt-4 flex items-center gap-3 rounded-[10px] bg-[#EFEFEF] px-4 py-3">
        <div className="h-[52px] w-[76px] shrink-0 overflow-hidden rounded-[8px] bg-white">
          <LazyImg
            src={selectedCar.image}
            alt={`${selectedCar.name}`}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="min-w-0 flex-1 text-start">
          <p className="truncate text-[14px] font-extrabold text-[#111111]">
            {selectedCar.name}
          </p>
          <p className="text-[12px] font-bold text-[var(--brand-primary-color)]">
            {fmt(carPrice)} {riyal}
          </p>
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between text-[13px]">
          <span className="font-bold text-[#111111]">
            {t("financeCalculator.step3.downPayment")}
          </span>
          <strong className="text-[var(--brand-primary-color)]">
            {downPaymentPercent}% — {fmt(downPayment)} {riyal}
          </strong>
        </div>
        <input
          type="range"
          min={DOWN_PAYMENT_MIN}
          max={DOWN_PAYMENT_MAX}
          step={1}
          value={downPaymentPercent}
          onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
          className={`finance-slider${isRtl ? " finance-slider--rtl" : ""}`}
          style={{ "--slider-progress": `${sliderProgress}%` } as CSSProperties}
        />
        <div className="mt-1 flex justify-between text-[10px] text-[#AAAAAA]">
          <span>{isRtl ? DOWN_PAYMENT_MAX : DOWN_PAYMENT_MIN}%</span>
          <span>{isRtl ? DOWN_PAYMENT_MIN : DOWN_PAYMENT_MAX}%</span>
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between text-[13px]">
          <span className="font-bold text-[#111111]">
            {t("financeCalculator.step3.financeTerm")}
          </span>
          <strong className="text-[var(--brand-primary-color)] font-extrabold">
            {term / 12} {t("financeCalculator.step3.years")} ({term}{" "}
            {t("financeCalculator.step3.months")})
          </strong>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {TERM_OPTIONS.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setTerm(opt)}
              className={[
                "flex h-[42px] items-center justify-center rounded-[6px] border text-[13px] font-bold transition",
                term === opt
                  ? "border-[var(--brand-primary-color)] bg-[var(--brand-primary-color)] text-white"
                  : "border-[#E7E7E7] bg-white text-[#8A8A8A] hover:border-[var(--brand-primary-color)] hover:text-[var(--brand-primary-color)]",
              ].join(" ")}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <label className="mb-1.5 block text-start text-[13px] font-bold text-[#111111]">
          {t("financeCalculator.step3.monthlyIncome")}
          <span className="ms-1">*</span>
        </label>
        <input
          type="number"
          min={0}
          value={monthlyIncome}
          onChange={(e) => setMonthlyIncome(e.target.value)}
          placeholder={t("financeCalculator.step3.monthlyIncomePlaceholder")}
          inputMode="numeric"
          dir="ltr"
          className={`${fieldCls} text-end`}
        />
      </div>

      <div className="mt-4">
        <label className="mb-1.5 block text-start text-[13px] font-bold text-[#111111]">
          {t("financeCalculator.step3.monthlyObligations")}
          <span className="ms-1 ">*</span>
        </label>
        <input
          type="number"
          min={0}
          value={monthlyObligations}
          onChange={(e) => setMonthlyObligations(e.target.value)}
          placeholder={t("financeCalculator.step3.monthlyObligationsPlaceholder")}
          inputMode="numeric"
          dir="ltr"
          className={`${fieldCls} text-end`}
        />
      </div>
    </div>
  );
}
