import { useTranslation } from "react-i18next";

import Button from "./button";
import CarCard from "./CarCard";
import SlideArrow from "./SlideArrow";
import BudgetCarsRangeFilters from "./BudgetCarsRangeFilters";
import RiyalLabel from "./RiyalLabel";
import { useInfiniteCarousel, GAP } from "../hooks/useInfiniteCarousel";

import type { IBudgetCarsSectionProps } from "../interfaces/IBudgetCarsSectionProps";
import type { IBudgetRange } from "../interfaces/IBudgetRange";
import { useLanguageStore } from "../store/language.store";

function useDefaultRanges(t: (key: string) => string): IBudgetRange[] {
    return [
        {
            label: <RiyalLabel text={t("budgetCars.ranges.0")} />,
            value: "3000-4000",
        },
        {
            label: <RiyalLabel text={t("budgetCars.ranges.1")} />,
            value: "4000-6000",
        },
        {
            label: <RiyalLabel text={t("budgetCars.ranges.2")} />,
            value: "7000-9000",
        },
        {
            label: <RiyalLabel text={t("budgetCars.ranges.3")} />,
            value: "9000-plus",
        },
    ];
}

export default function BudgetCarsSection({
    titleBlue,
    description,
    buttonText,
    buttonTo,
    cars,
    ranges,
    activeRange,
    itemsPerPage,
    onRangeChange,
}: IBudgetCarsSectionProps) {
    const { t } = useTranslation();
    const { direction } = useLanguageStore();
    const isRTL = direction === "rtl";

    const {
        track,
        containerRef,
        cardWidth,
        translateX,
        animated,
        canLoop,
        setIsPaused,
        next,
        prev,
        onTransitionEnd,
    } = useInfiniteCarousel({
        items: cars,
        isRTL,
        visibleCount: itemsPerPage,
    });

    const defaultRanges = useDefaultRanges(t);
    const resolvedRanges = ranges ?? defaultRanges;
    const isEmpty = cars.length === 0;

    return (
        <section
            dir={direction}
            className="w-full py-12 sm:py-16 lg:py-20"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header bar */}
                <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                    <div className="text-start">
                        <h2 className="text-[28px] font-bold! text-[#0D0D0D] lg:text-[28px]">
                            {titleBlue}
                        </h2>
                    </div>

                    <BudgetCarsRangeFilters
                        ranges={resolvedRanges}
                        activeRange={activeRange}
                        onRangeChange={onRangeChange}
                    />
                </div>

                {/* Carousel / Empty state */}
                {isEmpty ? (
                    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                        <span className="text-[48px]">🚗</span>
                        <p className="text-[18px] font-bold text-[#0D0D0D]">
                            {t("budgetCars.empty.title")}
                        </p>
                        <p className="text-[14px] text-[#9CA3AF]">
                            {t("budgetCars.empty.subtitle")}
                        </p>
                    </div>
                ) : (
                    <div ref={containerRef} className="overflow-hidden">
                        <div
                            className="flex"
                            style={{
                                columnGap: `${GAP}px`,
                                transform: `translateX(${translateX}px)`,
                                transition: animated
                                    ? "transform 300ms ease-in-out"
                                    : "none",
                            }}
                            onTransitionEnd={onTransitionEnd}
                        >
                            {track.map((car, i) => (
                                <div
                                    key={`${car.id}-${i}`}
                                    dir={isRTL ? "rtl" : "ltr"}
                                    style={{
                                        width: `${cardWidth}px`,
                                        flexShrink: 0,
                                    }}
                                >
                                    <CarCard {...car} eager={i < 4} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Arrows */}
                {canLoop && !isEmpty && (
                    <div
                        dir="ltr"
                        className="mt-8 flex items-center justify-center gap-6"
                    >
                        <SlideArrow
                            direction="prev"
                            onClick={isRTL ? next : prev}
                            className="h-10! w-10! rounded-[5px]! border-[var(--brand-secondary-color)]! bg-transparent! text-[var(--brand-secondary-color)]! shadow-none!"
                        />
                        <SlideArrow
                            direction="next"
                            onClick={isRTL ? prev : next}
                            className="h-10! w-10! rounded-[5px]! border-[var(--brand-secondary-color)]! bg-transparent! text-[var(--brand-secondary-color)]! shadow-none!"
                        />
                    </div>
                )}
            </div>
        </section>
    );
}
