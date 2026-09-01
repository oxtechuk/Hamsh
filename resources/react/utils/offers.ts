import type { TFunction } from "i18next";
import type { OfferBentoCar, OfferData } from "../types/offers.types";
import type { IOfferListCardProps } from "../interfaces/IOfferListCardProps";
import type { ICarCardProps } from "../interfaces/ICarCardProps";
import { APP_IMAGES, getImageUrl } from "../constants/app-images";
import { formatPrice } from "./format";
import { localize } from "./localize";

export function offerToCardProps(
  offer: OfferData,
  t: TFunction,
  locale: string,
): IOfferListCardProps {
  const badge = offer.discount_percent
    ? t("offersPage.grid.card.badgeDiscount", { percent: offer.discount_percent })
    : t("offersPage.grid.card.badgeSeasonal");

  const description = (offer.cars_count ?? 0) > 0
    ? t("offersPage.hero.vehiclesOnly", { count: offer.cars_count })
    : localize(offer.description, locale);

  const currentPrice = offer.special_installment ?? offer.special_price ?? 0;

  return {
    id: offer.id,
    image: getImageUrl(offer.image) || APP_IMAGES.OFFER_PLACEHOLDER,
    badge,
    title: localize(offer.title, locale),
    description,
    carName: localize(offer.title, locale),
    priceLabel: t("offersPage.grid.card.priceLabel"),
    price: currentPrice,
    priceUnit: t("offersPage.grid.card.priceUnit"),
    discountPercent: offer.discount_percent ?? undefined,
    expiresAt: undefined,
    isExpired: offer.countdown?.is_expired ?? false,
    countdown: offer.countdown ?? undefined,
    endsAtLabel: offer.ends_at,
    buttonText: t("offersPage.grid.card.buttonText"),
    buttonTo: `/cars?offerId=${offer.id}`,
  };
}

const SPEC_KEY_MAP: Record<string, string> = {
  "Fuel Type": "fuel",
  Transmission: "gearbox",
  seats: "seats",
  Seats: "seats",
};

function specValue(car: OfferBentoCar, label: string): string {
  if (!car || !car.specs) return "";
  if (Array.isArray(car.specs)) {
    const spec = car.specs.find((s) => "label" in s && s.label === label);
    return spec?.value ?? "";
  }
  if (typeof car.specs === "object") {
    const key = SPEC_KEY_MAP[label] || label.toLowerCase();
    const v = (car.specs as Record<string, unknown>)[key] ?? (car.specs as Record<string, unknown>)[label];
    return typeof v === "string" ? v : (v != null ? String(v) : "");
  }
  return "";
}

export function mapBentoCarToCardProps(
  car: OfferBentoCar,
  locale = "ar",
): ICarCardProps | null {
  try {
    const slug = localize(car.slug, locale);
    if (!slug) return null;

    return {
      id: car.id,
      image: getImageUrl(car.main_image || car.thumbnail) || APP_IMAGES.CAR_PLACEHOLDER,
      brand: localize(car.brand?.name, locale),
      name: localize(car.name, locale),
      year: String(car.year ?? ""),
      type: car.type ?? "",
      slug,
      fuelType: specValue(car, "Fuel Type") || (car as any).fuel_type || "",
      transmission: specValue(car, "Transmission") || (car as any).transmission || "",
      seats: specValue(car, "Seats") || (car as any).seats || "",
      price: formatPrice(car.cash_price ?? 0, "var(--brand-primary-color)", locale),
      monthlyPrice: formatPrice(car.min_installment ?? 0, "var(--brand-secondary-color)", locale),
      detailsTo: `/cars/${slug}`,
    };
  } catch {
    return null;
  }
}
