import { useState, type MouseEvent } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import LazyImg from "./LazyImg";
import CarDetailsModal from "./CarDetailsModal";
import type { ICarCardProps } from "../interfaces/ICarCardProps";
import { buildCarSpecPills } from "../utils/car-card-utils";
import { resolveHighlight } from "../utils/badge-utils";
import { SHOW_CAR_DETAILS_AS_MODAL } from "../constants/feature-flags";

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
    detailsTo,
    slug,
    compareText,
    reserveText,
    badgeText,
    badgeColor,
}: ICarCardProps) {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const direction = i18n.dir();

    const [showDetailsModal, setShowDetailsModal] = useState(false);

    const resolvedBadge = resolveHighlight(badgeText, i18n.language);
    const finalBadge = resolvedBadge
        ? {
              text: resolvedBadge.text,
              color: badgeColor ?? resolvedBadge.color ?? "#DFA655",
          }
        : { text: t("carCard.exclusive"), color: "#DFA655" };

    const handleOpenDetails = () => {
        if (SHOW_CAR_DETAILS_AS_MODAL && slug) {
            setShowDetailsModal(true);
            return;
        }

        navigate(detailsTo);
    };

    const handleCompare = (event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        navigate(
            slug ? `/compare?slug=${encodeURIComponent(slug)}` : "/compare",
        );
    };

    const specPills = buildCarSpecPills(t, transmission, fuelType, seats);
    const visiblePills = specPills.slice(0, MAX_VISIBLE_PILLS);
    const hiddenPillsCount = specPills.length - visiblePills.length;

    return (
        <>
            <article
                dir={direction}
                onClick={handleOpenDetails}
                className={[
                    "group relative flex w-full flex-col overflow-hidden ",
                    "border border-[#E8E7E3] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.03)]",
                    "transition-all duration-300 hover:-translate-y-1 hover:shadow-md cursor-pointer",
                ].join(" ")}
            >
                {/* Image Area */}
                <div className="relative h-[210px] sm:h-[230px] w-full shrink-0 overflow-hidden bg-[#F4F4F4]">
                    <LazyImg
                        src={image}
                        alt={`${brand} ${name}`}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Gold Badge */}
                    {finalBadge && (
                        <div className="absolute start-3 top-3 z-10">
                            <span
                                className="inline-flex items-center justify-center px-3 py-1 text-[12px] font-bold text-white shadow-xs"
                                style={{
                                    backgroundColor:
                                        finalBadge.color || "#DFA655",
                                }}
                            >
                                {finalBadge.text}
                            </span>
                        </div>
                    )}
                </div>

                {/* Content Area */}
                <div className="flex flex-1 flex-col justify-between border-b-2 border-[#E3E1DC] p-5 text-start">
                    <div>
                        {/* Brand & Meta Row */}
                        <div className="flex items-center justify-between gap-2">
                            <p className="truncate text-[13px] font-bold text-[#DFA655]">
                                {brand || t("carCard.defaultBrand")}
                            </p>
                            <p className="shrink-0 text-[12px] font-medium text-[#888888]">
                                {type
                                    ? `${type} · `
                                    : `${t("carCard.defaultType")} · `}
                                {year || t("carCard.defaultYear")}
                            </p>
                        </div>

                        {/* Title */}
                        <h3
                            title={`${brand} ${name}`}
                            className="mt-1.5 line-clamp-1 text-[19px] sm:text-[20px] font-black leading-snug text-[#111111]"
                        >
                            {name}
                        </h3>

                        {/* Spec Pills */}
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
                        {/* Prices Row */}
                        <div className="mb-5 flex items-baseline justify-between gap-2 text-start">
                            {/* Cash price */}
                            <div className="text-start">
                                <p className="text-[12px] font-medium ">
                                    {t("carCard.cashPrice")}
                                </p>
                                <p className="mt-0.5 text-[22px] sm:text-[24px] font-black text-[#111111]">
                                    {price}
                                </p>
                            </div>

                            {/* Monthly price */}
                            {monthlyPrice ? (
                                <div>
                                    <p className="text-[12px] font-medium">
                                        {t("carCard.monthlyPayment")}
                                    </p>
                                    <p className="mt-0.5 text-[18px] sm:text-[19px] font-extrabold text-[#DFA655]">
                                        {monthlyPrice}
                                    </p>
                                </div>
                            ) : (
                                <div />
                            )}
                        </div>

                        {/* Action Buttons Row */}
                        <div
                            className="grid grid-cols-2 gap-3"
                            onClick={(event) => event.stopPropagation()}
                        >
                            {/* Details Button */}
                            <button
                                type="button"
                                onClick={handleOpenDetails}
                                className="flex h-[44px] w-full items-center justify-center rounded-[4px] bg-[#DFA655] text-[15px] font-bold text-white shadow-xs transition hover:bg-[#c89345] active:scale-95 cursor-pointer"
                            >
                                {reserveText ?? t("carCard.details")}
                            </button>

                            {/* Compare Button */}
                            <button
                                type="button"
                                onClick={handleCompare}
                                className="flex h-[44px] w-full items-center justify-center rounded-[4px] border border-[#D0D5DD] bg-white text-[14px] font-bold text-[#344054] transition hover:bg-gray-50 active:scale-95 cursor-pointer"
                            >
                                {compareText ?? t("carCard.compare")}
                            </button>
                        </div>
                    </div>
                </div>
            </article>

            {showDetailsModal && slug && (
                <CarDetailsModal
                    slug={slug}
                    onClose={() => setShowDetailsModal(false)}
                />
            )}
        </>
    );
}
