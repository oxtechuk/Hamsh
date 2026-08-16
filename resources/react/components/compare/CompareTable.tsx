import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import type { ICompareTableProps } from "../../interfaces/ICompareTableProps";
import ComparisonSection from "./ComparisonSection";

export default function CompareTable({
    sections,
    car1Name,
    car2Name,
}: ICompareTableProps) {
    const { i18n, t } = useTranslation();
    const navigate = useNavigate();

    if (!sections.length) {
        return null;
    }

    return (
        <section
            dir={i18n.dir()}
            className="mx-auto w-full max-w-[1280px] pb-20"
        >
            {/* Comparison table */}
            <div className="overflow-x-auto border border-[#E8E3D9] bg-white">
                <div className="min-w-[640px]">
                    {sections.map((section, sectionIndex) => (
                        <ComparisonSection
                            key={`${section.title}-${sectionIndex}`}
                            title={section.title}
                            rows={section.rows}
                            car1Name={car1Name}
                            car2Name={car2Name}
                            carOneLabel={t("comparePage.carOne")}
                            carTwoLabel={t("comparePage.carTwo")}
                            hideHeader={sectionIndex > 0}
                        />
                    ))}
                </div>
            </div>

            {/* Actions */}
            <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <button
                    type="button"
                    onClick={() => navigate("/finance-calculator")}
                    className={[
                        "flex h-[56px] min-w-[230px]",
                        "items-center justify-center",
                        "bg-[var(--brand-primary-color)] px-8",
                        "text-[15px] font-bold text-[#20283E]",
                        "transition duration-300",
                        "hover:brightness-95",
                    ].join(" ")}
                >
                    {t("comparePage.requestFinance")}
                </button>

                <button
                    type="button"
                    onClick={() => navigate("/cars")}
                    className={[
                        "flex h-[56px] min-w-[230px]",
                        "items-center justify-center",
                        "border border-[#303A54]",
                        "bg-transparent px-8",
                        "text-[15px] font-medium text-[#303A54]",
                        "transition duration-300",
                        "hover:bg-[#303A54]",
                        "hover:text-white",
                    ].join(" ")}
                >
                    {t("comparePage.backToCars")}
                </button>
            </div>
        </section>
    );
}
