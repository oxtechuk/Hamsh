import { useEffect, useState } from "react";
import { Send } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { calculateFinance, submitCalculatorLead } from "../../services/api";
import { useLanguageStore } from "../../store/language.store";
import FinanceSliderStyles from "./FinanceSliderStyles";
import FinanceSummaryCard from "./FinanceSummaryCard";
import FinanceDetailsForm from "./FinanceDetailsForm";

import type { ICalculateData } from "../../interfaces/ICalculatorTypes";
import type { IStepTwoCalculatorProps } from "../../interfaces/IStepTwoCalculatorProps";

export default function StepThreeCalculator({
  selectedCar,
  downPaymentPercent,
  setDownPaymentPercent,
  term,
  setTerm,
  personalInfo,
  onBack,
  onSuccess,
}: IStepTwoCalculatorProps) {
  const { t } = useTranslation();
  const direction = useLanguageStore((s) => s.direction);

  const [calculation, setCalculation] = useState<ICalculateData | null>(null);
  const [monthlyIncome, setMonthlyIncome] = useState(personalInfo.salary ?? "");
  const [monthlyObligations, setMonthlyObligations] = useState(
    personalInfo.obligations ?? "",
  );
  const [isCalculating, setIsCalculating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const carPrice = Number(selectedCar.price) || 0;
  const carId = Number(selectedCar.id) || 0;
  const downPayment = Math.round((carPrice * downPaymentPercent) / 100);
  const riyal = t("financeCalculator.step3.riyal", "ر.س");

  useEffect(() => {
    if (!carPrice) {
      setCalculation(null);
      return;
    }
    let alive = true;
    setIsCalculating(true);
    calculateFinance({
      car_id: carId,
      down_payment_percentage: downPaymentPercent,
      period_months: term,
    })
      .then((r) => {
        if (alive) setCalculation(r);
      })
      .catch(() => {
        if (alive) setCalculation(null);
      })
      .finally(() => {
        if (alive) setIsCalculating(false);
      });
    return () => {
      alive = false;
    };
  }, [carPrice, carId, downPaymentPercent, term]);

  const monthlyPayment = calculation?.monthly_payment ?? 0;
  const totalPayment = calculation?.total_payment ?? 0;
  const financeAmount =
    calculation?.loan_amount ?? Math.max(carPrice - downPayment, 0);
  const totalInterest = calculation?.total_interest ?? 0;
  const annualRate = calculation?.annual_rate ?? 0;

  const handleSubmit = async () => {
    if (!monthlyIncome.trim() || !monthlyObligations.trim()) {
      toast.error(
        t(
          "financeCalculator.validation.fillRequired",
          "يرجى تعبئة جميع الحقول المطلوبة",
        ),
      );
      return;
    }
    setIsSubmitting(true);
    try {
      await submitCalculatorLead({
        name: personalInfo.fullName,
        phone: personalInfo.phone,
        email: personalInfo.email,
        city: personalInfo.city,
        purpose: personalInfo.purpose,
        car_ids: [carId],
        notes: personalInfo.message,
        monthly_obligations: Number(monthlyObligations) || 0,
        salary: Number(monthlyIncome) || 0,
      });
      toast.success(
        t("financeCalculator.step3.successToast", "تم إرسال طلب التمويل بنجاح"),
      );
      onSuccess();
    } catch {
      toast.error(
        t("financeCalculator.step3.errorToast", "تعذر إرسال طلب التمويل"),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section dir={direction} className="mx-auto w-full max-w-[900px]">
      <FinanceSliderStyles direction={direction} />

      <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-2">
        <FinanceDetailsForm
          selectedCar={selectedCar}
          carPrice={carPrice}
          downPaymentPercent={downPaymentPercent}
          setDownPaymentPercent={setDownPaymentPercent}
          term={term}
          setTerm={setTerm}
          monthlyIncome={monthlyIncome}
          setMonthlyIncome={setMonthlyIncome}
          monthlyObligations={monthlyObligations}
          setMonthlyObligations={setMonthlyObligations}
          riyal={riyal}
        />
        <FinanceSummaryCard
          carPrice={carPrice}
          downPayment={downPayment}
          financeAmount={financeAmount}
          term={term}
          annualRate={annualRate}
          monthlyPayment={monthlyPayment}
          isCalculating={isCalculating}
          totalPayment={totalPayment}
          totalInterest={totalInterest}
          riyal={riyal}
        />
      </div>

      <div className="mt-5 flex items-center gap-4">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting || isCalculating}
          className="flex h-[52px] flex-1 items-center justify-center gap-2 rounded-[8px] bg-[#C5232B] text-[15px] font-bold text-white transition hover:bg-[#A91D24] disabled:opacity-50"
        >
          <Send
            size={16}
            className={direction === "rtl" ? "-rotate-45" : "rotate-45"}
          />
          {isSubmitting
            ? t("financeCalculator.step3.submitting", "جارٍ الإرسال...")
            : t("financeCalculator.step3.submitLead", "تقديم طلب التمويل")}
        </button>
        <button
          type="button"
          onClick={onBack}
          className="flex h-[52px] flex-1 items-center justify-center rounded-[8px] border border-[#374151] text-[15px] font-semibold text-[#374151] transition hover:border-[#C5232B] hover:text-[#C5232B]"
        >
          {t("financeCalculator.step3.backButton", "رجوع")}
        </button>
      </div>
    </section>
  );
}
