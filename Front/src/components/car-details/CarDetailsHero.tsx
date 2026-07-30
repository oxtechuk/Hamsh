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
  description,
  images,
  exteriorImages,
  interiorImages,
  price,
  monthlyInstallment,
  minDownPayment,
  rating,
  views,
  colors,
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

  const currentImages =
    viewType === "inside"
      ? (interiorImages?.length ? interiorImages : images).map(getImageUrl)
      : (exteriorImages?.length ? exteriorImages : images).map(getImageUrl);

  const colorImage = selectedColor?.image
    ? getImageUrl(selectedColor.image)
    : null;
  const currentImage = colorImage ?? currentImages[activeImage];
  const isShowingColorImage = !!colorImage;

  const handleViewChange = useCallback((type: "inside" | "outside") => {
    setViewType(type);
    setActiveImage(0);
    setSelectedColor(null);
  }, []);

  return (
    <section dir={dir} className="w-full py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[1fr_420px]">
          {/* Gallery column */}
          <div className="order-2 min-w-0 lg:order-1">
            <CarDetailsGallery
              title={title}
              images={currentImages}
              currentImages={currentImages}
              currentImage={currentImage}
              activeImage={activeImage}
              onImageSelect={setActiveImage}
              isShowingColorImage={isShowingColorImage}
              selectedColor={selectedColor}
              onClearColor={() => setSelectedColor(null)}
              viewType={viewType}
              onViewChange={handleViewChange}
            />
            {specsTabs.length > 0 && (
              <CarDetailsSpecs tabs={specsTabs} embedded className="mt-6" />
            )}
          </div>

          {/* Content column */}
          <div className="order-1 lg:order-2">
            <div className="rounded-[22px] border border-[#E7E7E7] bg-white px-6 py-7 shadow-[0_4px_18px_rgba(15,23,42,0.05)]">
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
              <h1 className="text-start text-[30px] font-extrabold leading-[1.25] text-[#050505] md:text-[36px]">
                {title}
              </h1>

              {/* Optional description
              {description && (
                <div
                  className="mt-2 text-start text-[14px] leading-6 text-[#777777] [&_ol]:list-decimal [&_ol]:ps-5 [&_p]:mb-1 [&_ul]:list-disc [&_ul]:ps-5"
                  dangerouslySetInnerHTML={{ __html: description }}
                />
              )} */}

              {/* Prices box */}
              <div className="mt-6 overflow-hidden rounded-[16px] bg-[#FBEAEC]">
                <div className="grid grid-cols-2">
                  <div className="px-5 py-5 text-center">
                    <p className="text-[14px] text-[#8A8A8A]">
                      {t("carDetails.hero.price")}
                    </p>
                    <p className="mt-2 text-[29px] font-extrabold leading-none text-[#111111]">
                      {formatPrice(price, "#111111", lang)}
                    </p>
                  </div>
                  <div className="px-5 py-5 text-center">
                    <p className="text-[14px] text-[#8A8A8A]">
                      {t("carDetails.hero.installmentFrom")}
                    </p>
                    <p className="mt-2 text-[28px] font-extrabold leading-none text-[#C8242C]">
                      {formatPrice(monthlyInstallment, "#C8242C", lang)}
                    </p>
                  </div>
                </div>
                {/* {minDownPayment != null && (
                  <div className="border-t border-white/70 px-5 py-3 text-center">
                    <p className="text-[13px] text-[#8A8A8A]">
                      {t("carDetails.hero.minDownPayment")}
                    </p>
                    <p className="mt-1 text-[22px] font-extrabold leading-none text-[#111111]">
                      {formatPrice(minDownPayment, "#111111", lang)}
                    </p>
                  </div>
                )} */}
              </div>

              {/* Colors */}
              {/* {colors.length > 0 && (
                <div className="mt-5 flex items-center justify-between rounded-[14px] border border-[#ECECEC] bg-white px-4 py-3">
                  <span className="text-[14px] font-semibold text-[#313131]">
                    {t("carDetails.hero.availableColors")}
                  </span>
                  <div className="flex items-center gap-2.5">
                    {colors.map((color) => {
                      const isSelected = selectedColor?.name === color.name;
                      return (
                        <button
                          key={color.name}
                          type="button"
                          onClick={() =>
                            setSelectedColor(isSelected ? null : color)
                          }
                          aria-label={color.name}
                          className={[
                            "h-[34px] w-[34px] rounded-full border-2 p-[3px] transition",
                            isSelected
                              ? "border-[var(--brand-primary-color)]"
                              : "border-transparent",
                          ].join(" ")}
                        >
                          <span
                            className="block h-full w-full rounded-full border border-black/10"
                            style={{ backgroundColor: color.value }}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )} */}

              {/* CTA buttons */}
              <div className="mt-6 flex flex-col gap-3">
                <a
                  href={orderTo}
                  className="flex h-[62px] w-full items-center justify-center rounded-[6px] bg-[var(--brand-secondary-color)] text-[18px] font-bold text-white! transition hover:opacity-90"
                >
                  {t("carDetails.hero.orderNow")}
                </a>

                <a
                  href="/compare"
                  className="flex h-[62px] w-full items-center justify-center rounded-[6px] bg-[var(--brand-primary-color)] text-[18px] font-bold text-white! transition hover:opacity-90"
                >
                  {t("carDetails.hero.compare")}
                </a>

                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-[62px] w-full items-center justify-center gap-3 rounded-[6px] border border-[#E7E7E7] bg-white text-[18px] font-bold text-[#1A1A1A] transition hover:bg-[#FAFAFA]"
                >
                  <SiWhatsapp size={24} />
                  {t("carDetails.hero.whatsappContact")}
                </a>
              </div>

              {/* Free consultation note */}
              <p className="mt-5 pt-3 text-center text-[13px] text-[#9A9A9A]">
                {t("carDetails.hero.freeConsultation")}
              </p>
            </div>

            {/* Recommendations — desktop only inside sidebar */}
            {recommendations.length > 0 && (
              <div className="hidden lg:block">
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
          <div className="mt-6 lg:hidden">
            <CarDetailsRecommendations cars={recommendations} maxItems={3} />
          </div>
        )}
      </div>
    </section>
  );
}
