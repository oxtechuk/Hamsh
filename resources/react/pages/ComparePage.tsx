import { useTranslation } from "react-i18next";

import CompareTable from "../components/compare/CompareTable";
import CompareSummary from "../components/compare/CompareSummary";
import CompareCarSlot from "../components/compare/CompareCarSlot";
import { useSEO } from "../utils/useSEO";
import { useCompare } from "../hooks/useCompare";

export default function ComparePage() {
    const { t, i18n } = useTranslation();
    useSEO(t("pageTitles.compare"), t("comparePage.compareDescription"));

    const dir = i18n.dir();

    const {
        car1Slug,
        car2Slug,
        car1,
        car2,
        car1Name,
        car2Name,
        isLoading1,
        isLoading2,
        compareData,
        hasResults,
        showSearch1,
        showSearch2,
        setCar1Slug,
        setCar2Slug,
        setShowSearch1,
        setShowSearch2,
    } = useCompare();

    return (
        <div dir={dir} className="min-h-screen overflow-x-hidden">
            <div className="relative z-20 mt-[80px] px-6 pb-20">
                <div className="mx-auto max-w-7xl">
                    <div className="grid grid-cols-[minmax(320px,464px)_1fr_minmax(320px,464px)] items-start gap-12 max-lg:grid-cols-1 max-lg:gap-7">
                        {/* Car 1 slot */}
                        <div className="w-full max-lg:order-1">
                            <CompareCarSlot
                                slug={car1Slug}
                                car={car1}
                                isLoading={isLoading1}
                                showSearch={showSearch1}
                                label={t("comparePage.carOne")}
                                dir={dir}
                                onSelect={(slug) => {
                                    setCar1Slug(slug);
                                    setShowSearch1(false);
                                }}
                                onRemove={() => {
                                    setCar1Slug("");
                                    setShowSearch1(true);
                                }}
                                onShowSearch={() => setShowSearch1(true)}
                                onHideSearch={() => setShowSearch1(false)}
                            />
                        </div>

                        {/* VS divider */}
                        <div className="relative flex min-h-[401px] items-center justify-center max-lg:order-2 max-lg:min-h-[130px]">
                            <div
                                className={[
                                    "relative z-10",
                                    "flex h-[54px] w-[54px]",
                                    "items-center justify-center",
                                    "rounded-full border-2 border-[var(--brand-primary-color)]",
                                    "bg-white",
                                    "text-[16px] font-black uppercase",
                                    "text-[var(--brand-primary-color)]",
                                    "shadow-[0_4px_14px_rgba(201,35,44,0.08)]",
                                ].join(" ")}
                            >
                                {t("comparePage.vs")}
                            </div>
                        </div>

                        {/* Car 2 slot */}
                        <div className="w-full max-lg:order-3">
                            <CompareCarSlot
                                slug={car2Slug}
                                car={car2}
                                isLoading={isLoading2}
                                showSearch={showSearch2}
                                label={t("comparePage.carTwo")}
                                dir={dir}
                                onSelect={(slug) => {
                                    setCar2Slug(slug);
                                    setShowSearch2(false);
                                }}
                                onRemove={() => {
                                    setCar2Slug("");
                                    setShowSearch2(true);
                                }}
                                onShowSearch={() => setShowSearch2(true)}
                                onHideSearch={() => setShowSearch2(false)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {hasResults && compareData && car1 && car2 && (
                <>
                    <div className="mx-auto max-w-7xl px-6 pb-16">
                        <CompareTable
                            sections={compareData}
                            car1Name={car1Name}
                            car2Name={car2Name}
                        />
                    </div>
                </>
            )}
        </div>
    );
}
