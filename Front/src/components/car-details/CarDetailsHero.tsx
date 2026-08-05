import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { SiWhatsapp } from "react-icons/si";
import { getImageUrl } from "../../constants/app-images";
import { formatPrice } from "../../utils/format";
import { useSettingsStore } from "../../store/settings.store";
import type {
  ICarColor,
  ICarDetailsHeroProps,
} from "../../interfaces/ICarDetailsHeroProps";
import CarDetailsGallery from "./CarDetailsGallery";
import CarDetailsSpecs from "./CarDetailsSpecs";
import CarDetailsRecommendations from "../CarDetailsRecommendations";

export default function CarDetailsHero({
  title,
  images,
  price,
  monthlyInstallment,
  rating,
  views,
  orderTo,
  brand,
  year,
  specsTabs = [],
  recommendations = [],
}: ICarDetailsHeroProps) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const dir = i18n.dir();

  const settings = useSettingsStore((s) => s.settings);
  const whatsappNumber = settings?.contact?.whatsapp?.replace(/\D/g, "") ?? "";
  const whatsappHref = `https://wa.me/${whatsappNumber}`;

  const [activeImage, setActiveImage] = useState(0);
  const [viewType, setViewType] = useState<"inside" | "outside">("inside");
  const [selectedColor, setSelectedColor] = useState<ICarColor | null>(null);

  const allImages = images.map(getImageUrl);

  const colorImage = selectedColor?.image
    ? getImageUrl(selectedColor.image)
    : null;
  const currentImage = colorImage ?? allImages[activeImage];
  const isShowingColorImage = !!colorImage;

  const handleViewChange = useCallback((type: "inside" | "outside") => {
    setViewType(type);
    setActiveImage(0);
    setSelectedColor(null);
  }, []);

  const renderHeader = (isMobile = false) => (
    <div className={isMobile ? "mb-4 lg:hidden" : ""}>
      {/* Meta row: brand · year + views + stars */}
      <div className="flex items-center justify-between gap-4 text-[13px] text-[#8A8A8A]">
        {(brand || year) && (
          <span>
            {brand}
            {brand && year ? " · " : ""}
            {year}
          </span>
        )}

        <div className="flex items-center gap-1.5">
          {(views != null || rating) && (
            <>
              {views != null && (
                <span className="text-[#929292]">
                  ({views.toLocaleString(lang === "ar" ? "ar-SA" : "en-US")} {t("carDetails.hero.views")})
                </span>
              )}
              {rating && (
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className="text-[15px] leading-none"
                      style={{
                        color: i < Math.round(Number(rating)) ? "#FFB400" : "#D0D0D0",
                      }}
                    >
                      ★
                    </span>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Title */}
      <h1 className="mt-2 text-start text-[26px] font-extrabold leading-[1.25] text-[#050505] sm:text-[30px] md:text-[36px]">
        {title}
      </h1>
    </div>
  );

  const renderPricesAndButtons = () => (
    <>
      {/* Prices box */}
      <div className="mt-4 sm:mt-6 overflow-hidden rounded-[16px] bg-[#FBEAEC]">
        <div className="grid grid-cols-2">
          <div className="px-4 py-4 sm:px-5 sm:py-5 text-center">
            <p className="text-[13px] sm:text-[14px] text-[#8A8A8A]">
              {t("carDetails.hero.price")}
            </p>
            <p className="mt-1.5 sm:mt-2 text-[24px] sm:text-[29px] font-extrabold leading-none text-[#111111]">
              {formatPrice(price, "#111111", lang)}
            </p>
          </div>
          <div className="px-4 py-4 sm:px-5 sm:py-5 text-center">
            <p className="text-[13px] sm:text-[14px] text-[#8A8A8A]">
              {t("carDetails.hero.installmentFrom")}
            </p>
            <p className="mt-1.5 sm:mt-2 text-[24px] sm:text-[28px] font-extrabold leading-none text-[#C8242C]">
              {formatPrice(monthlyInstallment, "#C8242C", lang)}
            </p>
          </div>
        </div>
      </div>

      {/* CTA buttons */}
      <div className="mt-5 sm:mt-6 flex flex-col gap-3">
        <button
          type="button"
          onClick={orderTo}
          className="flex h-[56px] sm:h-[62px] w-full items-center justify-center rounded-[6px] bg-[var(--brand-secondary-color)] text-[16px] sm:text-[18px] font-bold text-white! transition hover:opacity-90 shadow-md"
        >
          {t("carDetails.hero.orderNow")}
        </button>

        <a
          href="/compare"
          className="flex h-[56px] sm:h-[62px] w-full items-center justify-center rounded-[6px] bg-[var(--brand-primary-color)] text-[16px] sm:text-[18px] font-bold text-white! transition hover:opacity-90"
        >
          {t("carDetails.hero.compare")}
        </a>

        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-[56px] sm:h-[62px] w-full items-center justify-center gap-3 rounded-[6px] border border-[#E7E7E7] bg-white text-[16px] sm:text-[18px] font-bold text-[#1A1A1A] transition hover:bg-[#FAFAFA]"
        >
          <SiWhatsapp size={22} />
          {t("carDetails.hero.whatsappContact")}
        </a>
      </div>

      {/* Free consultation note */}
      <p className="mt-4 pt-2 text-center text-[12px] sm:text-[13px] text-[#9A9A9A]">
        {t("carDetails.hero.freeConsultation")}
      </p>
    </>
  );

  return (
    <section dir={dir} className="w-full py-6 sm:py-10 pb-20 sm:pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Mobile Header (Shown above gallery only on mobile < lg) */}
        <div className="rounded-[20px] border border-[#E7E7E7] bg-white px-5 py-5 shadow-sm mb-6 lg:hidden">
          {renderHeader(true)}
        </div>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_420px] lg:gap-12">
          {/* Gallery column */}
          <div className="min-w-0">
            <CarDetailsGallery
              title={title}
              images={allImages}
              currentImage={currentImage}
              activeImage={activeImage}
              onImageSelect={setActiveImage}
              isShowingColorImage={isShowingColorImage}
              selectedColor={selectedColor}
              onClearColor={() => setSelectedColor(null)}
              viewType={viewType}
              onViewChange={handleViewChange}
            />

            {/* Mobile Prices & Buttons (Shown below gallery on mobile < lg) */}
            <div className="mt-6 rounded-[20px] border border-[#E7E7E7] bg-white px-5 py-6 shadow-sm lg:hidden">
              {renderPricesAndButtons()}
            </div>

            {specsTabs.length > 0 && (
              <CarDetailsSpecs tabs={specsTabs} embedded className="mt-6" />
            )}
          </div>

          {/* Desktop Content column (Shown on desktop >= lg) */}
          <div className="hidden lg:block">
            <div className="rounded-[22px] border border-[#E7E7E7] bg-white px-6 py-7 shadow-[0_4px_18px_rgba(15,23,42,0.05)]">
              {renderHeader(false)}
              {renderPricesAndButtons()}
            </div>

            {/* Recommendations — desktop only inside sidebar */}
            {recommendations.length > 0 && (
              <div className="mt-6">
                <CarDetailsRecommendations
                  cars={recommendations}
                  maxItems={3}
                />
              </div>
            )}
          </div>
        </div>

        {/* Recommendations — mobile only, after everything */}
        {recommendations.length > 0 && (
          <div className="mt-8 lg:hidden">
            <CarDetailsRecommendations cars={recommendations} maxItems={3} />
          </div>
        )}
      </div>
    </section>
  );
}
