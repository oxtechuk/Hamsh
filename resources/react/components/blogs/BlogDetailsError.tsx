import { useTranslation } from "react-i18next";
import { useLanguageStore } from "../../store/language.store";

export default function BlogDetailsError() {
  const { t } = useTranslation();
  const direction = useLanguageStore((s) => s.direction);

  return (
    <section dir={direction} className="flex h-[60vh] items-center justify-center">
      <p className="text-[18px] text-[#6B7280]">{t("blogPage.details.page.error")}</p>
    </section>
  );
}
