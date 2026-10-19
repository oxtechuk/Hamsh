import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ShoppingCart } from "lucide-react";

import LazyImg from "./LazyImg";
import CarDetailsModal from "./CarDetailsModal";
import CarOrderModal from "./CarOrderModal";
import type { ICarCardProps } from "../interfaces/ICarCardProps";
import { buildCarSpecPills } from "../utils/car-card-utils";
import { resolveHighlight } from "../utils/badge-utils";
import { SHOW_CAR_DETAILS_AS_MODAL } from "../constants/feature-flags";
import { useSettingsStore } from "../store/settings.store";
import { getCarBySlug } from "../services/api";

const MAX_VISIBLE_PILLS = 2;

export default function CarCard({
    image,
    brand,
    name,
    year,
    type,
    fuelType,
    transmission,
    seats,
    price,
    monthlyPrice,
    minSalary,
    rawPrice,
    rawMonthlyPrice,
    detailsTo,
    slug,
    compareText,
    reserveText,
    badgeText,
    badgeColor,
    eager,
}: ICarCardProps) {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const direction = i18n.dir();
    const isRTL = direction === "rtl";

    const carPopupEnabled = useSettingsStore(
        (state) => state.settings?.car_popup_enabled ?? SHOW_CAR_DETAILS_AS_MODAL,
    );

    const installmentLabel = isRTL
        ? t("carCard.installmentStartsFrom", "القسط لراتب يبدأ من")
        : t("carCard.installmentStartsFrom", "Installment starts from");

    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [orderMode, setOrderMode] = useState<"finance" | "cash">("cash");

    // Fetch car details when direct order/finance modal is triggered
    const { data: carDetails } = useQuery({
        queryKey: ["car-details-card", slug],
        queryFn: () => getCarBySlug(slug!),
        enabled: Boolean(showOrderModal && slug),
    });

    const resolvedBadge = resolveHighlight(badgeText, i18n.language);
    const finalBadge = resolvedBadge
        ? {
            text: resolvedBadge.text,
            color: badgeColor ?? resolvedBadge.color ?? "rgb(223, 166, 85)",
        }
        : { text: isRTL ? "أحدث السيارات" : "New Arrival", color: "rgb(223, 166, 85)" };

    const handleOpenDetails = () => {
        if (carPopupEnabled && slug) {
            setShowDetailsModal(true);
            return;
        }

        navigate(detailsTo);
    };

    const handleOpenOrder = (mode: "cash" | "finance") => {
        setOrderMode(mode);
        if (carPopupEnabled && slug) {
            setShowOrderModal(true);
            return;
        }

        if (mode === "finance") {
            navigate("/finance-calculator");
        } else {
            navigate(detailsTo);
        }
    };

    const specPills = buildCarSpecPills(t, transmission, fuelType, seats);
    const visiblePills = specPills.slice(0, MAX_VISIBLE_PILLS);
    const hiddenPillsCount = specPills.length - visiblePills.length;

    const numericMonthly =
        typeof rawMonthlyPrice === "number" && rawMonthlyPrice > 0
            ? rawMonthlyPrice
            : typeof monthlyPrice === "number" && monthlyPrice > 0
                ? monthlyPrice
                : typeof monthlyPrice === "string"
                    ? parseFloat(monthlyPrice.replace(/[^\d.]/g, "")) || 0
                    : 0;

    const displayMonthlyText = numericMonthly > 0
        ? `${numericMonthly.toLocaleString(isRTL ? "ar-SA" : "en-US")} ${isRTL ? "ر.س / شهرياً" : "SAR / month"}`
        : monthlyPrice
            ? <>{monthlyPrice} {isRTL ? "/ شهرياً" : "/ month"}</>
            : (isRTL ? "1,650 ر.س / شهرياً" : "1,650 SAR / month");

    const numericSalary =
        typeof minSalary === "number" && minSalary > 0
            ? minSalary
            : typeof minSalary === "string"
                ? parseFloat(minSalary.replace(/[^\d.]/g, "")) || 0
                : 0;

    const salaryBadgeText = numericSalary > 0
        ? (isRTL ? `من ${numericSalary.toLocaleString("ar-SA")} ر.س` : `From ${numericSalary.toLocaleString("en-US")} SAR`)
        : (isRTL ? "من 5,000 ر.س" : "From 5,000 SAR");

    const numericCash =
        typeof rawPrice === "number" && rawPrice > 0
            ? rawPrice
            : typeof price === "number" && price > 0
                ? price
                : typeof price === "string"
                    ? parseFloat(price.replace(/[^\d.]/g, "")) || 0
                    : 0;

    const displayCashText = numericCash > 0
        ? `${numericCash.toLocaleString(isRTL ? "ar-SA" : "en-US")} ${isRTL ? "ر.س" : "SAR"}`
        : price;

    return (
        <>
            <article
                dir={direction}
                onClick={handleOpenDetails}
                className="group relative flex w-full flex-col overflow-hidden rounded-xl border border-[#E8E7E3] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-1 hover:shadow-md cursor-pointer"
            >
                <div className="relative h-[210px] sm:h-[230px] w-full shrink-0 overflow-hidden bg-[#F4F4F4]">
                    <div className="relative overflow-hidden h-full w-full object-cover transition-transform duration-500 group-hover:scale-105">
                        <LazyImg
                            src={image}
                            alt={`${brand} ${name}`}
                            eager={eager}
                            className="w-full h-full object-cover relative z-10 opacity-100"
                        />
                    </div>
                    {finalBadge && (
                        <div className="absolute start-3 top-3 z-10">
                            <span
                                className="inline-flex items-center justify-center px-3 py-1 text-[12px] font-bold text-white shadow-xs rounded-sm"
                                style={{
                                    backgroundColor:
                                        finalBadge.color || "rgb(223, 166, 85)",
                                }}
                            >
                                {finalBadge.text}
                            </span>
                        </div>
                    )}
                </div>

                <div className="flex flex-1 flex-col justify-between border-b-2 border-[#E3E1DC] p-5 text-start">
                    <div>
                        <div className="flex items-center justify-between gap-2">
                            <p className="truncate text-[13px] font-bold text-[#DFA655]">
                                {brand || t("carCard.defaultBrand")}
                            </p>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenDetails();
                                }}
                                className="shrink-0 text-[12px] font-bold text-[#555555] hover:text-[#DFA655] transition-all cursor-pointer flex items-center gap-1 group/btn px-2.5 py-1 rounded-[6px] bg-[#F5F2EC] hover:bg-[#eae5db] active:scale-95"
                            >
                                <span>{isRTL ? "تفاصيل السيارة" : "Car Details"}</span>
                                <span className="transition-transform group-hover/btn:translate-x-[-2px]">
                                    {isRTL ? "←" : "→"}
                                </span>
                            </button>
                        </div>

                        <h3
                            title={`${brand} ${name}`}
                            className="mt-1.5 line-clamp-1 text-[19px] sm:text-[20px] font-black leading-snug text-[#111111]"
                        >
                            {name}
                        </h3>

                        <div className="mt-3.5 mb-4 flex flex-nowrap items-center gap-1.5 overflow-hidden">
                            {visiblePills.map((pill, index) => (
                                <span
                                    key={index}
                                    className="inline-flex shrink-0 items-center justify-center rounded-[6px] bg-[#F5F2EC] px-3 py-0 text-[12px] font-semibold text-[#475467]"
                                >
                                    {pill}
                                </span>
                            ))}

                            {hiddenPillsCount > 0 && (
                                <span className="inline-flex shrink-0 items-center justify-center rounded-[6px] bg-[#F5F2EC] px-3 py-0 text-[12px] font-semibold text-[#475467]">
                                    +{hiddenPillsCount}
                                </span>
                            )}
                        </div>
                    </div>

                    <div>
                        {/* Finance Details Box */}
                        <div className="mb-3.5 flex items-center justify-between rounded-xl border border-[#EEF2F6] bg-[#F8FAFC] px-3.5 py-2.5 text-start">
                            {/* Installment Starts From */}
                            <div className="text-start">
                                <p className="text-[11px] sm:text-[12px] font-medium text-[#737C8E]">
                                    {isRTL ? "القسط يبدأ من:" : "Installment starts from:"}
                                </p>
                                <p className="mt-0.5 text-[15px] sm:text-[16px] font-black text-[#1E283A]">
                                    {displayMonthlyText}
                                </p>
                            </div>

                            {/* Salary Required */}
                            <div className="flex flex-col items-end text-end">
                                <p className="text-[11px] sm:text-[12px] font-medium text-[#737C8E]">
                                    {isRTL ? "بدون دفعة  اولة لراتب:" : "Zero down payment for salary:"}
                                </p>
                                <span className="mt-1 inline-flex items-center rounded-md bg-[#EDF0F5] px-2.5 py-0.5 text-[11px] sm:text-[12px] font-bold text-[#1E283A]">
                                    {salaryBadgeText}
                                </span>
                            </div>
                        </div>

                        {/* Action Buttons: Cash Order & Finance Request */}
                        <div
                            className="grid grid-cols-2 gap-2.5"
                            onClick={(event) => event.stopPropagation()}
                        >
                            {/* Direct Cash Order Button (Dashed Green) */}
                            <button
                                type="button"
                                onClick={() => handleOpenOrder("cash")}
                                className="flex h-[52px] w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#22C55E] bg-[#F0FDF4]/50 p-1 transition duration-200 hover:border-[#16A34A] hover:bg-[#DCFCE7]/70 active:scale-95 cursor-pointer shadow-xs"
                            >
                                <div className="flex items-center gap-1 text-[11px] sm:text-[12px] font-bold text-[#15803D]">
                                    <ShoppingCart size={13} strokeWidth={2.5} className="shrink-0" />
                                    <span>{isRTL ? "طلب كاش مباشر" : "Direct Cash Order"}</span>
                                </div>
                                <div className="mt-0.5 text-[13px] sm:text-[14px] font-black text-[#15803D] leading-tight">
                                    {displayCashText}
                                </div>
                            </button>

                            {/* Finance Request Button (Solid Red) */}
                            <button
                                type="button"
                                onClick={() => handleOpenOrder("finance")}
                                className="flex h-[52px] w-full items-center justify-center rounded-xl bg-[#C01A24] px-3 text-[14px] sm:text-[15px] font-bold text-white shadow-xs transition duration-200 hover:bg-[#A3151E] active:scale-95 cursor-pointer"
                            >
                                <span>{isRTL ? "طلب تمويل" : "Finance Request"}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </article>

            {/* Details Modal */}
            {showDetailsModal && slug && (
                <CarDetailsModal
                    slug={slug}
                    onClose={() => setShowDetailsModal(false)}
                />
            )}

            {/* Direct Order / Finance Modal */}
            {showOrderModal && carDetails && (
                <CarOrderModal
                    car={carDetails}
                    initialMode={orderMode}
                    onClose={() => setShowOrderModal(false)}
                />
            )}
        </>
    );
}
