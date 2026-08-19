import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import LazyImg from "../LazyImg";
import { fmt } from "../../utils/format";
import type { ISelectedCar } from "../../interfaces/ISelectedCar";
import type { IStepperStep } from "../../interfaces/IStepperProps";

interface ICalculatorSidebarProps {
    step: IStepperStep;
    selectedCarData: {
        image: string;
        name: string;
        brand: string;
        price: number;
    } | null;
}

export default function CalculatorSidebar({
    step,
    selectedCarData,
}: ICalculatorSidebarProps) {
    const { t } = useTranslation();

    const sidebarSteps = [
        { number: 1, label: t("financeCalculator.step1.stepperLabel") },
        { number: 2, label: t("financeCalculator.step2.stepperLabel") },
        { number: 3, label: t("financeCalculator.step3.stepperLabel") },
    ];

    return (
        <aside className="w-full shrink-0 lg:w-2/5">
            <div className="sticky top-6">
                <div className="overflow-hidden  bg-white shadow-sm">
                    <div className="px-5 py-5">
                        <p className="mb-4 text-[12px] font-semibold text-[var(--brand-primary-color)]">
                            {t("financeCalculator.badge")}
                        </p>
                        <ul className="space-y-3">
                            {sidebarSteps.map((s) => {
                                const isDone = (step as number) > s.number;
                                const isActive = (step as number) === s.number;
                                return (
                                    <li
                                        key={s.number}
                                        className="flex items-center justify-start gap-3"
                                    >
                                        <span
                                            className={[
                                                "flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[6px] text-[12px] font-bold",
                                                isDone
                                                    ? "bg-[var(--brand-primary-color)] text-white"
                                                    : isActive
                                                      ? "border-2 border-[var(--brand-primary-color)] bg-[var(--brand-primary-color)]/10 text-[var(--brand-primary-color)]"
                                                      : "bg-[#F3F4F6] text-[#9CA3AF]",
                                            ].join(" ")}
                                        >
                                            {isDone ? (
                                                <Check
                                                    size={14}
                                                    strokeWidth={3}
                                                />
                                            ) : (
                                                String(s.number).padStart(
                                                    2,
                                                    "0",
                                                )
                                            )}
                                        </span>

                                        <span
                                            className={[
                                                "text-[14px] font-semibold",
                                                isActive
                                                    ? "text-[#111111]"
                                                    : isDone
                                                      ? "text-[#111111]"
                                                      : "text-[#9CA3AF]",
                                            ].join(" ")}
                                        >
                                            {s.label}
                                        </span>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    {selectedCarData && (
                        <>
                            <div className="border-t border-[#F3F4F6]" />
                            <div className="px-4 py-4">
                                <div className="mx-auto h-[357.2px] w-[354.08px] max-w-full bg-[#F5F2EC]! overflow-hidden rounded-[12px] border border-[#F3F4F6]">
                                    <div className="h-[180px] w-full">
                                        <LazyImg
                                            src={selectedCarData.image}
                                            alt={selectedCarData.name}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <div className="px-4 py-3">
                                        <p className="text-[12px] text-[var(--brand-primary-color)]">
                                            {selectedCarData.brand}
                                        </p>
                                        <p className="text-[15px] font-extrabold text-[#111111]">
                                            {selectedCarData.name}
                                        </p>
                                        {(step as number) === 3 &&
                                            selectedCarData.price > 0 && (
                                                <div className="mt-2">
                                                    <p className="text-[11px] text-[#9CA3AF]">
                                                        {t(
                                                            "financeCalculator.sidebar.estimatedInstallment",
                                                        )}
                                                    </p>
                                                    <p className="text-[18px] font-extrabold text-[#111111]">
                                                        {fmt(
                                                            selectedCarData.price,
                                                        )}
                                                    </p>
                                                    <p className="text-[11px] text-[#9CA3AF]">
                                                        {t(
                                                            "financeCalculator.sidebar.riyalPerMonth",
                                                        )}
                                                    </p>
                                                </div>
                                            )}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </aside>
    );
}
