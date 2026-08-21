import { useCallback, useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import SlideArrow from "./SlideArrow";
import LazyImg from "./LazyImg";

import type { IHomeOfferSlide } from "../interfaces/IHomeOfferSlide";
import type { IHomeOffersSectionProps } from "../interfaces/IHomeOffersSectionProps";

export type { IHomeOfferSlide as HomeOfferSlide };

export default function HomeOffersSection({
    slides,
    autoPlay = true,
    interval = 5000,
    className = "",
}: IHomeOffersSectionProps) {
    const { i18n, t } = useTranslation();
    const navigate = useNavigate();

    const direction = i18n.dir();
    const isRTL = direction === "rtl";

    const [currentSlide, setCurrentSlide] = useState(0);

    const [isPaused, setIsPaused] = useState(false);

    const totalSlides = slides.length;
    const activeSlide = slides[currentSlide];

    const goToSlide = useCallback(
        (index: number) => {
            if (!totalSlides) {
                return;
            }

            setCurrentSlide(
                ((index % totalSlides) + totalSlides) % totalSlides,
            );
        },
        [totalSlides],
    );

    const nextSlide = useCallback(() => {
        if (!totalSlides) {
            return;
        }

        setCurrentSlide((previous) => (previous + 1) % totalSlides);
    }, [totalSlides]);

    const previousSlide = useCallback(() => {
        if (!totalSlides) {
            return;
        }

        setCurrentSlide(
            (previous) => (previous - 1 + totalSlides) % totalSlides,
        );
    }, [totalSlides]);

    useEffect(() => {
        if (!autoPlay || isPaused || totalSlides <= 1) {
            return;
        }

        const intervalId = window.setInterval(nextSlide, interval);

        return () => {
            window.clearInterval(intervalId);
        };
    }, [autoPlay, interval, isPaused, nextSlide, totalSlides]);

    useEffect(() => {
        if (currentSlide >= totalSlides && totalSlides > 0) {
            setCurrentSlide(0);
        }
    }, [currentSlide, totalSlides]);

    if (!activeSlide) {
        return null;
    }

    const handleNavigate = (path?: string) => {
        if (!path) {
            return;
        }

        if (path.startsWith("http://") || path.startsWith("https://")) {
            window.location.href = path;
            return;
        }

        navigate(path);
    };

    return (
        <section
            dir={direction}
            className={["w-full  py-5", "sm:py-7 lg:py-9", className].join(" ")}
        >
            <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
                <article
                    className={[
                        "group relative w-full overflow-hidden",
                        "bg-[#E4E4E4]",
                        "shadow-[0_4px_18px_rgba(15,23,42,0.04)]",
                    ].join(" ")}
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    {/* Slides */}
                    <div
                        className={[
                            "relative w-full",
                            "aspect-[2.8/1]",
                            "min-h-[260px]",
                            "sm:min-h-[340px]",
                            "lg:min-h-[470px]",
                        ].join(" ")}
                    >
                        {slides.map((slide, slideIndex) => (
                            <div
                                key={slide.id}
                                onClick={() => handleNavigate(slide.buttonTo)}
                                className={[
                                    "absolute inset-0",
                                    "transition-opacity duration-700 ease-in-out",
                                    slide.buttonTo ? "cursor-pointer" : "",
                                    slideIndex === currentSlide
                                        ? "opacity-100"
                                        : "pointer-events-none opacity-0",
                                ].join(" ")}
                            >
                                <picture>
                                    {slide.mobileImage && (
                                        <source
                                            media="(max-width: 639px)"
                                            srcSet={slide.mobileImage}
                                        />
                                    )}

                                    <LazyImg
                                        src={slide.image}
                                        alt={slide.alt ?? ""}
                                        className="h-full w-full object-cover"
                                    />
                                </picture>
                            </div>
                        ))}

                        {/* CTA */}
                        {activeSlide.buttonText && (
                            <button
                                type="button"
                                onClick={() =>
                                    handleNavigate(activeSlide.buttonTo)
                                }
                                className={[
                                    "absolute bottom-0 end-0 z-20",
                                    "flex h-[52px] w-auto",
                                    "items-center justify-center gap-4",
                                    "bg-white px-8",
                                    "text-[18px] font-extrabold",
                                    "text-[#1D2437]",
                                    "transition duration-300",
                                    "hover:bg-[#F6F6F6]",
                                    "sm:h-[60px]",
                                    "sm:w-[247px]",
                                    "sm:text-[21px]",
                                ].join(" ")}
                            >
                                {activeSlide.buttonText}
                                <ArrowUpRight
                                    size={25}
                                    strokeWidth={1.7}
                                    className={isRTL ? "-rotate-90" : ""}
                                />
                            </button>
                        )}

                        {/* Optional second CTA */}
                        {activeSlide.button2Text && (
                            <button
                                type="button"
                                onClick={() =>
                                    handleNavigate(activeSlide.button2To)
                                }
                                className={[
                                    "absolute bottom-[60px] end-0 z-20",
                                    "hidden min-h-[42px]",
                                    "min-w-[210px]",
                                    "items-center justify-center",
                                    "bg-[#E1BE69] px-7",
                                    "text-[15px] font-bold",
                                    "text-[#1D2437]",
                                    "transition hover:bg-[#D4AD4F]",
                                    "sm:flex",
                                ].join(" ")}
                            >
                                {activeSlide.button2Text}
                            </button>
                        )}

                        {/* Navigation */}
                        {totalSlides > 1 && (
                            <div
                                dir="ltr"
                                className={[
                                    "absolute bottom-5 z-20",
                                    "flex items-center gap-5",
                                    isRTL ? "right-5" : "left-5",
                                    "sm:bottom-5 sm:gap-7",
                                    "sm:right-5",
                                ].join(" ")}
                            >
                                <SlideArrow
                                    direction="prev"
                                    onClick={isRTL ? nextSlide : previousSlide}
                                    aria-label={t("homeOffers.previous")}
                                    className={[
                                        "!h-[42px] !w-[42px]",
                                        "!rounded-none",
                                        "!border-0 !bg-white",
                                        "!text-[#1D2437]",
                                        "!shadow-none",
                                        "hover:!bg-[#F5F5F5]",
                                        "sm:!h-[48px]",
                                        "sm:!w-[48px]",
                                    ].join(" ")}
                                />

                                <SlideArrow
                                    direction="next"
                                    onClick={isRTL ? previousSlide : nextSlide}
                                    aria-label={t("homeOffers.next")}
                                    className={[
                                        "!h-[42px] !w-[42px]",
                                        "!rounded-none",
                                        "!border-0 !bg-white",
                                        "!text-[#1D2437]",
                                        "!shadow-none",
                                        "hover:!bg-[#F5F5F5]",
                                        "sm:!h-[48px]",
                                        "sm:!w-[48px]",
                                    ].join(" ")}
                                />
                            </div>
                        )}

                        {/* Small pagination indicators */}
                        {totalSlides > 1 && (
                            <div
                                dir="ltr"
                                className={[
                                    "absolute top-4 z-20",
                                    "flex items-center gap-1.5",
                                    isRTL ? "left-4" : "right-4",
                                ].join(" ")}
                            >
                                {slides.map((slide, slideIndex) => (
                                    <button
                                        key={slide.id}
                                        type="button"
                                        onClick={() => goToSlide(slideIndex)}
                                        aria-label={`${t("homeOffers.goTo")} ${slideIndex + 1}`}
                                        className={[
                                            "h-[5px] rounded-full",
                                            "transition-all duration-300",
                                            slideIndex === currentSlide
                                                ? "w-[30px] bg-white"
                                                : "w-[10px] bg-white/50",
                                        ].join(" ")}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </article>
            </div>
        </section>
    );
}
