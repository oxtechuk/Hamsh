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
        <div className="order-2 flex flex-col justify-between p-4 sm:p-6 lg:p-7 h-full max-h-[90vh] sm:max-h-[580px] lg:max-h-[600px] overflow-hidden">
            {/* Top: Price & Installment */}
            <div className="shrink-0 flex items-baseline justify-between gap-3 pb-3">
                <div className="text-start">
                    <p className="text-[12px] font-medium text-[#404E6A]">
                        {t("carDetails.hero.price")}
                    </p>
                    <p className="mt-0.5 text-[22px] font-extrabold text-[#1A1F2E] sm:text-[26px]">
                        {formatPrice(
                            car.current_price || car.cash_price,
                            "#1A1F2E",
                            i18n.language,
                        )}
                    </p>
                </div>

                <div className="text-end">
                    <p className="text-[12px] font-medium text-[#404E6A]">
                        {t("carDetails.hero.installmentFrom")}
                    </p>
                    <p className="mt-0.5 text-[22px] font-extrabold text-[#20283A] sm:text-[26px]">
                        {formatPrice(
                            car.min_installment,
                            "#DDBB72",
                            i18n.language,
                        )}
                    </p>
                </div>
            </div>

            {/* Middle: Tabs + Scrollable specs / features box */}
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden my-2">
                {/* Tabs */}
                <div className="shrink-0 mb-3 flex items-center justify-start gap-6 border-b border-[#ECE7DD]">
                    <button
                        type="button"
                        onClick={() => onChangeTab("features")}
                        className={
                            activeTab === "features"
                                ? "-mb-px border-b-2 border-[var(--brand-primary-color)] pb-2.5 text-[13px] font-bold! text-[#1A1F2E]"
                                : "pb-2.5 text-[13px] font-medium text-[#404E6A] hover:text-[#1A1F2E]"
                        }
                    >
                        {t("carDetails.specs.tab.features")}
                    </button>

                    <button
                        type="button"
                        onClick={() => onChangeTab("specs")}
                        className={
                            activeTab === "specs"
                                ? "-mb-px border-b-2 border-[var(--brand-primary-color)] pb-2.5 text-[13px] font-bold! text-[#1A1F2E]"
                                : "pb-2.5 text-[13px] font-medium text-[#404E6A] hover:text-[#1A1F2E]"
                        }
                    >
                        {t("carDetails.specs.tab.specifications")}
                    </button>
                </div>

                {/* Scrollable Content Container */}
                <div className="flex-1 overflow-y-auto pe-1.5 max-h-[240px] sm:max-h-[280px] lg:max-h-[300px]">
                    {activeTab === "features" ? (
                        <div className="grid grid-cols-2 [&>*:nth-child(odd)]:border-e [&>*:nth-child(odd)]:border-[#ECE7DD] bg-white border border-[#ECE7DD]">
                            {activeRows.map((row, index) => (
                                <div
                                    key={`${row.label}-${index}`}
                                    className="border-b border-[#ECE7DD] p-3 text-start transition hover:bg-gray-50/50"
                                >
                                    <p className="text-[11px] font-medium text-[#707E9A] leading-tight">
                                        {row.label}
                                    </p>
                                    <p className="mt-1 text-[14px] sm:text-[15px] font-bold text-[#1A1F2E] leading-snug">
                                        {row.value || "—"}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid gap-2">
                            {activeRows.map((row, index) => (
                                <div
                                    key={`${row.label}-${index}`}
                                    className="flex items-center justify-start gap-3 border border-[#E8E7E3] bg-white px-3.5 py-2.5 shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
                                >
                                    <span className="h-2 w-2 shrink-0 rounded-full bg-[var(--brand-primary-color)]" />
                                    <p className="text-[13px] sm:text-[14px] font-medium text-[#1A1F2E]">
                                        {[row.label, row.value]
                                            .filter(Boolean)
                                            .join(" ") || "—"}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Actions: Always Visible */}
            <div className="shrink-0 grid grid-cols-1 gap-3 pt-3 border-t border-[#ECE7DD] sm:grid-cols-[1.8fr_0.8fr]">
                <button
                    type="button"
                    onClick={onOrder}
                    className="flex h-[48px] items-center justify-center bg-[var(--brand-primary-color)] text-[14px] font-bold text-[#20283A] transition duration-300 hover:brightness-95 active:scale-[0.99] cursor-pointer shadow-sm"
                >
                    {t("carDetails.modal.placeOrder")}
                </button>

                <button
                    type="button"
                    onClick={onCompare}
                    className="flex h-[48px] items-center justify-center border border-[#D0D5DD] bg-white text-[14px] font-bold text-[#20283A] transition duration-300 hover:bg-[#F5F4EF] active:scale-[0.99] cursor-pointer"
                >
                    {t("carDetails.actions.compare")}
                </button>
            </div>
        </div>
    );
}
