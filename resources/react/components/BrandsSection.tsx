import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

import Button from "./button";
import LazyImg from "./LazyImg";
import SlideArrow from "./SlideArrow";
import type { IBrandsSectionProps } from "../interfaces/IBrandsSectionProps";
import type { IBrandCardProps } from "../interfaces/IBrandCardProps";

const ITEM_WIDTH = 170 + 48;
const NUDGE_PX = 218;
const SPEED = 25;

export default function BrandsSection({
    titleBlue,
    buttonText,
    buttonTo,
    brands,
    categories = [],
    activeCategory = "",
    searchPlaceholder,
    onCategoryChange,
    onSearchChange,
}: IBrandsSectionProps) {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const direction = i18n.dir();

    const staticCategories = t("brandsSection.categories", {
        returnObjects: true,
    }) as string[];

    const resolvedCategories = useMemo(
        () =>
            categories.length > 0
                ? categories
                : (Array.isArray(staticCategories) ? staticCategories : [])
                      .filter((label) => label !== t("brandsSection.all"))
                      .map((label) => ({ label, value: label })),
        [categories, staticCategories, t],
    );

    const [searchQuery, setSearchQuery] = useState("");
    const isSearching = searchQuery.trim().length > 0;

    const trackRef = useRef<HTMLDivElement>(null);
    const offsetRef = useRef(0);
    const rafRef = useRef<number>(0);
    const pausedRef = useRef(false);

    function renderBrand(brand: IBrandCardProps, key: string | number) {
        return (
            <button
                key={key}
                type="button"
                onClick={() =>
                    brand.onClick
                        ? brand.onClick()
                        : navigate(`/cars?search=${encodeURIComponent(brand.name)}`)
                }
                className="flex h-auto w-[145px] shrink-0 flex-col items-center justify-center gap-2 px-6 py-5 sm:w-[170px]"
            >
                <LazyImg
                    src={brand.logo}
                    alt={brand.name}
                    className="max-h-[48px] max-w-[105px] object-contain transition duration-300 hover:scale-105 sm:max-h-[54px] sm:max-w-[120px]"
                />
                <span className="text-[13px] font-semibold text-[#151A2A] sm:text-[14px]">
                    {brand.name}
                </span>
            </button>
        );
    }

    const itemWidth = ITEM_WIDTH;
    const viewWidth = typeof window !== "undefined" ? window.innerWidth : 1440;
    const repeats =
        brands.length && !isSearching
            ? Math.max(4, Math.ceil((viewWidth * 3) / (brands.length * itemWidth)))
            : 0;

    const setA: React.ReactNode[] = [];
    const setB: React.ReactNode[] = [];
    for (let i = 0; i < repeats; i++) {
        for (let j = 0; j < brands.length; j++) {
            setA.push(renderBrand(brands[j], `a${i}-${j}`));
            setB.push(renderBrand(brands[j], `b${i}-${j}`));
        }
    }

    useEffect(() => {
        const track = trackRef.current;
        if (!track) return;

        if (isSearching) {
            offsetRef.current = 0;
            track.style.transform = "translateX(0px)";
            return;
        }

        if (!brands.length) return;

        const children = track.children;
        const midpoint = Math.floor(children.length / 2);
        let halfWidth = 0;
        for (let i = 0; i < midpoint; i++) {
            halfWidth += (children[i] as HTMLElement).offsetWidth;
        }
        if (halfWidth <= 0) return;

        const tick = () => {
            if (!pausedRef.current) {
                const pxPerFrame = halfWidth / (SPEED * 60);
                offsetRef.current += pxPerFrame;

                if (offsetRef.current >= halfWidth) {
                    offsetRef.current -= halfWidth;
                }

                track.style.transform = `translateX(${-offsetRef.current}px)`;
            }
            rafRef.current = requestAnimationFrame(tick);
        };

        rafRef.current = requestAnimationFrame(tick);

        return () => cancelAnimationFrame(rafRef.current);
    }, [brands, isSearching]);

    const nudge = (dir: 1 | -1) => {
        const track = trackRef.current;
        if (!track) return;

        const children = track.children;
        const midpoint = Math.floor(children.length / 2);
        let halfWidth = 0;
        for (let i = 0; i < midpoint; i++) {
            halfWidth += (children[i] as HTMLElement).offsetWidth;
        }
        if (halfWidth <= 0) return;

        offsetRef.current =
            ((offsetRef.current + dir * NUDGE_PX) % halfWidth + halfWidth) % halfWidth;

        track.style.transform = `translateX(${-offsetRef.current}px)`;
    };

    return (
        <section dir={direction} className="w-full">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="text-[22px] font-extrabold leading-tight text-[#151A2A] sm:text-[26px]">
                        {titleBlue}
                    </h2>

                    <Button
                        to={buttonTo}
                        bgColor="bg-[var(--brand-primary-color)]"
                        textColor="text-[#151A2A]!"
                        className="!h-[44px] !w-[150px] !rounded-[8px] text-[14px] font-bold shadow-none"
                    >
                        {buttonText}
                    </Button>
                </div>

                {/* Category chips + search */}
                {(resolvedCategories.length > 0 || onSearchChange) && (
                    <div className="mb-8 flex flex-col gap-3 lg:flex-row lg:items-center">
                        {onSearchChange && (
                            <div className="relative min-w-0 w-full lg:w-[632px] lg:shrink-0 lg:grow-0">
                                <Search
                                    size={16}
                                    strokeWidth={1.7}
                                    className="pointer-events-none absolute end-4 top-1/2 -translate-y-1/2 text-[#8B92A2]"
                                />
                                <input
                                    type="search"
                                    value={searchQuery}
                                    onChange={(event) => {
                                        setSearchQuery(event.target.value);
                                        onSearchChange(event.target.value);
                                    }}
                                    placeholder={
                                        searchPlaceholder ?? t("brandsSection.searchPlaceholder")
                                    }
                                    className="h-[42px] w-full border border-[#E1E5EB] bg-white px-4 pe-10 text-[13px] text-[#151A2A] outline-none transition duration-300 placeholder:text-[#8B92A2] focus:border-[#DDBB68]"
                                />
                            </div>
                        )}

                        {resolvedCategories.length > 0 && (
                            <div className="flex flex-wrap items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => onCategoryChange?.("")}
                                    className={[
                                        "h-[38px] shrink-0 whitespace-nowrap border px-4 text-[13px] font-semibold transition duration-300",
                                        activeCategory === ""
                                            ? "border-[#172139] bg-[#172139] text-white"
                                            : "border-[#E1E5EB] bg-white text-[#151A2A] hover:border-[#172139]",
                                    ].join(" ")}
                                >
                                    {t("brandsSection.all")}
                                </button>

                                {resolvedCategories.map((category) => (
                                    <button
                                        key={category.value}
                                        type="button"
                                        onClick={() => onCategoryChange?.(category.value)}
                                        className={[
                                            "h-[38px] shrink-0 whitespace-nowrap border px-4 text-[13px] font-semibold transition duration-300",
                                            activeCategory === category.value
                                                ? "border-[#172139] bg-[#172139] text-white"
                                                : "border-[#E1E5EB] bg-white text-[#151A2A] hover:border-[#172139]",
                                        ].join(" ")}
                                    >
                                        {category.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Brands carousel */}
                {brands.length > 0 && (
                    <div
                        dir={isSearching ? direction : "ltr"}
                        className="flex items-center gap-3"
                    >
                        {!isSearching && (
                            <SlideArrow
                                direction="prev"
                                onClick={() => nudge(-1)}
                                className="shrink-0 border border-[#E1E5EB] bg-white text-[#151A2A] backdrop-blur-none hover:bg-[#F7F7F7]"
                            />
                        )}

                        <div
                            className="relative min-w-0 flex-1 overflow-hidden"
                            onMouseEnter={() => {
                                pausedRef.current = true;
                            }}
                            onMouseLeave={() => {
                                pausedRef.current = false;
                            }}
                        >
                            <div
                                ref={trackRef}
                                className={
                                    isSearching
                                        ? "flex flex-wrap justify-start will-change-transform"
                                        : "flex w-max will-change-transform"
                                }
                            >
                                {isSearching
                                    ? brands.map((brand) => renderBrand(brand, brand.id))
                                    : [...setA, ...setB]}
                            </div>
                        </div>

                        {!isSearching && (
                            <SlideArrow
                                direction="next"
                                onClick={() => nudge(1)}
                                className="shrink-0 border border-[#E1E5EB] bg-white text-[#151A2A] backdrop-blur-none hover:bg-[#F7F7F7]"
                            />
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}
