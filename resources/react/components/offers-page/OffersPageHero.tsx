import { useEffect, useMemo, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { getCountdownParts, padTime } from "../../utils/countdown";

import type { IOffersPageHeroProps } from "../../interfaces/IOffersPageHeroProps";
import LazyImg from "../LazyImg";

/* -------------------------------------------------------------------------- */
/* Static fallbacks — not currently provided by backend                        */
/* -------------------------------------------------------------------------- */

const STATIC_DATA = {
    breadcrumbHome: "الرئيسية",
    breadcrumbOffers: "السيارات",

    pageTitleBlack: "عروض",
    pageTitleGold: "استثنائية",

    pageDescription: "لا تفوّت فرصة اقتناء سيارة أحلامك بسعر مميز",

    featuredTitle: "عرض الربيع المميز",

    featuredDescription: "خصم يصل إلى 20,000 ر.س",

    oldPrice: 285000,

    mostRequestedBadge: "الأكثر طلبًا",

    buttonText: "استفد من العرض",
};

/* -------------------------------------------------------------------------- */
/* Countdown                                                                  */
/* -------------------------------------------------------------------------- */

interface TimeUnitProps {
    value: number;
    label: string;
}

function TimeUnit({ value, label }: TimeUnitProps) {
    return (
        <div
            className={[
                "flex min-w-0 flex-1 flex-col",
                "items-center justify-center",
                "bg-[#EEE9DF]",
                "px-2 py-4",
                "sm:min-h-[82px]",
            ].join(" ")}
        >
            <strong className="text-[22px] font-extrabold leading-none text-[#20283A] sm:text-[24px]">
                {padTime(value)}
            </strong>

            <span className="mt-2 text-[10px] text-[#697083] sm:text-[11px]">
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

        return endsAt ? new Date(endsAt) : null;
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
    /* Dynamic + static fallback values                                       */
    /* ---------------------------------------------------------------------- */

    const pageTitleBlack =
        title2?.trim() ||
        t("offersPage.hero.titleBlack", STATIC_DATA.pageTitleBlack);

    const pageTitleGold =
        title1?.trim() ||
        t("offersPage.hero.titleGold", STATIC_DATA.pageTitleGold);

    const pageDescription =
        description?.trim() ||
        t("offersPage.hero.pageDescription", STATIC_DATA.pageDescription);

    /*
     * The backend currently doesn't provide a separate featured-offer heading,
     * so this uses carLabel if available and a static fallback otherwise.
     */
    const featuredTitle =
        carLabel?.trim() ||
        t("offersPage.hero.featuredTitle", STATIC_DATA.featuredTitle);

    const featuredDescription = discountPercent
        ? t("offersPage.hero.discountPercent", {
              percent: discountPercent,
              defaultValue: `خصم ${discountPercent}%`,
          })
        : t(
              "offersPage.hero.featuredDescription",
              STATIC_DATA.featuredDescription,
          );

    const resolvedButtonText =
        primaryButtonText?.trim() ||
        t("offersPage.hero.button", STATIC_DATA.buttonText);

    const resolvedButtonTo = primaryButtonTo?.trim() || "/offers";

    const currentPrice =
        specialPrice && Number(specialPrice) > 0
            ? Number(specialPrice)
            : 265000;

    const oldPrice = STATIC_DATA.oldPrice;

    return (
        <section
            dir={direction}
            className="w-full bg-[var(--background)] pb-12 pt-8 sm:pb-16 sm:pt-10 lg:pb-20 lg:pt-12"
        >
            <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
                {/* ================================================================ */}
                {/* Page heading                                                     */}
                {/* ================================================================ */}

                <div className="text-start">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-[12px] sm:text-[13px]">
                        <NavLink
                            to="/"
                            className="font-semibold text-[#303A54] transition hover:text-[var(--brand-primary-color)]"
                        >
                            {t("nav.home", STATIC_DATA.breadcrumbHome)}
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
                            {t("nav.cars", STATIC_DATA.breadcrumbOffers)}
                        </span>
                    </nav>

                    {/* Heading */}
                    <h1
                        className={[
                            "mt-5 text-[32px]",
                            "font-extrabold leading-tight",
                            "text-[#20283A]",
                            "sm:text-[38px]",
                            "lg:text-[42px]",
                        ].join(" ")}
                    >
                        <span>{pageTitleBlack}</span>{" "}
                        <span className="text-[var(--brand-primary-color)]">
                            {pageTitleGold}
                        </span>
                    </h1>

                    <p className="mt-3 max-w-[620px] text-[14px] leading-7 text-[#59647A] sm:text-[15px]">
                        {pageDescription}
                    </p>
                </div>

                {/* ================================================================ */}
                {/* Main offer                                                       */}
                {/* ================================================================ */}

                <div
                    className={[
                        "mt-10 grid overflow-hidden",
                        "border border-[#E9E3D8]",
                        "bg-white",
                        "shadow-[0_10px_34px_rgba(32,40,58,0.06)]",
                        "lg:mt-12",
                        "lg:grid-cols-[0.92fr_1.08fr]",
                    ].join(" ")}
                >
                    {/* ============================================================ */}
                    {/* Offer information                                           */}
                    {/* ============================================================ */}

                    <div
                        className={[
                            "order-2 flex flex-col justify-center",
                            "px-6 py-8",
                            "sm:px-10 sm:py-10",
                            "lg:order-1",
                            "lg:px-14 lg:py-12",
                        ].join(" ")}
                    >
                        <div className="text-start">
                            <h2 className="text-[27px] font-extrabold leading-tight text-[#20283A] sm:text-[31px] lg:text-[34px]">
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
                                className="mt-7 grid grid-cols-4 gap-2 sm:gap-3"
                            >
                                <TimeUnit
                                    value={timeLeft.days}
                                    label={t(
                                        "offersPage.hero.countdownDays",
                                        "يوم",
                                    )}
                                />

                                <TimeUnit
                                    value={timeLeft.hours}
                                    label={t(
                                        "offersPage.hero.countdownHours",
                                        "ساعة",
                                    )}
                                />

                                <TimeUnit
                                    value={timeLeft.minutes}
                                    label={t(
                                        "offersPage.hero.countdownMinutes",
                                        "دق",
                                    )}
                                />

                                <TimeUnit
                                    value={timeLeft.seconds}
                                    label={t(
                                        "offersPage.hero.countdownSeconds",
                                        "ث",
                                    )}
                                />
                            </div>
                        )}

                        {/* Divider */}
                        <div className="my-7 h-px w-full bg-[#E9E1D4]" />

                        {/* Price */}
                        <div className="text-start">
                            {oldPrice > currentPrice && (
                                <p
                                    dir="ltr"
                                    className="w-fit text-[13px] text-[#6D7484] line-through"
                                >
                                    {oldPrice.toLocaleString()}{" "}
                                    {t("common.riyal", "ر.س")}
                                </p>
                            )}

                            <p
                                dir="ltr"
                                className={[
                                    "mt-2 w-fit",
                                    "text-[38px]",
                                    "font-extrabold leading-none",
                                    "text-[#20283A]",
                                    "sm:text-[44px]",
                                ].join(" ")}
                            >
                                {currentPrice.toLocaleString()}{" "}
                                <span className="text-[28px]">
                                    {t("common.riyal", "ر.س")}
                                </span>
                            </p>
                        </div>

                        {/* CTA */}
                        <NavLink
                            to={resolvedButtonTo}
                            className={[
                                "mt-7 flex h-[54px]",
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

                    {/* ============================================================ */}
                    {/* Image                                                       */}
                    {/* ============================================================ */}

                    <div
                        className={[
                            "relative order-1",
                            "min-h-[320px]",
                            "overflow-hidden",
                            "bg-[#EDE8DE]",
                            "sm:min-h-[420px]",
                            "lg:order-2",
                            "lg:min-h-[510px]",
                        ].join(" ")}
                    >
                        <LazyImg
                            src={image}
                            alt={featuredTitle}
                            className="absolute inset-0 h-full w-full object-cover"
                        />

                        {/* Most requested badge */}
                        <div className="absolute end-5 top-5 z-10 bg-[var(--brand-primary-color)] px-4 py-2 text-[12px] font-bold text-[#20283A]">
                            {badgeText?.trim() ||
                                t(
                                    "offersPage.hero.mostRequested",
                                    STATIC_DATA.mostRequestedBadge,
                                )}
                        </div>

                        {/* Decorative pagination dots */}
                        <div
                            dir="ltr"
                            className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 items-center gap-3"
                        >
                            {[0, 1, 2].map((dot) => (
                                <span
                                    key={dot}
                                    className={[
                                        "h-[10px] w-[10px]",
                                        "rounded-full",
                                        dot === 0
                                            ? "bg-[#8F7AC7]"
                                            : "bg-[#A796CA]/75",
                                        "border border-white/50",
                                    ].join(" ")}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
