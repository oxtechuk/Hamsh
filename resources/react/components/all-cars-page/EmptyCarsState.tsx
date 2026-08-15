import { useTranslation } from "react-i18next";

export default function EmptyCarsState() {
  const { t } = useTranslation();

  return (
    <div className="py-20 text-center">
      <p className="text-lg font-medium text-[#9CA3AF]">
        {t("allCarsPage.noCarsMatch")}
      </p>
    </div>
  );
}
