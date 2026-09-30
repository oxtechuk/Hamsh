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

    const handleNavigate = useCallback(
        (url?: string) => {
            if (!url) {
                return;
            }

            if (url.startsWith("http://") || url.startsWith("https://")) {
                window.open(url, "_blank", "noopener,noreferrer");
            } else {
                navigate(url);
            }
        },
        [navigate],
    );

    const hasAnyMobileImage = slides.some((slide) => Boolean(slide.imageMobile));

    return (
        <section className="w-full py-4 sm:py-6 lg:py-8">
            <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
                <div
                    dir="ltr"
                    className="relative overflow-hidden rounded-[16px] shadow-sm bg-neutral-900"
                >
                    <div
                        className={[
                            "relative w-full overflow-hidden",
                            hasAnyMobileImage
                                ? "aspect-[4/3] sm:aspect-[16/7] md:aspect-[1920/550]"
                                : "aspect-[1920/550]",
                        ].join(" ")}
                        style={{
                            aspectRatio: hasAnyMobileImage ? undefined : "1920 / 550",
                        }}
                    >
                        {slides.map((slide, slideIndex) => {
                            const isCurrent = slideIndex === index;
                            const desktopSrc = slide.imageDesktop || slide.image;
                            const hasLink = Boolean(slide.detailsTo);

                            return (
                                <div
                                    key={slide.id}
                                    role={isCurrent && hasLink ? "link" : undefined}
                                    tabIndex={isCurrent && hasLink ? 0 : undefined}
                                    onClick={() => {
                                        if (isCurrent && hasLink) {
                                            handleNavigate(slide.detailsTo);
                                        }
                                    }}
                                    onKeyDown={(e) => {
                                        if (isCurrent && hasLink && (e.key === "Enter" || e.key === " ")) {
                                            e.preventDefault();
                                            handleNavigate(slide.detailsTo);
                                        }
                                    }}
                                    className={[
                                        "absolute inset-0 h-full w-full",
                                        "transition-opacity duration-700 ease-in-out",
                                        isCurrent
                                            ? "opacity-100 z-10"
                                            : "pointer-events-none opacity-0 z-0",
                                        isCurrent && hasLink ? "cursor-pointer" : "",
                                    ].join(" ")}
                                >
                                    <picture className="block h-full w-full">
                                        {slide.imageMobile && (
                                            <source
                                                media="(max-width: 768px)"
                                                srcSet={slide.imageMobile}
                                            />
                                        )}
                                        <img
                                            src={desktopSrc}
                                            alt={slide.alt || ""}
                                            loading={isCurrent ? "eager" : "lazy"}
                                            decoding="async"
                                            className="h-full w-full object-cover object-center"
                                        />
                                    </picture>
                                </div>
                            );
                        })}

                        {current.buttonText && (
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleNavigate(current.detailsTo);
                                }}
                                style={{
                                    backgroundColor: "var(--brand-button-bg, var(--brand-primary-color))",
                                    color: "var(--brand-button-text, #20283A)",
                                }}
                                className={[
                                    "absolute bottom-6 start-6 z-20",
                                    "hidden sm:flex h-[46px] items-center justify-center",
                                    "px-6 rounded-[8px]",
                                    "text-[14px] font-bold shadow-md",
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
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        goTo(index - 1);
                                    }}
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
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        goTo(index + 1);
                                    }}
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
