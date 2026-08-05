import { useTranslation } from "react-i18next";
import { Clock3 } from "lucide-react";
import { NavLink } from "react-router-dom";

import { formatPrice } from "../../utils/format";
import type { IOfferListCardProps } from "../../interfaces/IOfferListCardProps";
import LazyImg from "../LazyImg";

export default function OfferListCard({
  image,
  badge,
  badgeColor,
  title,
  description,
  carName,
  priceLabel,
  price,
  isExpired,
  countdown,
  endsAtLabel,
  buttonText,
  buttonTo,
}: IOfferListCardProps) {
  const { t, i18n } = useTranslation();

  const showCountdown = !isExpired && countdown;

  return (
    <article
      dir={i18n.dir()}
      className="group mx-auto flex h-full w-full max-w-[460px] flex-col overflow-hidden rounded-[20px] border border-[#E4E4E4] bg-white shadow-[0_4px_16px_rgba(15,23,42,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(15,23,42,0.12)]"
    >
      {/* ── Image ── */}
      <div className="relative h-[240px] w-full shrink-0 overflow-hidden bg-[#EDEDED]">
        <LazyImg
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
        />

        {/* Discount badge — top start corner */}
        {badge && (
          <div
            className="absolute start-4 top-4 z-20 p-[3px] shadow-lg"
          >
            <div
              className="rounded-[8px] px-2 bg-[var(--brand-secondary-color)]"
              style={badgeColor ? { backgroundColor: badgeColor } : undefined}
            >
              <span className="text-[15px] text-white">{badge}</span>
            </div>
          </div>
        )}

        {/* Car name pill — bottom start */}
        {carName && (
          <span className="absolute bottom-4 start-4 z-20 inline-flex items-center rounded-[6px] bg-black/75 px-3 py-1 text-[13px] font-bold text-white backdrop-blur-sm">
            {carName}
          </span>
        )}
      </div>

      {/* ── Content ── */}
      <div className="flex flex-1 flex-col px-6 pb-5 pt-4">
        {/* Cars count / description */}
        {description && (
          <p className="text-start text-[13px] font-bold text-[#C5232B]">
            {description}
          </p>
        )}

        {/* Title */}
        <h3 className="mt-2 line-clamp-2 text-start text-[22px] font-extrabold leading-snug text-[#111111]">
          {title}
        </h3>

        <div className="my-4 h-px w-full bg-[#F0F0F0]" />

        {/* Price + CTA row */}
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0 text-start">
            <p className="text-[12px] text-[#9CA3AF]">{priceLabel}</p>
            <p className="mt-0.5 text-[20px] font-extrabold leading-none text-[#111111]">
              {formatPrice(price, "#111111")}
            </p>
          </div>
          <NavLink
            to={buttonTo}
            className="flex h-[46px] shrink-0 items-center justify-center rounded-[8px] bg-[#C5232B] px-5 text-[14px] font-bold text-white! transition hover:bg-[#A91D24]"
          >
            {buttonText}
          </NavLink>
        </div>

        {/* Countdown or start date */}
        {showCountdown && (
          <div className="mt-3 flex items-center justify-start gap-1.5 text-[12px] text-[#9CA3AF]">
            {endsAtLabel ? (
              <>

                <Clock3 size={13} strokeWidth={1.8} className="shrink-0" />
                <span>{t("offersPage.hero.countdownLabel", "ينتهي")}</span>
                <span>{endsAtLabel}</span>
              </>
            ) : (
              <>
                <Clock3 size={13} strokeWidth={1.8} className="shrink-0" />
                <span>{t("offersPage.hero.countdownLabel", "ينتهي")}</span>
              </>
            )}
          </div>
        )}

        {isExpired && (
          <p className="mt-3 text-start text-[12px] font-bold text-[#9CA3AF]">
            {t("offersPage.card.expired", "انتهى العرض")}
          </p>
        )}
      </div>
    </article>
  );
}
