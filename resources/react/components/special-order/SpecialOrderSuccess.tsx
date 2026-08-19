import { Check } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useLanguageStore } from "../../store/language.store";
import { useSettingsStore } from "../../store/settings.store";
import type { ISpecialOrderSuccessProps } from "../../interfaces/ISpecialOrderSuccessProps";

export default function SpecialOrderSuccess({
  carLabel,
  requestNumber = "HMX-9752",
}: ISpecialOrderSuccessProps) {
  const { t } = useTranslation();

  const direction = useLanguageStore((state) => state.direction);

  const settings = useSettingsStore((state) => state.settings);

  const navigate = useNavigate();

  const whatsappNum = settings?.contact?.whatsapp?.replace(/\D/g, "") ?? "";

  const whatsappMessage = encodeURIComponent(
    t("specialOrder.success.whatsappMessage", { carLabel, requestNumber }),
  );

  const whatsappHref = whatsappNum
    ? `https://wa.me/${whatsappNum}?text=${whatsappMessage}`
    : "#";

  return (
    <section
      dir={direction}
      className="mx-auto flex w-full max-w-[520px] flex-col items-center px-4 py-8 text-center sm:py-12"
    >
      <div className="flex h-[74px] items-center justify-center">
        <Check
          size={64}
          strokeWidth={1.25}
          className="text-[var(--brand-primary-color)]/30"
        />
      </div>

      <h1
        className={[
          "mt-2",
          "text-[32px] font-extrabold",
          "leading-tight",
          "text-[#20283A]",
          "sm:text-[36px]",
        ].join(" ")}
      >
        {t("specialOrder.success.title")}
      </h1>

      <p className="mt-5 max-w-[390px] text-[13px] leading-7 text-[#59647A] sm:text-[14px]">
        {t("specialOrder.success.description")}
      </p>

      <div className="mt-7 min-w-[170px] bg-white px-6 py-4 shadow-[0_3px_12px_rgba(48,58,84,0.05)]">
        <p className="text-[10px] text-[#70798A]">
          {t("specialOrder.success.requestNumberLabel")}
        </p>

        <p
          dir="ltr"
          className="mt-1 text-[22px] font-extrabold tracking-wide text-[#20283A]"
        >
          {requestNumber}
        </p>
      </div>

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
            "text-[14px] font-bold",
            "text-white!",
            "transition duration-300",
            "hover:bg-[#20C55D]",
          ].join(" ")}
        >
          <SiWhatsapp size={19} />

          {t("specialOrder.success.whatsapp")}
        </a>

        <button
          type="button"
          onClick={() => navigate("/cars")}
          className={[
            "mt-2 flex h-[52px] w-full",
            "items-center justify-center gap-3",
            "border border-[#E0E1E4]",
            "bg-white px-6",
            "text-[13px] font-bold",
            "text-[#303A54]",
            "transition duration-300",
            "hover:border-[#303A54]",
          ].join(" ")}
        >
          {t("specialOrder.success.backToCars")}

          <span className="text-[15px]">
            {direction === "rtl" ? "←" : "→"}
          </span>
        </button>
      </div>
    </section>
  );
}
