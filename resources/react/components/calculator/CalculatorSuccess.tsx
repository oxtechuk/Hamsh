import { Check } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useLanguageStore } from "../../store/language.store";
import { useSettingsStore } from "../../store/settings.store";
import type { ICalculatorSuccessProps } from "../../interfaces/ICalculatorSuccessProps";

interface CalculatorSuccessProps extends ICalculatorSuccessProps {
    requestNumber?: string;
}

export default function CalculatorSuccess({
    carLabel,
    clientPhone,
    requestNumber = "TF-7956",
}: CalculatorSuccessProps) {
    const { t } = useTranslation();

    const direction = useLanguageStore((state) => state.direction);

    const settings = useSettingsStore((state) => state.settings);

    const navigate = useNavigate();

    const whatsappNum = settings?.contact?.whatsapp?.replace(/\D/g, "") ?? "";

    const whatsappMessage = encodeURIComponent(
        t("financeCalculator.success.whatsappMessage", {
            carLabel,
            requestNumber,
            defaultValue:
                "مرحباً، أرسلت طلب تمويل رقم {{requestNumber}} لسيارة {{carLabel}} وأرغب في متابعة الطلب.",
        }),
    );

    const whatsappHref = whatsappNum
        ? `https://wa.me/${whatsappNum}?text=${whatsappMessage}`
        : "#";

    return (
        <section
            dir={direction}
            className="mx-auto flex w-full max-w-[560px] flex-col items-center px-4 py-8 text-center sm:py-12"
        >
            {/* Success icon */}
            <div
                className={[
                    "flex h-[72px] w-[72px]",
                    "items-center justify-center",
                    "border border-[var(--brand-primary-color)]/35",
                    "bg-[var(--brand-primary-color)]/[0.04]",
                ].join(" ")}
            >
                <Check
                    size={34}
                    strokeWidth={1.7}
                    className="text-[var(--brand-primary-color)]"
                />
            </div>

            {/* Title */}
            <h1
                className={[
                    "mt-8",
                    "text-[31px] font-extrabold",
                    "leading-tight text-[#20283A]",
                    "sm:text-[36px]",
                ].join(" ")}
            >
                {t("financeCalculator.success.title", "تم استلام طلبك!")}
            </h1>

            {/* Follow-up message */}
            <p className="mt-5 text-[14px] leading-7 text-[#59647A] sm:text-[15px]">
                {t(
                    "financeCalculator.success.followUpSimple",
                    "سيتواصل معك فريق التمويل في هامش خلال 24 ساعة.",
                )}
            </p>

            {/* Optional phone */}
            {clientPhone && (
                <p className="mt-1 text-[12px] text-[#8B919D]">{clientPhone}</p>
            )}

            {/* Request number */}
            <p
                dir="ltr"
                className={[
                    "mt-6",
                    "text-[18px] font-bold",
                    "text-[var(--brand-primary-color)]",
                    "sm:text-[20px]",
                ].join(" ")}
            >
                <span>
                    {t("financeCalculator.success.requestNumber", "رقم الطلب:")}
                </span>{" "}
                <span>{requestNumber}</span>
            </p>

            {/* Actions */}
            <div className="mt-9 w-full max-w-[390px]">
                <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={[
                        "flex h-[52px] w-full",
                        "items-center justify-center gap-3",
                        "bg-[#25D366]",
                        "px-6",
                        "text-[14px] font-bold text-white!",
                        "transition duration-300",
                        "hover:bg-[#20C55D]",
                    ].join(" ")}
                >
                    <SiWhatsapp size={20} />

                    {t(
                        "financeCalculator.success.whatsapp",
                        "تابع طلبك عبر واتساب",
                    )}
                </a>

                <button
                    type="button"
                    onClick={() => navigate("/cars")}
                    className={[
                        "mt-2 flex h-[52px] w-full",
                        "items-center justify-center gap-3",
                        "border border-[#E0E1E4]",
                        "bg-white",
                        "px-6",
                        "text-[14px] font-bold",
                        "text-[#303A54]",
                        "transition duration-300",
                        "hover:border-[#303A54]",
                    ].join(" ")}
                >
                    {t(
                        "financeCalculator.success.backToCars",
                        "العودة لتصفح السيارات",
                    )}

                    <span className="text-[16px]">
                        {direction === "rtl" ? "←" : "→"}
                    </span>
                </button>
            </div>
        </section>
    );
}
