import { useTranslation } from "react-i18next";
import DarkSummaryRow from "./DarkSummaryRow";
import { fmt } from "../../utils/format";

interface IFinanceSummaryCardProps {
  carPrice: number;
  downPayment: number;
  financeAmount: number;
  term: number;
  annualRate: number;
  monthlyPayment: number;
  isCalculating: boolean;
  totalPayment: number;
  totalInterest: number;
  riyal: string;
}

export default function FinanceSummaryCard({
  carPrice,
  downPayment,
  financeAmount,
  term,
  annualRate,
  monthlyPayment,
  isCalculating,
  totalPayment,
  totalInterest,
  riyal,
}: IFinanceSummaryCardProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col rounded-[16px] bg-[#0D0D0D] px-6 py-7 text-white shadow-[0_12px_32px_rgba(4,6,9,0.18)]">
      <h2 className="text-start text-[18px] font-bold text-white">
        {t("financeCalculator.step3.summaryTitle", "ملخص التمويل")}
      </h2>

      <div className="mt-4 divide-y divide-white/10">
        <DarkSummaryRow label={t("financeCalculator.step3.carPrice", "سعر السيارة")} value={`${fmt(carPrice)} ${riyal}`} />
        <DarkSummaryRow label={t("financeCalculator.step3.downPayment", "الدفعة الأولى")} value={`${fmt(downPayment)} ${riyal}`} />
        <DarkSummaryRow label={t("financeCalculator.step3.financeAmount", "مبلغ التمويل")} value={`${fmt(financeAmount)} ${riyal}`} />
        <DarkSummaryRow label={t("financeCalculator.step3.paymentPeriod", "مدة السداد")} value={`${term} ${t("financeCalculator.step3.months", "شهرًا")}`} />
        <DarkSummaryRow label={t("financeCalculator.step3.annualRate", "نسبة الفائدة التقريبية")} value={annualRate ? `${annualRate}%` : "—"} />
      </div>

      <div className="mt-5 rounded-[12px] bg-[#3A1114] px-5 py-6 text-center">
        <p className="text-[13px] text-white/55">
          {t("financeCalculator.step3.estimatedMonthlyPayment", "القسط الشهري التقريبي")}
        </p>
        <p className="mt-2 text-[42px] font-extrabold leading-none text-white">
          {isCalculating ? "..." : monthlyPayment > 0 ? fmt(monthlyPayment) : "—"}
        </p>
        <p className="mt-2 text-[12px] text-white/60">
          {t("financeCalculator.step3.riyalPerMonth", "ريال سعودي / شهر")}
        </p>
      </div>

      {(totalPayment > 0 || totalInterest > 0) && (
        <div className="mt-3 space-y-2 border-t border-white/10 pt-3">
          {totalPayment > 0 && (
            <div className="flex justify-between text-[11px] text-white/40">
              <span>{fmt(totalPayment)} {riyal}</span>
              <span>{t("financeCalculator.step3.totalPayment", "إجمالي السداد")}</span>
            </div>
          )}
          {totalInterest > 0 && (
            <div className="flex justify-between text-[11px] text-white/40">
              <span>{fmt(totalInterest)} {riyal}</span>
              <span>{t("financeCalculator.step3.totalInterest", "إجمالي الفائدة")}</span>
            </div>
          )}
        </div>
      )}

      <p className="mt-auto pt-4 text-center text-[11px] leading-6 text-white/35">
        {t("financeCalculator.step3.disclaimer", "* الأرقام تقريبية — سيتم التأكيد من فريق التمويل")}
      </p>
    </div>
  );
}
