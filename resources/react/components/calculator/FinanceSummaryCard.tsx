import { useTranslation } from "react-i18next";
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

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2.5 text-[13px]">
      <span className="text-[#6B7280]">{label}</span>
      <span className="font-bold text-[#111111]">{value}</span>
    </div>
  );
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
    <div className="flex flex-col rounded-[16px] border border-[#E7E7E7] bg-white px-6 py-7 shadow-sm">
      <h2 className="text-start text-[18px] font-bold text-[#111111]">
        {t("financeCalculator.step3.summaryTitle", "ملخص التمويل")}
      </h2>

      {/* Monthly payment highlight */}
      <div className="mt-5 rounded-[12px] bg-[#F5F4EF] px-5 py-6 text-center">
        <p className="text-[13px] text-[#9CA3AF]">
          {t("financeCalculator.step3.estimatedMonthlyPayment", "القسط الشهري التقريبي")}
        </p>
        <p className="mt-2 text-[42px] font-extrabold leading-none text-[#111111]">
          {isCalculating ? "..." : monthlyPayment > 0 ? fmt(monthlyPayment) : "—"}
        </p>
        <p className="mt-2 text-[12px] font-medium text-[var(--brand-primary-color)]">
          {t("financeCalculator.step3.riyalPerMonth", "ريال / شهر")}
        </p>
      </div>

      <div className="mt-4 divide-y divide-[#F3F4F6]">
        <SummaryRow label={t("financeCalculator.step3.carPrice", "سعر السيارة")} value={`${fmt(carPrice)} ${riyal}`} />
        <SummaryRow label={t("financeCalculator.step3.downPayment", "الدفعة الأولى")} value={`${fmt(downPayment)} ${riyal}`} />
        <SummaryRow label={t("financeCalculator.step3.financeAmount", "مبلغ التمويل")} value={`${fmt(financeAmount)} ${riyal}`} />
        <SummaryRow label={t("financeCalculator.step3.paymentPeriod", "مدة السداد")} value={`${term} ${t("financeCalculator.step3.months", "شهرًا")}`} />
        {annualRate > 0 && (
          <SummaryRow label={t("financeCalculator.step3.annualRate", "نسبة الفائدة التقريبية")} value={`${annualRate}%`} />
        )}
        {totalPayment > 0 && (
          <SummaryRow label={t("financeCalculator.step3.totalPayment", "إجمالي السداد")} value={`${fmt(totalPayment)} ${riyal}`} />
        )}
        {totalInterest > 0 && (
          <SummaryRow label={t("financeCalculator.step3.totalInterest", "إجمالي الفائدة")} value={`${fmt(totalInterest)} ${riyal}`} />
        )}
      </div>

      <p className="mt-auto pt-4 text-center text-[11px] leading-6 text-[#9CA3AF]">
        {t("financeCalculator.step3.disclaimer", "* الأرقام تقريبية — سيتم التأكيد من فريق التمويل")}
      </p>
    </div>
  );
}
