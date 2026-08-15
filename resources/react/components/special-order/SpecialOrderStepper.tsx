import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";

import type { ISpecialOrderStep } from "../../interfaces/ISpecialOrderTypes";

interface SpecialOrderStepperProps {
    activeStep: ISpecialOrderStep;
}

export default function SpecialOrderStepper({
    activeStep,
}: SpecialOrderStepperProps) {
    const { t } = useTranslation();

    const steps = [
        {
            number: 1,
            label: t("specialOrder.stepper.personal", "بياناتك الشخصية"),
        },
        {
            number: 2,
            label: t("specialOrder.stepper.car", "تفاصيل السيارة"),
        },
        {
            number: 3,
            label: t("specialOrder.stepper.budget", "حساب القسط"),
        },
    ];

    return (
        <div className="w-full">
            {/* Small heading */}
            <p className="mb-8 text-start text-[11px] font-medium text-[var(--brand-primary-color)]">
                {t("specialOrder.stepper.title", "سيارة على كيفك")}
            </p>

            <ul className="space-y-5">
                {steps.map((item) => {
                    const isCompleted = activeStep > item.number;

                    const isActive = activeStep === item.number;

                    return (
                        <li
                            key={item.number}
                            className="flex items-center justify-between gap-5"
                        >
                            {/* Label */}
                            <span
                                className={[
                                    "text-[12px]",
                                    isActive
                                        ? "font-bold text-[#20283A]"
                                        : isCompleted
                                          ? "font-medium text-[#20283A]"
                                          : "text-[#697083]",
                                ].join(" ")}
                            >
                                {item.label}
                            </span>

                            {/* Number / check */}
                            <span
                                className={[
                                    "flex h-[32px] w-[32px]",
                                    "shrink-0 items-center justify-center",
                                    "border text-[11px]",
                                    "transition duration-300",
                                    isCompleted
                                        ? [
                                              "border-[var(--brand-primary-color)]",
                                              "bg-[var(--brand-primary-color)]",
                                              "text-[#20283A]",
                                          ].join(" ")
                                        : isActive
                                          ? [
                                                "border-[var(--brand-primary-color)]",
                                                "bg-white",
                                                "font-bold",
                                                "text-[var(--brand-primary-color)]",
                                            ].join(" ")
                                          : [
                                                "border-[#E2E4E8]",
                                                "bg-white",
                                                "text-[#59647A]",
                                            ].join(" "),
                                ].join(" ")}
                            >
                                {isCompleted ? (
                                    <Check size={14} strokeWidth={2.3} />
                                ) : (
                                    String(item.number).padStart(2, "0")
                                )}
                            </span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
