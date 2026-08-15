import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";

import { formatPrice } from "../../utils/format";
import { padTime } from "../../utils/countdown";
import type { IOfferListCardProps } from "../../interfaces/IOfferListCardProps";
import LazyImg from "../LazyImg";

export default function OfferListCard({
    image,
    badge,
    title,
    description,
    carName,
    price,
    isExpired,
    countdown,
    buttonText,
    buttonTo,
}: IOfferListCardProps) {
    const { t, i18n } = useTranslation();

    const showCountdown = !isExpired && !!countdown;

    const oldPrice =
        price && Number(price) > 0 ? Number(price) + 20000 : 285000;

    const currentPrice = price && Number(price) > 0 ? Number(price) : 265000;

    return (
        <article
            dir={i18n.dir()}
            className={[
                "group mx-auto flex h-full w-full max-w-[560px] flex-col",
                "overflow-hidden border border-[#E8E2D8]",
                "bg-white",
                "shadow-[0_8px_24px_rgba(15,23,42,0.06)]",
                "transition duration-300",
                "hover:-translate-y-1",
                "hover:shadow-[0_18px_38px_rgba(15,23,42,0.10)]",
            ].join(" ")}
        >
            {/* Image */}
            <div className="relative h-[310px] w-full shrink-0 overflow-hidden bg-[#ECEAE6]">
                <LazyImg
                    src={image}
                    alt={title}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                />

                {/* Most requested badge */}
                <div className="absolute end-5 top-5 z-20">
                    <span
                        className={[
                            "inline-flex min-h-[42px] items-center justify-center",
                            "bg-[var(--brand-primary-color)] px-5",
                            "text-[15px] font-bold text-[#20283A]",
                        ].join(" ")}
                    >
                        {badge ||
                            t("offersPage.card.mostRequested", "الأكثر طلبًا")}
                    </span>
                </div>

                {/* Car name overlay */}
                {carName && (
                    <div className="absolute bottom-5 start-5 z-20">
                        <span className="text-[24px] font-extrabold text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.45)]">
                            {carName}
                        </span>
                    </div>
                )}

                {/* Dark bottom fade */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[34%] bg-gradient-to-t from-black/45 to-transparent" />
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col px-7 pb-7 pt-8 sm:px-9">
                {/* Title */}
                <h3
                    className={[
                        "text-start text-[30px]",
                        "font-extrabold leading-[1.25]",
                        "text-[#20283A]",
                    ].join(" ")}
                >
                    {title}
                </h3>

                {/* Description */}
                {description && (
                    <p className="mt-3 text-start text-[15px] leading-7 text-[#6D7484]">
                        {description}
                    </p>
                )}

                {/* Countdown */}
                {showCountdown && (
                    <div dir="ltr" className="mt-7 grid grid-cols-4 gap-3">
                        <TimeBox
                            value={countdown.days}
                            label={t("offersPage.hero.countdownDays", "يوم")}
                        />

                        <TimeBox
                            value={countdown.hours}
                            label={t("offersPage.hero.countdownHours", "ساعة")}
                        />

                        <TimeBox
                            value={countdown.minutes}
                            label={t(
                                "offersPage.hero.countdownMinutes",
                                "دقيقة",
                            )}
                        />

                        <TimeBox
                            value={countdown.seconds}
                            label={t(
                                "offersPage.hero.countdownSeconds",
                                "ثانية",
                            )}
                        />
                    </div>
                )}

                <div className="my-7 h-px w-full bg-[#EEE8DE]" />

                {/* Price + CTA */}
                <div className="flex items-end justify-between gap-5">
                    {/* Price */}
                    <div className="min-w-0 text-start">
                        <p
                            dir="ltr"
                            className="w-fit text-[15px] text-[#A0A5AF] line-through"
                        >
                            {formatPrice(oldPrice, "#A0A5AF")}
                        </p>

                        <p
                            dir="ltr"
                            className={[
                                "mt-2 w-fit",
                                "text-[31px] font-extrabold",
                                "leading-none",
                                "text-[var(--brand-primary-color)]",
                                "sm:text-[35px]",
                            ].join(" ")}
                        >
                            {formatPrice(
                                currentPrice,
                                "var(--brand-primary-color)",
                            )}
                        </p>
                    </div>

                    {/* CTA */}
                    <NavLink
                        to={buttonTo}
                        className={[
                            "flex h-[58px] min-w-[150px]",
                            "items-center justify-center",
                            "bg-[var(--brand-primary-color)]",
                            "px-6",
                            "text-[15px] font-bold",
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

interface TimeBoxProps {
    value: number;
    label: string;
}

function TimeBox({ value, label }: TimeBoxProps) {
    return (
        <div
            className={[
                "flex min-h-[88px] flex-col",
                "items-center justify-center",
                "bg-[#F7F7F7]",
                "px-2",
            ].join(" ")}
        >
            <strong className="text-[24px] font-extrabold leading-none text-[#20283A]">
                {padTime(value)}
            </strong>

            <span className="mt-2 text-[11px] text-[#9BA1AD]">{label}</span>
        </div>
    );
}
