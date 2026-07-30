import { Check } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "../../store/language.store";
import { useSettingsStore } from "../../store/settings.store";
import type { ISpecialOrderSuccessProps } from "../../interfaces/ISpecialOrderSuccessProps";

export default function SpecialOrderSuccess({ carLabel, clientPhone }: ISpecialOrderSuccessProps) {
  const { t } = useTranslation();
  const direction = useLanguageStore((s) => s.direction);
  const navigate = useNavigate();
  const settings = useSettingsStore((s) => s.settings);

  const whatsappNum = settings?.contact?.whatsapp?.replace(/\D/g, "") ?? "";
  const whatsappMsg = encodeURIComponent(
    `مرحباً، أرسلت طلب سيارة مخصصة (${carLabel}) وأود المتابعة.`,
  );
  const whatsappHref = whatsappNum
    ? `https://wa.me/${whatsappNum}?text=${whatsappMsg}`
    : "#";

  return (
    <div
      dir={direction}
      className="mx-auto flex w-full max-w-[520px] flex-col items-center px-4 py-6 text-center"
    >
      <div className="flex h-[90px] w-[90px] items-center justify-center rounded-full bg-[#EDC98E]/10">
        <Check size={38} strokeWidth={2.5} className="text-[#EDC98E]" />
      </div>

      <p className="mt-5 pb-4 pt-2 text-[13px] font-medium text-[#EDC98E]">
        {t("specialOrder.success.badge", "تم الإرسال")}
      </p>

      <h2 className="mt-1 text-[32px] font-extrabold text-[#16254F]">
        {t("specialOrder.success.title", "طلبك في المراجعة!")}
      </h2>

      <p className="mt-3 text-[15px] text-[#667085] pt-5">
        {t("specialOrder.success.description", "تم استلام طلب تمويل {carLabel}").split("{carLabel}")[0]}
        <span className="text-[#16254F] font-bold">{carLabel}</span>
        {t("specialOrder.success.description", "تم استلام طلب تمويل {carLabel}").split("{carLabel}")[1]}
      </p>
      <p className="mt-1 text-[14px] text-[#667085]">
        {t("specialOrder.success.contact", "سيتواصل معك أحد متخصصينا على {phone} خلال ساعات العمل.").split("{phone}")[0]}
        <span className="text-[#667085] font-bold">{clientPhone}</span>
        {t("specialOrder.success.contact", "سيتواصل معك أحد متخصصينا على {phone} خلال ساعات العمل.").split("{phone}")[1]}
      </p>

      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-7 flex h-[52px] w-full items-center justify-center gap-2.5 rounded-[16px] bg-[#25D366] text-[16px] !font-bold text-white! transition hover:bg-[#1ebe5d]"
      >
        <SiWhatsapp size={20} />
        {t("specialOrder.success.whatsapp", "تابع طلبك عبر واتساب")}
      </a>

      <button
        type="button"
        onClick={() => navigate("/cars")}
        className="mt-4 flex h-[52px] w-full items-center justify-center gap-1.5 rounded-[16px] border border-[#6B7280] text-[15px] text-[#6B7280] transition hover:border-[#C5232B] hover:text-[#C5232B] !font-bold"
      >
        {t("specialOrder.success.backToCars", "العودة لتصفح السيارات")}
        <span>{direction === "rtl" ? "←" : "→"}</span>
      </button>
    </div>
  );
}
