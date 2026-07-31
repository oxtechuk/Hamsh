import { useTranslation } from "react-i18next";

import CarCard from "./CarCard";
import SlideArrow from "./SlideArrow";
import BudgetCarsRangeFilters from "./BudgetCarsRangeFilters";
import { useInfiniteCarousel } from "../hooks/useInfiniteCarousel";

import type { IBudgetCarsSectionProps } from "../interfaces/IBudgetCarsSectionProps";
import type { IBudgetRange } from "../interfaces/IBudgetRange";
import { useLanguageStore } from "../store/language.store";
import { APP_IMAGES } from "../constants/app-images";

function RiyalLabel({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center gap-1">
      <span>{text}</span>
      <span
        aria-label="ريال"
        className="inline-block h-[13px] w-[13px] shrink-0"
        style={{
          backgroundColor: "currentColor",
          WebkitMask: `url(${APP_IMAGES.RIYAL}) center / contain no-repeat`,
          mask: `url(${APP_IMAGES.RIYAL}) center / contain no-repeat`,
        }}
      />
    </span>
  );
}

function useDefaultRanges(t: (key: string) => string): IBudgetRange[] {
  return [
    { label: <RiyalLabel text={t("budgetCars.ranges.0")} />, value: "3000-4000" },
    { label: <RiyalLabel text={t("budgetCars.ranges.1")} />, value: "4000-6000" },
    { label: <RiyalLabel text={t("budgetCars.ranges.2")} />, value: "7000-9000" },
    { label: <RiyalLabel text={t("budgetCars.ranges.3")} />, value: "9000-plus" },
  ];
}

export default function BudgetCarsSection({
  titleBlue,
  cars,
  ranges,
  activeRange,
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
  });

  const defaultRanges = useDefaultRanges(t);
  const resolvedRanges = ranges ?? defaultRanges;
  const isEmpty = cars.length === 0;

  return (
    <section
      className="w-full bg-white py-25"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header bar */}
        <div className={`mb-8 flex flex-wrap items-center justify-between gap-4 `}>
          <h2 className="text-[28px] font-extrabold text-[#0D0D0D] lg:text-[32px]">
            {titleBlue}
          </h2>
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
              {t("budgetCars.empty.title", "لا توجد سيارات")}
            </p>
            <p className="text-[14px] text-[#9CA3AF]">
              {t("budgetCars.empty.subtitle", "لا توجد سيارات ضمن هذا النطاق السعري حالياً")}
            </p>
          </div>
        ) : (
          <>
            {/* Carousel */}
            <div ref={containerRef} className="overflow-hidden">
              <div
                className="flex"
                style={{
                  transform: `translateX(${translateX}px)`,
                  transition: animated ? "transform 300ms ease-in-out" : "none",
                }}
                onTransitionEnd={onTransitionEnd}
              >
                {track.map((car, i) => (
                  <div
                    key={`${car.id}-${i}`}
                    dir={isRTL ? "rtl" : "ltr"}
                    style={{ width: `${cardWidth}px`, flexShrink: 0 }}
                  >
                    <CarCard {...car} />
                  </div>
                ))}
              </div>
            </div>

            {/* Arrows */}
            {canLoop && (
              <div dir="ltr" className="mt-8 flex items-center justify-center gap-6">
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
          </>
        )}
      </div>
    </section>
  );
}
