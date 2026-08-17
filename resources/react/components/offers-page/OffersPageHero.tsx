import { useEffect, useMemo, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { getCountdownParts, padTime } from "../../utils/countdown";
import { formatPrice } from "../../utils/format";

import type { IOffersPageHeroProps } from "../../interfaces/IOffersPageHeroProps";
import type { ITimeUnitProps } from "../../interfaces/ITimeUnitProps";
import LazyImg from "../LazyImg";

/* -------------------------------------------------------------------------- */
/* Countdown                                                                  */
/* -------------------------------------------------------------------------- */

function TimeUnit({ value, label, locale }: ITimeUnitProps) {
    return (
        <div
            className={[
                "flex flex-col",
                "items-center justify-center gap-1",
                "h-[56px] w-full min-w-0",
                "sm:h-[64px]",
                "bg-[#EEE9DF]",
                "px-1 sm:px-2",
            ].join(" ")}
        >
            <strong className="text-[18px] font-extrabold leading-none text-[#20283A] sm:text-[22px] lg:text-[24px]">
                {padTime(value, locale)}
            </strong>

            <span className="text-[9px] text-[#697083] sm:text-[10px] lg:text-[11px]">
                {label}
            </span>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/* Hero                                                                       */
/* -------------------------------------------------------------------------- */

export default function OffersPageHero({
    image,

    badgeText,
    title1,
    title2,
    description,

    carLabel,
    endsAt,

    primaryButtonText,
    primaryButtonTo,

    countdown,
    specialPrice,
    discountPercent,
}: IOffersPageHeroProps) {
    const { t, i18n } = useTranslation();

    const direction = i18n.dir();
    const isRTL = direction === "rtl";

    /* ---------------------------------------------------------------------- */
    /* Countdown target                                                       */
    /* ---------------------------------------------------------------------- */

    const target = useMemo(() => {
        if (countdown && !countdown.is_expired) {
            const now = new Date();

            return new Date(
                now.getTime() +
                    countdown.days * 86400000 +
                    countdown.hours * 3600000 +
                    countdown.minutes * 60000 +
                    countdown.seconds * 1000,
            );
        }

        if (endsAt) {
            const parsed = new Date(endsAt);
            return Number.isNaN(parsed.getTime()) ? null : parsed;
        }

        return null;
    }, [countdown, endsAt]);

    const [timeLeft, setTimeLeft] = useState(() =>
        target
            ? getCountdownParts(target)
            : {
                  days: 0,
                  hours: 0,
                  minutes: 0,
                  seconds: 0,
              },
    );

    useEffect(() => {
        if (!target) {
            return;
        }

        setTimeLeft(getCountdownParts(target));

        const intervalId = window.setInterval(() => {
            setTimeLeft(getCountdownParts(target));
        }, 1000);

        return () => {
            window.clearInterval(intervalId);
        };
    }, [target]);

    /* ---------------------------------------------------------------------- */
    /* Dynamic values                                                         */
    /* ---------------------------------------------------------------------- */

    const pageTitleBlack = title2?.trim() ?? "";

    const pageTitleGold = title1?.trim() ?? "";

    const pageDescription = description?.trim() ?? "";

    const featuredTitle = carLabel?.trim() ?? "";

    const featuredDescription = discountPercent
        ? t("offersPage.hero.discount", { percent: discountPercent })
        : "";

    const resolvedButtonText = primaryButtonText?.trim() ?? "";

    const resolvedButtonTo = primaryButtonTo?.trim() || "/offers";

    const currentPrice =
        specialPrice && Number(specialPrice) > 0
            ? Number(specialPrice)
            : 0;

    const oldPrice =
        currentPrice > 0 && discountPercent
            ? Math.round(currentPrice * (1 + discountPercent / 100))
            : 0;

    return (
        <section
            dir={direction}
            className="w-full bg-[var(--background)] pb-12 pt-8 sm:pb-16 sm:pt-10 lg:pb-20 lg:pt-12"
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* ================================================================ */}
                {/* Page heading                                                     */}
                {/* ================================================================ */}

                <div className="flex flex-col justify-center text-start py-2">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-[12px] sm:text-[13px]">
                        <NavLink
                            to="/"
                            className="font-semibold text-[#303A54] transition hover:text-[var(--brand-primary-color)]"
                        >
                            {t("nav.home")}
                        </NavLink>

                        <ChevronLeft
                            size={14}
                            strokeWidth={1.6}
                            className={[
                                "text-[#6F7480]",
                                !isRTL ? "rotate-180" : "",
                            ].join(" ")}
                        />

                        <span className="text-[var(--brand-primary-color)]">
                            {t("nav.cars")}
                        </span>
                    </nav>

                    {/* Heading */}
                    <h1
                        className={[
                            "mt-2 text-[30px]",
                            "font-extrabold leading-tight",
                            "text-[#20283A]",
                            "sm:text-[34px]",
                            "lg:text-[38px]",
                        ].join(" ")}
                    >
                        <span>{pageTitleBlack}</span>{" "}
                        <span className="text-[var(--brand-primary-color)]">
                            {pageTitleGold}
                        </span>
                    </h1>

                    <p className="mt-2 max-w-[620px] text-[14px] leading-6 text-[#59647A] sm:text-[15px]">
                        {pageDescription}
                    </p>
                </div>

                {/* ================================================================ */}
                {/* Main offer                                                       */}
                {/* ================================================================ */}

                <div
                    className={[
                        "mt-8 grid overflow-hidden",
                        "border border-[#E9E3D8]",
                        "bg-white",
                        "shadow-[0_10px_34px_rgba(32,40,58,0.06)]",
                        "lg:mt-12",
                        "lg:h-[435px]",
                        "lg:grid-cols-2",
                    ].join(" ")}
                >
                    {/* ============================================================ */}
                    {/* Image                                                       */}
                    {/* ============================================================ */}

                    <div
                        className={[
                            "relative order-1",
                            "min-h-[220px]",
                            "overflow-hidden",
                            "bg-[#EDE8DE]",
                            "sm:min-h-[340px]",
                            "lg:order-1",
                            "lg:min-h-[435px]",
                        ].join(" ")}
                    >
                        <LazyImg
                            src={image}
                            alt={featuredTitle}
                            className="absolute inset-0 h-full w-full object-contains"
                        />

                        {/* Most requested badge */}
                        <div className="absolute start-5 top-5 z-10 bg-[var(--brand-primary-color)] px-4 py-2 text-[12px] font-bold text-[#20283A]">
                            {badgeText?.trim() ||
                                t("offersPage.hero.mostRequested")}
                        </div>
                    </div>
                    <div
                        className={[
                            "order-2 flex flex-col justify-center",
                            "px-5 py-6",
                            "sm:px-8 sm:py-8",
                            "lg:order-1",
                            "lg:px-12 lg:py-8",
                        ].join(" ")}
                    >
                        <div className="text-start">
                            <h2 className="text-[25px] font-extrabold leading-tight text-[#20283A] sm:text-[29px] lg:text-[31px]">
                                {featuredTitle}
                            </h2>

                            <p className="mt-3 text-[14px] text-[#59647A] sm:text-[15px]">
                                {featuredDescription}
                            </p>
                        </div>

                        {/* Countdown */}
                        {target && (
                            <div
                                dir="ltr"
                                className="mt-5 grid grid-cols-4 gap-2 sm:gap-3"
                            >
                                <TimeUnit
                                    value={timeLeft.days}
                                    label={t("offersPage.hero.countdownDays")}
                                    locale={i18n.language}
                                />

                                <TimeUnit
                                    value={timeLeft.hours}
                                    label={t("offersPage.hero.countdownHours")}
                                    locale={i18n.language}
                                />

                                <TimeUnit
                                    value={timeLeft.minutes}
                                    label={t("offersPage.hero.countdownMinutes")}
                                    locale={i18n.language}
                                />

                                <TimeUnit
                                    value={timeLeft.seconds}
                                    label={t("offersPage.hero.countdownSeconds")}
                                    locale={i18n.language}
                                />
                            </div>
                        )}

                        {/* Divider */}
                        <div className="my-5 h-px w-full bg-[#E9E1D4]" />

                        {/* Price */}
                        <div className="text-start">
                            {oldPrice > currentPrice && (
                                <p className="relative w-fit text-[13px] text-[#6D7484]">
                                    {formatPrice(oldPrice, "#6D7484")}
                                    <span
                                        aria-hidden="true"
                                        className="pointer-events-none absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-[#6D7484]"
                                    />
                                </p>
                            )}

                            <p className="mt-2 w-fit text-[34px] font-extrabold leading-none text-[#20283A] sm:text-[40px]">
                                {formatPrice(currentPrice, "#20283A")}
                            </p>
                        </div>

                        {/* CTA */}
                        <NavLink
                            to={resolvedButtonTo}
                            className={[
                                "mt-5 flex h-[50px]",
                                "w-full items-center justify-center",
                                "bg-[var(--brand-primary-color)]",
                                "px-6",
                                "text-[15px] font-bold",
                                "text-[#20283A]",
                                "transition duration-300",
                                "hover:brightness-95",
                            ].join(" ")}
                        >
                            {resolvedButtonText}
                        </NavLink>
                    </div>
                </div>
            </div>
        </section>
    );
}
