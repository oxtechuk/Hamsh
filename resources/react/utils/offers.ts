import type { TFunction } from "i18next";
import type { OfferData } from "../types/offers.types";
import type { IOfferListCardProps } from "../interfaces/IOfferListCardProps";
import { APP_IMAGES, getImageUrl } from "../constants/app-images";
import { localize } from "./localize";

export function offerToCardProps(
  offer: OfferData,
  t: TFunction,
  locale: string,
): IOfferListCardProps {
  const badge = offer.discount_percent
    ? t("offersPage.grid.card.badgeDiscount", { percent: offer.discount_percent })
    : t("offersPage.grid.card.badgeSeasonal");

  // "٥ مركبات فقط" style description from cars_count
  const description = offer.cars_count > 0
    ? `${offer.cars_count} ${locale === "ar" ? "مركبات فقط" : "vehicles only"}`
    : localize(offer.description, locale);

  return {
    id: offer.id,
    image: getImageUrl(offer.image) || APP_IMAGES.OFFER_PLACEHOLDER,
    badge,
    title: localize(offer.title, locale),
    description,
    priceLabel: t("offersPage.grid.card.priceLabel"),
    price: offer.special_installment ?? offer.special_price ?? 0,
    priceUnit: t("offersPage.grid.card.priceUnit"),
    // Pass countdown directly via expiresAt — we'll use countdown object instead
    expiresAt: undefined,
    isExpired: offer.countdown?.is_expired ?? false,
    countdown: offer.countdown ?? undefined,
    endsAtLabel: offer.ends_at,
    buttonText: t("offersPage.grid.card.buttonText"),
    buttonTo: `/cars?offerId=${offer.id}`,
  };
}
