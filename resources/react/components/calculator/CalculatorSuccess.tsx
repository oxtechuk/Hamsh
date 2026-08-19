import { Check } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useLanguageStore } from "../../store/language.store";
import { useSettingsStore } from "../../store/settings.store";
import type { ICalculatorSuccessFullProps } from "../../interfaces/ICalculatorSuccessFullProps";

export default function CalculatorSuccess({
  carLabel,
  clientPhone,
  requestNumber = "TF-7956",
}: ICalculatorSuccessFullProps) {
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
      className="mx-auto flex w-full max-w-[560px] flex-col items-center px-4 pb-4 pt-8 text-center sm:pb-6 sm:pt-12"
    >
      <div className="flex h-[72px] w-[72px] items-center justify-center border border-[var(--brand-primary-color)]/35 bg-[var(--brand-primary-color)]/[0.04]">
        <Check size={34} strokeWidth={1.7} className="text-[var(--brand-primary-color)]" />
      </div>

      <h1 className="mt-8 text-[31px] font-extrabold leading-tight text-[#20283A] sm:text-[36px]">
        {t("financeCalculator.success.title")}
      </h1>

      <p className="mt-5 text-[14px] leading-7 text-[#59647A] sm:text-[15px]">
        {t("financeCalculator.success.followUpSimple")}
      </p>

      <p
        dir="ltr"
        className="mt-6 text-[18px] font-bold text-[var(--brand-primary-color)] sm:text-[20px]"
      >
        <span>{t("financeCalculator.success.requestNumber")}</span>{" "}
        <span>{requestNumber}</span>
      </p>

      <div className="mt-9 w-full max-w-[390px]">
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-[52px] w-full items-center justify-center gap-3 bg-[#25D366] px-6 text-[14px] font-bold text-white! transition duration-300 hover:bg-[#20C55D]"
        >
          <SiWhatsapp size={20} />
          {t("financeCalculator.success.whatsapp")}
        </a>

        <button
          type="button"
          onClick={() => navigate("/cars")}
          className="mt-2 flex h-[52px] w-full items-center justify-center gap-3 border border-[#E0E1E4] bg-white px-6 text-[14px] font-bold text-[#303A54] transition duration-300 hover:border-[#303A54]"
        >
          {t("financeCalculator.success.backToCars")}
          <span className="text-[16px]">
            {direction === "rtl" ? "\u2190" : "\u2192"}
          </span>
        </button>
      </div>
    </section>
  );
}
