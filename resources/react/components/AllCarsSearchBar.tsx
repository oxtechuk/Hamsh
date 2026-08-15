import { useTranslation } from "react-i18next";

import type { IAllCarsSearchBarProps } from "../interfaces/IAllCarsSearchBarProps";

export default function AllCarsSearchBar({
  resultCount,
}: IAllCarsSearchBarProps) {
  const { t, i18n } = useTranslation();

  return (
    <div className="mb-5" dir={i18n.dir()}>
      <p className="mt-2 text-start text-[13px] font-semibold text-[#111827]">
        {t("allCarsPage.availableCars")}
      </p>
    </div>
  );
}
