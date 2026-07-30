import { useTranslation } from "react-i18next";

import type { ICompareTableProps } from "../../interfaces/ICompareTableProps";
import ComparisonSection from "./ComparisonSection";

export default function CompareTable({
  sections,
  car1Name,
  car2Name,
}: ICompareTableProps) {
  const { i18n, t } = useTranslation();

  if (!sections.length) {
    return null;
  }

  return (
    <section
      dir={i18n.dir()}
      className="mx-auto w-full max-w-[1250px] space-y-5 pb-20"
    >
      {sections.map((section, sectionIndex) => (
        <ComparisonSection
          key={`${section.title}-${sectionIndex}`}
          title={section.title}
          rows={section.rows}
          car1Name={car1Name}
          car2Name={car2Name}
          carOneLabel={t("comparePage.carOne")}
          carTwoLabel={t("comparePage.carTwo")}
        />
      ))}
    </section>
  );
}
