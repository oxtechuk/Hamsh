import { useTranslation } from "react-i18next";
import { Check } from "lucide-react";

import type { ICarOrderSuccessProps } from "../../interfaces/ICarOrderSuccessProps";

export default function CarOrderSuccess({
    fullName,
    carLabel,
    onClose,
}: ICarOrderSuccessProps) {
    const { t } = useTranslation();

    return (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 py-10 text-center">
            <span className="flex h-[64px] w-[64px] items-center justify-center rounded-full bg-[var(--brand-primary-color)] text-[#20283A]">
                <Check size={30} strokeWidth={2.5} />
            </span>
            <h3 className="mt-2 text-[22px] font-extrabold text-[#20283A]">
                {t("carDetails.modal.successTitle")}
            </h3>
            <p className="max-w-[360px] text-[13px] leading-6 text-[#8B909C]">
                {t("carDetails.modal.successDescription", {
                    name: fullName,
                    carLabel,
                })}
            </p>
            <button
                type="button"
                onClick={onClose}
                className="mt-4 flex h-[48px] items-center justify-center bg-[#20283A] px-10 text-[13px] font-bold text-white transition duration-300 hover:brightness-110"
            >
                {t("carDetails.modal.closeButton")}
            </button>
        </div>
    );
}
