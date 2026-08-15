import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { calculateFinance, submitCalculatorLead } from "../../services/api";

import { useLanguageStore } from "../../store/language.store";
import FinanceSliderStyles from "./FinanceSliderStyles";

import type { ICalculateData } from "../../interfaces/ICalculatorTypes";
import type { IStepTwoCalculatorProps } from "../../interfaces/IStepTwoCalculatorProps";

const TERM_OPTIONS = [24, 36, 48, 60, 72];

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

    const direction = useLanguageStore((state) => state.direction);

    const [calculation, setCalculation] = useState<ICalculateData | null>(null);

    const [isCalculating, setIsCalculating] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const carPrice = Number(selectedCar.price) || 0;

    const carId = Number(selectedCar.id) || 0;

    const downPayment = Math.round((carPrice * downPaymentPercent) / 100);

    const riyal = t("financeCalculator.step3.riyal", "ر.س");

    useEffect(() => {
        if (!carPrice || !carId) {
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
            .then((result) => {
                if (alive) {
                    setCalculation(result);
                }
            })
            .catch(() => {
                if (alive) {
                    setCalculation(null);
                }
            })
            .finally(() => {
                if (alive) {
                    setIsCalculating(false);
                }
            });

        return () => {
            alive = false;
        };
    }, [carPrice, carId, downPaymentPercent, term]);

    const monthlyPayment = calculation?.monthly_payment ?? 0;

    const financeAmount =
        calculation?.loan_amount ?? Math.max(carPrice - downPayment, 0);

    const annualRate = calculation?.annual_rate ?? 0;

    const handleSubmit = async () => {
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

                monthly_obligations: Number(personalInfo.obligations) || 0,

                salary: Number(personalInfo.salary) || 0,
            });

            toast.success(
                t(
                    "financeCalculator.step3.successToast",
                    "تم إرسال طلب التمويل بنجاح",
                ),
            );

            onSuccess();
        } catch {
            toast.error(
                t(
                    "financeCalculator.step3.errorToast",
                    "تعذر إرسال طلب التمويل",
                ),
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section dir={direction} className="w-full">
            <FinanceSliderStyles direction={direction} />

            {/* Title */}
            <h2
                className={[
                    "text-start",
                    "text-[27px] font-extrabold",
                    "leading-tight",
                    "text-[#20283A]",
                    "sm:text-[31px]",
                ].join(" ")}
            >
                {t("financeCalculator.step3.title", "حساب القسط")}
            </h2>

            {/* Down payment */}
            <div className="mt-10">
                <div className="mb-3 flex items-center justify-between gap-4 text-[11px]">
                    <span className="font-medium text-[#303A54]">
                        {t(
                            "financeCalculator.step3.downPayment",
                            "الدفعة الأولى",
                        )}
                    </span>

                    <span className="font-bold text-[var(--brand-primary-color)]">
                        {downPayment.toLocaleString()} {riyal}
                    </span>
                </div>

                <div dir="ltr">
                    <input
                        type="range"
                        min={10}
                        max={40}
                        step={1}
                        value={downPaymentPercent}
                        onChange={(event) =>
                            setDownPaymentPercent(Number(event.target.value))
                        }
                        className="finance-slider w-full"
                    />
                </div>

                <div
                    dir="ltr"
                    className="mt-2 flex items-center justify-between text-[9px] text-[#8B909C]"
                >
                    <span>10%</span>
                    <span>40%</span>
                </div>
            </div>

            {/* Term */}
            <div className="mt-7">
                <p className="mb-4 text-start text-[11px] font-medium text-[#303A54]">
                    {t("financeCalculator.step3.financeTerm", "مدة التمويل")}
                </p>

                <div className="grid grid-cols-5 gap-3">
                    {TERM_OPTIONS.map((option) => {
                        const isActive = option === term;

                        return (
                            <button
                                key={option}
                                type="button"
                                onClick={() => setTerm(option)}
                                className={[
                                    "flex h-[44px]",
                                    "items-center justify-center",
                                    "border px-3",
                                    "text-[11px] font-medium",
                                    "transition duration-300",
                                    isActive
                                        ? [
                                              "border-[var(--brand-primary-color)]",
                                              "bg-[var(--brand-primary-color)]",
                                              "font-bold text-[#20283A]",
                                          ].join(" ")
                                        : [
                                              "border-[#E1E2E5]",
                                              "bg-white",
                                              "text-[#59647A]",
                                              "hover:border-[var(--brand-primary-color)]",
                                          ].join(" "),
                                ].join(" ")}
                            >
                                {option}{" "}
                                {t("financeCalculator.step3.month", "شهر")}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Monthly result */}
            <div
                className={[
                    "mt-7 bg-white",
                    "px-6 py-7",
                    "shadow-[0_8px_22px_rgba(48,58,84,0.07)]",
                ].join(" ")}
            >
                <div className="text-center">
                    <p className="text-[11px] text-[#7B8291]">
                        {t(
                            "financeCalculator.step3.monthlyPayment",
                            "القسط الشهري التقريبي",
                        )}
                    </p>

                    <div className="mt-3">
                        {isCalculating ? (
                            <div className="mx-auto h-[46px] w-[150px] animate-pulse bg-[#F2EEE5]" />
                        ) : (
                            <>
                                <strong className="text-[42px] font-extrabold leading-none text-[#20283A] sm:text-[48px]">
                                    {monthlyPayment > 0
                                        ? monthlyPayment.toLocaleString()
                                        : "—"}
                                </strong>

                                <span className="ms-2 text-[13px] font-medium text-[var(--brand-primary-color)]">
                                    {riyal} / شهر
                                </span>
                            </>
                        )}
                    </div>
                </div>

                {/* Divider */}
                <div className="my-6 h-px w-full bg-[#ECE7DD]" />

                {/* Breakdown */}
                <div className="grid grid-cols-3 divide-x divide-x-reverse divide-[#ECE7DD]">
                    <SummaryItem
                        label={t(
                            "financeCalculator.step3.carPrice",
                            "سعر السيارة",
                        )}
                        value={`${carPrice.toLocaleString()} ${riyal}`}
                    />

                    <SummaryItem
                        label={t(
                            "financeCalculator.step3.downPaymentAmount",
                            "مبلغ الدفعة",
                        )}
                        value={`${downPayment.toLocaleString()} ${riyal}`}
                    />

                    <SummaryItem
                        label={t("financeCalculator.step3.term", "مدة التمويل")}
                        value={`${term} شهر`}
                    />
                </div>

                {(financeAmount > 0 || annualRate > 0) && (
                    <div className="mt-6 grid grid-cols-2 gap-4 border-t border-[#ECE7DD] pt-5">
                        <div className="text-center">
                            <p className="text-[10px] text-[#8B909C]">
                                {t(
                                    "financeCalculator.step3.financeAmount",
                                    "مبلغ التمويل",
                                )}
                            </p>

                            <p className="mt-1 text-[12px] font-bold text-[#303A54]">
                                {financeAmount.toLocaleString()} {riyal}
                            </p>
                        </div>

                        <div className="text-center">
                            <p className="text-[10px] text-[#8B909C]">
                                {t(
                                    "financeCalculator.step3.annualRate",
                                    "النسبة السنوية",
                                )}
                            </p>

                            <p className="mt-1 text-[12px] font-bold text-[#303A54]">
                                {annualRate ? `${annualRate}%` : "—"}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="mt-6 grid grid-cols-[0.8fr_1.8fr] gap-3">
                <button
                    type="button"
                    onClick={onBack}
                    className={[
                        "flex h-[52px]",
                        "items-center justify-center",
                        "border border-[#D8D9DC]",
                        "bg-white px-5",
                        "text-[13px] font-medium",
                        "text-[#303A54]",
                        "transition duration-300",
                        "hover:border-[#303A54]",
                    ].join(" ")}
                >
                    {t("financeCalculator.step3.backButton", "السابق")}
                </button>

                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting || isCalculating}
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
                    {isSubmitting
                        ? t(
                              "financeCalculator.step3.submitting",
                              "جارٍ الإرسال...",
                          )
                        : t(
                              "financeCalculator.step3.submitLead",
                              "اطلب التمويل الآن",
                          )}
                </button>
            </div>
        </section>
    );
}

interface SummaryItemProps {
    label: string;
    value: string;
}

function SummaryItem({ label, value }: SummaryItemProps) {
    return (
        <div className="px-3 text-center">
            <p className="text-[9px] text-[#8B909C]">{label}</p>

            <p className="mt-2 text-[11px] font-bold text-[#303A54]">{value}</p>
        </div>
    );
}
