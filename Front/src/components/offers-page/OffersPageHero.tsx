import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { getCountdownParts, padTime } from "../../utils/countdown";
import type { IOffersPageHeroProps } from "../../interfaces/IOffersPageHeroProps";
import LazyImg from "../LazyImg";

interface TimeUnitProps {
  value: number;
  label: string;
}

function TimeUnit({ value, label }: TimeUnitProps) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center gap-2">
      <div
        className={[
          "flex h-[64px] w-full min-w-[58px] items-center justify-center",
          "rounded-[14px] bg-[#54171A]",
          "px-3 text-[24px] font-extrabold text-white",
          "sm:h-[72px] sm:min-w-[68px] sm:text-[27px]",
        ].join(" ")}
      >
        {padTime(value)}
      </div>

      <span className="text-[11px] text-white/45 sm:text-[12px]">{label}</span>
    </div>
  );
}

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
}: IOffersPageHeroProps) {
  const { t, i18n } = useTranslation();

  const direction = i18n.dir();

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
  }, [endsAt, countdown]);

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

  return (
    <section dir={direction} className="w-full py-6 sm:py-8 lg:py-10">
      <div className="mx-auto max-w-7xl px-3 sm:px-5 lg:px-8">
        <div
          className={[
            "relative overflow-hidden rounded-[22px]",
            "bg-[#08090B]",
            "shadow-[0_12px_34px_rgba(15,23,42,0.08)]",
          ].join(" ")}
        >
          <div className="grid min-h-[445px] grid-cols-1 lg:grid-cols-2">
            {/* Offer image */}
            <div className="relative min-h-[320px] overflow-hidden lg:min-h-[445px]">
              <LazyImg
                src={image}
                alt={title1}
                className="absolute inset-0 h-full w-full"
              />
            </div>
            {/* Content */}
            <div
              className={[
                "relative z-10 flex flex-col justify-center",
                "bg-[radial-gradient(circle_at_top_left,rgba(80,12,17,0.45),transparent_46%),#08090B]",
                "px-6 py-10 sm:px-10 lg:px-14 xl:px-[54px]",
                "text-center",
              ].join(" ")}
            >
              {/* Optional badge */}
              {badgeText && (
                <span
                  className={[
                    "mb-5 inline-flex w-fit items-center justify-center",
                    "rounded-full border border-[#C82930]/35",
                    "bg-[#39161A] px-4 py-2",
                    "text-[12px] font-bold text-[#D6383E]",
                  ].join(" ")}
                >
                  {badgeText}
                </span>
              )}

              {/* Main title */}
              <h1
                className={[
                  "text-[38px] font-extrabold leading-[1.2] text-white",
                  "sm:text-[48px] lg:text-[53px] xl:text-[58px]",
                ].join(" ")}
              >
                <span>{title2}</span>{" "}
                <span className="text-[var(--brand-secondary-color)]">
                  {title1}
                </span>
              </h1>

              {/* Description */}
              {description && (
                <p className="mt-5 pt-3 max-w-[560px] text-[16px] leading-8 text-white/55 sm:text-[18px]">
                  {description}
                </p>
              )}

              {/* Optional car label */}
              {carLabel && (
                <p className="mt-4 text-[15px] font-bold text-[#D22B32]">
                  {carLabel}
                </p>
              )}

              {/* Countdown box */}
              {target && (
                <div
                  className={[
                    "mx-auto mt-7 max-w-[440px] rounded-[18px]",
                    "border border-white/15",
                    "bg-white/[0.035] px-5 py-6",
                    "shadow-[inset_0_0_24px_rgba(255,255,255,0.015)]",
                    "backdrop-blur-sm",
                  ].join(" ")}
                >
                  <p className="mb-5 pb-3 text-center text-[15px] text-white/60">
                    {t(
                      "offersPage.hero.countdownLabel",
                      "ينتهي العرض الرئيسي خلال",
                    )}
                  </p>

                  <div dir="ltr" className="grid grid-cols-4 gap-3">
                    <TimeUnit
                      value={timeLeft.seconds}
                      label={t("offersPage.hero.countdownSeconds", "ثانية")}
                    />
                    <TimeUnit
                      value={timeLeft.minutes}
                      label={t("offersPage.hero.countdownMinutes", "دقيقة")}
                    />
                    <TimeUnit
                      value={timeLeft.hours}
                      label={t("offersPage.hero.countdownHours", "ساعة")}
                    />
                    <TimeUnit
                      value={timeLeft.days}
                      label={t("offersPage.hero.countdownDays", "يوم")}
                    />
                  </div>
                </div>
              )}

              {/* Optional CTA */}
              {primaryButtonText && primaryButtonTo && (
                <a
                  href={primaryButtonTo}
                  className={[
                    "mt-7 flex h-[52px] w-fit min-w-[170px]",
                    "items-center justify-center rounded-[12px]",
                    "bg-[#C7252C] px-7",
                    "text-[15px] font-bold text-white",
                    "transition duration-300",
                    "hover:-translate-y-0.5 hover:bg-[#A91F26]",
                  ].join(" ")}
                >
                  {primaryButtonText}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
