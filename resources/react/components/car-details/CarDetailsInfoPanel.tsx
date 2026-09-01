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
    featureRows = [],
    onOrder,
    onFinance,
}: ICarDetailsInfoPanelProps) {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.dir() === "rtl";

    const trims = car.trims && car.trims.length > 0 ? car.trims : [];
    const currentTrim = trims[selectedTrimIndex] ?? null;

    // Derived Specs for the selected trim or fallback
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
        )?.value;

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
        )?.value;

    const safetySpec =
        currentTrim?.safety ||
        car.safety_features?.[0]?.name ||
        car.specifications?.find(
            (s) =>
                s.name.includes("أمان") ||
                s.name.toLowerCase().includes("safety"),
        )?.value;

    const lightingSpec =
        currentTrim?.lighting ||
        car.specifications?.find(
            (s) =>
                s.name.includes("إضاءة") ||
                s.name.includes("LED") ||
                s.name.toLowerCase().includes("light"),
        )?.value;

    const displayCashPrice = currentTrim?.cash_price || car.current_price || car.cash_price;
    const displayInstallment = currentTrim?.monthly_installment || car.min_installment;

    const availabilityText =
        currentTrim?.availability_status ||
        (car.availability_status === "order_now"
            ? isRTL ? "اطلب الآن" : "Order Now"
            : car.availability_status === "on_request"
              ? isRTL ? "عند الطلب" : "On Request"
              : isRTL ? "🔥 متبقي سيارتين فقط - ع وشك النفاذ!" : "🔥 Only 2 left in stock!");

    // Build unified specs/features list for the 2-column table grid
    const tableItems: { label: string; value: string }[] = [];

    if (engineSpec) {
        tableItems.push({
            label: isRTL ? "نوع المحرك" : "Engine Type",
            value: engineSpec,
        });
    }
    if (transmissionSpec) {
        tableItems.push({
            label: isRTL ? "ناقل الحركة" : "Transmission",
            value: transmissionSpec,
        });
    }
    if (safetySpec) {
        tableItems.push({
            label: isRTL ? "أنظمة الأمان والسلامة" : "Safety Systems",
            value: safetySpec,
        });
    }
    if (lightingSpec) {
        tableItems.push({
            label: isRTL ? "الإضاءة الخارجية" : "Exterior Lighting",
            value: lightingSpec,
        });
    }

    // Add extra features from featureRows if available
    featureRows.forEach((item) => {
        if (
            item.label &&
            item.value &&
            item.value !== "—" &&
            !tableItems.some((t) => t.label === item.label)
        ) {
            tableItems.push(item);
        }
    });

    return (
        <div className="order-2 flex flex-col justify-between p-4 sm:p-6 lg:p-7 h-full max-h-[90vh] sm:max-h-[580px] lg:max-h-[600px] overflow-hidden">
            {/* Top: Price & Installment */}
            <div className="shrink-0 flex items-baseline justify-between gap-3 pb-2">
                {/* Cash Price */}
                <div className="text-start">
                    <p className="text-[12px] font-medium text-[#404E6A]">
                        {isRTL ? "السعر النقدي" : "Cash Price"}
                    </p>
                    <p className="mt-0.5 text-[22px] font-black text-[#1A1F2E] sm:text-[26px]">
                        {formatPrice(displayCashPrice, "#1A1F2E", i18n.language)}
                    </p>
                </div>

                {/* Installment */}
                <div className="text-end">
                    <p className="text-[12px] font-medium text-[#404E6A]">
                        {isRTL ? "قسط شهري يبدأ من" : "Monthly starts from"}
                    </p>
                    <p className="mt-0.5 text-[22px] font-black text-[#DDBB72] sm:text-[26px]">
                        {formatPrice(displayInstallment, "#DDBB72", i18n.language)}
                    </p>
                </div>
            </div>

            {/* Middle Section: Trim Selector + Availability + Features Table */}
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden my-1">
                {/* Trim Selector Dropdown (اختر الفئة) */}
                {trims.length > 0 && (
                    <div className="shrink-0 mb-2">
                        <div className="flex items-center justify-between gap-2 mb-1">
                            <label className="text-[12px] sm:text-[13px] font-bold text-[#C22026] text-start">
                                {isRTL ? "اختر فئة السيارة المطلوبة:" : "Select Trim:"}
                            </label>
                            {availabilityText && (
                                <span className="text-[11px] font-bold text-[#B45309] bg-[#FFFBEB] border border-[#FDE68A] px-2 py-0.5 rounded-md">
                                    {availabilityText}
                                </span>
                            )}
                        </div>
                        <div className="relative">
                            <select
                                value={selectedTrimIndex}
                                onChange={(e) => onSelectTrimIndex?.(Number(e.target.value))}
                                className="w-full appearance-none rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 pe-8 text-[13px] sm:text-[14px] font-bold text-[#1E293B] shadow-xs transition hover:border-[#C22026]/40 focus:border-[#C22026] focus:outline-none focus:ring-2 focus:ring-[#C22026]/10 cursor-pointer text-start"
                            >
                                {trims.map((trim, idx) => (
                                    <option key={idx} value={idx} className="font-semibold text-gray-800 py-1">
                                        {trim.name}
                                    </option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center pe-2.5 text-gray-500">
                                <ChevronDown size={16} />
                            </div>
                        </div>
                    </div>
                )}

                {/* Table Header: الميزات والمواصفات الرئيسية */}
                <div className="shrink-0 mb-2 flex items-center justify-start gap-3 border-b border-[#ECE7DD]">
                    <div className="-mb-px border-b-2 border-[#DDBB72] pb-1.5 text-[13px] sm:text-[14px] font-bold text-[#1A1F2E]">
                        {isRTL ? "الميزات والمواصفات الرئيسية" : "Key Specifications & Features"}
                    </div>
                </div>

                {/* Scrollable Features & Specs Table Grid */}
                <div className="flex-1 overflow-y-auto pe-1 max-h-[220px] sm:max-h-[260px] lg:max-h-[280px]">
                    {tableItems.length > 0 ? (
                        <div className="grid grid-cols-2 [&>*:nth-child(odd)]:border-e [&>*:nth-child(odd)]:border-[#ECE7DD] bg-white border border-[#ECE7DD] rounded-md overflow-hidden">
                            {tableItems.map((row, index) => (
                                <div
                                    key={`${row.label}-${index}`}
                                    className="border-b border-[#ECE7DD] p-2.5 sm:p-3 text-start transition hover:bg-gray-50/60"
                                >
                                    <p className="text-[10px] sm:text-[11px] font-medium text-[#707E9A] leading-tight mb-0.5">
                                        {row.label}
                                    </p>
                                    <p className="text-[12px] sm:text-[13px] font-bold text-[#1A1F2E] leading-snug">
                                        {row.value || "—"}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-8 text-center text-xs text-gray-400">
                            {isRTL ? "لا توجد مواصفات مسجلة" : "No specifications listed"}
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Actions: Two Direct Buttons (تقديم طلب شراء + طلب تمويل) */}
            <div className="shrink-0 grid grid-cols-2 gap-3 pt-3 border-t border-[#ECE7DD]">
                {/* 1. زر تقديم طلب / شراء */}
                <button
                    type="button"
                    onClick={onOrder}
                    className="flex h-[46px] sm:h-[48px] items-center justify-center gap-2 rounded-md bg-[#DFA655] text-[13px] sm:text-[14px] font-bold text-white shadow-xs transition duration-200 hover:bg-[#c89345] active:scale-[0.99] cursor-pointer"
                >
                    <ShoppingBag size={16} />
                    <span>{isRTL ? "تقديم طلب شراء" : "Place Purchase Order"}</span>
                </button>

                {/* 2. زر تمويل */}
                <button
                    type="button"
                    onClick={onFinance || onOrder}
                    className="flex h-[46px] sm:h-[48px] items-center justify-center gap-2 rounded-md bg-[#1A1F2E] text-[13px] sm:text-[14px] font-bold text-white shadow-xs transition duration-200 hover:bg-[#2A3144] active:scale-[0.99] cursor-pointer"
                >
                    <CreditCard size={16} className="text-[#DDBB72]" />
                    <span>{isRTL ? "طلب تمويل" : "Apply for Finance"}</span>
                </button>
            </div>
        </div>
    );
}


