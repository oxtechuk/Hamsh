import { Check } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useLanguageStore } from "../../store/language.store";
import { useSettingsStore } from "../../store/settings.store";

interface DriveSuccessProps {
    carLabel?: string;
    clientPhone?: string;
    requestNumber?: string;
}

export default function DriveSuccess({
    carLabel = "",
    requestNumber = "TF-7956",
}: DriveSuccessProps) {
    const { t } = useTranslation();

    const direction = useLanguageStore((state) => state.direction);

    const settings = useSettingsStore((state) => state.settings);

    const navigate = useNavigate();

    const whatsappNumber =
        settings?.contact?.whatsapp?.replace(/\D/g, "") ?? "";

    const whatsappMessage = encodeURIComponent(
        t("drivePage.success.whatsappMessage", {
            carLabel,
            requestNumber,
            defaultValue:
                "مرحباً، أرسلت طلب تجربة قيادة رقم {{requestNumber}} للسيارة {{carLabel}} وأرغب في متابعة الطلب.",
        }),
    );

    const whatsappHref = whatsappNumber
        ? `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`
        : "#";

    return (
        <section
            dir={direction}
            className="mx-auto flex w-full max-w-[520px] flex-col items-center px-4 py-10 text-center sm:py-14"
        >
            {/* Check */}
            <div
                className={[
                    "flex h-[72px] w-[72px]",
                    "items-center justify-center",
                    "border border-[var(--brand-primary-color)]/30",
                    "bg-[var(--brand-primary-color)]/[0.05]",
                ].join(" ")}
            >
                <Check
                    size={34}
                    strokeWidth={1.6}
                    className="text-[var(--brand-primary-color)]"
                />
            </div>

            {/* Title */}
            <h1
                className={[
                    "mt-7",
                    "text-[30px] font-extrabold",
                    "leading-tight text-[#20283A]",
                    "sm:text-[34px]",
                ].join(" ")}
            >
                {t("drivePage.success.title", "تم استلام طلبك!")}
            </h1>

            {/* Message */}
            <p className="mt-5 max-w-[390px] text-[13px] leading-7 text-[#59647A] sm:text-[14px]">
                {t(
                    "drivePage.success.description",
                    "سيتواصل معك فريق هامش خلال 24 ساعة لتأكيد موعد تجربة القيادة.",
                )}
            </p>

            {/* Request number */}
            <p
                dir="ltr"
                className="mt-6 text-[18px] font-bold text-[var(--brand-primary-color)]"
            >
                <span>
                    {t("drivePage.success.requestNumber", "رقم الطلب:")}
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
                    <SiWhatsapp size={19} />

                    {t("drivePage.success.whatsapp", "تابع طلبك عبر واتساب")}
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
                        "text-[13px] font-bold",
                        "text-[#303A54]",
                        "transition duration-300",
                        "hover:border-[#303A54]",
                    ].join(" ")}
                >
                    {t("drivePage.success.backToCars", "العودة لتصفح السيارات")}

                    <span className="text-[15px]">
                        {direction === "rtl" ? "←" : "→"}
                    </span>
                </button>
            </div>
        </section>
    );
}
