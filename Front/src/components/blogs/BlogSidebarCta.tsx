import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "../../store/language.store";

export default function BlogSidebarCta() {
  const { t } = useTranslation();
  const direction = useLanguageStore((s) => s.direction);

  return (
    <div dir={direction} className="rounded-[14px] bg-[var(--brand-secondary-color)] px-5 py-6 text-start text-white">
      <p className="text-[18px] font-bold text-white">
        {t("blogPage.sidebar.cta.title")}
      </p>
      <p className="mt-1 pt-2 text-[15px] text-white/80 leading-snug">
        {t("blogPage.sidebar.cta.subtitle")}
      </p>
      <NavLink
        to="/finance-calculator"
        className="mt-4 flex h-[42px] items-center justify-center rounded-[8px] bg-white text-[16px] font-bold text-[var(--brand-secondary-color)]! transition hover:bg-white/90"
      >
        {t("blogPage.sidebar.cta.buttonText")}
      </NavLink>
    </div>
  );
}
