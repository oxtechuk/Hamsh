import { useTranslation } from "react-i18next";

import Button from "./button";
import CarCard from "./CarCard";
import SlideArrow from "./SlideArrow";
import { useInfiniteCarousel, GAP } from "../hooks/useInfiniteCarousel";

import type { IFeaturedCarsSectionProps } from "../interfaces/IFeaturedCarsSectionProps";

export default function FeaturedCarsSection({
    titleBlue,
    buttonText,
    buttonTo,
    cars,
    backgroundImage,
    className = "",
    itemsPerPage,
    emptyMessage,
}: IFeaturedCarsSectionProps) {
    const { i18n } = useTranslation();
    const isRTL = i18n.dir() === "rtl";

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

    if (!cars.length) {
        if (emptyMessage) {
            return (
                <section
                    dir={i18n.dir()}
                    className={`relative w-full overflow-hidden py-10 sm:py-12 lg:py-14  ${className}`}
                >
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex min-h-[200px] items-center justify-center">
                            <p className="text-lg text-[#6EA9F5]">
                                {emptyMessage}
                            </p>
                        </div>
                    </div>
                </section>
            );
        }
        return null;
    }

    return (
        <section
            dir={i18n.dir()}
            className={`relative w-full overflow-hidden py-10 sm:py-12 lg:py-14 ${className}`}
            style={
                backgroundImage
                    ? {
                          backgroundImage: `url(${backgroundImage})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                      }
                    : undefined
            }
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onFocus={() => setIsPaused(true)}
            onBlur={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
        >
            {backgroundImage && <div className="absolute inset-0" />}

            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                    <div className="text-start">
                        <p className="text-[32px] text-[var(--brand-secondary-color)] font-bold">
                            {titleBlue}
                        </p>
                    </div>

                    {canLoop && (
                        <div
                            dir="ltr"
                            className="flex items-center justify-center gap-6"
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

                {/* Carousel */}
                <div
                    ref={containerRef}
                    className="w-full overflow-hidden px-6 sm:px-0"
                >
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
                                <CarCard {...car} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-10 flex justify-center">
                    <Button
                        bgColor=""
                        to={buttonTo}
                        className="w-full px-6 py-2.5 text-[13px] md:w-auto md:px-8 md:py-3 md:text-[15px] bg-[var(--brand-secondary-color)]!"
                    >
                        {buttonText}
                    </Button>
                </div>
            </div>
        </section>
    );
}
