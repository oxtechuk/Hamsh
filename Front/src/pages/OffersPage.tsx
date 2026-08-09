import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import ContactCtaSection from "../components/ContactCtaSection";
import OffersGridSection from "../components/offers-page/OffersGridSection";
import OffersPageHero from "../components/offers-page/OffersPageHero";
import { getOffers } from "../services/api";
import { useLanguageStore } from "../store/language.store";
import { APP_IMAGES } from "../constants/app-images";
import { offerToCardProps } from "../utils/offers";
import { useSEO } from "../utils/useSEO";
import type { OfferData } from "../types/offers.types";
import { OffersSkeleton } from "../components/skeletons";

// ── Static mock offers for pagination testing ──────────────────────────────
const MOCK_COUNTDOWN = {
  days: 8,
  hours: 14,
  minutes: 30,
  seconds: 0,
  is_expired: false,
};

const MOCK_OFFER: OfferData = {
  id: 0,
  title: "بيك آب فورد رابتر — المحدودة",
  description: "عروض مختارة بعناية على أبرز السيارات. محدودة الوقت.",
  image: APP_IMAGES.OFFER_PLACEHOLDER,
  offer_category: null,
  user_rated_count: 0,
  discount_percent: 10,
  special_price: 6000,
  special_installment: 500,
  starts_at: "2026-07-01T00:00:00.000000Z",
  ends_at: "8 أغسطس 2026",
  is_active: true,
  cars_count: 5,
  countdown: MOCK_COUNTDOWN,
};

const MOCK_OFFERS: OfferData[] = Array.from({ length: 25 }, (_, i) => ({
  ...MOCK_OFFER,
  id: i + 1,
  title: `${MOCK_OFFER.title} — ${i + 1}`,
  discount_percent: [8, 10, 15, 20, null][i % 5],
  cars_count: (i % 8) + 1,
}));

const MOCK_PER_PAGE = 12;
// ──────────────────────────────────────────────────────────────────────────

export default function OffersPage() {
  const { t } = useTranslation();
  useSEO(t("pageTitles.offers"), t("offersPage.hero.description"));
  const language = useLanguageStore((s) => s.language);
  const [page, setPage] = useState(1);

  // TODO: remove mock override when API has enough data
  const USE_MOCK = false;

  const { data: offersResponse, isLoading } = useQuery({
    queryKey: ["offers", language, page],
    queryFn: () => getOffers(page, 12),
    enabled: !USE_MOCK,
  });

  const rawOffers = USE_MOCK
    ? MOCK_OFFERS.slice((page - 1) * MOCK_PER_PAGE, page * MOCK_PER_PAGE)
    : (offersResponse?.data ?? []);

  const offers = useMemo(
    () => rawOffers.map((offer) => offerToCardProps(offer, t, language)),
    [rawOffers, t, language],
  );

  const mainOffer = USE_MOCK
    ? MOCK_OFFER
    : (offersResponse?.meta.main_offer ?? null);
  const heroMeta = USE_MOCK ? null : (offersResponse?.meta.hero ?? null);

  const currentPage = USE_MOCK
    ? page
    : (offersResponse?.meta.current_page ?? page);
  const totalPages = USE_MOCK
    ? Math.ceil(MOCK_OFFERS.length / MOCK_PER_PAGE)
    : (offersResponse?.meta.last_page ?? 1);

  if (isLoading) {
    return <OffersSkeleton />;
  }

  return (
    <>
      <OffersPageHero
        image={heroMeta?.image || APP_IMAGES.OFFER_HERO_PLACEHOLDER}
        badgeText={heroMeta?.title.badge || ""}
        title1={heroMeta?.colored_title || "لا تفوّت"}
        title2={heroMeta?.title.text || "عروض"}
        description={heroMeta?.description || mainOffer?.description || "عروض مختارة بعناية على أبرز السيارات. محدودة الوقت."}
        countdown={mainOffer?.countdown}
        discountPercent={mainOffer?.discount_percent}
        specialPrice={mainOffer?.special_price}
        primaryButtonText={heroMeta?.button_1.text || ""}
        primaryButtonTo={heroMeta?.button_1.link || ""}
      />

      <OffersGridSection
        offers={offers}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <ContactCtaSection
        titleWhite={t("contactCta.title")}
        description={t("contactCta.description")}
        phoneText={t("contactCta.phoneText")}
      />
    </>
  );
}
