import React from "react";
import { useTranslation } from "react-i18next";
import { CreditCard, ShoppingBag } from "lucide-react";

import { formatPrice } from "../../utils/format";
import type { ICarDetailsInfoPanelProps } from "../../interfaces/ICarDetailsInfoPanelProps";

export default function CarDetailsInfoPanel({
    car,
    featureRows,
    onOrder,
    onFinance,
}: ICarDetailsInfoPanelProps) {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.dir() === "rtl";

    return (
        <div className="order-2 flex flex-col justify-between p-4 sm:p-6 lg:p-7 h-full max-h-[90vh] sm:max-h-[580px] lg:max-h-[600px] overflow-hidden">
            {/* Top: Price & Installment (Matching Screenshot 3) */}
            <div className="shrink-0 flex items-baseline justify-between gap-3 pb-3">
                {/* Cash Price */}
                <div className="text-start">
                    <p className="text-[12px] font-medium text-[#404E6A]">
                        {isRTL ? "السعر النقدي" : "Cash Price"}
                    </p>
                    <p className="mt-0.5 text-[22px] font-extrabold text-[#1A1F2E] sm:text-[26px]">
                        {formatPrice(
                            car.current_price || car.cash_price,
                            "#1A1F2E",
                            i18n.language,
                        )}
                    </p>
                </div>

                {/* Installment */}
                <div className="text-end">
                    <p className="text-[12px] font-medium text-[#404E6A]">
                        {isRTL ? "قسط شهري يبدأ من" : "Monthly starts from"}
                    </p>
                    <p className="mt-0.5 text-[22px] font-extrabold text-[#DDBB72] sm:text-[26px]">
                        {formatPrice(
                            car.min_installment,
                            "#DDBB72",
                            i18n.language,
                        )}
                    </p>
                </div>
            </div>

            {/* Middle: Features Section (Technical Specs removed per request) */}
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden my-2">
                {/* Header: الميزات الرئيسية */}
                <div className="shrink-0 mb-3 flex items-center justify-start gap-3 border-b border-[#ECE7DD]">
                    <div className="-mb-px border-b-2 border-[#DDBB72] pb-2.5 text-[14px] font-bold text-[#1A1F2E]">
                        {isRTL ? "الميزات الرئيسية" : "Key Features"}
                    </div>
                </div>

                {/* Scrollable Features Grid */}
                <div className="flex-1 overflow-y-auto pe-1.5 max-h-[260px] sm:max-h-[300px] lg:max-h-[320px]">
                    {featureRows && featureRows.length > 0 ? (
                        <div className="grid grid-cols-2 [&>*:nth-child(odd)]:border-e [&>*:nth-child(odd)]:border-[#ECE7DD] bg-white border border-[#ECE7DD] rounded-md overflow-hidden">
                            {featureRows.map((row, index) => (
                                <div
                                    key={`${row.label}-${index}`}
                                    className="border-b border-[#ECE7DD] p-3 text-start transition hover:bg-gray-50/60"
                                >
                                    <p className="text-[11px] font-medium text-[#707E9A] leading-tight">
                                        {row.label}
                                    </p>
                                    <p className="mt-1 text-[13px] sm:text-[14px] font-bold text-[#1A1F2E] leading-snug">
                                        {row.value || "—"}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-12 text-center text-xs text-gray-400">
                            {isRTL ? "لا توجد ميزات إضافية مسجلة" : "No additional features listed"}
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Actions: Two Direct Buttons (طلب شراء كاش + طلب تمويل) */}
            <div className="shrink-0 grid grid-cols-2 gap-3 pt-3 border-t border-[#ECE7DD]">
                {/* 1. زر تقديم طلب / شراء */}
                <button
                    type="button"
                    onClick={onOrder}
                    className="flex h-[48px] items-center justify-center gap-2 rounded-md bg-[#DFA655] text-[14px] font-bold text-white shadow-xs transition duration-200 hover:bg-[#c89345] active:scale-[0.99] cursor-pointer"
                >
                    <ShoppingBag size={17} />
                    <span>{isRTL ? "تقديم طلب شراء" : "Place Purchase Order"}</span>
                </button>

                {/* 2. زر تمويل */}
                <button
                    type="button"
                    onClick={onFinance || onOrder}
                    className="flex h-[48px] items-center justify-center gap-2 rounded-md bg-[#1A1F2E] text-[14px] font-bold text-white shadow-xs transition duration-200 hover:bg-[#2A3144] active:scale-[0.99] cursor-pointer"
                >
                    <CreditCard size={17} className="text-[#DDBB72]" />
                    <span>{isRTL ? "طلب تمويل" : "Apply for Finance"}</span>
                </button>
            </div>
        </div>
    );
}
