import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

import LazyImg from "./LazyImg";

import type { IHomeHeroProps } from "../interfaces/IHomeHeroProps";

export type { IHomeHeroSlide } from "../interfaces/IHomeHeroSlide";

export default function HomeHero({
    slides,
    autoPlayInterval = 5000,
}: IHomeHeroProps) {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [index, setIndex] = useState(0);

    const total = slides.length;
    const current = slides[index];

    const goTo = useCallback(
        (newIndex: number) => {
            if (!total) {
                return;
            }

            setIndex(((newIndex % total) + total) % total);
        },
        [total],
    );

    useEffect(() => {
        if (total <= 1 || autoPlayInterval <= 0) {
            return;
        }

        const intervalId = window.setInterval(() => {
            setIndex((previousIndex) => (previousIndex + 1) % total);
        }, autoPlayInterval);

        return () => {
            window.clearInterval(intervalId);
        };
    }, [autoPlayInterval, total]);

    useEffect(() => {
        if (index >= total && total > 0) {
            setIndex(0);
        }
    }, [index, total]);

    if (!current) {
        return null;
    }

    return (
        <section className="w-full py-6 sm:py-8 lg:py-10">
            <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
                <div
                    dir="ltr"
                    className="relative overflow-hidden rounded-[16px]"
                >
                    <div className="relative h-[54vh] min-h-[240px] sm:h-[62vh] lg:h-[68vh]">
                        {slides.map((slide, slideIndex) => (
                            <LazyImg
                                key={slide.id}
                                src={slide.image}
                                alt={slide.alt || ""}
                                eager
                                className={[
                                    "absolute inset-0 h-full w-full object-cover",
                                    "transition-opacity duration-700 ease-in-out",
                                    slideIndex === index
                                        ? "opacity-100"
                                        : "pointer-events-none opacity-0",
                                ].join(" ")}
                            />
                        ))}

                        {current.buttonText && (
                            <button
                                type="button"
                                onClick={() =>
                                    current.detailsTo &&
                                    navigate(current.detailsTo)
                                }
                                className={[
                                    "absolute bottom-6 start-6 z-20",
                                    "flex h-[46px] items-center justify-center",
                                    "bg-[var(--brand-primary-color)] px-6",
                                    "text-[14px] font-bold text-[#20283A]",
                                    "transition duration-300 hover:brightness-95",
                                ].join(" ")}
                            >
                                {current.buttonText}
                            </button>
                        )}

                        {total > 1 && (
                            <>
                                <button
                                    type="button"
                                    onClick={() => goTo(index - 1)}
                                    aria-label={t("hero.slider.prev")}
                                    className={[
                                        "absolute start-3 top-1/2 z-20 -translate-y-1/2",
                                        "flex h-9 w-9 items-center justify-center rounded-full",
                                        "bg-white/90 text-[#20283A] shadow-sm",
                                        "transition duration-300 hover:bg-white",
                                    ].join(" ")}
                                >
                                    <ChevronLeft size={18} />
                                </button>

                                <button
                                    type="button"
                                    onClick={() => goTo(index + 1)}
                                    aria-label={t("hero.slider.next")}
                                    className={[
                                        "absolute end-3 top-1/2 z-20 -translate-y-1/2",
                                        "flex h-9 w-9 items-center justify-center rounded-full",
                                        "bg-white/90 text-[#20283A] shadow-sm",
                                        "transition duration-300 hover:bg-white",
                                    ].join(" ")}
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {total > 1 && (
                    <div
                        dir="ltr"
                        className="mt-4 flex items-center justify-center gap-2"
                    >
                        {slides.map((slide, slideIndex) => (
                            <button
                                key={slide.id}
                                type="button"
                                onClick={() => goTo(slideIndex)}
                                aria-label={`${t("hero.slider.goTo")} ${slideIndex + 1}`}
                                className={[
                                    "h-[6px] rounded-full transition-all duration-300",
                                    slideIndex === index
                                        ? "w-[28px] bg-[var(--brand-primary-color)]"
                                        : "w-[8px] bg-[#D9D9D9]",
                                ].join(" ")}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
