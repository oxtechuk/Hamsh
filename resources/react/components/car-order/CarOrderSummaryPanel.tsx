import { useTranslation } from "react-i18next";
import { Check } from "lucide-react";

import LazyImg from "../LazyImg";
import { formatPrice } from "../../utils/format";
import { localize } from "../../utils/localize";

import type { ICarOrderSummaryPanelProps } from "../../interfaces/ICarOrderSummaryPanelProps";

export default function CarOrderSummaryPanel({
    car,
    step,
    done,
    steps,
}: ICarOrderSummaryPanelProps) {
    const { t, i18n } = useTranslation();

    return (
        <div className="order-1 flex flex-col gap-5 bg-[#1A1F2E] p-6 lg:p-8">
            <p className="text-[13px] font-bold text-[#DDBB72]">
                {t("carDetails.modal.title")}
            </p>

            <div className="h-[150px] w-[272px] overflow-hidden">
                <LazyImg
                    src={car.main_image}
                    alt={localize(car.name, i18n.language)}
                    className="h-full w-full object-cover"
                />
            </div>

            <div>
                <p className="text-[12px] text-[var(--brand-primary-color)]">
                    {localize(car.brand?.name, i18n.language)}
                </p>
                <p className="mt-1 text-[19px] font-extrabold text-white">
                    {localize(car.name, i18n.language)}
                </p>
            </div>

            <div className="flex items-baseline justify-between gap-3 border-t border-white/10 pt-4">
                <p className="text-[12px] text-white/60">
                    {t("carDetails.hero.installmentFrom")}
                </p>
                <p className="text-[22px] font-extrabold text-white">
                    {formatPrice(
                        car.min_installment,
                        "var(--brand-primary-color)",
                        i18n.language,
                    )}
                </p>
            </div>

            <ul className="mt-auto flex flex-col gap-4 pt-5">
                {steps.map((item) => {
                    const isActive = step === item.number;
                    const isDone = step > item.number || done;
                    const Icon = item.icon;

                    return (
                        <li
                            key={item.number}
                            className="flex items-center justify-start gap-3"
                        >
                            <span
                                className={[
                                    "flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-full",
                                    isActive || isDone
                                        ? "bg-[var(--brand-primary-color)] text-[#20283A]"
                                        : "bg-white/10 text-white/50",
                                ].join(" ")}
                            >
                                {isDone ? (
                                    <Check size={16} strokeWidth={2.5} />
                                ) : (
                                    <Icon size={16} strokeWidth={2} />
                                )}
                            </span>

                            <span
                                className={[
                                    "text-[14px] font-bold!",
                                    isActive || isDone
                                        ? "text-white"
                                        : "text-white/50",
                                ].join(" ")}
                            >
                                {item.label}
                            </span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
