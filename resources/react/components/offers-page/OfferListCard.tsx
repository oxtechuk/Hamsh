import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";

import { formatPrice } from "../../utils/format";
import { padTime } from "../../utils/countdown";
import type { IOfferListCardProps } from "../../interfaces/IOfferListCardProps";
import type { ITimeBoxProps } from "../../interfaces/ITimeBoxProps";
import LazyImg from "../LazyImg";

export default function OfferListCard({
    image,
    badge,
    title,
    description,
    carName,
    price,
    discountPercent,
    isExpired,
    countdown,
    buttonText,
    buttonTo,
}: IOfferListCardProps) {
    const { t, i18n } = useTranslation();
    const lang = i18n.language;

    const showCountdown = !isExpired && !!countdown;

    const currentPrice = price > 0 ? price : 265000;

    const oldPrice =
        currentPrice > 0 && discountPercent
            ? Math.round(currentPrice * (1 + discountPercent / 100))
            : 0;

    return (
        <article
            dir={i18n.dir()}
            className={[
                "group mx-auto flex flex-col",
                "w-full",
                "overflow-hidden border border-[#E8E2D8]",
                "bg-white",
                "shadow-[0_8px_24px_rgba(15,23,42,0.06)]",
                "transition duration-300",
                "hover:-translate-y-1",
                "hover:shadow-[0_18px_38px_rgba(15,23,42,0.10)]",
            ].join(" ")}
        >
            {/* ── Image block ── */}
            <div className="relative h-[200px] w-full shrink-0 overflow-hidden bg-[#ECEAE6]">
                <LazyImg
                    src={image}
                    alt={title}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                />

                {/* Dark bottom gradient for car-name legibility */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-black/60 to-transparent" />

                {/* Badge — flush top-start corner */}
                <div className="absolute top-5 z-20 start-5">
                    <span
                        className={[
                            "inline-flex min-h-[40px] items-center justify-center ",
                            "bg-[var(--brand-primary-color)] px-2",
                            "text-[14px] font-extrabold text-[#20283A]",
                        ].join(" ")}
                    >
                        {badge ??
                            t("offersPage.card.mostRequested", "الأكثر طلبًا")}
                    </span>
                </div>

                {/* Car name overlay — bottom-start */}
                {carName && (
                    <div className="absolute bottom-4 end-5 z-20">
                        <span className="text-[22px] font-bold text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.55)]">
                            {carName}
                        </span>
                    </div>
                )}
            </div>

            {/* ── Content block ── */}
            <div className="flex flex-1 flex-col items-start px-6 pb-6 pt-7 text-start sm:px-8">
                {/* Title */}
                <h3 className="text-[26px] font-extrabold leading-snug text-[#20283A]">
                    {title}
                </h3>

                {/* Description */}
                {description && (
                    <p className="mt-2 text-[14px] leading-6 text-[#8A94A6]">
                        {description}
                    </p>
                )}

                {/* Countdown */}
                {showCountdown && (
                    <div
                        dir="ltr"
                        className="mt-6 grid w-full grid-cols-4 gap-2"
                    >
                        <TimeBox
                            value={countdown.days}
                            label={t("offersPage.hero.countdownDays", "يوم")}
                            locale={lang}
                            width={71}
                            height={58}
                        />
                        <TimeBox
                            value={countdown.hours}
                            label={t("offersPage.hero.countdownHours", "ساعة")}
                            locale={lang}
                            width={71}
                            height={58}
                        />
                        <TimeBox
                            value={countdown.minutes}
                            label={t(
                                "offersPage.hero.countdownMinutes",
                                "دقيقة",
                            )}
                            locale={lang}
                            width={71}
                            height={58}
                        />
                        <TimeBox
                            value={countdown.seconds}
                            label={t(
                                "offersPage.hero.countdownSeconds",
                                "ثانية",
                            )}
                            locale={lang}
                            width={71}
                            height={58}
                        />
                    </div>
                )}

                {/* Price + CTA row */}
                <div className="mt-6 flex w-full flex-wrap items-center justify-between gap-3">
                    {/* Prices — start-aligned */}
                    <div className="flex flex-col items-start gap-1">
                        {oldPrice > currentPrice && (
                            <p
                                dir="ltr"
                                className="relative text-[13px] text-[#A0A5AF]"
                            >
                                {formatPrice(oldPrice, "#A0A5AF", lang)}
                                <span
                                    aria-hidden="true"
                                    className="pointer-events-none absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-[#A0A5AF]"
                                />
                            </p>
                        )}

                        <p
                            dir="ltr"
                            className={[
                                "text-[20px] font-bold leading-none",
                                "text-[var(--brand-primary-color)]",
                                "sm:text-[20px]",
                            ].join(" ")}
                        >
                            {formatPrice(
                                currentPrice,
                                "var(--brand-primary-color)",
                                lang,
                            )}
                        </p>
                    </div>

                    {/* CTA */}
                    <NavLink
                        to={buttonTo}
                        className={[
                            "flex h-[38px] min-w-[90px] rounded-[4px]",
                            "items-center justify-center",
                            "bg-[var(--brand-primary-color)]",
                            "px-2",
                            "text-[12px] font-bold",
                            "text-[#20283A]",
                            "transition duration-300",
                            "hover:brightness-95",
                        ].join(" ")}
                    >
                        {buttonText || t("offersPage.card.cta", "استفد الآن")}
                    </NavLink>
                </div>

                {isExpired && (
                    <p className="mt-5 text-start text-[13px] font-bold text-[#A0A5AF]">
                        {t("offersPage.card.expired", "انتهى العرض")}
                    </p>
                )}
            </div>
        </article>
    );
}

function TimeBox({ value, label, locale, width, height }: ITimeBoxProps) {
    return (
        <div
            className="flex flex-col items-center justify-center bg-[#F5F5F5] px-2"
            style={{
                width: width ? `${width}px` : undefined,
                height: height ? `${height}px` : undefined,
                minHeight: height ? undefined : "80px",
            }}
        >
            <strong className="text-center text-[22px] font-extrabold leading-none text-[#20283A]">
                {padTime(value, locale)}
            </strong>

            <span className="mt-1.5 text-center text-[11px] text-[#9BA1AD]">
                {label}
            </span>
        </div>
    );
}
