import { useTranslation } from "react-i18next";

import { formatPrice } from "../../utils/format";

import type { ICarDetailsInfoPanelProps } from "../../interfaces/ICarDetailsInfoPanelProps";

export default function CarDetailsInfoPanel({
    car,
    activeTab,
    specRows,
    featureRows,
    onChangeTab,
    onCompare,
    onOrder,
}: ICarDetailsInfoPanelProps) {
    const { t, i18n } = useTranslation();
    const activeRows = activeTab === "specs" ? specRows : featureRows;

    return (
        <div className="order-2 flex flex-col gap-5 p-4 pb-6 sm:p-6 sm:pb-8 lg:p-8 lg:pb-10">
            <div className="flex items-baseline justify-between gap-3">
                <div className="text-start">
                    <p className="text-[12px] text-[#404E6A]">
                        {t("carDetails.hero.price")}
                    </p>
                    <p className="mt-1 text-[24px] font-extrabold text-[#1A1F2E] sm:text-[28px]">
                        {formatPrice(
                            car.current_price || car.cash_price,
                            "#1A1F2E",
                            i18n.language,
                        )}
                    </p>
                </div>

                <div>
                    <p className="text-[12px] text-[#404E6A]">
                        {t("carDetails.hero.installmentFrom")}
                    </p>
                    <p className="mt-1 text-[24px] font-extrabold text-[#20283A] sm:text-[28px]">
                        {formatPrice(
                            car.min_installment,
                            "#DDBB72",
                            i18n.language,
                        )}
                    </p>
                </div>
            </div>

            <div>
                <div className="mb-5 flex items-center justify-start gap-6 border-b border-[#ECE7DD]">
                    <button
                        type="button"
                        onClick={() => onChangeTab("features")}
                        className={
                            activeTab === "features"
                                ? "-mb-px border-b-2 border-[var(--brand-primary-color)] pb-3 text-[13px] font-semibold! text-[#1A1F2E]"
                                : "pb-3 text-[13px] font-medium text-[#404E6A]"
                        }
                    >
                        {t("carDetails.specs.tab.features")}
                    </button>

                    <button
                        type="button"
                        onClick={() => onChangeTab("specs")}
                        className={
                            activeTab === "specs"
                                ? "-mb-px border-b-2 border-[var(--brand-primary-color)] pb-3 text-[13px] font-semibold! text-[#1A1F2E]"
                                : "pb-3 text-[13px] font-medium text-[#404E6A]"
                        }
                    >
                        {t("carDetails.specs.tab.specifications")}
                    </button>
                </div>

                {activeTab === "features" ? (
                    <div className="grid grid-cols-2 [&>*:nth-child(odd)]:border-e [&>*:nth-child(odd)]:border-[#ECE7DD] bg-white">
                        {activeRows.map((row, index) => (
                            <div
                                key={`${row.label}-${index}`}
                                className="border-b border-[#ECE7DD] px-2 py-3 text-start"
                            >
                                <p className="text-[11px] text-[#404E6A]">
                                    {row.label}
                                </p>
                                <p className="mt-1 text-[16px] font-bold text-[#1A1F2E]">
                                    {row.value || "—"}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid gap-3">
                        {activeRows.map((row, index) => (
                            <div
                                key={`${row.label}-${index}`}
                                className="flex items-center justify-start gap-3 border border-[#E8E7E3] bg-white px-4 py-3 shadow-[0_2px_12px_rgba(0,0,0,0.03)]"
                            >
                                <span className="h-2 w-2 flex-shrink-0 bg-[var(--brand-primary-color)]" />
                                <p className="text-[14px] text-[#1A1F2E]">
                                    {[row.label, row.value]
                                        .filter(Boolean)
                                        .join(" ") || "—"}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="mt-auto grid grid-cols-1 gap-3 pt-2 sm:grid-cols-[1.8fr_0.8fr]">
                <button
                    type="button"
                    onClick={onOrder}
                    className="flex h-[52px] items-center justify-center bg-[var(--brand-primary-color)] text-[13px] font-semibold! text-[#20283A] transition duration-300 hover:brightness-95"
                >
                    {t("carDetails.modal.placeOrder")}
                </button>

                <button
                    type="button"
                    onClick={onCompare}
                    className="flex h-[52px] items-center justify-center border border-[#E1E2E5]  text-[13px] font-bold text-[#20283A] transition duration-300 hover:bg-[#F5F4EF]"
                >
                    {t("carDetails.actions.compare")}
                </button>
            </div>
        </div>
    );
}
