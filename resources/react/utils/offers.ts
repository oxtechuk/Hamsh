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

function specValue(car: OfferBentoCar, label: string): string {
  const spec = car.specs?.find((s) => s.label === label);
  return spec?.value ?? "";
}

export function mapBentoCarToCardProps(
  car: OfferBentoCar,
  locale = "ar",
): ICarCardProps | null {
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
    fuelType: specValue(car, "Fuel Type"),
    transmission: specValue(car, "Transmission"),
    seats: specValue(car, "Seats"),
    price: formatPrice(car.cash_price ?? 0, "var(--brand-primary-color)", locale),
    monthlyPrice: formatPrice(car.min_installment ?? 0, "var(--brand-secondary-color)", locale),
    detailsTo: `/cars/${slug}`,
  };
}
