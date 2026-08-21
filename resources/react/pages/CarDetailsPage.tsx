import { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useLanguageStore } from "../store/language.store";
import CarDetailsHero from "../components/car-details/CarDetailsHero";
import CarDetailsPageSkeleton from "../components/CarDetailsPageSkeleton";
import { getCarBySlug } from "../services/api/cars.service";
import { buildTabs, mapRelatedCar } from "../utils/car-mappers";
import { localize } from "../utils/localize";
import { formatPrice } from "../utils/format";
import { useSEO } from "../utils/useSEO";
import { getImageUrl } from "../constants/app-images";

export default function CarDetailsPage() {
  const { t } = useTranslation();
  useSEO(t("nav.cars"), t("carDetails.hero.metaDescription"));
  const language = useLanguageStore((s) => s.language);
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const {
    data: car,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["car-details", slug, language],
    queryFn: () => getCarBySlug(slug!),
    enabled: !!slug,
    retry: 1,
  });

  const tabs = useMemo(() => (car ? buildTabs(car, t) : []), [car, t]);

  const relatedCars = useMemo(
    () =>
      car?.related_cars
        ?.filter((c) => c.slug?.trim())
        .map((c) => mapRelatedCar(c, language))
        .filter((c): c is NonNullable<typeof c> => c !== null) ?? [],
    [car?.related_cars, language],
  );

  if (isLoading) {
    return <CarDetailsPageSkeleton />;
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center py-20 text-xl font-bold text-red-500">
        {t("carDetails.page.error")}
      </div>
    );
  }

  if (!car) {
    return (
      <div className="flex items-center justify-center py-20 text-xl font-bold text-gray-500">
        {t("carDetails.page.notFound")}
      </div>
    );
  }

  return (
    <>
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          name: localize(car.name, language),
          description: localize(car.description, language).replace(/<[^>]*>/g, "").slice(0, 200),
          image: getImageUrl(car.main_image),
          brand: { "@type": "Brand", name: localize(car.brand?.name, language) },
          offers: {
            "@type": "Offer",
            price: car.current_price,
            priceCurrency: "SAR",
            availability: "https://schema.org/InStock",
          },
        })}
      </script>
      <CarDetailsHero
        slug={slug}
        title={localize(car.name, language)}
        description={localize(car.description, language)}
        brand={localize(car.brand?.name, language)}
        category={localize(car.category?.name, language)}
        year={car.year}
        images={[
          car.main_image,
          ...(car.images ?? []).filter((img) => img !== car.main_image),
        ]}
        exteriorImages={car.exterior_images}
        interiorImages={car.interior_images}
        price={car.current_price}
        oldPrice={car.savings > 0 ? car.cash_price : undefined}
        monthlyInstallment={car.min_installment}
        savingAmount={car.savings > 0 ? car.savings : undefined}
        minDownPayment={car.min_down_payment}
        rating={car.rating}
        views={car.views}
        colors={(car.colors ?? []).map((color) => ({
          name: color.name,
          value: color.hex,
          image: color.image,
        }))}
        orderTo={() => navigate("/finance-calculator", { state: { car } })}
        financeTo="/finance-calculator"
        specsTabs={tabs}
        specs={car.specs}
        specifications={car.specifications}
        featuresList={car.features_list}
        recommendations={relatedCars}
      />
    </>
  );
}
