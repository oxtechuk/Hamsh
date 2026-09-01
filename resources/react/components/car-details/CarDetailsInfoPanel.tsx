import React from "react";
import { useTranslation } from "react-i18next";
import { CreditCard, ShoppingBag, ChevronDown } from "lucide-react";

import { formatPrice } from "../../utils/format";
import { localize } from "../../utils/localize";
import type { ICarDetailsInfoPanelProps } from "../../interfaces/ICarDetailsInfoPanelProps";

export default function CarDetailsInfoPanel({
    car,
    selectedTrimIndex = 0,
    onSelectTrimIndex,
    featureRows,
    onOrder,
    onFinance,
}: ICarDetailsInfoPanelProps) {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.dir() === "rtl";

    const trims = car.trims && car.trims.length > 0 ? car.trims : [];
    const currentTrim = trims[selectedTrimIndex] ?? null;

    // Derived Specs for the 4-box grid matching the design
    const engineSpec =
        currentTrim?.engine ||
        (typeof car.specs === "object" && !Array.isArray(car.specs) && car.specs?.hp
            ? car.specs.hp
            : null) ||
        car.specifications?.find(
            (s) =>
                s.name.includes("محرك") ||
                s.name.toLowerCase().includes("engine") ||
                s.name.includes("سلندر"),
        )?.value ||
        (isRTL ? "4 سلندر 2.5 لتر هجين (Hybrid)" : "4-Cyl 2.5L Hybrid");

    const transmissionSpec =
        currentTrim?.transmission ||
        (typeof car.specs === "object" && !Array.isArray(car.specs) && car.specs?.gearbox
            ? car.specs.gearbox
            : null) ||
        car.specifications?.find(
            (s) =>
                s.name.includes("ناقل") ||
                s.name.toLowerCase().includes("transmission") ||
                s.name.toLowerCase().includes("gearbox"),
        )?.value ||
        (isRTL ? "أوتوماتيك تناسقي (e-CVT)" : "Automatic (e-CVT)");

    const safetySpec =
        currentTrim?.safety ||
        car.safety_features?.[0]?.name ||
        car.specifications?.find(
            (s) =>
                s.name.includes("أمان") ||
                s.name.toLowerCase().includes("safety"),
        )?.value ||
        (isRTL ? "تويوتا سيفتي سينس المطور" : "Advanced Safety Sense");

    const lightingSpec =
        currentTrim?.lighting ||
        car.specifications?.find(
            (s) =>
                s.name.includes("إضاءة") ||
                s.name.includes("LED") ||
                s.name.toLowerCase().includes("light"),
        )?.value ||
        (isRTL ? "مصابيح LED أمامية وخلفية" : "Front & Rear LED Lights");

    const displayCashPrice = currentTrim?.cash_price || car.current_price || car.cash_price;
    const displayInstallment = currentTrim?.monthly_installment || car.min_installment;

    const availabilityText =
        currentTrim?.availability_status ||
        car.availability_status === "order_now"
            ? isRTL ? "اطلب الآن" : "Order Now"
            : car.availability_status === "on_request"
              ? isRTL ? "عند الطلب" : "On Request"
              : isRTL ? "🔥 متبقي سيارتين فقط - ع وشك النفاذ!" : "🔥 Only 2 left in stock!";

    return (
        <div className="order-2 flex flex-col justify-between p-4 sm:p-6 h-full max-h-[90vh] sm:max-h-[620px] overflow-y-auto">
            <div className="flex flex-col gap-3">
                {/* 1. Header & Trim Select Box */}
                <div>
                    <label className="block text-[13px] sm:text-[14px] font-bold text-[#C22026] mb-1.5 text-start">
                        {isRTL ? "اختر فئة السيارة المطلوبة:" : "Select Required Trim:"}
                    </label>

                    {trims.length > 0 ? (
                        <div className="relative">
                            <select
                                value={selectedTrimIndex}
                                onChange={(e) => onSelectTrimIndex?.(Number(e.target.value))}
                                className="w-full appearance-none rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 pe-10 text-[14px] sm:text-[15px] font-bold text-[#1E293B] shadow-xs transition hover:border-[#C22026]/40 focus:border-[#C22026] focus:outline-none focus:ring-2 focus:ring-[#C22026]/10 cursor-pointer text-start"
                            >
                                {trims.map((trim, idx) => (
                                    <option key={idx} value={idx} className="font-semibold text-gray-800 py-1">
                                        {trim.name}
                                    </option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center pe-3.5 text-gray-500">
                                <ChevronDown size={18} />
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-[14px] font-bold text-[#1E293B] shadow-xs text-start">
                            {localize(car.name, i18n.language)} ({car.year})
                        </div>
                    )}
                </div>

                {/* 2. Availability Status Bar */}
                <div className="flex items-center justify-between rounded-xl border border-[#FDE68A] bg-[#FFFBF0] px-3.5 py-2 shadow-xs">
                    <span className="text-[12px] sm:text-[13px] font-semibold text-[#475467]">
                        {isRTL ? "حالة التوفر الحالي:" : "Current Availability:"}
                    </span>
                    <span className="text-[12px] sm:text-[13px] font-bold text-[#B45309]">
                        {availabilityText}
                    </span>
                </div>

                {/* 3. 4-Box Specs Grid */}
                <div className="grid grid-cols-2 gap-2.5">
                    {/* Engine */}
                    <div className="flex flex-col justify-center rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-2.5 sm:p-3 text-center sm:text-start transition hover:border-gray-300">
                        <span className="text-[11px] font-medium text-[#64748B] mb-0.5">
                            {isRTL ? "نوع المحرك" : "Engine Type"}
                        </span>
                        <span className="text-[12px] sm:text-[13px] font-bold text-[#1E293B] line-clamp-1">
                            {engineSpec}
                        </span>
                    </div>

                    {/* Transmission */}
                    <div className="flex flex-col justify-center rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-2.5 sm:p-3 text-center sm:text-start transition hover:border-gray-300">
                        <span className="text-[11px] font-medium text-[#64748B] mb-0.5">
                            {isRTL ? "ناقل الحركة" : "Transmission"}
                        </span>
                        <span className="text-[12px] sm:text-[13px] font-bold text-[#1E293B] line-clamp-1">
                            {transmissionSpec}
                        </span>
                    </div>

                    {/* Safety Systems */}
                    <div className="flex flex-col justify-center rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-2.5 sm:p-3 text-center sm:text-start transition hover:border-gray-300">
                        <span className="text-[11px] font-medium text-[#64748B] mb-0.5">
                            {isRTL ? "أنظمة الأمان" : "Safety Systems"}
                        </span>
                        <span className="text-[12px] sm:text-[13px] font-bold text-[#1E293B] line-clamp-1">
                            {safetySpec}
                        </span>
                    </div>

                    {/* Lighting */}
                    <div className="flex flex-col justify-center rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-2.5 sm:p-3 text-center sm:text-start transition hover:border-gray-300">
                        <span className="text-[11px] font-medium text-[#64748B] mb-0.5">
                            {isRTL ? "الإضاءة الخارجية" : "Exterior Lighting"}
                        </span>
                        <span className="text-[12px] sm:text-[13px] font-bold text-[#1E293B] line-clamp-1">
                            {lightingSpec}
                        </span>
                    </div>
                </div>

                {/* 4. Pricing (Estimated Cash & Monthly) */}
                <div className="grid grid-cols-2 gap-2.5">
                    {/* Cash Price */}
                    <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-2.5 sm:p-3 text-center sm:text-start">
                        <span className="text-[11px] font-medium text-[#64748B]">
                            {isRTL ? "سعر الكاش المقدر" : "Est. Cash Price"}
                        </span>
                        <p className="mt-0.5 text-[15px] sm:text-[17px] font-extrabold text-[#059669]">
                            {formatPrice(displayCashPrice, "#059669", i18n.language)}
                        </p>
                    </div>

                    {/* Monthly Installment */}
                    <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-2.5 sm:p-3 text-center sm:text-start">
                        <span className="text-[11px] font-medium text-[#64748B]">
                            {isRTL ? "القسط الشهري التقديري" : "Est. Monthly Installment"}
                        </span>
                        <p className="mt-0.5 text-[15px] sm:text-[17px] font-extrabold text-[#C22026]">
                            {formatPrice(displayInstallment, "#C22026", i18n.language)} {isRTL ? "/ شهرياً" : "/ mo"}
                        </p>
                    </div>
                </div>
            </div>

            {/* 5. Bottom Action Confirmation Buttons */}
            <div className="mt-4 pt-3 border-t border-[#E2E8F0]">
                <p className="text-[12px] font-bold text-center text-[#475467] mb-2.5">
                    {isRTL ? "كيف ترغب في إتمام الشراء لهذه الفئة؟" : "How would you like to purchase this trim?"}
                </p>
                <div className="grid grid-cols-2 gap-2.5">
                    {/* Direct Cash */}
                    <button
                        type="button"
                        onClick={onOrder}
                        className="flex h-[46px] items-center justify-center gap-1.5 rounded-xl border-2 border-[#10B981] bg-[#ECFDF5] text-[#065F46] hover:bg-[#D1FAE5] text-[13px] sm:text-[14px] font-extrabold transition shadow-xs cursor-pointer active:scale-95"
                    >
                        <ShoppingBag size={16} />
                        <span>{isRTL ? "اعتماد كاش مباشر" : "Direct Cash Order"}</span>
                    </button>

                    {/* Finance Application */}
                    <button
                        type="button"
                        onClick={onFinance || onOrder}
                        className="flex h-[46px] items-center justify-center gap-1.5 rounded-xl bg-[#C22026] hover:bg-[#A81B21] text-white text-[13px] sm:text-[14px] font-extrabold transition shadow-xs cursor-pointer active:scale-95"
                    >
                        <CreditCard size={16} />
                        <span>{isRTL ? "اعتماد والانتقال للتمويل" : "Confirm & Finance"}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

