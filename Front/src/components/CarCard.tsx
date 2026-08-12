import { useState, type MouseEvent } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Fuel, Gauge, GitCompare, Settings2 } from "lucide-react";

import Button from "./button";
import LazyImg from "./LazyImg";
import { SpecItem } from "./SpecItem";
import type { ICarCardProps } from "../interfaces/ICarCardProps";
import { resolveHighlight, contrastTextColor } from "../utils/badge-utils";
import { useSettingsStore } from "../store/settings.store";
import CarRequestModal from "./CarRequestModal";

export type { ICarCardProps as CarCardProps };

export default function CarCard({
  id,
  image,
  brand,
  name,
  year,
  type,
  fuelType,
  transmission,
  seats,
  price,
  monthlyPrice,
  detailsTo,
  slug,
  compareText,
  reserveText,
  badgeText,
  badgeColor,
  rawPrice,
}: ICarCardProps) {
  const { t, i18n } = useTranslation();
  const direction = i18n.dir();
  const navigate = useNavigate();

  const { settings } = useSettingsStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const resolvedBadge = resolveHighlight(badgeText, i18n.language);

  const finalBadge = resolvedBadge
    ? {
        text: resolvedBadge.text,
        color:
          badgeColor ?? resolvedBadge.color ?? "var(--brand-secondary-color)",
      }
    : undefined;

  const handleOpenDetails = () => {
    if (settings?.car_popup_enabled) {
      setIsModalOpen(true);
    } else {
      navigate(detailsTo);
    }
  };

  const handleCompare = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    navigate(slug ? `/compare?slug=${encodeURIComponent(slug)}` : "/compare");
  };

  return (
    <article
      dir={direction}
      onClick={handleOpenDetails}
      className={[
        "group relative mx-auto flex",
        "w-full max-w-[377px]",
        "cursor-pointer flex-col overflow-hidden",
        "rounded-[18px] border border-[#E4E6E8]",
        "bg-white",
        "shadow-[0_3px_12px_rgba(15,23,42,0.06)]",
        "transition duration-300",
        "hover:-translate-y-1",
        "hover:shadow-[0_16px_34px_rgba(15,23,42,0.12)]",
      ].join(" ")}
    >
      <div className="relative h-[195px] w-full shrink-0 overflow-hidden bg-[#F2F2F2]">
        <LazyImg
          src={image}
          alt={`${brand} ${name}`}
          className={[
            "h-full w-full object-cover",
            "transition-transform duration-700 ease-out",
            "group-hover:scale-[1.025]",
          ].join(" ")}
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/[0.04] via-transparent to-white/10" />

        {finalBadge && (
          <div className="absolute start-4 top-4 z-20">
            <span
              className={[
                "inline-flex min-h-[32px]",
                "items-center justify-center",
                "rounded-[6px] px-4",
                "text-[14px] font-medium",
                "shadow-[0_5px_14px_rgba(0,0,0,0.08)]",
              ].join(" ")}
              style={{
                backgroundColor: finalBadge.color,
                color: contrastTextColor(finalBadge.color),
              }}
            >
              {finalBadge.text}
            </span>
          </div>
        )}

        <button
          type="button"
          onClick={handleCompare}
          aria-label={compareText ?? t("carCard.compare")}
          title={compareText ?? t("carCard.compare")}
          className={[
            "absolute bottom-4 end-4 z-20",
            "flex h-[40px] w-[40px]",
            "items-center justify-center",
            "rounded-full border border-white/70",
            "bg-white/90",
            "text-[var(--brand-primary-color)]",
            "shadow-[0_8px_20px_rgba(0,0,0,0.12)]",
            "backdrop-blur-sm",
            "transition duration-300",
            "hover:scale-105 hover:bg-white",
          ].join(" ")}
        >
          <GitCompare size={19} strokeWidth={1.9} />
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col px-5 pb-4 pt-4">
        <div className="flex items-center justify-between gap-4">
          <p className="flex min-w-0 items-center gap-2 text-[14px] text-[#7A7A7A]">
            <span className="truncate">{brand}</span>
            <span className="h-1 w-1 shrink-0 rounded-full bg-[#7A7A7A]" />
            <span className="shrink-0">{year}</span>
          </p>

          {type ? (
            <span
              className={[
                "inline-flex h-[30px] min-w-[64px]",
                "items-center justify-center",
                "rounded-[6px]",
                "border border-[var(--brand-secondary-color)]",
                "px-3",
                "text-[14px] font-medium",
                "text-[var(--brand-secondary-color)]",
              ].join(" ")}
            >
              {type}
            </span>
          ) : (
            <span />
          )}
        </div>

        <h3
          title={`${brand} ${name}`}
          className={[
            "mt-2 line-clamp-1 text-start",
            "text-[23px] font-extrabold",
            "leading-[1.25] text-[#0D0D0D]",
          ].join(" ")}
        >
          {name}
        </h3>

        <div className="mt-3 flex min-h-[24px] flex-wrap items-center gap-x-4 gap-y-2 text-[#737373]">
          {seats && (
            <SpecItem
              icon={<Gauge size={17} strokeWidth={1.8} />}
              label={String(seats)}
            />
          )}
          {transmission && (
            <SpecItem
              icon={<Settings2 size={17} strokeWidth={1.8} />}
              label={String(transmission)}
            />
          )}
          {fuelType && (
            <SpecItem
              icon={<Fuel size={17} strokeWidth={1.8} />}
              label={String(fuelType)}
            />
          )}
        </div>

        <div className="my-3 h-px w-full shrink-0 bg-[#E5E5E5]" />

        <div className="mt-3 flex items-end justify-between gap-4">
          <div className="min-w-0 text-start">
            <p className="text-[13px] font-medium text-[#777777]">
              {t("carCard.startsFrom")}
            </p>
            <p className="mt-1 truncate text-[27px] font-extrabold leading-none">
              {price}
            </p>
            {monthlyPrice && (
              <p className="mt-1 truncate text-[14px] font-medium">
                {monthlyPrice}
                <span className="ms-1">/ {t("carCard.month")}</span>
              </p>
            )}
          </div>

          <div
            className="shrink-0"
            onClick={(event) => event.stopPropagation()}
          >
            <Button
              to={settings?.car_popup_enabled ? undefined : detailsTo}
              onClick={settings?.car_popup_enabled ? () => setIsModalOpen(true) : undefined}
              bgColor="bg-[var(--brand-secondary-color)]"
              textColor="text-white!"
              className={[
                "!h-[46px] !min-w-[130px]",
                "!rounded-[7px] px-5",
                "text-[15px] font-bold",
                "shadow-none",
                "hover:!bg-[#A91E25]",
              ].join(" ")}
            >
              {reserveText ?? t("carCard.moreDetails")}
            </Button>
          </div>
        </div>
      </div>

      <CarRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        car={{
          id,
          brand,
          name,
          year,
          price: rawPrice ?? 0,
        }}
      />
    </article>
  );
}
