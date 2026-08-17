import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import CarCard from "../components/CarCard";
import OffersGridSection from "../components/offers-page/OffersGridSection";
import OffersPageHero from "../components/offers-page/OffersPageHero";
import { getOffers } from "../services/api";
import { useLanguageStore } from "../store/language.store";
import { APP_IMAGES } from "../constants/app-images";
import { mapBentoCarToCardProps, offerToCardProps } from "../utils/offers";
import { useSEO } from "../utils/useSEO";
import type { ICarCardProps } from "../interfaces/ICarCardProps";

export default function OffersPage() {
    const { t } = useTranslation();
    useSEO(t("pageTitles.offers"), t("offersPage.hero.description"));
    const language = useLanguageStore((s) => s.language);
    const [page, setPage] = useState(1);

    const { data: offersResponse } = useQuery({
        queryKey: ["offers", language, page],
        queryFn: () => getOffers(page, 12),
    });

    const offers = useMemo(
        () =>
            (offersResponse?.data ?? []).map((offer) =>
                offerToCardProps(offer, t, language),
            ),
        [offersResponse?.data, t, language],
    );

    const mainOffer = offersResponse?.meta.main_offer ?? null;
    const heroMeta = offersResponse?.meta.hero ?? null;

    const bentoCars = useMemo<ICarCardProps[]>(
        () =>
            (offersResponse?.meta.bento_cars ?? [])
                .map((car) => mapBentoCarToCardProps(car, language))
                .filter(Boolean) as ICarCardProps[],
        [offersResponse?.meta.bento_cars, language],
    );

    const currentPage = offersResponse?.meta.current_page ?? page;
    const totalPages = offersResponse?.meta.last_page ?? 1;

    return (
        <>
            <OffersPageHero
                image={
                    mainOffer?.image ||
                    heroMeta?.image ||
                    APP_IMAGES.OFFER_HERO_PLACEHOLDER
                }
                badgeText={heroMeta?.title?.badge || ""}
                title1={heroMeta?.colored_title || ""}
                title2={heroMeta?.title?.text || ""}
                description={
                    heroMeta?.description ||
                    t(
                        "offersPage.hero.description",
                        "لا تفوّت فرصة اقتناء سيارة أحلامك بسعر مميز",
                    )
                }
                carLabel={mainOffer?.title || undefined}
                countdown={mainOffer?.countdown}
                discountPercent={mainOffer?.discount_percent}
                specialPrice={mainOffer?.special_price}
                primaryButtonText={
                    heroMeta?.button_1?.text ||
                    t("offersPage.hero.primaryButton")
                }
                primaryButtonTo={heroMeta?.button_1?.link || "/offers"}
            />

            <OffersGridSection
                offers={offers}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setPage}
            />
        </>
    );
}
